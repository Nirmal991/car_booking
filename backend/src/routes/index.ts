import { Router } from "express";
import userRouter from './user.route'
import captainRouter from './captain.route'
import mapRouter from './maps.routes';

const $ = Router();

$.use('/api/user', userRouter)
$.use('/api/captain', captainRouter)
$.use('/api/map', mapRouter)

export default $;
