import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateBookService } from '@modules/books/services/CreateBookService';
import { ListBookService } from '@modules/books/services/ListBooksService';
import { FindBookService } from '@modules/books/services/FindBookService';
import { UpdateBookService } from '@modules/books/services/UpdateBookService';
import { DeleteBookService } from '@modules/books/services/DeleteBookService';
import { StatusCodes } from 'http-status-codes';

export class BookController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listBooks = container.resolve(ListBookService);

    const books = await listBooks.execute();

    return response.json(books);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findBook = container.resolve(FindBookService);

    const books = await findBook.execute(id);

    return response.json(books);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, publisher } = request.body;

    const createBook = container.resolve(CreateBookService);

    const book = await createBook.execute({ name, publisher });

    return response.status(StatusCodes.CREATED).json(book);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, publisher } = request.body;

    const updateBook = container.resolve(UpdateBookService);

    const book = await updateBook.execute({ bookId: id, name, publisher });

    return response.json(book);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteBook = container.resolve(DeleteBookService);

    await deleteBook.execute(id);

    return response.status(StatusCodes.OK).send();
  }
}
