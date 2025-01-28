// src/routers/students.js

import { Router } from 'express';

import {
  getStudentsController,
  getStudentByIdController,
  createStudentController,
  deleteStudentController,
  upsertStudentController,
  patchStudentController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createStudentSchema, updateStudentSchema } from '../validation/students.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/students', ctrlWrapper(getStudentsController));

router.get('/students/:studentId', ctrlWrapper(getStudentByIdController));

router.post('/students', ctrlWrapper(createStudentController));

router.delete('/students/:studentId', ctrlWrapper(deleteStudentController));

router.put('/students/:studentId', ctrlWrapper(upsertStudentController));

router.patch('/students/:studentId', ctrlWrapper(patchStudentController));

router.post(
  '/',
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController),
);

router.put(
  '/students/:studentId',
  validateBody(createStudentSchema),
  ctrlWrapper(upsertStudentController),
);

router.patch(
  '/students/:studentId',
  validateBody(updateStudentSchema),
  ctrlWrapper(patchStudentController),
);

router.get(
  '/:studentId',
  isValidId,
  ctrlWrapper(getStudentByIdController),
);

export default router;

