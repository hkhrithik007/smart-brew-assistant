// ==========================================
// CONFIG DIRECTORY LOADER
// ==========================================
// Note: "/contents/" is just GitHub's API syntax. It looks directly into your "barista" folder.
const GITHUB_API_URL = 'https://api.github.com/repos/hkhrithik007/smart-brew-assistant/contents/barista';

// Hardcoded fallback list for local testing so you don't need an index.json file
const localFallbackFiles = ['james_hoffmann.yaml'];

let allBaristas = [];

// ==========================================
// DOM Elements
// ==========================================
const baristaEl = document.getElementById('barista');
const methodEl = document.getElementById('method');
const roastEl = document.getElementById('roast');
const fermentationEl = document.getElementById('fermentation');
const weightEl = document.getElementById('weight');
const ratioEl = document.getElementById('ratio');
const ratioDisplay = document.getElementById('ratio-display');
const targetWaterEl = document.getElementById('target-water');
const targetTempEl = document.getElementById('target-temp');
const recipeStepsEl = document.getElementById('recipe-steps');
const creatorBadgeEl = document.getElementById('creator-badge');
const recipeTitleEl = document.getElementById('recipe-title');

const tempMatrix = {
  'very_light': { 'washed': 96, 'washed_ferment': 95, 'yellow_honey': 94, 'red_honey': 93, 'natural': 92, 'natural_ferment': 91 },
  'light': { 'washed': 95, 'washed_ferment': 94, 'yellow_honey': 93, 'red_honey': 92, 'natural': 91, 'natural_ferment': 90 },
  'medium_light': { 'washed': 94, 'washed_ferment': 93, 'yellow_honey': 92, 'red_honey': 91, 'natural': 90, 'natural_ferment': 89 },
  'medium_dark': { 'washed': 93, 'washed_ferment': 92, 'yellow_honey': 91, 'red_honey': 90, 'natural': 89, 'natural_ferment': 88 },
  'dark': { 'washed': 92, 'washed_ferment': 91, 'yellow_honey': 90, 'red_honey': 89, 'natural': 88, 'natural_ferment': 87 },
  'very_dark': { 'washed': 91, 'washed_ferment': 90, 'yellow_honey': 89, 'red_honey': 88, 'natural': 87, 'natural_ferment': 86 }
};

// ==========================================
// Initialization & Dynamic YAML Loading
// ==========================================
async function initializeApp() {
  try {
    let yamlFilesToFetch = [];

    // ATTEMPT 1: Auto-scan the folder using the GitHub API
    try {
      const response = await fetch(GITHUB_API_URL);
      if (response.ok) {
        const files = await response.json();
        yamlFilesToFetch = files
          .filter(f => f.name.endsWith('.yaml') || f.name.endsWith('.yml'))
          .map(f => f.download_url);
        console.log("Successfully loaded directory from GitHub API!");
      } else {
        throw new Error('API Rate limit or local testing environment');
      }
    } catch (e) {
      // ATTEMPT 2: Use the hardcoded local fallback list
      console.log("GitHub API unavailable. Using local fallback list...");
      yamlFilesToFetch = localFallbackFiles.map(fileName => `../barista/${fileName}`);
    }

    if (yamlFilesToFetch.length === 0) throw new Error("No configs found");

    // Download and Parse each YAML file
    for (const url of yamlFilesToFetch) {
      try {
        const fileRes = await fetch(url);
        if (!fileRes.ok) continue;

        const yamlText = await fileRes.text();
        const config = jsyaml.load(yamlText);

        if (config && config.id) {
          allBaristas.push(config);
        }
      } catch (err) {
        console.warn(`Could not parse YAML from ${url}`, err);
      }
    }

    if (allBaristas.length === 0) throw new Error("YAML parsed, but data is empty");

    // Populate Barista Dropdown & Select First Item by Default
    baristaEl.innerHTML = allBaristas.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    baristaEl.disabled = false;
    baristaEl.classList.replace("bg-slate-100", "bg-white");

    // Setup initial methods based on first loaded barista
    updateMethodsDropdown();

    // Add event listeners
    baristaEl.addEventListener('change', () => { updateMethodsDropdown(); calculateRecipe(); });
    methodEl.addEventListener('change', calculateRecipe);
    roastEl.addEventListener('change', calculateRecipe);
    fermentationEl.addEventListener('change', calculateRecipe);
    weightEl.addEventListener('input', calculateRecipe);
    ratioEl.addEventListener('input', calculateRecipe);

    // Initial render
    calculateRecipe();

  } catch (error) {
    console.error("Failed to load configs:", error);
    showMissingConfigError();
  }
}

