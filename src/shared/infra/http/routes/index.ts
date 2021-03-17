import { Router } from 'express';

import { booksRouter } from '@modules/books/infra/http/routes/books.routes';

const router = Router();

router.use('/books', booksRouter);

export { router };
