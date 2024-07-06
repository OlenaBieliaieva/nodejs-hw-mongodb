import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkUserTokenId } from '../middlewares/checkUserTokenId.js';

const contactRouter = Router();

contactRouter.use(authenticate);
contactRouter.use('/:contactId', checkUserTokenId);
contactRouter.get('/', ctrlWrapper(getContactsController));
contactRouter.get('/:contactId', ctrlWrapper(getContactByIdController));
contactRouter.delete('/:contactId', ctrlWrapper(deleteContactController));
contactRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
contactRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

export default contactRouter;
