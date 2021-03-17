import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { BookBatchController } from '../controllers/BookCommandController';

const booksRouter = Router();
const bookController = new BookController();
const bookCommandController = new BookBatchController();

booksRouter.get('/', bookController.index);

booksRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required(),
    },
  }),
  bookController.show,
);

booksRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      publisher: Joi.string().required(),
    },
  }),
  bookController.update,
);

booksRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required(),
    },
  }),
  bookController.delete,
);

booksRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      publisher: Joi.string().required(),
    },
  }),
  bookController.create,
);

booksRouter.post(
  '/commands',
  celebrate({
    [Segments.BODY]: {
      method: Joi.string().valid('put', 'delete').required(),
      books: Joi.array(),
    },
  }),
  bookCommandController.create,
);

export { booksRouter };
