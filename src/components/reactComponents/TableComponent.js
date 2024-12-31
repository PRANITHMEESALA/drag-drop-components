import React, { useState } from 'react';
import './TableComponent.css';

const TableComponent =  ({ data, theme })  => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filterOption, setFilterOption] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');


  const tableStyle = {
    backgroundColor: theme === 'dark' ? '#333' : '#fff', 
    color: theme === 'dark' ? '#fff' : '#000', 
    padding: '20px',
    borderRadius: '8px',
    overflowX: 'auto',
  };

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filtering logic
  const filteredData = sortedData.filter((coin) => {
    if (filterQuery && !coin.name.toLowerCase().includes(filterQuery.toLowerCase())) {
      return false;
    }
    if (filterOption === 'top10') {
      return coin.market_cap_rank <= 10;
    }
    if (filterOption === 'top50') {
      return coin.market_cap_rank <= 50;
    }
    return true;
  });

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination controls
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="table-container" style={tableStyle}>
      <h3>Cryptocurrency Table</h3>

      <div className="filter-options">
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All Coins</option>
          <option value="top10">Top 10 by Market Cap</option>
          <option value="top50">Top 50 by Market Cap</option>
        </select>

        {/* Filter Input */}
        <input
          type="text"
          placeholder="Search by name"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>
              Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => requestSort('current_price')}>
              Price {sortConfig.key === 'current_price' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => requestSort('market_cap')}>
              Market Cap {sortConfig.key === 'market_cap' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => requestSort('price_change_percentage_24h')}>
              24h Change (%) {sortConfig.key === 'price_change_percentage_24h' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.name}</td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
