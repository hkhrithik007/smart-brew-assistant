// ==========================================
// PARALLEL CONFIG LOADER (Optimized)
// ==========================================
const GITHUB_API_URL = 'https://api.github.com/repos/hkhrithik007/smart-brew-assistant/contents/barista';
const LOCAL_INDEX_URL = '../barista/index.json';

const EMERGENCY_FALLBACK_DATA = [
  {
    id: "james_hoffmann", name: "James Hoffmann", default_roast: "medium_light", default_process: "washed", default_dose: 15,
    methods: {
      v60: {
        label: "Pour Over (V60)", ratio: 16.6, grinder_name: "Timemore C2s", grind_size: 20, result_type: "Clean, sweet, and bright cup.", notes: "Based on the Ultimate 1-Cup V60 method. Use water just off the boil.", steps: [
          { time: "0:00", water: "{{chunk_1}}", text: "Pour {{chunk_1}}g of water to bloom. Gently swirl from 0:10 - 0:15." },
          { time: "0:45", water: "{{chunk_2}}", text: "Pour up to {{chunk_2}}g total over 15 seconds. Pause until 1:10." },
          { time: "1:10", water: "{{chunk_3}}", text: "Pour up to {{chunk_3}}g total over 10 seconds. Pause until 1:30." },
          { time: "1:30", water: "{{chunk_4}}", text: "Pour up to {{chunk_4}}g total over 10 seconds. Pause until 1:50." },
          { time: "1:50", water: "{{water}}", text: "Pour up to {{water}}g total over 10 seconds." },
          { time: "2:00", water: "", text: "Give the brewer a final gentle swirl and let it draw down." }
        ]
      },
      french_press: {
        label: "French Press", ratio: 15.0, grinder_name: "Timemore C2s", grind_size: 24, result_type: "Heavy body, rich and textured.", notes: "James Hoffmann Ultimate French Press technique.", steps: [
          { time: "0:00", water: "{{water}}", text: "Pour all {{water}}g of water. Wait 4 minutes." },
          { time: "4:00", water: "", text: "Stir the crust. Scoop off the foam and floating bits. Wait 5 more minutes." },
          { time: "9:00", water: "", text: "Plunge just to the surface of the coffee and pour gently." }
        ]
      },
      moka_pot: {
        label: "Moka Pot", ratio: 10.0, grinder_name: "Timemore C2s", grind_size: 15, result_type: "Strong, espresso-like intensity.", notes: "Fill base with boiling water. Start on medium-low heat.", steps: [
          { time: "0:00", water: "", text: "Assemble with boiling water in the base and place on medium-low heat." },
          { time: "0:00", water: "", text: "When coffee starts flowing fast and bubbling lighter, remove from heat." },
          { time: "0:00", water: "", text: "Run the base under cold water immediately to stop extraction." }
        ]
      }
    }
  },
  {
    id: "morgan_eckroth", name: "Morgan Eckroth", default_roast: "light", default_process: "washed", default_dose: 15,
    methods: {
      v60: {
        label: "Pour Over (V60)", ratio: 16.0, grinder_name: "Timemore C2s", grind_size: 20, result_type: "Balanced, everyday cup with great clarity.", steps: [
          { time: "0:00", water: "{{chunk_1}}", text: "Pour water in a spiral motion for the bloom. Let it rest and let the CO2 escape." },
          { time: "0:30", water: "{{chunk_3}}", text: "Pour the next batch of water in a spiral motion, starting in the center and working towards the edges." },
          { time: "1:30", water: "{{water}}", text: "Pour the remaining water. The drawdown should finish right around 2:15 to 2:30." },
          { time: "2:30", water: "", text: "Drawdown completes. Serve and enjoy!" }
        ]
      },
      french_press: {
        label: "French Press", ratio: 15.0, grinder_name: "Timemore C2s", grind_size: 24, result_type: "Full-bodied, rich, and sweet cup.", steps: [
          { time: "0:00", water: "", text: "Add roughly 2x the coffee weight in water for the bloom. Use a spoon to stir lightly, ensuring all grounds are saturated." },
          { time: "0:30", water: "{{water}}", text: "Add the remaining water. Give it one final stir and place the plunger resting lightly on the surface (do not push down)." },
          { time: "4:30", water: "", text: "Remove from scale. Plunge slowly until the coffee bed is almost compacted at the bottom. Do not press hard into the grounds." }
        ]
      },
      aeropress: {
        label: "AeroPress", ratio: 16.0, grinder_name: "Timemore C2s", grind_size: 16, result_type: "Easy, versatile, and well-extracted cup.", steps: [
          { time: "0:00", water: "{{water}}", text: "Standard orientation. Add all of your water right off the bat. Give it a stir to incorporate the grounds." },
          { time: "0:15", water: "", text: "Place the plunger on top at a slight angle to create a vacuum seal. This stops coffee from dripping through early." },
          { time: "1:30", water: "", text: "Straighten out the plunger and begin pushing down slowly and steadily (this should take 15-30 seconds)." },
          { time: "2:00", water: "", text: "Stop plunging when you feel the bed compact or hear a slight hiss." }
        ]
      },
      moka_pot: {
        label: "Moka Pot", ratio: 10.0, grinder_name: "Timemore C2s", grind_size: 15, result_type: "Rich, highly concentrated, espresso-like coffee.", steps: [
          { time: "0:00", water: "", text: "Fill the lower chamber with preheated water up to just below the pressure release valve." },
          { time: "0:15", water: "", text: "Fill the basket to the top with coffee (do not tamp or compress). Assemble the pot using a towel to protect your hands." },
          { time: "0:30", water: "", text: "Place on the stove over medium heat. Leave the lid open so you can keep an eye on the brew." },
          { time: "2:00", water: "", text: "As soon as coffee starts to bubble up into the top chamber, reduce the stove to low heat." },
          { time: "3:00", water: "", text: "When you hear the coffee sputtering, close the lid and remove the pot entirely from the heat. Pour immediately." }
        ]
      }
    }
  }
];

