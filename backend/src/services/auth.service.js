import { PrismaClient } from '@prisma/client';
import Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Configure Nodemailer with Mailtrap Transport
const transporter = Nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN,
  })
);

// Generates OTP, hashes it, saves it, and sends the email
const generateOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otpVerification.create({
    data: { email, otpHash, expiresAt },
  });

  const sender = {
    address: process.env.MAILTRAP_SENDER_EMAIL,
    name: process.env.MAILTRAP_SENDER_NAME,
  };

  try {
    await transporter.sendMail({
      from: sender,
      to: email,
      subject: 'Your LinguaFr OTP Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4A90E2;">Bonjour! 👋</h2>
          <p>Here’s your one-time passcode to log in to LinguaFr:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">${otp}</p>
          <p>This code expires in 5 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">— The LinguaFr Team 🇫🇷</p>
        </div>
      `,
      category: 'OTP Verification',
    });
    console.log('OTP email sent to Mailtrap successfully!');
  } catch (error) {
    console.error('Error sending email with Mailtrap:', error);
    throw new Error('Could not send OTP email.');
  }
};

// Verifies the OTP and issues a JWT
const verifyUserOtp = async (email, otp) => {
  const otpRecord = await prisma.otpVerification.findFirst({
    where: { email, expiresAt: { gt: new Date() }, used: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    throw new Error('OTP is invalid, has expired, or has already been used.');
  }

  const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isMatch) {
    throw new Error('Invalid OTP.');
  }

  await prisma.otpVerification.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        settings: { create: {} },
      },
    });
  }

  // CORRECT: Use jwt.sign() to call the method on the imported object
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return { token, user };
};

export { generateOtp, verifyUserOtp };