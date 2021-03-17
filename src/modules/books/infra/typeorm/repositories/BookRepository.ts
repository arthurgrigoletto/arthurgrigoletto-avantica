import { IBookRepository } from '@modules/books/repositories/IBookRepository';
import { getRepository, In, Repository } from 'typeorm';

import { ICreateBookDTO } from '../../http/dtos/ICreateBookDTO';
import { Book } from '../entities/Book';

export class BookRepository implements IBookRepository {
  private ormRepository: Repository<Book>;

  constructor() {
    this.ormRepository = getRepository(Book);
  }

  public async findAll(): Promise<Book[]> {
    const books = await this.ormRepository.find();

    return books;
  }

  public async findById(id: string): Promise<Book | undefined> {
    const book = await this.ormRepository.findOne(id);

    return book;
  }

  public async findByIds(ids: string[]): Promise<Book[]> {
    const book = await this.ormRepository.findByIds(ids);

    return book;
  }

  public async findByName(name: string): Promise<Book | undefined> {
    const book = await this.ormRepository.findOne({
      where: { name },
    });

    return book;
  }

  public async findByNames(names: string[]): Promise<Book[]> {
    const books = await this.ormRepository.find({
      where: { name: In(names) },
    });

    return books;
  }

  public async create({ name, publisher }: ICreateBookDTO): Promise<Book> {
    const book = this.ormRepository.create({ name, publisher });

    await this.ormRepository.save(book);

    return book;
  }

  public async save(book: Book): Promise<Book> {
    return this.ormRepository.save(book);
  }

  public async bulkSave(books: Book[]): Promise<Book[]> {
    return this.ormRepository.save(books);
  }

  public async delete(id: string | string[]): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