// ==========================================
// Helper Functions & Calculation
// ==========================================
function buildTimelineStep(time, instruction) {
  return `
    <div class="relative pl-7">
        <div class="absolute w-3.5 h-3.5 bg-indigo-500 rounded-full -left-[8px] top-1.5 ring-4 ring-white shadow-sm"></div>
        <div class="text-sm font-black text-indigo-600 tracking-wide mb-1">${time}</div>
        <div class="text-slate-600 leading-relaxed text-sm md:text-base">${instruction}</div>
    </div>
  `;
}

function showMissingConfigError() {
  creatorBadgeEl.textContent = "Setup Required";
  creatorBadgeEl.classList.replace("bg-indigo-100", "bg-red-100");
  creatorBadgeEl.classList.replace("text-indigo-700", "text-red-700");

  baristaEl.innerHTML = '<option disabled selected>No .yaml config files found</option>';
  methodEl.innerHTML = '<option disabled>N/A</option>';

  recipeTitleEl.textContent = "Awaiting Configuration";
  recipeStepsEl.innerHTML = buildTimelineStep('Error', 'No barista configuration files were loaded from the directory.');
}

function updateMethodsDropdown() {
  const selectedBarista = allBaristas.find(b => b.id === baristaEl.value);

  methodEl.innerHTML = Object.keys(selectedBarista.methods).map(methodKey => {
    return `<option value="${methodKey}">${selectedBarista.methods[methodKey].label}</option>`;
  }).join('');

  methodEl.disabled = false;
  methodEl.classList.replace("bg-slate-100", "bg-white");
}

// Replaces YAML placeholders like {{water}} with actual math numbers
function parseYamlTemplate(text, water) {
  const chunk = Math.round(water / 5);
  return text
    .replaceAll('{{water}}', water)
    .replaceAll('{{chunk_1}}', chunk)
    .replaceAll('{{chunk_2}}', chunk * 2)
    .replaceAll('{{chunk_3}}', chunk * 3)
    .replaceAll('{{chunk_4}}', chunk * 4);
}

function calculateRecipe() {
  if (allBaristas.length === 0) return;

  const activeBarista = allBaristas.find(b => b.id === baristaEl.value);
  const activeMethodKey = methodEl.value;

  const roast = roastEl.value;
  const fermentation = fermentationEl.value;
  const weight = parseFloat(weightEl.value) || 0;
  const ratio = parseFloat(ratioEl.value) || 0;

  // Update UI Text
  creatorBadgeEl.textContent = `${activeBarista.name} Methods`;
  recipeTitleEl.textContent = `${activeBarista.name} Technique`;

  // Update Water/Ratio
  ratioDisplay.textContent = ratio;
  const totalWater = Math.round(weight * ratio);
  targetWaterEl.textContent = totalWater;

  // Update Temperature
  targetTempEl.textContent = tempMatrix[roast][fermentation];

  // Fetch steps from YAML and run them through our templating function
  const rawSteps = activeBarista.methods[activeMethodKey].steps;

  recipeStepsEl.innerHTML = rawSteps
    .map(step => buildTimelineStep(step.time, parseYamlTemplate(step.text, totalWater)))
    .join('');
}

// Boot the app
initializeApp();
