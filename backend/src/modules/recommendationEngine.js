const FLAVOR_TO_SENSORY_MAP = {
  frutal:     { acidez:0.9, cuerpo:0.4, dulzor:0.8, amargor:0.1, aroma:0.7, saborResidual:0.6, balance:0.7, uniformidad:0.6 },
  chocolate:  { acidez:0.2, cuerpo:0.9, dulzor:0.7, amargor:0.6, aroma:0.8, saborResidual:0.9, balance:0.8, uniformidad:0.7 },
  caramelo:   { acidez:0.1, cuerpo:0.7, dulzor:0.9, amargor:0.2, aroma:0.7, saborResidual:0.8, balance:0.8, uniformidad:0.8 },
  floral:     { acidez:0.8, cuerpo:0.3, dulzor:0.6, amargor:0.1, aroma:0.9, saborResidual:0.5, balance:0.7, uniformidad:0.6 },
  nuez:       { acidez:0.3, cuerpo:0.7, dulzor:0.5, amargor:0.4, aroma:0.6, saborResidual:0.7, balance:0.8, uniformidad:0.8 },
  especiado:  { acidez:0.4, cuerpo:0.8, dulzor:0.3, amargor:0.7, aroma:0.8, saborResidual:0.8, balance:0.6, uniformidad:0.6 },
  citrico:    { acidez:1.0, cuerpo:0.3, dulzor:0.5, amargor:0.1, aroma:0.8, saborResidual:0.4, balance:0.6, uniformidad:0.7 },
  terroso:    { acidez:0.2, cuerpo:0.9, dulzor:0.2, amargor:0.8, aroma:0.6, saborResidual:0.9, balance:0.7, uniformidad:0.7 },
};

const MOOD_WEIGHTS = {
  concentrado: { acidez:1.2, cuerpo:1.4, dulzor:0.8, amargor:1.3, aroma:1.0, saborResidual:1.1, balance:1.0, uniformidad:1.0 },
  relajado:    { acidez:0.7, cuerpo:1.1, dulzor:1.4, amargor:0.5, aroma:1.3, saborResidual:1.2, balance:1.2, uniformidad:1.1 },
  social:      { acidez:0.9, cuerpo:0.9, dulzor:1.3, amargor:0.6, aroma:1.4, saborResidual:1.0, balance:1.3, uniformidad:1.0 },
  energetico:  { acidez:1.4, cuerpo:1.0, dulzor:0.7, amargor:1.2, aroma:1.1, saborResidual:1.0, balance:0.9, uniformidad:0.9 },
  creativo:    { acidez:1.3, cuerpo:0.6, dulzor:0.9, amargor:0.4, aroma:1.5, saborResidual:0.8, balance:1.0, uniformidad:1.0 },
  cansado:     { acidez:0.5, cuerpo:1.3, dulzor:1.5, amargor:0.3, aroma:1.0, saborResidual:1.3, balance:1.2, uniformidad:1.1 },
};

const INTENSITY_SCALE = { 1: 0.4, 2: 0.6, 3: 0.8, 4: 1.0, 5: 1.2 };
const DIMS = ['acidez','cuerpo','dulzor','amargor','aroma','saborResidual','balance','uniformidad'];

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((s, a, i) => s + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((s, a) => s + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((s, b) => s + b * b, 0));
  if (!magA || !magB) return 0;
  return dot / (magA * magB);
}

function buildUserVector(flavorTags, intensity, mood) {
  const weights = MOOD_WEIGHTS[mood] || MOOD_WEIGHTS.social;
  const scale = INTENSITY_SCALE[intensity] || 0.8;
  return DIMS.map(dim => {
    const avg = flavorTags.reduce((s, tag) => s + (FLAVOR_TO_SENSORY_MAP[tag]?.[dim] || 0), 0) / Math.max(flavorTags.length, 1);
    return avg * weights[dim] * scale;
  });
}

function generateReason(coffee, flavorTags, mood, score) {
  const moodMessages = {
    concentrado: 'su cuerpo intenso potencia la concentración',
    relajado:    'su dulzor suave invita a un momento de calma',
    social:      'su perfil equilibrado es ideal para compartir',
    energetico:  'su acidez vibrante te dará el impulso que necesitas',
    creativo:    'sus notas florales estimulan la imaginación',
    cansado:     'su dulzor reconfortante es el abrazo perfecto',
  };
  const notes = JSON.parse(coffee.sensoryProfile?.flavorNotes || '[]');
  const match = flavorTags.filter(t => notes.includes(t)).slice(0, 2).join(' y ');
  const pct = Math.round(score * 100);
  const level = score > 0.85 ? 'Coincidencia excelente' : score > 0.70 ? 'Muy buena coincidencia' : 'Buena coincidencia';
  return `${level} (${pct}%). ${match ? `Encontrarás notas de ${match}. ` : ''}Además, ${moodMessages[mood] || 'se adapta a tu estado de ánimo'}.`;
}

function recommendCoffees(questionnaire, catalog) {
  const { flavorTags, intensity, mood } = questionnaire;
  const userVector = buildUserVector(flavorTags, intensity, mood);

  const scored = catalog
    .filter(c => c.sensoryProfile && c.isActive)
    .map(coffee => {
      const sp = coffee.sensoryProfile;
      const coffeeVector = DIMS.map(d => (sp[d] || 0) / 10);
      const score = cosineSimilarity(userVector, coffeeVector);
      return { coffee, score, reason: generateReason(coffee, flavorTags, mood, score) };
    })
    .sort((a, b) => b.score - a.score);

  const selected = [scored[0]];
  for (const c of scored.slice(1)) {
    if (selected.length >= 3) break;
    const sp = c.coffee.sensoryProfile;
    const tooSimilar = selected.some(s => {
      const ssp = s.coffee.sensoryProfile;
      const v1 = DIMS.map(d => (sp[d] || 0) / 10);
      const v2 = DIMS.map(d => (ssp[d] || 0) / 10);
      return cosineSimilarity(v1, v2) > 0.92;
    });
    if (!tooSimilar) selected.push(c);
  }
  while (selected.length < 3 && scored.length > selected.length) {
    const next = scored.find(s => !selected.includes(s));
    if (next) selected.push(next);
  }
  return selected;
}

module.exports = { recommendCoffees };