let allBaristas = [];
let stagedCustomMethods = {};

// ==========================================
// DOM Elements
// ==========================================
const baristaEl = document.getElementById('barista');
const methodContainer = document.getElementById('method-container');
const methodEl = document.getElementById('method');
const roastEl = document.getElementById('roast');
const fermentationEl = document.getElementById('fermentation');
const weightEl = document.getElementById('weight');
const ratioEl = document.getElementById('ratio');
const ratioDisplay = document.getElementById('ratio-display');
const ratioLockIcon = document.getElementById('ratio-lock-icon');
const targetWaterEl = document.getElementById('target-water');
const targetTempEl = document.getElementById('target-temp');
const recipeStepsEl = document.getElementById('recipe-steps');
const creatorBadgeEl = document.getElementById('creator-badge');
const recipeTitleEl = document.getElementById('recipe-title');
const recipeProfileEl = document.getElementById('recipe-profile');
const recipeNotesEl = document.getElementById('recipe-notes');

const metricsContainer = document.getElementById('metrics-container');
const tempCardEl = document.getElementById('temp-card');

// Custom Builder Elements
const customBuilder = document.getElementById('custom-builder');
const customNameEl = document.getElementById('custom-name');
const customBrewMethodEl = document.getElementById('custom-brew-method');
const customProfileEl = document.getElementById('custom-profile');
const customNotesEl = document.getElementById('custom-notes');
const customGrinderNameEl = document.getElementById('custom-grinder-name'); // NEW
const customGrinderSizeEl = document.getElementById('custom-grinder-size'); // NEW
const customStepsContainer = document.getElementById('custom-steps-container');
const addStepBtn = document.getElementById('add-step-btn');
const stageMethodBtn = document.getElementById('stage-method-btn');
const downloadConfigBtn = document.getElementById('download-config-btn');
const loadConfigFile = document.getElementById('load-config-file');
const stagedMethodsContainer = document.getElementById('staged-methods-container');
const stagedMethodsList = document.getElementById('staged-methods-list');

