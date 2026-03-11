const express = require('express');
const { getOptimalWindow, generateSeries } = require('../modules/temperatureSimulator');

const router = express.Router();

router.post('/simulate', (req, res) => {
  try {
    const { brewMethod = 'v60', containerType = 'ceramica', volumeMl = 200, ambientTempC = 20 } = req.body;
    const params = { brewMethod, containerType, volumeMl, ambientTempC };
    const window = getOptimalWindow(params);
    const series = generateSeries(params, 30, 0.5);
    res.json({ ...window, series });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/options', (req, res) => {
  res.json({
    brewMethods: ['espresso','v60','chemex','french_press','cold_brew','aeropress','moka','americano'],
    containerTypes: ['ceramica','vidrio','papel','termos','metalico'],
  });
});

module.exports = router;
