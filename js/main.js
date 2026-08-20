// ==========================================
// DATA: FERMENTATION PROCESSES (Grouped & Searchable)
// ==========================================
const FERMENTATION_PROCESSES = [
  { group: "Washed / Wet", items: [{ id: "washed", label: "Washed" }, { id: "double_washed", label: "Double Washed" }] },
  { group: "Natural / Dry", items: [{ id: "natural", label: "Natural" }, { id: "fruit_maceration", label: "Fruit Maceration" }] },
  { group: "Honey Process", items: [{ id: "white_honey", label: "White Honey" }, { id: "yellow_honey", label: "Yellow Honey" }, { id: "red_honey", label: "Red Honey" }, { id: "black_honey", label: "Black/Dark Honey" }] },
  { group: "Experimental / Anaerobic", items: [{ id: "anaerobic_washed", label: "Anaerobic Washed" }, { id: "anaerobic_natural", label: "Anaerobic Natural" }, { id: "carbonic_maceration", label: "Carbonic Maceration" }, { id: "thermal_shock", label: "Thermal Shock" }] }
];

// ==========================================
// DATA: CUSTOM BREW METHODS (Grouped & Searchable)
// ==========================================
const CUSTOM_BREW_METHODS = [
  { group: "Conical Drippers", items: [{ id: "v60", label: "Hario V60" }, { id: "origami", label: "Origami Dripper" }, { id: "kono", label: "Kono Meimon" }] },
  { group: "Flat-Bottom Drippers", items: [{ id: "kalita", label: "Kalita Wave" }, { id: "orea", label: "Orea V3" }, { id: "fellow_stagg", label: "Fellow Stagg X" }] },
  { group: "Hybrid & Immersion", items: [{ id: "clever", label: "Clever Dripper" }, { id: "switch", label: "Hario Switch" }, { id: "french_press", label: "French Press" }, { id: "aeropress", label: "AeroPress" }] },
  { group: "Carafe-Style Drippers", items: [{ id: "chemex", label: "Chemex" }] },
  { group: "Other Brewers", items: [{ id: "moka_pot", label: "Moka Pot" }, { id: "auto_drip", label: "Automatic Drip Machine" }, { id: "cold_brew", label: "Cold Brew" }, { id: "siphon", label: "Siphon" }, { id: "phin", label: "Phin" }] }
];

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
let activeShareUrl = '';
let activeShareConfig = null;
let currentMode = 'official';

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
const customGrinderNameEl = document.getElementById('custom-grinder-name');
const customGrinderSizeEl = document.getElementById('custom-grinder-size');
const customStepsContainer = document.getElementById('custom-steps-container');
const addStepBtn = document.getElementById('add-step-btn');
const stageMethodBtn = document.getElementById('stage-method-btn');
const downloadConfigBtn = document.getElementById('download-config-btn');
const stagedMethodsContainer = document.getElementById('staged-methods-container');
const stagedMethodsList = document.getElementById('staged-methods-list');
const baristaContainer = document.getElementById('barista-container');

// Load Menus
const importMenuBtn = document.getElementById('import-menu-btn');
const importMenuDropdown = document.getElementById('import-menu-dropdown');
const loadConfigFile = document.getElementById('load-config-file');
const loadQrFile = document.getElementById('load-qr-file');

// Mode Toggle Elements
const modeOfficialBtn = document.getElementById('mode-official');
const modeCreateBtn = document.getElementById('mode-create');

// Grinder Badge
const recipeGrinderBadgeEl = document.getElementById('recipe-grinder-badge');
const recipeGrinderTextEl = document.getElementById('recipe-grinder-text');

// Theme & Modals
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const previewTimelineBtn = document.getElementById('preview-timeline-btn');
const recipePreviewModal = document.getElementById('recipe-preview-modal');
const closePreviewBtn = document.getElementById('close-preview-btn');
const modalContentArea = document.getElementById('modal-content-area');
const shareQrBtn = document.getElementById('share-qr-btn');
const quickShareQrBtn = document.getElementById('quick-share-qr-btn');
const qrModal = document.getElementById('qr-modal');
const closeQrModalBtn = document.getElementById('close-qr-modal-btn');
const qrModalTitle = document.getElementById('qr-modal-title');
const qrModalSubtitle = document.getElementById('qr-modal-subtitle');
const qrcodeTarget = document.getElementById('qrcode-target');
const downloadQrCardBtn = document.getElementById('download-qr-card-btn');
const copyQrLinkBtn = document.getElementById('copy-qr-link-btn');
const copyBtnText = document.getElementById('copy-btn-text');
const qrExportCanvas = document.getElementById('qr-export-canvas');

