import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import aiService from './ai.service.js';

const prisma = new PrismaClient();

// User signup with password and level selection
const signupUser = async (email, password, name, level) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists with this email.');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with settings and level
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      level,
      settings: { create: {} },
    },
    include: {
      settings: true,
    },
  });

  // Initialize user's learning journey
  await initializeUserLearningJourney(user.id, level);

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

// Initialize user's learning journey with AI-generated content
const initializeUserLearningJourney = async (userId, level) => {
  try {
    // Check if chapters already exist for this level
    const existingChapters = await prisma.chapter.findMany({
      where: { level },
      orderBy: { order: 'asc' }
    });

    // If no chapters exist for this level, generate them
    if (existingChapters.length === 0) {
      console.log(`Generating curriculum for ${level} level...`);
      const chapters = await aiService.generateChapters(level);
      
      // Create chapters in database
      for (const chapterData of chapters) {
        const chapter = await prisma.chapter.create({
          data: {
            title: chapterData.title,
            description: chapterData.description,
            level: chapterData.level,
            order: chapterData.order,
            xpRequired: chapterData.xpRequired,
            isUnlocked: chapterData.order === 1 // Unlock first chapter
          }
        });

        // Generate lessons for this chapter
        const lessons = await aiService.generateLessons(
          chapter.id, 
          chapter.title, 
          level
        );

        // Create lessons in database
        for (const lessonData of lessons) {
          const lesson = await prisma.lesson.create({
            data: {
              chapterId: chapter.id,
              title: lessonData.title,
              content: lessonData.content,
              vocabulary: lessonData.vocabulary,
              grammar: lessonData.grammar,
              level: lessonData.level,
              order: lessonData.order,
              xpReward: lessonData.xpReward,
              coinReward: lessonData.coinReward
            }
          });

          // Generate quests for this lesson
          const quests = await aiService.generateQuests(
            lesson.id,
            lesson.title,
            lesson.vocabulary,
            level
          );

          // Create quests in database
          for (const questData of quests) {
            await prisma.quest.create({
              data: {
                lessonId: lesson.id,
                type: questData.type,
                question: questData.question,
                options: questData.options,
                answer: questData.answer,
                hint: questData.hint,
                difficulty: questData.difficulty,
                order: questData.order,
                xpReward: questData.xpReward
              }
            });
          }
        }
      }
    }

    // Create initial streak record
    await prisma.streak.create({
      data: {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null
      }
    });

    console.log(`Learning journey initialized for user ${userId} at ${level} level`);
  } catch (error) {
    console.error('Error initializing learning journey:', error);
    // Don't throw error to prevent signup failure
  }
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