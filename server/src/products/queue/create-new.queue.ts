export class CreateNewQueue<T> {
  constructor(public index: string, public id: string, public document: T) {}
}