// Grinder Display Elements
const recipeGrinderBadgeEl = document.getElementById('recipe-grinder-badge'); // NEW
const recipeGrinderTextEl = document.getElementById('recipe-grinder-text'); // NEW

// Dark Mode Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Preview Modal Elements
const previewTimelineBtn = document.getElementById('preview-timeline-btn');
const recipePreviewModal = document.getElementById('recipe-preview-modal');
const closePreviewBtn = document.getElementById('close-preview-btn');
const modalContentArea = document.getElementById('modal-content-area');

// ==========================================
// Dynamic Temperature Logic
// ==========================================
const baseRoastTemps = {
  'very_light': 97, 'light': 95, 'medium_light': 93, 'medium': 91, 'medium_dark': 89, 'dark': 86, 'very_dark': 82
};
const fermentationOffsets = {
  'washed': 0, 'yellow_honey': -1, 'red_honey': -1, 'natural': -2,
  'anaerobic_washed': -2, 'anaerobic_natural': -3, 'carbonic_maceration': -4
};

function getOptimalTemp(roast, process) {
  const temp = baseRoastTemps[roast] + fermentationOffsets[process];
  return Math.max(80, Math.min(100, temp));
}

const noTempMethods = ['moka_pot', 'cold_brew', 'siphon', 'phin'];

// ==========================================
// Initialization & Loading
// ==========================================
async function initializeApp() {
  setupDarkMode();

  try {
    let yamlFilesToFetch = [];
    let loadSuccess = false;

    try {
      const indexResponse = await fetch(LOCAL_INDEX_URL);
      if (indexResponse.ok) {
        const localFiles = await indexResponse.json();
        yamlFilesToFetch = localFiles.map(fileName => `../barista/${fileName}`);
        loadSuccess = true;
      }
    } catch (e) { console.log("Local index not found, falling back to GitHub API..."); }

    if (!loadSuccess) {
      try {
        const response = await fetch(GITHUB_API_URL);
        if (response.ok) {
          const files = await response.json();
          yamlFilesToFetch = files.filter(f => f.name.endsWith('.yaml') || f.name.endsWith('.yml')).map(f => f.download_url);
          loadSuccess = true;
        }
      } catch (e) { console.log("GitHub API failed."); }
    }

    if (loadSuccess && yamlFilesToFetch.length > 0) {
      await Promise.all(yamlFilesToFetch.map(async (url) => {
        try {
          const cacheBusterUrl = url.includes('github') ? url : url + '?t=' + new Date().getTime();
          const fileRes = await fetch(cacheBusterUrl);
          if (fileRes.ok) {
            const config = jsyaml.load(await fileRes.text());
            if (config && config.id) allBaristas.push(config);
          }
        } catch (err) { console.warn(`Skipped YAML`, err); }
      }));
    }

    if (allBaristas.length === 0) {
      console.warn("Using Emergency Hardcoded Fallback.");
      allBaristas = [...EMERGENCY_FALLBACK_DATA];
    }

    renderBaristaDropdown();
    setupEventListeners();
    addCustomStepRow();
    applyConfigDefaults();
    calculateRecipe();

  } catch (error) {
    console.error(error);
    creatorBadgeEl.textContent = "Setup Required";
    baristaEl.innerHTML = '<option disabled selected>No configurations found</option>';
  }
}

// ==========================================
// Dark Mode Logic
// ==========================================
function setupDarkMode() {
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon.classList.remove('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    themeToggleDarkIcon.classList.remove('hidden');
  }

  themeToggleBtn.addEventListener('click', function () {
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  });
}

