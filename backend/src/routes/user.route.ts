import express from 'express';
import { body } from 'express-validator';
import { register } from '../controllers';

const router = express.Router();

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage
    ('first name must be atleast 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be 6 lettor long')
] ,register)

export default router;