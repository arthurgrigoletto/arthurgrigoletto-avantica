import { BookRepository } from '@modules/books/infra/typeorm/repositories/BookRepository';
import { IBookRepository } from '@modules/books/repositories/IBookRepository';
import { container } from 'tsyringe';

import './providers';

container.registerSingleton<IBookRepository>('BookRepository', BookRepository);
