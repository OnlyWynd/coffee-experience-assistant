const CONTAINER_CONSTANTS = {
  ceramica: { k: 0.045, thermalMass: 1.3 },
  vidrio:   { k: 0.062, thermalMass: 1.0 },
  papel:    { k: 0.095, thermalMass: 0.7 },
  termos:   { k: 0.012, thermalMass: 2.5 },
  metalico: { k: 0.038, thermalMass: 1.5 },
};

const OPTIMAL_RANGES = {
  espresso:     { min: 67, max: 74, peak: 70 },
  v60:          { min: 70, max: 78, peak: 74 },
  chemex:       { min: 72, max: 80, peak: 76 },
  french_press: { min: 75, max: 82, peak: 78 },
  cold_brew:    { min:  4, max: 12, peak:  8 },
  aeropress:    { min: 68, max: 76, peak: 72 },
  moka:         { min: 68, max: 76, peak: 72 },
  americano:    { min: 70, max: 78, peak: 74 },
};

const INITIAL_TEMPS = {
  espresso: 88, v60: 93, chemex: 93, french_press: 93,
  cold_brew: 6, aeropress: 88, moka: 85, americano: 90,
};

function simulateTemp({ brewMethod = 'v60', containerType = 'ceramica', volumeMl = 200, ambientTempC = 20, elapsedMinutes = 0 }) {
  const T0 = INITIAL_TEMPS[brewMethod] || 90;
  const c = CONTAINER_CONSTANTS[containerType] || CONTAINER_CONSTANTS.ceramica;
  const volumeFactor = Math.pow(200 / Math.max(volumeMl, 50), 0.3);
  const k_eff = c.k * volumeFactor / c.thermalMass;
  return Math.round((ambientTempC + (T0 - ambientTempC) * Math.exp(-k_eff * elapsedMinutes)) * 10) / 10;
}

function getOptimalWindow(params) {
  const range = OPTIMAL_RANGES[params.brewMethod] || OPTIMAL_RANGES.v60;
  let optStart = null, optEnd = null;
  for (let t = 0; t <= 60; t += 0.1) {
    const temp = simulateTemp({ ...params, elapsedMinutes: t });
    if (optStart === null && temp <= range.max && temp >= range.min) optStart = t;
    if (optStart !== null && temp < range.min) { optEnd = t; break; }
  }
  const currentTemp = simulateTemp({ ...params, elapsedMinutes: params.elapsedMinutes || 0 });
  const status = currentTemp > range.max ? 'muy_caliente' : currentTemp >= range.min ? 'optimo' : 'frio';
  return {
    currentTemp,
    optimalRange: range,
    optimalStartMin: optStart ? Math.round(optStart * 10) / 10 : null,
    optimalEndMin: optEnd ? Math.round(optEnd * 10) / 10 : null,
    windowMinutes: optStart && optEnd ? Math.round((optEnd - optStart) * 10) / 10 : null,
    status,
    statusLabel: { muy_caliente: 'Esperando — Demasiado caliente', optimo: '¡Momento perfecto!', frio: 'Se ha enfriado' }[status],
  };
}

function generateSeries(params, totalMin = 30, step = 0.5) {
  const range = OPTIMAL_RANGES[params.brewMethod] || OPTIMAL_RANGES.v60;
  const series = [];
  for (let t = 0; t <= totalMin; t += step) {
    const temp = simulateTemp({ ...params, elapsedMinutes: t });
    series.push({ time: Math.round(t * 10) / 10, temp, zone: temp > range.max ? 'hot' : temp >= range.min ? 'optimal' : 'cold' });
  }
  return series;
}

module.exports = { simulateTemp, getOptimalWindow, generateSeries, OPTIMAL_RANGES, CONTAINER_CONSTANTS };
