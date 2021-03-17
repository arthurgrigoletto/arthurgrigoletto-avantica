import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Book } from '../infra/typeorm/entities/Book';
import { IBookRepository } from '../repositories/IBookRepository';

@injectable()
export class ListBookService {
  constructor(
    @inject('BookRepository')
    private bookRepository: IBookRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<Book[]> {
    const cacheKey = `books-list:${Date.now()}`;
    let books = await this.cacheProvider.recover<Book[]>(cacheKey);

    if (!books) {
      books = await this.bookRepository.findAll();

      await this.cacheProvider.save(cacheKey, books);
    }

    return books;
  }
}
