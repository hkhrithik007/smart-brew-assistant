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

// Data-driven recipe steps - Makes it incredibly easy to edit or add methods later
const recipes = {
  v60: (water) => {
    // James Hoffmann 1-Cup V60 is split into five equal 20% pours
    const chunk = Math.round(water / 5);
    return [
      { time: '0:00', text: `Pour <strong class="text-slate-900">${chunk}g</strong> for the bloom. Give the brewer a gentle swirl to mix. <strong>Wait 45 seconds</strong>.` },
      { time: '0:45', text: `Pour to <strong class="text-slate-900">${chunk * 2}g</strong> over 10 seconds. Pour in slow circles, keeping the kettle spout low. Wait until 1:10.` },
      { time: '1:10', text: `Pour to <strong class="text-slate-900">${chunk * 3}g</strong> over 10 seconds. <strong>Wait 10 seconds</strong>.` },
      { time: '1:30', text: `Pour to <strong class="text-slate-900">${chunk * 4}g</strong> over 10 seconds. <strong>Wait 10 seconds</strong>.` },
      { time: '1:50', text: `Pour to <strong class="text-slate-900">${water}g</strong> over 10 seconds.` },
      { time: '2:00', text: `Give the brewer a final gentle swirl. Let it draw down (should finish around 3:00).` }
    ];
  },
  french_press: (water) => {
    // Ultimate French Press technique completely avoids plunging
    return [
      { time: '0:00', text: `Pour all <strong class="text-slate-900">${water}g</strong> of water. Do not put the plunger on yet.` },
      { time: '4:00', text: `Take a spoon and gently stir the crust at the top. Most grounds will fall to the bottom.` },
      { time: '4:05', text: `Scoop off any remaining foam and floating bits with two spoons and discard.` },
      { time: '4:10', text: `Wait patiently. Do absolutely nothing for at least 5 minutes to let the microscopic silt settle.` },
      { time: '9:00+', text: `Place the plunger on the surface as a strainer (<strong>do not plunge down</strong>). Pour gently into your cup and serve.` }
    ];
  },
  aeropress: (water) => {
    // Ultimate AeroPress uses standard orientation and a vacuum seal
    return [
      { time: '0:00', text: `Standard orientation (not inverted). Put dry paper in cap, lock it. Pour all <strong class="text-slate-900">${water}g</strong> of water.` },
      { time: '0:15', text: `Insert the plunger just slightly into the top chamber. This creates a vacuum and stops the coffee from dripping through.` },
      { time: '2:00', text: `Carefully hold the base and the plunger together, and give the AeroPress a gentle swirl.` },
      { time: '2:30', text: `Begin pressing down gently. It should take about 30 seconds to push all the way through.` },
      { time: '3:00', text: `Stop pressing when you hear the hiss. Pull back slightly on the plunger to stop drips, and serve.` }
    ];
  }
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

// Core calculation logic
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

  // Generate steps dynamically by mapping over the selected recipe array
  const currentRecipe = recipes[method](totalWater);
  recipeStepsEl.innerHTML = currentRecipe
    .map(step => buildTimelineStep(step.time, step.text))
    .join('');
}

// Event Listeners
methodEl.addEventListener('change', calculateRecipe);
roastEl.addEventListener('change', calculateRecipe);
fermentationEl.addEventListener('change', calculateRecipe);
weightEl.addEventListener('input', calculateRecipe);
ratioEl.addEventListener('input', calculateRecipe);

// Initial render
calculateRecipe();
