import faker from 'faker';

import AppError from '@shared/errors/AppError';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { DeleteBookService } from './DeleteBookService';
import { FakeBookRepository } from '../repositories/fakes/FakeBookRepository';

let fakeBookRepository: FakeBookRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteBook: DeleteBookService;

describe('FindBook', () => {
  beforeEach(() => {
    fakeBookRepository = new FakeBookRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteBook = new DeleteBookService(fakeBookRepository, fakeCacheProvider);
  });

  it('should be able to delete a book', async () => {
    const book = await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    await deleteBook.execute(book.id);

    const findBook = await fakeBookRepository.findById(book.id);

    expect(findBook).toBeFalsy();
  });

  it('should return error when book does not exists', async () => {
    await expect(
      deleteBook.execute(faker.random.uuid()),
    ).rejects.toBeInstanceOf(AppError);
  });
});
