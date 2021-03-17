import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Book } from '../infra/typeorm/entities/Book';
import { IBookRepository } from '../repositories/IBookRepository';

interface IRequest {
  name: string;
  publisher: string;
}

@injectable()
export class CreateBookService {
  constructor(
    @inject('BookRepository')
    private bookRepository: IBookRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, publisher }: IRequest): Promise<Book> {
    const checkBookExists = await this.bookRepository.findByName(name);

    if (checkBookExists) {
      throw new AppError('Book already exists');
    }

    const book = await this.bookRepository.create({ name, publisher });

    await this.cacheProvider.invalidatePrefix('books-list');

    return book;
  }
}
