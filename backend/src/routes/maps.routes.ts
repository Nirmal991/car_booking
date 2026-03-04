import express from 'express';
import { query } from 'express-validator';
import { authUser } from '../middlewares';
import { getAutoCompleteSuggestions, getCoordinates, getDistanceTime } from '../controllers';
import { get } from 'http';


const router = express.Router();


router.get('/get-coordinates',
    query('address').isString().isLength({min: 3}),
    authUser,getCoordinates
)
router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authUser, getDistanceTime
)

router.get('/autocomplete',
    query('input').isString().isLength({ min: 1 }),
    authUser, getAutoCompleteSuggestions
)
export default router;