export enum StarType {
  INCR = 'INCR',
  MODIFY = 'MODIFY',
  DECR = 'DECR',
}

export class UpdateStarQueue {
  constructor(
    public type: StarType,
    public productId: string,
    public starValue: number,
    public preStarValue?: number,
  ) {
    if (type === StarType.MODIFY && !preStarValue) {
      throw new Error('preStarValue is required in comment queue');
    }
  }
}
