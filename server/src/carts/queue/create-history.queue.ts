export type HistoryItem = {
  price: number;
  quantity: number;
  productId: string;
};

export class CreateHistoryQueue {
  constructor(
    public userId: string,
    public total: number,
    public historyItems: HistoryItem[],
  ) {}
}