function renderBaristaDropdown(selectedId = null) {
  let dropdownHTML = allBaristas.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
  dropdownHTML += `<option value="custom">🛠 Create Custom Recipe</option>`;

  baristaEl.innerHTML = dropdownHTML;
  baristaEl.disabled = false;
  baristaEl.classList.remove("bg-stone-100", "dark:bg-stone-800");
  baristaEl.classList.add("bg-white", "dark:bg-stone-900");

  if (selectedId) baristaEl.value = selectedId;
  updateMethodsDropdown();
}

function setupEventListeners() {
  baristaEl.addEventListener('change', () => {
    applyConfigDefaults();
    updateMethodsDropdown();
    calculateRecipe();
  });
  methodEl.addEventListener('change', () => {
    applyConfigDefaults();
    calculateRecipe();
  });

  roastEl.addEventListener('change', calculateRecipe);
  fermentationEl.addEventListener('change', calculateRecipe);
  weightEl.addEventListener('input', calculateRecipe);
  ratioEl.addEventListener('input', calculateRecipe);

  customNameEl.addEventListener('input', calculateRecipe);
  customBrewMethodEl.addEventListener('change', calculateRecipe);
  customProfileEl.addEventListener('input', calculateRecipe);
  customNotesEl.addEventListener('input', calculateRecipe);

  // NEW: Add event listeners for the grinder inputs
  customGrinderNameEl.addEventListener('input', calculateRecipe);
  customGrinderSizeEl.addEventListener('input', calculateRecipe);

  addStepBtn.addEventListener('click', () => { addCustomStepRow(); calculateRecipe(); });
  stageMethodBtn.addEventListener('click', stageCurrentMethod);
  downloadConfigBtn.addEventListener('click', downloadCustomConfig);
  loadConfigFile.addEventListener('change', handleFileUpload);

  // Modal Listeners
  if (previewTimelineBtn) {
    previewTimelineBtn.addEventListener('click', () => {
      modalContentArea.innerHTML = `
            <h3 class="text-lg font-extrabold text-stone-900 dark:text-stone-50 mb-2">${recipeTitleEl.textContent || 'Custom Recipe'}</h3>
            <div class="relative border-l-2 border-amber-200 dark:border-amber-800/50 ml-2 mt-4 space-y-6 pb-2">
                ${recipeStepsEl.innerHTML}
            </div>
        `;
      recipePreviewModal.classList.remove('hidden');
      setTimeout(() => {
        recipePreviewModal.classList.remove('opacity-0');
        recipePreviewModal.querySelector('div').classList.remove('scale-95');
      }, 10);
    });
  }

  if (closePreviewBtn) {
    closePreviewBtn.addEventListener('click', () => {
      recipePreviewModal.classList.add('opacity-0');
      recipePreviewModal.querySelector('div').classList.add('scale-95');
      setTimeout(() => {
        recipePreviewModal.classList.add('hidden');
      }, 300);
    });
  }
}

function applyConfigDefaults() {
  const isCustom = baristaEl.value === 'custom';
  if (!isCustom) {
    const activeBarista = allBaristas.find(b => b.id === baristaEl.value);
    if (activeBarista) {
      if (activeBarista.default_roast) roastEl.value = activeBarista.default_roast;
      if (activeBarista.default_process) fermentationEl.value = activeBarista.default_process;
      if (activeBarista.default_dose) weightEl.value = activeBarista.default_dose;
    }
  }
}

function updateMethodsDropdown() {
  if (baristaEl.value === 'custom') {
    methodContainer.classList.add('hidden');
    customBuilder.classList.remove('hidden');
    ratioEl.disabled = false;
    ratioLockIcon.classList.add('hidden');
    return;
  }

  methodContainer.classList.remove('hidden');
  customBuilder.classList.add('hidden');
  ratioEl.disabled = true;
  ratioLockIcon.classList.remove('hidden');

  const selectedBarista = allBaristas.find(b => b.id === baristaEl.value);
  if (selectedBarista && selectedBarista.methods) {
    methodEl.innerHTML = Object.keys(selectedBarista.methods).map(k => `<option value="${k}">${selectedBarista.methods[k].label}</option>`).join('');
    methodEl.disabled = false;
  }
}

