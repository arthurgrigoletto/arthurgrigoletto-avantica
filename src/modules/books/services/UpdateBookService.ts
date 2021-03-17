import { inject, injectable } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';

import AppError from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Book } from '../infra/typeorm/entities/Book';
import { IBookRepository } from '../repositories/IBookRepository';

interface IRequest {
  bookId: string;
  name: string;
  publisher: string;
}

@injectable()
export class UpdateBookService {
  constructor(
    @inject('BookRepository')
    private booksRepository: IBookRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ bookId, name, publisher }: IRequest): Promise<Book> {
    const book = await this.booksRepository.findById(bookId);

    if (!book) {
      throw new AppError('Book not found', StatusCodes.NOT_FOUND);
    }

    Object.assign(book, { name, publisher });

    await this.booksRepository.save(book);

    await this.cacheProvider.invalidatePrefix('books-list');

    return book;
  }
}
