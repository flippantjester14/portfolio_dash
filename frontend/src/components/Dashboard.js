// frontend/src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import PortfolioTable from './PortfolioTable';
import AddStockForm from './AddStockForm';
import { getPortfolio, addStock, deleteStock, updateStockPrice } from '../services/api';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPortfolio();
      setStocks(data);
    } catch (err) {
      setError('Failed to fetch portfolio data. Ensure the backend server is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const handleStockAdded = async (stockData) => {
    // The addStock function in api.js will throw an error if API call fails
    // That error will be caught by AddStockForm's handleSubmit
    await addStock(stockData);
    fetchPortfolioData(); // Refresh data
  };

  const handleDeleteStock = async (stockId) => {
    if (window.confirm("Are you sure you want to delete this stock holding?")) {
        try {
            await deleteStock(stockId);
            fetchPortfolioData(); // Refresh data
        } catch (err) {
            setError(err.message || 'Failed to delete stock.');
            console.error(err);
        }
    }
  };

  const handleUpdatePrice = async (stockId, newPrice) => {
    try {
        await updateStockPrice(stockId, newPrice);
        fetchPortfolioData(); // Refresh data
    } catch (err) {
        setError(err.message || 'Failed to update stock price.');
        console.error(err);
    }
  };


  if (isLoading) {
    return <p className="loading-message">Loading portfolio data...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  const totalMarketValue = stocks.reduce((sum, stock) => sum + (parseFloat(stock.shares_owned) * parseFloat(stock.current_market_price)), 0);
  const totalCostBasis = stocks.reduce((sum, stock) => sum + (parseFloat(stock.shares_owned) * parseFloat(stock.average_cost)), 0);
  const overallGainLoss = totalMarketValue - totalCostBasis;


  return (
    <main className="dashboard-main">
      <div className="portfolio-summary">
        <h2>Portfolio Snapshot</h2>
        <p>Total Market Value: <strong>${totalMarketValue.toFixed(2)}</strong></p>
        <p>Total Cost Basis: <strong>${totalCostBasis.toFixed(2)}</strong></p>
        <p>Overall Gain/Loss: <strong className={overallGainLoss >= 0 ? 'gain' : 'loss'}>${overallGainLoss.toFixed(2)}</strong></p>
      </div>
      <PortfolioTable stocks={stocks} onDeleteStock={handleDeleteStock} onUpdatePrice={handleUpdatePrice} />
      <AddStockForm onStockAdded={handleStockAdded} />
    </main>
  );
};

export default Dashboard;