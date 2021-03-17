import faker from 'faker';

import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { DeleteBookCommandService } from './DeleteBookCommandService';
import { FakeBookRepository } from '../repositories/fakes/FakeBookRepository';

let fakeBookRepository: FakeBookRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteBook: DeleteBookCommandService;

describe('DeleteBookCommand', () => {
  beforeEach(() => {
    fakeBookRepository = new FakeBookRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteBook = new DeleteBookCommandService(
      fakeBookRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a list of book', async () => {
    const book1 = await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    const book2 = await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    await deleteBook.execute({ books: [book1, book2] });

    const books = await fakeBookRepository.findAll();

    expect(books).toHaveLength(1);
  });
});
