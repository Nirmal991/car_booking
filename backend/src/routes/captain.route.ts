import {Router} from 'express';
import { body } from 'express-validator';
import { getCaptainProfile, LoginCaptain, logoutCaptain, registerCaptain } from '../controllers';
import { authCaptain } from '../middlewares';

const router = Router();

router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('Vehicle color is required'),
    body('vehicle.plate').isLength({min:3}).withMessage('Vehicle plate is required'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type must be either car, motorcycle, or auto'),
] ,registerCaptain);

router.post('/login', [
     body('email').isEmail().withMessage('Invalid Email'),
     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
] ,LoginCaptain);

router.get('/profile', authCaptain, getCaptainProfile)

router.get('/logout', authCaptain, logoutCaptain);

export default router;