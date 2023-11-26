import classNames from 'classnames'
import formatNumber from '../../../../helpers/formatNumber'
import './DataRow.css'

export type DataRowProps = {
  price: number
  amount: number
  total: number
  maxTotal: number
  variant: 'red' | 'green'
  precision: number
}

const DataRow: React.FC<DataRowProps> = ({ price, amount, total, maxTotal, variant, precision }) => {
  return (
    <tr className={classNames("tbody_row", variant)} style={{ "--translateX": `${(1 - total / maxTotal) * 100}%` } as React.CSSProperties}>
      <td className="price">{formatNumber(price, Math.max(-Math.log10(precision), 0))}</td>
      <td className="amount">{formatNumber(amount, 5)}</td>
      <td className="total">{formatNumber(total, 2)}</td>
    </tr>
  )
}

export default DataRow

