import express from 'express';
import { getNotices } from '../controllers/adminController.js'; // getNotices just fetches from Notice model

const router = express.Router();

router.get('/notices', getNotices);

export default router;
