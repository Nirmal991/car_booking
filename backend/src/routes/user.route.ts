import express from 'express';
import { body } from 'express-validator';
import { getUserProfile, login, logout, register } from '../controllers';
import { authUser } from '../middlewares';

const router = express.Router();

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage
    ('first name must be atleast 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be 6 lettor long')
] ,register)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be 6 lettor long')
] ,login)

router.get('/profile',authUser, getUserProfile);
router.get('/logout', authUser, logout)

export default router;