import AppError from '@shared/errors/AppError';
import faker from 'faker';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { UpdateBookCommandService } from './UpdateBookCommandService';
import { FakeBookRepository } from '../repositories/fakes/FakeBookRepository';

let fakeBookRepository: FakeBookRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateBook: UpdateBookCommandService;

describe('UpdateBook', () => {
  beforeEach(() => {
    fakeBookRepository = new FakeBookRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateBook = new UpdateBookCommandService(
      fakeBookRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update books', async () => {
    const book1 = await fakeBookRepository.create({
      name: faker.random.words(3),
      publisher: faker.random.words(3),
    });

    const book2 = await fakeBookRepository.create({
      name: faker.random.words(3),
      publisher: faker.random.words(3),
    });

    const books = await updateBook.execute({
      books: [
        { ...book1, name: 'book1' },
        { ...book2, name: 'book2' },
      ],
    });

    expect(books).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...book1, name: 'book1' }),
        expect.objectContaining({ ...book2, name: 'book2' }),
      ]),
    );
  });

  it('should not be able to update books with duplicated names', async () => {
    const name = faker.random.words(3);

    const book1 = await fakeBookRepository.create({
      name: faker.random.words(3),
      publisher: faker.random.words(3),
    });

    const book2 = await fakeBookRepository.create({
      name: faker.random.words(3),
      publisher: faker.random.words(3),
    });

    await expect(
      updateBook.execute({
        books: [
          { ...book1, name },
          { ...book2, name },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update books with name already taken', async () => {
    const name = faker.random.words(3);

    await fakeBookRepository.create({
      name,
      publisher: faker.random.words(3),
    });

    const book = await fakeBookRepository.create({
      name: faker.random.words(3),
      publisher: faker.random.words(3),
    });

    await expect(
      updateBook.execute({
        books: [{ ...book, name }],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a inexist book', async () => {
    await expect(
      updateBook.execute({
        books: [
          {
            id: faker.random.uuid(),
            name: faker.random.words(3),
            publisher: faker.random.words(3),
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
