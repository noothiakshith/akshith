// src/controllers/auth.controller.js
import { signupUser, signinUser } from '../services/auth.service.js';
import prisma from '../utils/prisma.js';

export const signup = async (req, res) => {
  try {
    const { email, password, name, level } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: 'Valid level (beginner, intermediate, advanced) is required.' });
    }

    const { token, user } = await signupUser(email, password, name, level);
    res.status(201).json({ 
      message: 'User created successfully.',
      token, 
      user 
    });
  } catch (error) {
    console.error('Error in signup controller:', error);
    res.status(400).json({ error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { token, user } = await signinUser(email, password);
    res.status(200).json({ 
      message: 'Signed in successfully.',
      token, 
      user 
    });
  } catch (error) {
    console.error('Error in signin controller:', error);
    res.status(401).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error in getProfile controller:', error);
    res.status(500).json({ error: 'Could not fetch user profile.' });
  }
};