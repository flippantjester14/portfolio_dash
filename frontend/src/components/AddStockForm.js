// frontend/src/components/AddStockForm.js
import React, { useState } from 'react';

const AddStockForm = ({ onStockAdded }) => {
  const [ticker, setTicker] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [shares, setShares] = useState('');
  const [avgCost, setAvgCost] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!ticker || !shares || !avgCost || !currentPrice) {
      setError('Please fill in all required fields: Ticker, Shares, Average Cost, Current Price.');
      return;
    }

    const stockData = {
      ticker_symbol: ticker.toUpperCase(),
      company_name: companyName,
      shares_owned: parseFloat(shares),
      average_cost: parseFloat(avgCost),
      current_market_price: parseFloat(currentPrice),
      purchase_date: purchaseDate,
    };

    try {
      await onStockAdded(stockData);
      setSuccessMessage(`Successfully added ${stockData.ticker_symbol}!`);
      // Clear form
      setTicker('');
      setCompanyName('');
      setShares('');
      setAvgCost('');
      setCurrentPrice('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3s
    } catch (err) {
      setError(err.message || 'Failed to add stock. Ticker might already exist or server error.');
    }
  };

  return (
    <div className="add-stock-form-container">
      <h2>Add New Stock to Portfolio</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ticker">Ticker Symbol*:</label>
          <input type="text" id="ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="companyName">Company Name:</label>
          <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="shares">Shares Owned*:</label>
          <input type="number" step="any" id="shares" value={shares} onChange={(e) => setShares(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="avgCost">Average Cost per Share*:</label>
          <input type="number" step="0.01" id="avgCost" value={avgCost} onChange={(e) => setAvgCost(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="currentPrice">Current Market Price per Share*:</label>
          <input type="number" step="0.01" id="currentPrice" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} required />
        </div>
         <div>
          <label htmlFor="purchaseDate">Purchase Date:</label>
          <input type="date" id="purchaseDate" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
        </div>
        <button type="submit">Add Stock</button>
      </form>
    </div>
  );
};

export default AddStockForm;