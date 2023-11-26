import { useCallback, useEffect } from 'react'
import imitator from '../../../imitator';
import { selectLastDealPrice, selectPrecision, addData, selectPrevLastDealPrice, selectGroupedAsks, selectGroupedBids, Response } from '../../../redux/features/OrdersSlice/OrdersSlice';
import { useAppSelector, useAppDispatch } from '../../../redux/store';
import DataRow from './DataRow/DataRow';
import TableHeader from './TableHeader/TableHeader';

import './Table.css'
import ValueRow from './ValueRow/ValueRow';

const Table = () => {
  const bids = useAppSelector(selectGroupedBids)
  const asks = useAppSelector(selectGroupedAsks)
  const lastDealPrice = useAppSelector(selectLastDealPrice);
  const prevLastDealPrice = useAppSelector(selectPrevLastDealPrice);
  const precision = useAppSelector(selectPrecision);

  const dispatch = useAppDispatch()

  const processData = useCallback((data: Response) => {
    dispatch(addData(data))
  }, [dispatch])

  useEffect(() => {
    console.log(import.meta.env.VITE_WS_URL)
    if (import.meta.env.VITE_WS_URL) {
      const ws = new WebSocket(import.meta.env.VITE_WS_URL)
      ws.onmessage = event => {
        const data = JSON.parse(event.data)

        processData(data);
      }

      return () => ws.close()
    } else {
      const observer = { onSubscribe: processData, onMessage: processData }
      imitator.subscribe(observer)

      return () => imitator.unSubscribe(observer)
    }
  }, [processData])

  return (
    <table className="table">
      <TableHeader />
      <tbody>
        {asks.data.map(([price, amount, total], index) => <DataRow key={index} amount={amount}
          price={price} total={total} maxTotal={asks.maxTotal} variant='red' precision={precision} />)}
        <ValueRow price={lastDealPrice} prevPrice={prevLastDealPrice} />
        {bids.data.map(([price, amount, total], index) => <DataRow key={index} amount={amount}
          price={price} total={total} maxTotal={bids.maxTotal} variant='green' precision={precision} />)}
      </tbody>
    </table>
  )
}

export default Table