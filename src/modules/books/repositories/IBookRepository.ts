import { ICreateBookDTO } from '../infra/http/dtos/ICreateBookDTO';
import { Book } from '../infra/typeorm/entities/Book';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | undefined>;
  findByIds(id: string[]): Promise<Book[]>;
  findByName(name: string): Promise<Book | undefined>;
  findByNames(name: string[]): Promise<Book[]>;
  create(data: ICreateBookDTO): Promise<Book>;
  save(book: Book): Promise<Book>;
  bulkSave(books: Book[]): Promise<Book[]>;
  delete(id: string | string[]): Promise<void>;
}
