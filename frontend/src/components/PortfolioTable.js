// frontend/src/components/PortfolioTable.js
import React from 'react';

const PortfolioTable = ({ stocks, onDeleteStock, onUpdatePrice }) => {
  if (!stocks || stocks.length === 0) {
    return <p>Your portfolio is empty. Add some stocks!</p>;
  }

  const handlePriceUpdate = (stockId) => {
    const newPriceStr = prompt(`Enter new current market price for ${stocks.find(s=>s.id === stockId)?.ticker_symbol}:`);
    if (newPriceStr !== null) {
        const newPrice = parseFloat(newPriceStr);
        if (!isNaN(newPrice) && newPrice > 0) {
            onUpdatePrice(stockId, newPrice);
        } else {
            alert("Invalid price entered.");
        }
    }
  };

  return (
    <div className="portfolio-table-container">
      <h2>My Portfolio Holdings</h2>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Company</th>
            <th>Shares</th>
            <th>Avg. Cost ($)</th>
            <th>Current Price ($)</th>
            <th>Market Value ($)</th>
            <th>Total Gain/Loss ($)</th>
            <th>Purchase Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const marketValue = parseFloat(stock.shares_owned) * parseFloat(stock.current_market_price);
            const totalCost = parseFloat(stock.shares_owned) * parseFloat(stock.average_cost);
            const gainLoss = marketValue - totalCost;
            const gainLossClass = gainLoss >= 0 ? 'gain' : 'loss';

            return (
              <tr key={stock.id}>
                <td>{stock.ticker_symbol}</td>
                <td>{stock.company_name}</td>
                <td>{Number(stock.shares_owned).toFixed(2)}</td>
                <td>{Number(stock.average_cost).toFixed(2)}</td>
                <td>{Number(stock.current_market_price).toFixed(2)}</td>
                <td>{marketValue.toFixed(2)}</td>
                <td className={gainLossClass}>{gainLoss.toFixed(2)}</td>
                <td>{stock.purchase_date ? new Date(stock.purchase_date).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button onClick={() => handlePriceUpdate(stock.id)} className="action-button update-button">Update Price</button>
                  <button onClick={() => onDeleteStock(stock.id)} className="action-button delete-button">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;