import express from 'express';
import { getNotices } from '../controllers/adminController.js';
import { verifyNoDues } from '../controllers/pdfController.js';

const router = express.Router();

router.get('/notices', getNotices);
router.get('/verify/no-dues/:id', verifyNoDues);

export default router;
