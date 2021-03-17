import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';

import { IBookRepository } from '../repositories/IBookRepository';

@injectable()
export class DeleteBookService {
  constructor(
    @inject('BookRepository')
    private bookRepository: IBookRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(id: string): Promise<void> {
    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new AppError('Book not found', StatusCodes.NOT_FOUND);
    }

    await this.bookRepository.delete(id);

    await this.cacheProvider.invalidatePrefix('books-list');
  }
}
