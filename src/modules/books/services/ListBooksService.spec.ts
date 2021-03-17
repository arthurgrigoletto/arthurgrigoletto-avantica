import faker from 'faker';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ListBookService } from './ListBooksService';
import { FakeBookRepository } from '../repositories/fakes/FakeBookRepository';

let fakeBookRepository: FakeBookRepository;
let fakeCacheRepository: FakeCacheProvider;
let listBooks: ListBookService;

describe('ListBook', () => {
  beforeEach(() => {
    fakeBookRepository = new FakeBookRepository();
    fakeCacheRepository = new FakeCacheProvider();

    listBooks = new ListBookService(fakeBookRepository, fakeCacheRepository);
  });

  it('should be able to list books from database', async () => {
    const book1 = await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    const book2 = await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    const books = await listBooks.execute();

    expect(books).toHaveLength(2);
    expect(books).toEqual(expect.arrayContaining([book1, book2]));
  });

  it('should be able to list books from cache', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const book1 = await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    const book2 = await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    await fakeCacheRepository.save(
      `books-list:${new Date(2020, 4, 10, 12).getTime()}`,
      [book1, book2],
    );

    const books = await listBooks.execute();

    expect(books).toHaveLength(2);
    expect(books).toEqual(expect.arrayContaining([book1, book2]));
  });
});