// ==========================================
// Temperature Logic
// ==========================================
const baseRoastTemps = {
  'very_light': 97, 'light': 95, 'medium_light': 93, 'medium': 91, 'medium_dark': 89, 'dark': 86, 'very_dark': 82
};
const fermentationOffsets = {
  'washed': 0, 'double_washed': 0,
  'yellow_honey': -1, 'white_honey': 0, 'red_honey': -1, 'black_honey': -2,
  'natural': -2, 'fruit_maceration': -2,
  'anaerobic_washed': -2, 'anaerobic_natural': -3,
  'carbonic_maceration': -4, 'thermal_shock': -3
};

function getOptimalTemp(roast, process) {
  const temp = baseRoastTemps[roast] + (fermentationOffsets[process] || 0);
  return Math.max(80, Math.min(100, temp));
}
const noTempMethods = ['moka_pot', 'cold_brew', 'siphon', 'phin', 'auto_drip'];

// ==========================================
// MODE TOGGLER & DROPDOWN INIT
// ==========================================
function setMode(mode) {
  currentMode = mode;

  [modeOfficialBtn, modeCreateBtn].forEach(b => {
    b.className = "flex-1 py-2 text-[10px] md:text-xs font-bold rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-all";
  });

  if (mode === 'official') {
    modeOfficialBtn.className = "flex-1 py-2 text-[10px] md:text-xs font-bold rounded-lg bg-white dark:bg-stone-700 shadow-sm text-amber-700 dark:text-amber-400 transition-all";
    baristaContainer.classList.remove('hidden');
    methodContainer.classList.remove('hidden');
    customBuilder.classList.add('hidden');

    renderBaristaDropdown(null);

  } else if (mode === 'create') {
    modeCreateBtn.className = "flex-1 py-2 text-[10px] md:text-xs font-bold rounded-lg bg-white dark:bg-stone-700 shadow-sm text-teal-700 dark:text-teal-400 transition-all";
    baristaContainer.classList.add('hidden');
    methodContainer.classList.add('hidden');
    customBuilder.classList.remove('hidden');
  }

  updateMethodsDropdown();
  calculateRecipe();
}

function renderBaristaDropdown(selectedId = null) {
  baristaEl.innerHTML = allBaristas.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
  baristaEl.disabled = false;
  baristaEl.classList.remove("bg-stone-100", "dark:bg-stone-800");
  baristaEl.classList.add("bg-white", "dark:bg-stone-900");

  // Explicitly force James Hoffmann if selectedId is null, otherwise fallbacks
  if (selectedId && allBaristas.some(b => b.id === selectedId)) {
    baristaEl.value = selectedId;
  } else if (allBaristas.some(b => b.id === 'james_hoffmann')) {
    baristaEl.value = 'james_hoffmann';
  } else if (allBaristas.length > 0) {
    baristaEl.value = allBaristas[0].id;
  }

  updateMethodsDropdown();
}

