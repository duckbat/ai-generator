import express from 'express';
import {body} from 'express-validator';
import {validate} from '../../middlewares';
import {commentPost} from '../controllers/commentController';

const router = express.Router();

router.route('/').post(body('text').notEmpty().escape(), validate, commentPost);

export default router;
