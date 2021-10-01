export interface Repository<T> {
  get(id:string): Promise<T>;
  update(item:T): Promise<void>;
  add(item:T): Promise<T>;
}