function initSearchableDropdown(wrapperId, groups, defaultVal = null) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const toggle = wrapper.querySelector('.dropdown-toggle');
  const menu = wrapper.querySelector('.dropdown-menu');
  const search = wrapper.querySelector('.search-input');
  const list = wrapper.querySelector('.option-list');
  const textSpan = wrapper.querySelector('.selected-text');
  const hiddenInput = wrapper.querySelector('input[type="hidden"]');

  if (defaultVal) {
    hiddenInput.value = defaultVal;
    let foundLabel = "";
    groups.forEach(g => g.items.forEach(i => { if (i.id === defaultVal) foundLabel = i.label; }));
    textSpan.textContent = foundLabel || "Select...";
  }

  function populate(filter = "") {
    list.innerHTML = "";
    let hasResults = false;
    groups.forEach(g => {
      const matchedItems = g.items.filter(i => i.label.toLowerCase().includes(filter.toLowerCase()));
      if (matchedItems.length > 0) {
        hasResults = true;
        if (g.group) {
          const groupLabel = document.createElement('div');
          groupLabel.className = "px-3 pt-3 pb-1 text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-stone-800 z-10 shadow-[0_4px_4px_-4px_rgba(0,0,0,0.1)]";
          groupLabel.textContent = g.group;
          list.appendChild(groupLabel);
        }
        matchedItems.forEach(item => {
          const opt = document.createElement('div');
          opt.className = "px-3 py-2 mt-1 cursor-pointer text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-400 rounded-md transition-colors option-item";
          opt.textContent = item.label;
          if (hiddenInput.value === item.id) opt.classList.add('bg-amber-50', 'dark:bg-amber-900/30', 'text-amber-700', 'dark:text-amber-400');
          opt.addEventListener('click', (e) => {
            e.stopPropagation();
            hiddenInput.value = item.id;
            textSpan.textContent = item.label;
            menu.classList.add('hidden');
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
          });
          list.appendChild(opt);
        });
      }
    });
    if (!hasResults) list.innerHTML = `<div class="px-3 py-4 text-center text-xs text-stone-500 dark:text-stone-400">No options found</div>`;
  }

  const newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);
  const newSearch = search.cloneNode(true);
  search.parentNode.replaceChild(newSearch, search);

  newToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (newToggle.disabled) return;
    document.querySelectorAll('.dropdown-menu').forEach(m => { if (m !== menu) m.classList.add('hidden'); });
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) {
      newSearch.value = "";
      populate();
      setTimeout(() => newSearch.focus(), 50);
    }
  });

  newSearch.addEventListener('input', (e) => populate(e.target.value));
  populate();
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
  }
});

// ==========================================
// Initialization & Loading
// ==========================================
async function initializeApp() {
  setupDarkMode();

  allBaristas = [...EMERGENCY_FALLBACK_DATA];

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
    } catch (e) { /* Offline */ }

    if (!loadSuccess) {
      try {
        const response = await fetch(GITHUB_API_URL);
        if (response.ok) {
          const files = await response.json();
          yamlFilesToFetch = files.filter(f => f.name.endsWith('.yaml') || f.name.endsWith('.yml')).map(f => f.download_url);
          loadSuccess = true;
        }
      } catch (e) { /* Offline */ }
    }

    if (loadSuccess && yamlFilesToFetch.length > 0) {
      let liveBaristas = [];
      await Promise.all(yamlFilesToFetch.map(async (url) => {
        try {
          const cacheBusterUrl = url.includes('github') ? url : url + '?t=' + new Date().getTime();
          const fileRes = await fetch(cacheBusterUrl);
          if (fileRes.ok) {
            const config = jsyaml.load(await fileRes.text());
            if (config && config.id) liveBaristas.push(config);
          }
        } catch (err) { /* Skip */ }
      }));

      if (liveBaristas.length > 0) {
        allBaristas = liveBaristas;
      }
    }
  } catch (error) {
    console.warn("Using offline fallback data.");
  }

  initSearchableDropdown('fermentation-wrapper', FERMENTATION_PROCESSES, 'washed');
  initSearchableDropdown('custom-brew-method-wrapper', CUSTOM_BREW_METHODS, 'v60');

  setupEventListeners();
  addCustomStepRow();

  if (window.location.search.indexOf('r=') === -1) {
    setMode('official');
  } else {
    checkUrlForSharedRecipe();
  }
}

// ==========================================
// UNPACK PAYLOAD (URL or QR Image)
// ==========================================
function processSharedRecipePayload(compressedData) {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(compressedData);
    if (jsonString) {
      const sharedConfig = JSON.parse(jsonString);
      if (sharedConfig && sharedConfig.id && sharedConfig.methods) {
        const existingIdx = allBaristas.findIndex(b => b.id === sharedConfig.id);
        if (existingIdx > -1) allBaristas[existingIdx] = sharedConfig;
        else allBaristas.unshift(sharedConfig);

        setMode('official');
        renderBaristaDropdown(sharedConfig.id);
        applyConfigDefaults();
        calculateRecipe();
        return true;
      }
    }
  } catch (e) {
    console.warn("Could not unpack QR recipe", e);
  }
  return false;
}

