// src/routes/auth.routes.js
import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// ✅ MUST use default export for ES modules
export default router;
