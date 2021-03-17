import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { inject, injectable } from 'tsyringe';

import { Book } from '../infra/typeorm/entities/Book';
import { IBookRepository } from '../repositories/IBookRepository';

interface IRequest {
  books: Book[];
}

@injectable()
export class DeleteBookCommandService {
  constructor(
    @inject('BookRepository')
    private bookRepository: IBookRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ books }: IRequest): Promise<void> {
    const bookIds = books.map(book => book.id);

    await this.bookRepository.delete(bookIds);

    await this.cacheProvider.invalidatePrefix('books-list');
  }
}
