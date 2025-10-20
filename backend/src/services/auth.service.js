import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// User signup with password
const signupUser = async (email, password, name) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists with this email.');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with settings
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      settings: { create: {} },
    },
    include: {
      settings: true,
    },
  });

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

// User signin with password
const signinUser = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({ 
    where: { email },
    include: {
      settings: true,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  // Update last active date
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveDate: new Date() },
  });

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

export { signupUser, signinUser };