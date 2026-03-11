require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

const COFFEES = [
  {
    name: 'Huila Especial Geisha',
    description: 'Café de especialidad cultivado a 1900 msnm en el Huila. Notas brillantes de jazmín, durazno y bergamota.',
    origin: 'Huila, Colombia', variety: 'Geisha', process: 'Lavado', roastLevel: 'Clara', price: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    sensory: { acidez:8.5, cuerpo:4.5, dulzor:7.8, amargor:2.0, aroma:9.2, saborResidual:8.0, balance:8.5, uniformidad:8.8, flavorNotes:['floral','frutal','citrico'], cupperScore:88.5 }
  },
  {
    name: 'Nariño Caturra Natural',
    description: 'Proceso natural que resalta el dulzor intenso. Notas de chocolate negro, panela y uvas pasas.',
    origin: 'Nariño, Colombia', variety: 'Caturra', process: 'Natural', roastLevel: 'Media', price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    sensory: { acidez:5.0, cuerpo:8.5, dulzor:9.0, amargor:5.5, aroma:8.0, saborResidual:8.5, balance:7.8, uniformidad:8.0, flavorNotes:['chocolate','caramelo','frutal'], cupperScore:85.0 }
  },
  {
    name: 'Cundinamarca Castillo Lavado',
    description: 'Café regional de Fusagasugá con notas a nuez tostada, caramelo suave y cítrico suave.',
    origin: 'Cundinamarca, Colombia', variety: 'Castillo', process: 'Lavado', roastLevel: 'Media', price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    sensory: { acidez:6.0, cuerpo:6.5, dulzor:6.8, amargor:4.5, aroma:6.5, saborResidual:6.5, balance:7.5, uniformidad:7.8, flavorNotes:['nuez','caramelo','citrico'], cupperScore:82.0 }
  },
  {
    name: 'Cauca Bourbon Honey',
    description: 'Proceso honey que combina lo mejor de lavado y natural. Notas de miel, melocotón y flores blancas.',
    origin: 'Cauca, Colombia', variety: 'Bourbon', process: 'Honey', roastLevel: 'Clara', price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    sensory: { acidez:7.5, cuerpo:6.0, dulzor:8.8, amargor:2.5, aroma:8.5, saborResidual:7.5, balance:8.2, uniformidad:8.5, flavorNotes:['floral','caramelo','frutal'], cupperScore:86.5 }
  },
  {
    name: 'Tolima Anaeróbico Especial',
    description: 'Fermentación anaerobia que desarrolla notas únicas de guayaba, moras y especias tropicales.',
    origin: 'Tolima, Colombia', variety: 'Tabi', process: 'Anaeróbico', roastLevel: 'Media-Clara', price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
    sensory: { acidez:8.0, cuerpo:7.0, dulzor:7.5, amargor:3.0, aroma:9.0, saborResidual:8.8, balance:7.8, uniformidad:8.0, flavorNotes:['frutal','especiado','floral'], cupperScore:89.0 }
  },
  {
    name: 'Espresso Fusagasugá Dark',
    description: 'Blend local pensado para espresso. Cuerpo intenso, notas de chocolate amargo y tabaco suave.',
    origin: 'Cundinamarca, Colombia', variety: 'Castillo', process: 'Lavado', roastLevel: 'Oscura', price: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=400',
    sensory: { acidez:2.5, cuerpo:9.5, dulzor:4.0, amargor:8.5, aroma:7.5, saborResidual:9.0, balance:7.0, uniformidad:7.5, flavorNotes:['chocolate','terroso','especiado'], cupperScore:80.0 }
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coffee.com' },
    update: {},
    create: { name: 'Admin Coffee', email: 'admin@coffee.com', passwordHash: adminHash, role: 'administrador' },
  });

  // Demo client
  const clientHash = await bcrypt.hash('cliente123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'demo@coffee.com' },
    update: {},
    create: { name: 'Carlos Demo', email: 'demo@coffee.com', passwordHash: clientHash, role: 'cliente' },
  });
  await prisma.clientProfile.upsert({ where: { userId: client.id }, update: {}, create: { userId: client.id } });

  // Coffees
  for (const c of COFFEES) {
    const coffee = await prisma.coffee.upsert({
      where: { id: c.name.replace(/\s+/g, '-').toLowerCase().substring(0, 25) },
      update: {},
      create: {
        id: c.name.replace(/\s+/g, '-').toLowerCase().substring(0, 25),
        name: c.name, description: c.description, origin: c.origin,
        variety: c.variety, process: c.process, roastLevel: c.roastLevel,
        price: c.price, imageUrl: c.imageUrl,
      },
    });

    await prisma.sensoryProfile.upsert({
      where: { coffeeId: coffee.id },
      update: {},
      create: {
        coffeeId: coffee.id,
        acidez: c.sensory.acidez, cuerpo: c.sensory.cuerpo, dulzor: c.sensory.dulzor,
        amargor: c.sensory.amargor, aroma: c.sensory.aroma, saborResidual: c.sensory.saborResidual,
        balance: c.sensory.balance, uniformidad: c.sensory.uniformidad,
        flavorNotes: JSON.stringify(c.sensory.flavorNotes), cupperScore: c.sensory.cupperScore,
      },
    });

    const token = randomUUID().replace(/-/g,'');
    const qrUrl = `http://localhost:5173/trace/${coffee.id}`;
    const qrImage = await QRCode.toDataURL(qrUrl);
    await prisma.qRCode.upsert({
      where: { coffeeId: coffee.id },
      update: {},
      create: { coffeeId: coffee.id, qrToken: token, qrUrl, qrImage },
    });

    // Traceability stages
    const stages = [
      { stage: 'cosecha', stageOrder: 1, harvestDate: '2024-06-15', harvestMethod: 'Selectiva', cherryWeightKg: 250, notes: 'Cosecha en punto óptimo de maduración' },
      { stage: 'procesamiento', stageOrder: 2, processStart: '2024-06-16T08:00:00Z', processEnd: '2024-06-30T08:00:00Z', humidityPct: 11.5, notes: 'Fermentación controlada 36 horas' },
      { stage: 'tostion', stageOrder: 3, roastDate: '2024-07-10T10:00:00Z', roastDurationMin: 12, roastTempC: 210, notes: 'Perfil de tostión optimizado para especialidad' },
      { stage: 'taza', stageOrder: 4, brewMethod: 'V60', grindSize: 'Media', waterTempC: 93, doseGrams: 15, notes: 'Ratio 1:15, extracción 3 minutos' },
    ];
    for (const s of stages) {
      const exists = await prisma.traceabilityRecord.findFirst({ where: { coffeeId: coffee.id, stageOrder: s.stageOrder } });
      if (!exists) await prisma.traceabilityRecord.create({ data: { coffeeId: coffee.id, recordedById: admin.id, ...s } });
    }
  }

  // Badges
  const badges = [
    { name: 'Explorador del Café', description: 'Probaste tu primer café', iconUrl: '☕', requiredStamps: 1 },
    { name: 'Catador Junior', description: 'Valoraste 3 cafés diferentes', iconUrl: '⭐', requiredStamps: 3 },
    { name: 'Conocedor', description: 'Completaste 5 cafés en tu pasaporte', iconUrl: '🏅', requiredStamps: 5 },
    { name: 'Maestro Catador', description: 'Has probado todos los orígenes', iconUrl: '👑', requiredStamps: 6 },
  ];
  for (const b of badges) {
    await prisma.badge.upsert({ where: { id: badges.indexOf(b) + 1 }, update: {}, create: b });
  }

  console.log('✅ Seed completed!');
  console.log('👤 Admin: admin@coffee.com / admin123');
  console.log('👤 Demo:  demo@coffee.com / cliente123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
