// src/controllers/auth.controller.js
import { generateOtp, verifyUserOtp } from '../services/auth.service.js';

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    await generateOtp(email);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error in sendOtp controller:', error);
    res.status(500).json({ error: 'Could not send OTP email.' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

    const { token, user } = await verifyUserOtp(email, otp);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error in verifyOtp controller:', error);
    res.status(400).json({ error: error.message });
  }
};
