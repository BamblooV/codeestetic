import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import roundToNearest from '../../../helpers/roundToNeares';

type Price = number;
type Amount = number;
type Total = number;

type Order = [Price, Amount];
type OrdersData = { data: [Price, Amount, Total][]; maxTotal: Total };

export type Response = {
  bids: Order[];
  asks: Order[];
  lastDealPrice: number;
};

type OrdersState = {
  bids: Record<string, number>;
  bidsKeys: string[];
  asks: Record<string, number>;
  asksKeys: string[];
  lastDealPrice: number;
  prevLastDealPrice: number;
  bidsToDisplay: number;
  asksToDisplay: number;
  precision: number;
};

const initialState: OrdersState = {
  bids: {},
  bidsKeys: [],
  asks: {},
  asksKeys: [],
  lastDealPrice: 0,
  prevLastDealPrice: 0,
  bidsToDisplay: 15,
  asksToDisplay: 15,
  precision: 1e-2,
};

export const ordersSlice = createSlice({
  name: 'ordersSlice',
  initialState,
  reducers: {
    addData: (state, { payload }) => {
      const { bids, asks, lastDealPrice } = payload as Response;

      const newBids = Object.assign({}, state.bids);

      bids.forEach(([price, amount]) => {
        if (amount === 0) {
          delete newBids[price.toString()];
        } else {
          newBids[price.toString()] = amount;
        }
      });

      const newAsks = Object.assign({}, state.asks);

      asks.forEach(([price, amount]) => {
        if (amount === 0) {
          delete newAsks[price.toString()];
        } else {
          newAsks[price.toString()] = amount;
        }
      });

      return {
        ...state,
        bids: newBids,
        bidsKeys: Object.keys(newBids).sort(),
        asks: newAsks,
        asksKeys: Object.keys(newAsks).sort(),
        lastDealPrice,
        prevLastDealPrice: state.lastDealPrice,
      };
    },
    showBids: (state) => ({
      ...state,
      bidsToDisplay: 30,
      asksToDisplay: 0,
    }),
    showAsks: (state) => ({
      ...state,
      bidsToDisplay: 0,
      asksToDisplay: 30,
    }),
    showBoth: (state) => ({
      ...state,
      bidsToDisplay: 15,
      asksToDisplay: 15,
    }),
    setPrecision: (state, { payload }) => ({
      ...state,
      precision: payload,
    }),
  },
});

export const { addData, showAsks, showBids, showBoth, setPrecision } = ordersSlice.actions;

export const selectPrecision = (state: RootState): number => state.orders.precision;

export const selectLastDealPrice = (state: RootState): number => state.orders.lastDealPrice;
export const selectPrevLastDealPrice = (state: RootState): number => state.orders.prevLastDealPrice;

export const selectBidsToDisplay = (state: RootState): number => state.orders.bidsToDisplay;
export const selectBidsKeys = (state: RootState): string[] => state.orders.bidsKeys;
export const selectBids = (state: RootState) => state.orders.bids;

export const selectAsksToDisplay = (state: RootState): number => state.orders.asksToDisplay;
export const selectAsksKeys = (state: RootState): string[] => state.orders.asksKeys;
export const selectAsks = (state: RootState) => state.orders.asks;

export const selectGroupedBids = createSelector(
  [selectBidsToDisplay, selectBidsKeys, selectBids, selectPrecision],
  (bidsToDisplay, bidsKeys, bids, precision): OrdersData => {
    const result: OrdersData = { data: [], maxTotal: 0 };

    const groupedBids: { data: Record<string, number>; uniqueKeysAmount: number } = { data: {}, uniqueKeysAmount: 0 };

    for (let i = bidsKeys.length - 1; i > 0; i--) {
      if (groupedBids.uniqueKeysAmount === bidsToDisplay) {
        break;
      }

      const key = bidsKeys[i];
      const roundedKey = roundToNearest(parseFloat(key), precision);

      if (roundedKey in groupedBids.data) {
        groupedBids.data[roundedKey] += bids[key];
      } else {
        groupedBids.data[roundedKey] = bids[key];
        groupedBids.uniqueKeysAmount += 1;
      }
    }

    Object.entries(groupedBids.data).forEach(([key, amount]) => {
      const price = parseFloat(key);
      const total = price * amount;
      result.data.push([price, amount, total]);
      if (result.maxTotal < total) {
        result.maxTotal = total;
      }
    });

    result.data.sort(([price1], [price2]) => price2 - price1);
    return result;
  }
);

export const selectGroupedAsks = createSelector(
  [selectAsksToDisplay, selectAsksKeys, selectAsks, selectPrecision],
  (asksToDisplay, asksKeys, asks, precision): OrdersData => {
    const result: OrdersData = { data: [], maxTotal: 0 };

    const groupedAsks: { data: Record<string, number>; uniqueKeysAmount: number } = { data: {}, uniqueKeysAmount: 0 };

    for (let i = 0; i < asksKeys.length; i++) {
      if (groupedAsks.uniqueKeysAmount === asksToDisplay) {
        break;
      }

      const key = asksKeys[i];
      const roundedKey = roundToNearest(parseFloat(key), precision);

      if (roundedKey in groupedAsks.data) {
        groupedAsks.data[roundedKey] += asks[key];
      } else {
        groupedAsks.data[roundedKey] = asks[key];
        groupedAsks.uniqueKeysAmount += 1;
      }
    }

    Object.entries(groupedAsks.data).forEach(([key, amount]) => {
      const price = parseFloat(key);
      const total = price * amount;
      result.data.push([price, amount, total]);
      if (result.maxTotal < total) {
        result.maxTotal = total;
      }
    });

    result.data.sort(([price1], [price2]) => price2 - price1);
    return result;
  }
);

export default ordersSlice.reducer;
