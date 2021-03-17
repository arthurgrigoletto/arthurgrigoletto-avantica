import AppError from '@shared/errors/AppError';
import faker from 'faker';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { CreateBookService } from './CreateBookService';
import { FakeBookRepository } from '../repositories/fakes/FakeBookRepository';

let fakeBookRepository: FakeBookRepository;
let fakeCacheRepository: FakeCacheProvider;
let createBook: CreateBookService;

describe('CreateBook', () => {
  beforeEach(() => {
    fakeBookRepository = new FakeBookRepository();
    fakeCacheRepository = new FakeCacheProvider();

    createBook = new CreateBookService(fakeBookRepository, fakeCacheRepository);
  });

  it('should be able to create a new book', async () => {
    const book = await createBook.execute({
      name: 'John Doe',
      publisher: faker.random.words(3),
    });

    expect(book).toHaveProperty('id');
  });

  it('should not be able to create a new book with same name from another', async () => {
    await createBook.execute({
      name: 'John Doe',
      publisher: faker.random.words(3),
    });

    await expect(
      createBook.execute({
        name: 'John Doe',
        publisher: faker.random.words(3),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
