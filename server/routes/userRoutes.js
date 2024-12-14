import express from 'express';
import { login, signup } from '../controller/userController.js';
import { loginValidation, signupValidation, validationErrors } from '../middlewares/validation/index.js';

const router = express.Router();

router.post('/signup',signupValidation(),validationErrors,  signup);

router.post('/login',loginValidation(),validationErrors, login);


export default router; 