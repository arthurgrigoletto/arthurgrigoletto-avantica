import { ICreateBookDTO } from '@modules/books/infra/http/dtos/ICreateBookDTO';
import { Book } from '@modules/books/infra/typeorm/entities/Book';
import { v4 as uuid } from 'uuid';

import { IBookRepository } from '../IBookRepository';

export class FakeBookRepository implements IBookRepository {
  private books: Book[] = [];

  public async findAll(): Promise<Book[]> {
    return this.books;
  }

  public async findById(id: string): Promise<Book | undefined> {
    const findBook = this.books.find(book => book.id === id);

    return findBook;
  }

  public async findByIds(id: string[]): Promise<Book[]> {
    const books = this.books.filter(book => id.includes(book.id));

    return books;
  }

  public async findByName(name: string): Promise<Book | undefined> {
    const findBook = this.books.find(book => book.name === name);

    return findBook;
  }

  public async findByNames(names: string[]): Promise<Book[]> {
    const books = this.books.filter(book => names.includes(book.name));

    return books;
  }

  public async create(bookData: ICreateBookDTO): Promise<Book> {
    const book = new Book();

    Object.assign(book, { id: uuid() }, bookData);

    this.books.push(book);

    return book;
  }

  public async save(book: Book): Promise<Book> {
    const findIndex = this.books.findIndex(findbook => findbook.id === book.id);

    this.books[findIndex] = book;

    return book;
  }

  public async bulkSave(books: Book[]): Promise<Book[]> {
    return this.books.map(book => {
      const newBook = books.find(b => b.id === book.id);

      if (newBook) {
        return newBook;
      }

      return book;
    });
  }

  public async delete(id: string | string[]): Promise<void> {
    if (typeof id === 'string') {
      const findIndex = this.books.findIndex(findbook => findbook.id === id);

      this.books.splice(findIndex, 1);
    } else {
      this.books = this.books.filter(book => !id.includes(book.id));
    }
  }
}
