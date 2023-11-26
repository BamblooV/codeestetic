import './TableHeader.css'

const TableHeader = () => {
  return (
    <thead className="table-header">
      <tr className="table-header-row">
        <th className="table-header-cell">
          <div className="table-header-title">Price (USDT)</div>
        </th>
        <th className="table-header-cell">
          <div className="table-header-title">Amount (BTC)</div>
        </th>
        <th className="table-header-cell">
          <div className="table-header-title">Total</div>
        </th>
      </tr>
    </thead>
  )
}

export default TableHeader