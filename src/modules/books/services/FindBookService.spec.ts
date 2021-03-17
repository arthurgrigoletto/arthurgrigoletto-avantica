import faker from 'faker';

import AppError from '@shared/errors/AppError';
import { FindBookService } from './FindBookService';
import { FakeBookRepository } from '../repositories/fakes/FakeBookRepository';

let fakeBookRepository: FakeBookRepository;
let findBookService: FindBookService;

describe('FindBook', () => {
  beforeEach(() => {
    fakeBookRepository = new FakeBookRepository();

    findBookService = new FindBookService(fakeBookRepository);
  });

  it('should be able to find a book', async () => {
    const book = await fakeBookRepository.create({
      name: faker.name.firstName(),
      publisher: faker.random.words(3),
    });

    const findBook = await findBookService.execute(book.id);

    expect(findBook).toEqual(expect.objectContaining(book));
  });

  it('should return error when book does not exists', async () => {
    await expect(
      findBookService.execute(faker.random.uuid()),
    ).rejects.toBeInstanceOf(AppError);
  });
});