function checkUrlForSharedRecipe() {
  const urlParams = new URLSearchParams(window.location.search);
  const compressedData = urlParams.get('r');
  if (compressedData) {
    if (processSharedRecipePayload(compressedData)) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}

// ==========================================
// Dark Mode & Listeners
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

function setupEventListeners() {
  modeOfficialBtn.addEventListener('click', () => setMode('official'));
  modeCreateBtn.addEventListener('click', () => setMode('create'));

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

  customBrewMethodEl.addEventListener('change', () => {
    const methodId = customBrewMethodEl.value;
    if (stagedCustomMethods[methodId]) {
      customStepsContainer.innerHTML = '';
      stagedCustomMethods[methodId].steps.forEach(step => {
        let [m, s] = String(step.time).split(':');
        addCustomStepRow(m, s, step.water, step.text);
      });
    } else {
      customStepsContainer.innerHTML = '';
      addCustomStepRow();
    }
    calculateRecipe();
  });

  weightEl.addEventListener('input', calculateRecipe);
  ratioEl.addEventListener('input', calculateRecipe);

  customNameEl.addEventListener('input', calculateRecipe);
  customProfileEl.addEventListener('input', calculateRecipe);
  customNotesEl.addEventListener('input', calculateRecipe);
  customGrinderNameEl.addEventListener('input', calculateRecipe);
  customGrinderSizeEl.addEventListener('input', calculateRecipe);

  addStepBtn.addEventListener('click', () => { addCustomStepRow(); calculateRecipe(); });
  stageMethodBtn.addEventListener('click', stageCurrentMethod);
  downloadConfigBtn.addEventListener('click', downloadCustomConfig);

  // IMPORT MENU LISTENERS
  importMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    importMenuDropdown.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#import-menu-dropdown') && !e.target.closest('#import-menu-btn')) {
      importMenuDropdown.classList.add('hidden');
    }
  });
  loadConfigFile.addEventListener('change', handleFileUpload);
  loadQrFile.addEventListener('change', handleQrUpload);

  shareQrBtn.addEventListener('click', () => triggerQrModal(true));
  quickShareQrBtn.addEventListener('click', () => triggerQrModal(false));
  closeQrModalBtn.addEventListener('click', hideQrModal);
  downloadQrCardBtn.addEventListener('click', downloadBrandedQrCard);
  copyQrLinkBtn.addEventListener('click', copyDirectLink);

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
  if (currentMode === 'create') return;
  const activeBarista = allBaristas.find(b => b.id === baristaEl.value);

  if (activeBarista) {
    if (activeBarista.default_roast) roastEl.value = activeBarista.default_roast;
    if (activeBarista.default_process) {
      fermentationEl.value = activeBarista.default_process;
      const wrapper = document.getElementById('fermentation-wrapper');
      const textSpan = wrapper.querySelector('.selected-text');
      let foundLabel = activeBarista.default_process;
      FERMENTATION_PROCESSES.forEach(g => g.items.forEach(i => { if (i.id === activeBarista.default_process) foundLabel = i.label; }));
      textSpan.textContent = foundLabel;
    }
    if (activeBarista.default_dose) weightEl.value = activeBarista.default_dose;
  }
}

function updateMethodsDropdown() {
  const methodBtn = document.getElementById('method-btn');
  if (currentMode === 'create') {
    methodContainer.classList.add('hidden');
    ratioEl.disabled = false;
    ratioLockIcon.classList.add('hidden');
    return;
  }

  methodContainer.classList.remove('hidden');
  ratioEl.disabled = true;
  ratioLockIcon.classList.remove('hidden');

  const selectedBarista = allBaristas.find(b => b.id === baristaEl.value);

  if (selectedBarista && selectedBarista.methods) {
    methodBtn.disabled = false;
    const dynamicMethods = [{
      group: "Available Recipes",
      items: Object.keys(selectedBarista.methods).map(k => ({ id: k, label: selectedBarista.methods[k].label }))
    }];

    let currentVal = methodEl.value;
    if (!Object.keys(selectedBarista.methods).includes(currentVal)) {
      currentVal = Object.keys(selectedBarista.methods)[0];
    }
    initSearchableDropdown('method-wrapper', dynamicMethods, currentVal);
  } else {
    methodBtn.disabled = true;
  }
}

