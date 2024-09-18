import express from 'express';
import {body} from 'express-validator';
import {validate} from '../../middlewares';
import { imagePost } from '../controllers/imageController';

const router = express.Router();

router.route('/').post(body('text').notEmpty().escape(), validate, imagePost);

export default router;
