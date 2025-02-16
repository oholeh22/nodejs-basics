// src/controllers/students.js
import { createStudent, deleteStudent, updateStudent } from '../services/students.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateStudent(studentId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a student!`,
    data: result.student,
  });
};



  export const getStudentByIdController = async (req, res) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);


    if (!student) {
      // 2. Створюємо та налаштовуємо помилку
      throw createHttpError(404, 'Student not found');
    }

    res.json({
      status: 200,
      message: `Successfully found student with id ${studentId}!`,
      data: student,
    });
  };

  export const createStudentController = async (req, res) => {
    const student = await createStudent(req.body);

    res.status(201).json({
      status: 201,
      message: `Successfully created a student!`,
      data: student,
    });
  };

  export const deleteStudentController = async (req, res, next) => {
    const { studentId } = req.params;

    const student = await deleteStudent(studentId);

    if (!student) {
      next(createHttpError(404, 'Student not found'));
      return;
    }

    res.status(204).send();
  };


  export const upsertStudentController = async (req, res, next) => {
    const { studentId } = req.params;

    const result = await updateStudent(studentId, req.body, {
      upsert: true,
    });

    if (!result) {
      next(createHttpError(404, 'Student not found'));
      return;
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: `Successfully upserted a student!`,
      data: result.student,
    });
  };

  export const patchStudentController = async (req, res, next) => {
    const { studentId } = req.params;
    const result = await updateStudent(studentId, req.body);

    if (!result) {
      next(createHttpError(404, 'Student not found'));
      return;
    }

    res.json({
      status: 200,
      message: `Successfully patched a student!`,
      data: result.student,
    });
  };

  export const getStudentsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const students = await getAllStudents({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 200,
      message: 'Successfully found students!',
      data: students,
    });
  };

  export const getAllStudents = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
  }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const studentsQuery = StudentsCollection.find();

    if (filter.gender) {
      studentsQuery.where('gender').equals(filter.gender);
    }
    if (filter.maxAge) {
      studentsQuery.where('age').lte(filter.maxAge);
    }
    if (filter.minAge) {
      studentsQuery.where('age').gte(filter.minAge);
    }
    if (filter.maxAvgMark) {
      studentsQuery.where('avgMark').lte(filter.maxAvgMark);
    }
    if (filter.minAvgMark) {
      studentsQuery.where('avgMark').gte(filter.minAvgMark);
    }

    const [studentsCount, students] = await Promise.all([
      StudentsCollection.find().merge(studentsQuery).countDocuments(),
      studentsQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec(),
    ]);

    const paginationData = calculatePaginationData(studentsCount, perPage, page);

    return {
      data: students,
      ...paginationData,
    };
  };


