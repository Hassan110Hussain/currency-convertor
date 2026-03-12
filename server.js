const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

// API endpoint to get currency conversion
app.get('/api/convert', async (req, res) => {
  const { baseCurrency } = req.query;
  const apiKey = process.env.CURRENCY_API_KEY;

  if (!baseCurrency) {
    return res.status(400).json({ error: 'baseCurrency is required' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${baseCurrency}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch from currency API');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
