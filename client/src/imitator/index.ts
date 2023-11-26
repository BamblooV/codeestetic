const maxBidsLength = 1000;
const maxAsksLength = 1000;

const initBidsAmount = 200;
const initAsksAmount = 200;

const bidsLowerBound = 25_600;
const bidsUpperBound = 26_000;

const asksLowerBound = 26_000;
const asksUpperBound = 26_400;

const amountLowerBound = 0.0001;
const amountUpperBound = 1;

const lastDealPriceLowerBound = 26_010;
const lastDealPriceUpperBound = 26_040;

const bidsGenerateAmountLowerBound = 0;
const bidsGenerateAmountUpperBound = 100;

const asksGenerateAmountLowerBound = 0;
const asksGenerateAmountUpperBound = 100;

const bidsDeleteAmountLowerBound = 0;
const bidsDeleteAmountUpperBound = 50;

const asksDeleteAmountLowerBound = 0;
const asksDeleteAmountUpperBound = 50;

const chanceToDeleteBids = 0.5;
const chanceToDeleteAsks = 0.5;

const chanceToNewDealPrice = 0.3;

const timeout = 500;

type Price = number;
type Amount = number;

export type Order = [Price, Amount];

export type Response = {
  bids: Order[];
  asks: Order[];
  lastDealPrice: number;
};

export type Subscriber = {
  onSubscribe(data: Response): void;
  onMessage(data: Response): void;
};

class Imitator {
  private bids: Order[] = [];
  private asks: Order[] = [];
  private lastDealPrice: number = 0;

  private subscribers: Subscriber[] = [];

  constructor() {
    this.initState();

    setInterval(() => {
      const response = this.generateResponse();
      this.notify(response);
    }, timeout);
  }

  public subscribe(sub: Subscriber): void {
    this.subscribers.push(sub);
    sub.onSubscribe(this.getState());
  }

  public unSubscribe(sub: Subscriber): void {
    this.subscribers = this.subscribers.filter((observer) => observer !== sub);
  }

  private notify(data: Response): void {
    this.subscribers.forEach((observer) => observer.onMessage(data));
  }

  private getState(): Response {
    const { bids, asks, lastDealPrice } = this;

    return { bids, asks, lastDealPrice };
  }

  private generateFloatInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private initState(): void {
    this.bids = this.generateBids(initBidsAmount);
    this.asks = this.generateAsks(initAsksAmount);
    this.lastDealPrice = this.generateLastDealPrice();
  }

  private generateResponse(): Response {
    const newBidsAmount = Math.floor(
      this.generateFloatInRange(bidsGenerateAmountLowerBound, bidsGenerateAmountUpperBound)
    );
    const newAsksAmount = Math.floor(
      this.generateFloatInRange(asksGenerateAmountLowerBound, asksGenerateAmountUpperBound)
    );

    const newBids = this.generateBids(newBidsAmount);
    const newAsks = this.generateAsks(newAsksAmount);

    const bidsToDelete: Order[] = [];
    const asksToDelete: Order[] = [];

    if (Math.random() > chanceToDeleteBids) {
      const deleteAmount = Math.floor(
        this.generateFloatInRange(bidsDeleteAmountLowerBound, bidsDeleteAmountUpperBound)
      );
      bidsToDelete.push(...this.deleteBids(deleteAmount));
    }

    if (Math.random() > chanceToDeleteAsks) {
      const deleteAmount = Math.floor(
        this.generateFloatInRange(asksDeleteAmountLowerBound, asksDeleteAmountUpperBound)
      );
      asksToDelete.push(...this.deleteAsks(deleteAmount));
    }

    if (Math.random() > chanceToNewDealPrice) {
      this.lastDealPrice = this.generateLastDealPrice();
    }

    if (this.bids.length + newBids.length > maxBidsLength) {
      const diff = this.bids.length + newBids.length - maxBidsLength;
      bidsToDelete.push(...this.deleteBids(diff));
    }

    if (this.asks.length + newAsks.length > maxAsksLength) {
      const diff = this.asks.length + newAsks.length - maxAsksLength;
      asksToDelete.push(...this.deleteAsks(diff));
    }

    this.bids.push(...newBids);
    this.asks.push(...newAsks);

    return {
      bids: [...newBids, ...bidsToDelete],
      asks: [...newAsks, ...asksToDelete],
      lastDealPrice: this.lastDealPrice,
    };
  }

  private generateLastDealPrice(): number {
    return this.generateFloatInRange(lastDealPriceLowerBound, lastDealPriceUpperBound);
  }

  private generateBids(amount: number): Response['bids'] {
    const bids: Response['bids'] = [];

    for (let i = 0; i < amount; i++) {
      const bin: Order = [
        this.generateFloatInRange(bidsLowerBound, bidsUpperBound),
        this.generateFloatInRange(amountLowerBound, amountUpperBound),
      ];
      bids.push(bin);
    }

    return bids;
  }

  private generateAsks(amount: number): Response['asks'] {
    const asks: Response['asks'] = [];

    for (let i = 0; i < amount; i++) {
      const ask: Order = [
        this.generateFloatInRange(asksLowerBound, asksUpperBound),
        this.generateFloatInRange(amountLowerBound, amountUpperBound),
      ];
      asks.push(ask);
    }

    return asks;
  }

  private selectIDs(amount: number, target: unknown[]): number[] {
    const ids: number[] = [];

    while (ids.length < amount && target.length / 2 > ids.length) {
      const id = Math.floor(this.generateFloatInRange(0, target.length));
      if (ids.includes(id)) continue;
      ids.push(id);
    }

    return ids;
  }

  private deleteBids(amount: number): Response['bids'] {
    const idsToDelete: number[] = this.selectIDs(amount, this.bids);
    const bidsToDelete: Order[] = idsToDelete.map((id) => {
      const [price] = this.bids[id];
      return [price, 0];
    });

    this.bids = this.bids.filter((_, index) => !idsToDelete.includes(index));

    return bidsToDelete;
  }

  private deleteAsks(amount: number): Response['bids'] {
    const idsToDelete: number[] = this.selectIDs(amount, this.asks);
    const asksToDelete: Order[] = idsToDelete.map((id) => {
      const [price] = this.asks[id];
      return [price, 0];
    });

    this.asks = this.asks.filter((_, index) => !idsToDelete.includes(index));

    return asksToDelete;
  }
}

const imitator = new Imitator();

export default imitator;
