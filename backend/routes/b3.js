const express = require('express');
const axios = require('axios');
const router = express.Router();

// Buscar cotação para um ticker da B3 (formato exemplo: PETR4.SA)
router.get('/quote/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();

  try {
    const response = await axios.get(`https://brapi.dev/api/quote/${encodeURIComponent(ticker)}`);
    const result = response.data;

    if (!result || !result.results || result.results.length === 0) {
      return res.status(404).json({ message: 'Ticker não encontrado na B3' });
    }

    res.json(result.results[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar dados da B3', error: err.message });
  }
});

module.exports = router;
