const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/:coffeeId', async (req, res) => {
  try {
    const records = await prisma.traceabilityRecord.findMany({
      where: { coffeeId: req.params.coffeeId },
      orderBy: { stageOrder: 'asc' },
    });
    const coffee = await prisma.coffee.findUnique({ where: { id: req.params.coffeeId } });
    res.json({ coffee, stages: records });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
