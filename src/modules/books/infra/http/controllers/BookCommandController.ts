import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateBookCommandService } from '@modules/books/services/UpdateBookCommandService';
import { DeleteBookCommandService } from '@modules/books/services/DeleteBookCommandService';
import { Book } from '../../typeorm/entities/Book';

interface IRequestBody {
  books: Book[];
  method: 'put' | 'delete';
}

export class BookBatchController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { books, method } = request.body as IRequestBody;

    const service = {
      put: container.resolve(UpdateBookCommandService),
      delete: container.resolve(DeleteBookCommandService),
    };

    const book = await service[method].execute({ books });

    return response.json(book);
  }
}
