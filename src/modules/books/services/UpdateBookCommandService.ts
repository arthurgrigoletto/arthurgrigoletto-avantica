import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import { Book } from '../infra/typeorm/entities/Book';
import { IBookRepository } from '../repositories/IBookRepository';

interface IRequest {
  books: Book[];
}

@injectable()
export class UpdateBookCommandService {
  constructor(
    @inject('BookRepository')
    private bookRepository: IBookRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ books }: IRequest): Promise<Book[]> {
    const bookIds: string[] = [];
    const bookNames: string[] = [];

    const hasDuplicatedNames = books.reduce((_, book, index, self) => {
      bookIds.push(book.id);
      bookNames.push(book.name);

      const bookIndex = self.findIndex(b => b.name === book.name);

      return bookIndex !== index;
    }, false);

    const findBooksByNames = await this.bookRepository.findByNames(bookNames);
    const filterNamesWithDifferentId = findBooksByNames.filter(book =>
      books.some(b => b.name === book.name && b.id !== book.id),
    );

    if (hasDuplicatedNames || !!filterNamesWithDifferentId.length) {
      throw new AppError('Cannot have books with same names');
    }

    const findBooks = await this.bookRepository.findByIds(bookIds);

    if (!findBooks.length) {
      throw new AppError('Can only update exist book');
    }

    const newBooks = await this.bookRepository.bulkSave(books);

    await this.cacheProvider.invalidatePrefix('books-list');

    return newBooks;
  }
}
