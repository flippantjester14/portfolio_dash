// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const getPortfolioStocks = async () => {
  const result = await pool.query('SELECT id, ticker_symbol, company_name, shares_owned, average_cost, current_market_price, purchase_date FROM portfolio_stocks ORDER BY company_name ASC');
  return result.rows;
};

const addPortfolioStock = async (stock) => {
  const { ticker_symbol, company_name, shares_owned, average_cost, current_market_price, purchase_date } = stock;
  // Basic validation
  if (!ticker_symbol || !shares_owned || !average_cost || !current_market_price) {
    throw new Error('Ticker, shares, average cost, and current market price are required.');
  }
  const query = `
    INSERT INTO portfolio_stocks (ticker_symbol, company_name, shares_owned, average_cost, current_market_price, purchase_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, ticker_symbol, company_name, shares_owned, average_cost, current_market_price, purchase_date;
  `;
  const values = [ticker_symbol.toUpperCase(), company_name, shares_owned, average_cost, current_market_price, purchase_date || new Date()];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateStockCurrentPrice = async (id, current_market_price) => {
  const query = `
    UPDATE portfolio_stocks
    SET current_market_price = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, ticker_symbol, company_name, shares_owned, average_cost, current_market_price, purchase_date;
  `;
  const result = await pool.query(query, [current_market_price, id]);
  if (result.rows.length === 0) {
    throw new Error('Stock not found or no change made.');
  }
  return result.rows[0];
};

const deletePortfolioStock = async (id) => {
  const query = 'DELETE FROM portfolio_stocks WHERE id = $1 RETURNING id;';
  const result = await pool.query(query, [id]);
  if (result.rowCount === 0) {
    throw new Error('Stock not found.');
  }
  return { id, message: 'Stock deleted successfully' };
};


module.exports = {
  query: (text, params) => pool.query(text, params), // Generic query function if needed
  getPortfolioStocks,
  addPortfolioStock,
  updateStockCurrentPrice,
  deletePortfolioStock,
};