// ==========================================
// Staging System (Building the Multi-Method Config)
// ==========================================
function stageCurrentMethod() {
  const methodId = customBrewMethodEl.value;
  const methodLabel = customBrewMethodEl.options[customBrewMethodEl.selectedIndex].text;

  const steps = Array.from(document.querySelectorAll('.step-row')).map(row => {
    const min = row.querySelector('.custom-step-min').value || '0';
    const sec = (row.querySelector('.custom-step-sec').value || '00').padStart(2, '0');
    return {
      time: `${min}:${sec}`,
      water: row.querySelector('.custom-step-water').value || '',
      text: row.querySelector('.custom-step-text').value || '...'
    };
  });

  // Now successfully injecting the grinder parameters into the YAML config
  stagedCustomMethods[methodId] = {
    label: methodLabel,
    ratio: parseFloat(ratioEl.value),
    grinder_name: customGrinderNameEl.value || null,
    grind_size: customGrinderSizeEl.value ? Number(customGrinderSizeEl.value) : null,
    result_type: customProfileEl.value || "Custom dialed profile.",
    notes: customNotesEl.value || "",
    steps: steps
  };

  renderStagedMethods();
  customProfileEl.value = '';
  customNotesEl.value = '';
  customGrinderNameEl.value = ''; // Clean up grinder fields after save
  customGrinderSizeEl.value = '';
  customStepsContainer.innerHTML = '';
  addCustomStepRow();
  calculateRecipe();
}

function renderStagedMethods() {
  const keys = Object.keys(stagedCustomMethods);
  if (keys.length > 0) {
    stagedMethodsContainer.classList.remove('hidden');
    stagedMethodsList.innerHTML = keys.map(k => `
      <span class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs font-bold rounded-md border border-amber-200 dark:border-amber-700/50">
        ${stagedCustomMethods[k].label}
        <button onclick="removeStagedMethod('${k}')" class="hover:text-red-500 ml-1 leading-none text-sm">&times;</button>
      </span>
    `).join('');
  } else {
    stagedMethodsContainer.classList.add('hidden');
  }
}

window.removeStagedMethod = function (id) {
  delete stagedCustomMethods[id];
  renderStagedMethods();
}

// ==========================================
// Custom Step Row Generator
// ==========================================
function addCustomStepRow() {
  const div = document.createElement('div');
  div.className = 'flex flex-col gap-2 step-row bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm';

  div.innerHTML = `
    <div class="flex gap-2 items-center w-full">
      <div class="flex items-center justify-center bg-stone-100 dark:bg-stone-900 rounded-md py-1 px-1 w-[4.5rem] shrink-0 shadow-inner">
        <input type="number" inputmode="numeric" class="custom-step-min w-6 bg-transparent text-stone-700 dark:text-stone-300 text-center text-sm font-bold focus:outline-none" placeholder="0" min="0" max="15" value="0" />
        <span class="text-stone-400 font-black text-xs">:</span>
        <input type="number" inputmode="numeric" class="custom-step-sec w-6 bg-transparent text-stone-700 dark:text-stone-300 text-center text-sm font-bold focus:outline-none" placeholder="00" min="0" max="59" value="00" />
      </div>
      <div class="flex items-center bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md shrink-0 px-2 h-full">
        <input type="text" class="custom-step-water w-12 bg-transparent text-amber-700 dark:text-amber-400 py-1 focus:outline-none text-xs font-bold text-center" placeholder="water" />
        <span class="text-amber-500 text-[10px] font-bold">g</span>
      </div>
      <button class="remove-step text-stone-300 dark:text-stone-600 hover:text-red-500 font-bold ml-auto px-2 text-xl leading-none">&times;</button>
    </div>
    <input type="text" class="custom-step-text w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 py-1.5 px-3 rounded-md focus:ring-2 focus:ring-amber-600 text-sm" placeholder="Instruction text..." />
  `;

  const secInput = div.querySelector('.custom-step-sec');
  secInput.addEventListener('blur', (e) => {
    if (e.target.value.length === 1) e.target.value = '0' + e.target.value;
  });

  div.querySelectorAll('input').forEach(inp => inp.addEventListener('input', calculateRecipe));
  div.querySelector('.remove-step').addEventListener('click', (e) => {
    e.target.closest('.step-row').remove();
    calculateRecipe();
  });

  customStepsContainer.appendChild(div);
}

