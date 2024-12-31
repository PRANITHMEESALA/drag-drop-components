import React from 'react';

const SummaryCard = ({ data }) => {
  if (data.length === 0) return null;

  const highest = Math.max(...data.map((coin) => coin.current_price));
  const lowest = Math.min(...data.map((coin) => coin.current_price));
  const average = (data.reduce((acc, coin) => acc + coin.current_price, 0) / data.length).toFixed(2);

  return (
    <div>
      <h3>Summary</h3>
      <p>Highest Price: ${highest}</p>
      <p>Lowest Price: ${lowest}</p>
      <p>Average Price: ${average}</p>
    </div>
  );
};

export default SummaryCard;
