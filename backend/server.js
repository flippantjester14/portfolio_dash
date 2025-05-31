// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// ROUTES
app.get('/', (req, res) => {
  res.send('Portfolio Backend API is running!');
});

// Get all portfolio stocks
app.get('/api/portfolio', async (req, res) => {
  try {
    const stocks = await db.getPortfolioStocks();
    res.json(stocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new stock to the portfolio
app.post('/api/portfolio', async (req, res) => {
  try {
    const newStock = await db.addPortfolioStock(req.body);
    res.status(201).json(newStock);
  } catch (err) {
    console.error(err.message);
    // Check for unique constraint violation for ticker_symbol
    if (err.message.includes('duplicate key value violates unique constraint "portfolio_stocks_ticker_symbol_key"')) {
        return res.status(409).json({ message: `Stock with ticker ${req.body.ticker_symbol} already exists.` });
    }
    if (err.message.includes('required')) {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server error');
  }
});

// Update a stock's current market price
app.put('/api/portfolio/:id/price', async (req, res) => {
    const { id } = req.params;
    const { current_market_price } = req.body;

    if (typeof current_market_price !== 'number') {
        return res.status(400).json({ message: 'Valid current_market_price is required.' });
    }

    try {
        const updatedStock = await db.updateStockCurrentPrice(id, current_market_price);
        res.json(updatedStock);
    } catch (err) {
        console.error(err.message);
        if (err.message.includes('Stock not found')) {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
});


// Delete a stock from the portfolio
app.delete('/api/portfolio/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.deletePortfolioStock(id);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message.includes('Stock not found')) {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
});


app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});