// ==========================================
// File I/O (Download & Load YAML)
// ==========================================
function downloadCustomConfig() {
  const configName = customNameEl.value || 'My Custom Config';
  const hasUnsavedSteps = document.querySelectorAll('.step-row').length > 0 && document.querySelector('.custom-step-text').value !== '';
  if (Object.keys(stagedCustomMethods).length === 0 || hasUnsavedSteps) {
    stageCurrentMethod();
  }

  const yamlObj = {
    id: configName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: configName,
    default_roast: roastEl.value,
    default_process: fermentationEl.value,
    default_dose: parseFloat(weightEl.value),
    methods: stagedCustomMethods
  };

  const yamlStr = jsyaml.dump(yamlObj);
  const blob = new Blob([yamlStr], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${yamlObj.id}.yaml`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const config = jsyaml.load(evt.target.result);
      if (config && config.id && config.methods) {
        const existingIndex = allBaristas.findIndex(b => b.id === config.id);
        if (existingIndex > -1) allBaristas[existingIndex] = config;
        else allBaristas.push(config);

        renderBaristaDropdown(config.id);
        applyConfigDefaults();
        calculateRecipe();
      } else {
        alert("Invalid YAML format. Make sure it has an id, name, and methods.");
      }
    } catch (err) { alert("Could not read YAML file!"); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ==========================================
// Core Calculation & Rendering
// ==========================================
function buildTimelineStep(time, water, instruction) {
  const waterBadge = water ? `<span class="ml-2 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700/50 px-2 py-0.5 rounded-full">${water}g</span>` : '';
  return `
    <div class="relative pl-6 md:pl-7">
        <div class="absolute w-3.5 h-3.5 bg-amber-600 rounded-full -left-[8px] top-1.5 ring-4 ring-white dark:ring-stone-900 shadow-sm transition-colors duration-300"></div>
        <div class="flex items-center mb-1">
          <div class="text-sm font-black text-amber-700 dark:text-amber-500 tracking-wide">${time}</div>
          ${waterBadge}
        </div>
        <div class="text-stone-600 dark:text-stone-300 leading-relaxed text-sm md:text-base">${instruction}</div>
    </div>
  `;
}

function parseYamlTemplate(text, water) {
  if (!text) return '';
  const chunk = Math.round(water / 5);
  return text.replaceAll('{{water}}', water)
    .replaceAll('{{chunk_1}}', chunk)
    .replaceAll('{{chunk_2}}', chunk * 2)
    .replaceAll('{{chunk_3}}', chunk * 3)
    .replaceAll('{{chunk_4}}', chunk * 4);
}

function calculateRecipe() {
  const weight = parseFloat(weightEl.value) || 0;
  const isCustom = baristaEl.value === 'custom';

  let activeRatio = 17;
  let activeMethodId = '';

  if (!isCustom) {
    const activeBarista = allBaristas.find(b => b.id === baristaEl.value);
    activeMethodId = methodEl.value;
    const activeMethodData = activeBarista?.methods[activeMethodId];
    if (activeMethodData) {
      activeRatio = activeMethodData.ratio || 16.6;
      ratioEl.value = activeRatio;
    }
  } else {
    activeRatio = parseFloat(ratioEl.value) || 17;
    activeMethodId = customBrewMethodEl.value;
  }

  if (noTempMethods.includes(activeMethodId)) {
    tempCardEl.classList.add('hidden');
    metricsContainer.classList.replace('grid-cols-2', 'grid-cols-1');
  } else {
    tempCardEl.classList.remove('hidden');
    metricsContainer.classList.replace('grid-cols-1', 'grid-cols-2');
  }

  ratioDisplay.textContent = activeRatio;
  const totalWater = Math.round(weight * activeRatio);
  targetWaterEl.textContent = totalWater;
  targetTempEl.textContent = getOptimalTemp(roastEl.value, fermentationEl.value);

  if (isCustom) {
    creatorBadgeEl.textContent = `Custom Workspace`;
    creatorBadgeEl.className = "inline-block py-1 px-3 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-[10px] md:text-xs font-bold tracking-wider mb-2 md:mb-3 uppercase border border-teal-200 dark:border-teal-800";
    recipeTitleEl.textContent = customNameEl.value || 'Untitled Brew Method';
    recipeProfileEl.textContent = customProfileEl.value ? `Target: ${customProfileEl.value}` : '';

    // Live update for Grinder Data Badge
    if (customGrinderNameEl.value || customGrinderSizeEl.value) {
      const gName = customGrinderNameEl.value || "Custom Grinder";
      const gSize = customGrinderSizeEl.value ? ` (Size: ${customGrinderSizeEl.value})` : "";
      recipeGrinderTextEl.textContent = `${gName}${gSize}`;
      recipeGrinderBadgeEl.classList.remove('hidden');
    } else {
      recipeGrinderBadgeEl.classList.add('hidden');
    }

    if (customNotesEl.value) {
      recipeNotesEl.textContent = customNotesEl.value;
      recipeNotesEl.classList.remove('hidden');
    } else {
      recipeNotesEl.classList.add('hidden');
    }

    const customSteps = Array.from(document.querySelectorAll('.step-row')).map(row => {
      const min = row.querySelector('.custom-step-min').value || '0';
      const sec = (row.querySelector('.custom-step-sec').value || '00').padStart(2, '0');
      return {
        time: `${min}:${sec}`,
        water: row.querySelector('.custom-step-water').value,
        text: row.querySelector('.custom-step-text').value || '...'
      };
    });

    recipeStepsEl.innerHTML = customSteps.map(step =>
      buildTimelineStep(step.time, parseYamlTemplate(step.water, totalWater), parseYamlTemplate(step.text, totalWater))
    ).join('');

  } else {
    const activeBarista = allBaristas.find(b => b.id === baristaEl.value);
    const activeMethodData = activeBarista?.methods[methodEl.value];

    if (activeBarista && activeMethodData) {
      creatorBadgeEl.textContent = `${activeBarista.name} Config`;
      creatorBadgeEl.className = "inline-block py-1 px-3 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] md:text-xs font-bold tracking-wider mb-2 md:mb-3 uppercase border border-amber-200 dark:border-amber-800";
      recipeTitleEl.textContent = `${activeMethodData.label} Technique`;
      recipeProfileEl.textContent = activeMethodData.result_type ? `Target: ${activeMethodData.result_type}` : '';

      // Load Grinder Data Badge if it exists in the preset file
      if (activeMethodData.grinder_name || activeMethodData.grind_size) {
        const gName = activeMethodData.grinder_name || "Grinder";
        const gSize = activeMethodData.grind_size ? ` (Size: ${activeMethodData.grind_size})` : "";
        recipeGrinderTextEl.textContent = `${gName}${gSize}`;
        recipeGrinderBadgeEl.classList.remove('hidden');
      } else {
        recipeGrinderBadgeEl.classList.add('hidden');
      }

      if (activeMethodData.notes) {
        recipeNotesEl.textContent = activeMethodData.notes;
        recipeNotesEl.classList.remove('hidden');
      } else {
        recipeNotesEl.classList.add('hidden');
      }

      recipeStepsEl.innerHTML = activeMethodData.steps.map(step =>
        buildTimelineStep(step.time, parseYamlTemplate(String(step.water || ''), totalWater), parseYamlTemplate(step.text, totalWater))
      ).join('');
    }
  }
}

initializeApp();
