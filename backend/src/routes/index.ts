import { Router } from "express";
import userRouter from './user.route'
import captainRouter from './captain.route'

const $ = Router();

$.use('/api/user', userRouter)
$.use('/api/captain', captainRouter)

export default $;
