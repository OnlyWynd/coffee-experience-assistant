const express = require('express');
const { PrismaClient } = require('@prisma/client');
const QRCode = require('qrcode');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const coffees = await prisma.coffee.findMany({
      where: { isActive: true },
      include: { sensoryProfile: true, qrCode: true },
    });
    res.json(coffees);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const coffee = await prisma.coffee.findUnique({
      where: { id: req.params.id },
      include: {
        sensoryProfile: true,
        qrCode: true,
        traceRecords: { orderBy: { stageOrder: 'asc' } },
        ratings: { include: { user: { select: { name: true } } } },
      },
    });
    if (!coffee) return res.status(404).json({ error: 'Café no encontrado' });
    res.json(coffee);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/qr/:token', async (req, res) => {
  try {
    const qr = await prisma.qRCode.findUnique({
      where: { qrToken: req.params.token },
      include: { coffee: { include: { sensoryProfile: true, traceRecords: { orderBy: { stageOrder: 'asc' } } } } },
    });
    if (!qr) return res.status(404).json({ error: 'QR no encontrado' });
    await prisma.qRCode.update({ where: { id: qr.id }, data: { scanCount: { increment: 1 } } });
    res.json(qr);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
