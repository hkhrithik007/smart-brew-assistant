// DOM Elements
const methodEl = document.getElementById('method');
const roastEl = document.getElementById('roast');
const fermentationEl = document.getElementById('fermentation');
const weightEl = document.getElementById('weight');
const ratioEl = document.getElementById('ratio');
const ratioDisplay = document.getElementById('ratio-display');
const targetWaterEl = document.getElementById('target-water');
const targetTempEl = document.getElementById('target-temp');
const recipeStepsEl = document.getElementById('recipe-steps');

// 2D Matrix for Temperature Logic based on the chart
const tempMatrix = {
  'very_light': { 'washed': 96, 'washed_ferment': 95, 'yellow_honey': 94, 'red_honey': 93, 'natural': 92, 'natural_ferment': 91 },
  'light': { 'washed': 95, 'washed_ferment': 94, 'yellow_honey': 93, 'red_honey': 92, 'natural': 91, 'natural_ferment': 90 },
  'medium_light': { 'washed': 94, 'washed_ferment': 93, 'yellow_honey': 92, 'red_honey': 91, 'natural': 90, 'natural_ferment': 89 },
  'medium_dark': { 'washed': 93, 'washed_ferment': 92, 'yellow_honey': 91, 'red_honey': 90, 'natural': 89, 'natural_ferment': 88 },
  'dark': { 'washed': 92, 'washed_ferment': 91, 'yellow_honey': 90, 'red_honey': 89, 'natural': 88, 'natural_ferment': 87 },
  'very_dark': { 'washed': 91, 'washed_ferment': 90, 'yellow_honey': 89, 'red_honey': 88, 'natural': 87, 'natural_ferment': 86 }
};

// Helper function to build timeline steps with Tailwind styling
function buildTimelineStep(time, instruction) {
  return `
        <div class="relative pl-7">
            <div class="absolute w-3.5 h-3.5 bg-indigo-500 rounded-full -left-[8px] top-1.5 ring-4 ring-white shadow-sm"></div>
            <div class="text-sm font-black text-indigo-600 tracking-wide mb-1">${time}</div>
            <div class="text-slate-600 leading-relaxed text-sm md:text-base">${instruction}</div>
        </div>
    `;
}

function calculateRecipe() {
  const method = methodEl.value;
  const roast = roastEl.value;
  const fermentation = fermentationEl.value;
  const weight = parseFloat(weightEl.value) || 0;
  const ratio = parseFloat(ratioEl.value) || 0;

  // Update UI displays
  ratioDisplay.textContent = ratio;
  const totalWater = Math.round(weight * ratio);
  targetWaterEl.textContent = totalWater;

  // Fetch precise temperature from the matrix
  const exactTemp = tempMatrix[roast][fermentation];
  targetTempEl.textContent = exactTemp;

  // Generate Steps
  let stepsHTML = '';

  if (method === 'v60') {
    const pourVol = Math.round(totalWater / 5);
    stepsHTML += buildTimelineStep('0:00', `Pour <strong class="text-slate-900">${pourVol}g</strong> for the bloom. Swirl gently or excavate.`);
    stepsHTML += buildTimelineStep('0:45', `Pour <strong class="text-slate-900">${pourVol}g</strong> (Scale reads ${pourVol * 2}g). Keep pour centered.`);
    stepsHTML += buildTimelineStep('1:00', `Pour <strong class="text-slate-900">${pourVol}g</strong> (Scale reads ${pourVol * 3}g).`);
    stepsHTML += buildTimelineStep('1:15', `Pour <strong class="text-slate-900">${pourVol}g</strong> (Scale reads ${pourVol * 4}g).`);
    stepsHTML += buildTimelineStep('1:30', `Pour <strong class="text-slate-900">${pourVol}g</strong> (Scale reads ${totalWater}g). Let drawdown finish completely.`);
  } else if (method === 'french_press') {
    stepsHTML += buildTimelineStep('0:00', `Pour all <strong class="text-slate-900">${totalWater}g</strong> of water aggressively to wet all grounds.`);
    stepsHTML += buildTimelineStep('4:00', `Gently stir the crust at the top 3-4 times. It will fall to the bottom.`);
    stepsHTML += buildTimelineStep('4:05', `Scoop off any remaining foam/chaff from the surface with two spoons.`);
    stepsHTML += buildTimelineStep('9:00', `Rest plunger gently on surface (do not press down hard). Pour and serve.`);
  } else if (method === 'aeropress') {
    stepsHTML += buildTimelineStep('0:00', `Set AeroPress to inverted. Pour <strong class="text-slate-900">${totalWater}g</strong> of water.`);
    stepsHTML += buildTimelineStep('0:30', `Stir gently back and forth to ensure even saturation.`);
    stepsHTML += buildTimelineStep('1:30', `Attach cap with rinsed filter paper and carefully flip onto mug.`);
    stepsHTML += buildTimelineStep('2:00', `Press gently but firmly for about 30 seconds until you hear a hiss.`);
  }

  recipeStepsEl.innerHTML = stepsHTML;
}

// Event Listeners
methodEl.addEventListener('change', calculateRecipe);
roastEl.addEventListener('change', calculateRecipe);
fermentationEl.addEventListener('change', calculateRecipe);
weightEl.addEventListener('input', calculateRecipe);
ratioEl.addEventListener('input', calculateRecipe);

// Initial render
calculateRecipe();
