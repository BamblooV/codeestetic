import { useEffect, useRef, useState } from 'react'
import formatNumber from '../../../../helpers/formatNumber'
import './ValueRow.css'

export type ValueRowProps = {
  price: number,
  prevPrice: number
}

const ValueRow: React.FC<ValueRowProps> = ({ price, prevPrice }) => {
  const [diff, setDiff] = useState(() => price - prevPrice)
  const timerId = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setDiff(price - prevPrice)
  }, [price, prevPrice])

  useEffect(() => {
    timerId.current = setTimeout(() => {
      setDiff(0)
    }, 500);

    return () => {
      clearTimeout(timerId.current)
    }
  }, [price, prevPrice])

  if (diff === 0) {
    return (
      <tr className="order-price" >
        <td className='price-container'>
          {formatNumber(price, 2)}
        </td>
      </tr>
    )
  }

  if (diff > 0) {
    return (
      <tr className="order-price order-price-green" >
        <td className='price-container'>
          {formatNumber(price, 2)}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="sc-jiFHBL gmXjdC" >
            <path d="M5 9L6.41 10.41L11 5.83V22H13V5.83L17.59 10.42L19 9L12 2L5 9Z">
            </path>
          </svg >
        </td>
      </tr>
    )
  }

  if (diff < 0) {
    return (
      <tr className="order-price order-price-red" >
        <td className='price-container'>
          {formatNumber(price, 2)}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="sc-jiFHBL gmXjdC">
            <path d="M19 15L17.59 13.59L13 18.17V2H11V18.17L6.41 13.58L5 15L12 22L19 15Z">
            </path>
          </svg>
        </td>
      </tr>
    )
  }


}

export default ValueRow