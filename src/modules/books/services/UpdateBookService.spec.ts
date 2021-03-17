import AppError from '@shared/errors/AppError';
import faker from 'faker';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { UpdateBookService } from './UpdateBookService';
import { FakeBookRepository } from '../repositories/fakes/FakeBookRepository';

let fakeBookRepository: FakeBookRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateBook: UpdateBookService;

describe('UpdateBook', () => {
  beforeEach(() => {
    fakeBookRepository = new FakeBookRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateBook = new UpdateBookService(fakeBookRepository, fakeCacheProvider);
  });

  it('should be able to update a book', async () => {
    const bookData = {
      name: faker.random.words(3),
      publisher: faker.random.words(3),
    };

    const { id } = await fakeBookRepository.create(bookData);

    const newName = faker.random.words(3);

    Object.assign(bookData, { name: newName });

    const book = await updateBook.execute({ bookId: id, ...bookData });

    expect(book).toEqual(
      expect.objectContaining({ ...bookData, name: newName }),
    );
  });

  it('should not be able to update a inexist book', async () => {
    await expect(
      updateBook.execute({
        bookId: faker.random.uuid(),
        name: faker.random.words(3),
        publisher: faker.random.words(3),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
