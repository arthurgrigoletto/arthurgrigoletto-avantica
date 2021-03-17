import AppError from '@shared/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';

import { Book } from '../infra/typeorm/entities/Book';
import { IBookRepository } from '../repositories/IBookRepository';

@injectable()
export class FindBookService {
  constructor(
    @inject('BookRepository')
    private bookRepository: IBookRepository,
  ) {}

  public async execute(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new AppError('Book not found', StatusCodes.NOT_FOUND);
    }

    return book;
  }
}
