const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { recommendCoffees } = require('../modules/recommendationEngine');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { flavorTags, intensity, mood } = req.body;
    if (!flavorTags?.length || !intensity || !mood) return res.status(400).json({ error: 'Faltan parámetros del cuestionario' });

    const catalog = await prisma.coffee.findMany({ where: { isActive: true }, include: { sensoryProfile: true } });
    const results = recommendCoffees({ flavorTags, intensity, mood }, catalog);

    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;
    if (token) {
      try { userId = jwt.verify(token, process.env.JWT_SECRET).userId; } catch {}
    }

    const matchScores = {};
    results.forEach(r => { matchScores[r.coffee.id] = Math.round(r.score * 100); });

    const session = await prisma.recommendationSession.create({
      data: {
        userId,
        q1FlavorTags: JSON.stringify(flavorTags),
        q2Intensity: intensity,
        q3Mood: mood,
        recommendedIds: JSON.stringify(results.map(r => r.coffee.id)),
        matchScores: JSON.stringify(matchScores),
      },
    });

    res.json({
      sessionId: session.id,
      recommendations: results.map(r => ({
        coffee: r.coffee,
        score: Math.round(r.score * 100),
        reason: r.reason,
      })),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/rate', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No autorizado' });
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const { coffeeId, rAcidez, rCuerpo, rDulzor, rAmargor, rAroma, rSaborResidual, rBalance, rUniformidad, overallScore, comment } = req.body;

    const rating = await prisma.rating.upsert({
      where: { userId_coffeeId: { userId, coffeeId } },
      update: { rAcidez, rCuerpo, rDulzor, rAmargor, rAroma, rSaborResidual, rBalance, rUniformidad, overallScore, comment },
      create: { userId, coffeeId, rAcidez, rCuerpo, rDulzor, rAmargor, rAroma, rSaborResidual, rBalance, rUniformidad, overallScore, comment },
    });

    // Add passport stamp
    await prisma.passportStamp.upsert({
      where: { userId_coffeeId: { userId, coffeeId } },
      update: {},
      create: { userId, coffeeId, stampIcon: overallScore >= 4 ? 'estrella' : 'probado' },
    });

    res.json(rating);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