// ==========================================
// Staging & Custom Config Builder
// ==========================================
function stageCurrentMethod() {
  const methodId = customBrewMethodEl.value;
  const methodLabel = document.querySelector('#custom-brew-method-wrapper .selected-text').textContent;

  const steps = Array.from(document.querySelectorAll('.step-row')).map(row => {
    const min = row.querySelector('.custom-step-min').value || '0';
    const sec = (row.querySelector('.custom-step-sec').value || '00').padStart(2, '0');
    return {
      time: `${min}:${sec}`,
      water: row.querySelector('.custom-step-water').value || '',
      text: row.querySelector('.custom-step-text').value || '...'
    };
  });

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

  const originalText = stageMethodBtn.innerHTML;
  stageMethodBtn.innerHTML = "✓ Method Saved";
  stageMethodBtn.classList.add('bg-teal-200', 'dark:bg-teal-800');
  setTimeout(() => {
    stageMethodBtn.innerHTML = originalText;
    stageMethodBtn.classList.remove('bg-teal-200', 'dark:bg-teal-800');
  }, 2000);

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

function addCustomStepRow(m = "0", s = "00", waterStr = "", textStr = "") {
  const div = document.createElement('div');
  div.className = 'flex flex-col gap-2 step-row bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm';

  if (!s && m && m.includes(':')) { let split = m.split(':'); m = split[0]; s = split[1]; }

  div.innerHTML = `
    <div class="flex gap-2 items-center w-full">
      <div class="flex items-center justify-center bg-stone-100 dark:bg-stone-900 rounded-md py-1 px-1 w-[4.5rem] shrink-0 shadow-inner">
        <input type="number" inputmode="numeric" class="custom-step-min w-6 bg-transparent text-stone-700 dark:text-stone-300 text-center text-sm font-bold focus:outline-none" placeholder="0" min="0" max="15" value="${parseInt(m) || 0}" />
        <span class="text-stone-400 font-black text-xs">:</span>
        <input type="number" inputmode="numeric" class="custom-step-sec w-6 bg-transparent text-stone-700 dark:text-stone-300 text-center text-sm font-bold focus:outline-none" placeholder="00" min="0" max="59" value="${(parseInt(s) || 0).toString().padStart(2, '0')}" />
      </div>
      <div class="flex items-center bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md shrink-0 px-2 h-full">
        <input type="text" class="custom-step-water w-12 bg-transparent text-amber-700 dark:text-amber-400 py-1 focus:outline-none text-xs font-bold text-center" placeholder="water" value="${waterStr}" />
        <span class="text-amber-500 text-[10px] font-bold">g</span>
      </div>
      <button class="remove-step text-stone-300 dark:text-stone-600 hover:text-red-500 font-bold ml-auto px-2 text-xl leading-none">&times;</button>
    </div>
    <input type="text" class="custom-step-text w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 py-1.5 px-3 rounded-md focus:ring-2 focus:ring-amber-600 text-sm" placeholder="Instruction text..." value="${textStr}" />
  `;

  const minInput = div.querySelector('.custom-step-min');
  const secInput = div.querySelector('.custom-step-sec');

  minInput.addEventListener('focus', (e) => { if (e.target.value === '0') e.target.value = ''; e.target.select(); });
  minInput.addEventListener('blur', (e) => { if (e.target.value === '') e.target.value = '0'; });
  secInput.addEventListener('focus', (e) => { if (e.target.value === '00' || e.target.value === '0') e.target.value = ''; e.target.select(); });
  secInput.addEventListener('blur', (e) => {
    if (e.target.value === '') e.target.value = '00';
    else if (e.target.value.length === 1) e.target.value = '0' + e.target.value;
  });

  div.querySelectorAll('input').forEach(inp => inp.addEventListener('input', calculateRecipe));
  div.querySelector('.remove-step').addEventListener('click', (e) => {
    e.target.closest('.step-row').remove();
    calculateRecipe();
  });

  customStepsContainer.appendChild(div);
}

// ==========================================
// QR Code & Card Generation Logic
// ==========================================
function triggerQrModal(fromCustomBuilder = false) {
  let activeConfigObj = null;

  if (fromCustomBuilder || currentMode === 'create') {
    const configName = customNameEl.value || 'Custom Coffee Brew';
    const hasUnsavedSteps = document.querySelectorAll('.step-row').length > 0 && document.querySelector('.custom-step-text').value !== '';
    if (Object.keys(stagedCustomMethods).length === 0 || hasUnsavedSteps) stageCurrentMethod();

    activeConfigObj = {
      id: configName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: configName,
      default_roast: roastEl.value,
      default_process: fermentationEl.value,
      default_dose: parseFloat(weightEl.value),
      methods: stagedCustomMethods
    };
  } else {
    activeConfigObj = allBaristas.find(b => b.id === baristaEl.value);
  }

  if (!activeConfigObj) return;

  const activeMethodId = currentMode === 'create' ? customBrewMethodEl.value : methodEl.value;
  const singleMethod = {};
  if (activeConfigObj.methods && activeConfigObj.methods[activeMethodId]) {
    singleMethod[activeMethodId] = activeConfigObj.methods[activeMethodId];
  }

  activeShareConfig = {
    id: activeConfigObj.id,
    name: activeConfigObj.name,
    default_roast: roastEl.value,
    default_process: fermentationEl.value,
    default_dose: parseFloat(weightEl.value),
    methods: singleMethod
  };

  const jsonStr = JSON.stringify(activeShareConfig);
  const compressed = LZString.compressToEncodedURIComponent(jsonStr);
  const baseUrl = window.location.origin + window.location.pathname;
  activeShareUrl = `${baseUrl}?r=${compressed}`;

  qrModalTitle.textContent = activeShareConfig.name;
  const methodData = activeShareConfig.methods[activeMethodId];
  qrModalSubtitle.textContent = methodData ? `${methodData.label} • Ratio 1:${methodData.ratio}` : 'Ready to Brew';

  qrcodeTarget.innerHTML = '';
  new QRCode(qrcodeTarget, {
    text: activeShareUrl,
    width: 512, height: 512,
    colorDark: "#1c1917", colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.L
  });

  qrModal.classList.remove('hidden');
  setTimeout(() => {
    qrModal.classList.remove('opacity-0');
    qrModal.querySelector('div').classList.remove('scale-95');
  }, 10);
}

function hideQrModal() {
  qrModal.classList.add('opacity-0');
  qrModal.querySelector('div').classList.add('scale-95');
  setTimeout(() => { qrModal.classList.add('hidden'); }, 300);
}

function copyDirectLink() {
  navigator.clipboard.writeText(activeShareUrl).then(() => {
    copyBtnText.textContent = "✓ Link Copied!";
    setTimeout(() => { copyBtnText.textContent = "Copy Direct Link"; }, 2000);
  });
}

function downloadBrandedQrCard() {
  if (!activeShareConfig) return;

  const canvas = qrExportCanvas;
  const ctx = canvas.getContext('2d');

  canvas.width = 800; canvas.height = 1050;

  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#1c1917'); bgGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#d97706'; ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 30px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('SMART BREW ASSISTANT', canvas.width / 2, 90);

  ctx.strokeStyle = '#292524'; ctx.lineWidth = 2; ctx.beginPath();
  ctx.moveTo(80, 120); ctx.lineTo(canvas.width - 80, 120); ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 44px sans-serif';
  ctx.fillText(activeShareConfig.name, canvas.width / 2, 190);

  const firstMethodKey = Object.keys(activeShareConfig.methods)[0];
  const methodData = activeShareConfig.methods[firstMethodKey];
  const methodLabel = methodData?.label || 'Custom Brew';
  const grinderInfo = methodData?.grinder_name ? `${methodData.grinder_name} (Size: ${methodData.grind_size || 'Dialed'})` : 'Dialed Precision';

  ctx.fillStyle = '#a8a29e'; ctx.font = '24px sans-serif';
  ctx.fillText(`${methodLabel} • 1:${methodData?.ratio || 16}`, canvas.width / 2, 240);
  ctx.fillText(`Grinder: ${grinderInfo}`, canvas.width / 2, 280);

  const qrBoxSize = 420; const qrX = (canvas.width - qrBoxSize) / 2; const qrY = 330;
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(qrX, qrY, qrBoxSize, qrBoxSize, [24]); ctx.fill();

  const qrCanvas = qrcodeTarget.querySelector('canvas');
  const qrImg = qrcodeTarget.querySelector('img');
  let qrDataUrl = '';

  if (qrCanvas && qrCanvas.width > 0) qrDataUrl = qrCanvas.toDataURL('image/png');
  else if (qrImg && qrImg.src) qrDataUrl = qrImg.src;

  if (!qrDataUrl) {
    alert("Please wait a second for the QR code to finish generating before downloading.");
    return;
  }

  const safeImg = new Image();
  safeImg.onload = function () {
    ctx.drawImage(safeImg, qrX + 30, qrY + 30, qrBoxSize - 60, qrBoxSize - 60);
    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 24px sans-serif';
    ctx.fillText('Scan with Camera to Brew Live', canvas.width / 2, 820);
    ctx.fillStyle = '#78716c'; ctx.font = 'bold 20px sans-serif';
    ctx.fillText('© 2026 Smart Brew Assistant™ • Crafted by Hritik Sharma', canvas.width / 2, 940);
    ctx.font = '16px sans-serif';
    ctx.fillText('https://hkhrithik007.github.io/smart-brew-assistant/', canvas.width / 2, 975);

    const link = document.createElement('a');
    link.download = `smart-brew-assistant-${activeShareConfig.id || 'recipe'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  safeImg.src = qrDataUrl;
}

// ==========================================
// FILE I/O (YAML & QR IMAGE UPLOAD)
// ==========================================
function downloadCustomConfig() {
  const configName = customNameEl.value || 'My Custom Config';
  const hasUnsavedSteps = document.querySelectorAll('.step-row').length > 0 && document.querySelector('.custom-step-text').value !== '';
  if (Object.keys(stagedCustomMethods).length === 0 || hasUnsavedSteps) stageCurrentMethod();

  const yamlObj = {
    id: configName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: configName, default_roast: roastEl.value, default_process: fermentationEl.value, default_dose: parseFloat(weightEl.value),
    methods: stagedCustomMethods
  };

  const yamlStr = jsyaml.dump(yamlObj);
  const blob = new Blob([yamlStr], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${yamlObj.id}.yaml`; a.click(); URL.revokeObjectURL(url);
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const config = jsyaml.load(evt.target.result);
      if (config && config.id && config.methods) {
        const existingIdx = allBaristas.findIndex(b => b.id === config.id);
        if (existingIdx > -1) allBaristas[existingIdx] = config;
        else allBaristas.unshift(config);

        setMode('official');
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
  importMenuDropdown.classList.add('hidden');
}

function handleQrUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      // Draw uploaded image to a canvas so jsQR can read its pixels
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const rawData = code.data;
        if (rawData.includes('?r=')) {
          const payload = rawData.split('?r=')[1];
          if (processSharedRecipePayload(payload)) {
            alert("✅ QR Recipe Loaded Successfully!");
          } else {
            alert("❌ Corrupted recipe data inside this QR code.");
          }
        } else {
          alert("❌ This QR code does not contain a Smart Brew recipe.");
        }
      } else {
        alert("❌ No QR code detected. Make sure the image is clear and not cropped.");
      }
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
  importMenuDropdown.classList.add('hidden');
}

// ==========================================
// Calculation & Steps Rendering
// ==========================================
function formatTime(val) {
  if (typeof val === 'number') {
    const m = Math.floor(val / 60);
    const s = (val % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  return String(val || '0:00');
}

function buildTimelineStep(time, water, instruction) {
  const displayTime = formatTime(time);
  const waterBadge = water ? `<span class="ml-2 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700/50 px-2 py-0.5 rounded-full">${water}g</span>` : '';
  return `
    <div class="relative pl-6 md:pl-7">
        <div class="absolute w-3.5 h-3.5 bg-amber-600 rounded-full -left-[8px] top-1.5 ring-4 ring-white dark:ring-stone-900 shadow-sm transition-colors duration-300"></div>
        <div class="flex items-center mb-1">
          <div class="text-sm font-black text-amber-700 dark:text-amber-500 tracking-wide">${displayTime}</div>
          ${waterBadge}
        </div>
        <div class="text-stone-600 dark:text-stone-300 leading-relaxed text-sm md:text-base">${instruction}</div>
    </div>
  `;
}

function parseYamlTemplate(text, water) {
  if (text === undefined || text === null) return '';
  const strText = String(text);
  const w = Number(water) || 0;
  const chunk = Math.round(w / 5);
  return strText.replaceAll('{{water}}', w)
    .replaceAll('{{chunk_1}}', chunk)
    .replaceAll('{{chunk_2}}', chunk * 2)
    .replaceAll('{{chunk_3}}', chunk * 3)
    .replaceAll('{{chunk_4}}', chunk * 4);
}

function calculateRecipe() {
  const weight = parseFloat(weightEl.value) || 0;
  let activeRatio = 17;
  let activeMethodId = '';

  if (currentMode === 'official') {
    const activeBarista = allBaristas.find(b => b.id === baristaEl.value);
    activeMethodId = methodEl.value;
    const activeMethodData = activeBarista?.methods?.[activeMethodId];
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

  if (currentMode === 'create') {
    creatorBadgeEl.textContent = `Custom Workspace`;
    creatorBadgeEl.className = "inline-block py-1 px-3 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-[10px] md:text-xs font-bold tracking-wider mb-2 uppercase border border-teal-200 dark:border-teal-800";
    recipeTitleEl.textContent = customNameEl.value || 'Untitled Brew Method';
    recipeProfileEl.textContent = customProfileEl.value ? `Target: ${customProfileEl.value}` : '';

    if (customGrinderNameEl.value || customGrinderSizeEl.value) {
      const gName = customGrinderNameEl.value || "Custom Grinder";
      const gSize = customGrinderSizeEl.value ? ` (Size: ${customGrinderSizeEl.value})` : "";
      recipeGrinderTextEl.textContent = `${gName}${gSize}`;
      recipeGrinderBadgeEl.classList.remove('hidden');
    } else { recipeGrinderBadgeEl.classList.add('hidden'); }

    if (customNotesEl.value) {
      recipeNotesEl.textContent = customNotesEl.value;
      recipeNotesEl.classList.remove('hidden');
    } else { recipeNotesEl.classList.add('hidden'); }

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
      buildTimelineStep(step.time, step.water ? parseYamlTemplate(step.water, totalWater) : '', parseYamlTemplate(step.text, totalWater))
    ).join('');

  } else {
    const activeBarista = allBaristas.find(b => b.id === baristaEl.value);
    const activeMethodData = activeBarista?.methods?.[methodEl.value];

    if (activeBarista && activeMethodData) {
      creatorBadgeEl.textContent = `${activeBarista.name} Config`;
      creatorBadgeEl.className = "inline-block py-1 px-3 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] md:text-xs font-bold tracking-wider mb-2 uppercase border border-amber-200 dark:border-amber-800";
      recipeTitleEl.textContent = `${activeMethodData.label} Technique`;
      recipeProfileEl.textContent = activeMethodData.result_type ? `Target: ${activeMethodData.result_type}` : '';

      if (activeMethodData.grinder_name || activeMethodData.grind_size) {
        const gName = activeMethodData.grinder_name || "Grinder";
        const gSize = activeMethodData.grind_size ? ` (Size: ${activeMethodData.grind_size})` : "";
        recipeGrinderTextEl.textContent = `${gName}${gSize}`;
        recipeGrinderBadgeEl.classList.remove('hidden');
      } else { recipeGrinderBadgeEl.classList.add('hidden'); }

      if (activeMethodData.notes) {
        recipeNotesEl.textContent = activeMethodData.notes;
        recipeNotesEl.classList.remove('hidden');
      } else { recipeNotesEl.classList.add('hidden'); }

      recipeStepsEl.innerHTML = activeMethodData.steps.map(step =>
        buildTimelineStep(step.time, (step.water !== undefined && step.water !== null && step.water !== "") ? parseYamlTemplate(step.water, totalWater) : '', parseYamlTemplate(step.text, totalWater))
      ).join('');
    } else {
      recipeStepsEl.innerHTML = '';
      recipeTitleEl.textContent = "No Recipe Found";
      recipeProfileEl.textContent = "";
      recipeGrinderBadgeEl.classList.add('hidden');
    }
  }
}

initializeApp();
