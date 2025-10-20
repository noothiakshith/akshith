import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.mistake.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users for leaderboard
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@test.com',
        password: hashedPassword,
        xp: 100,
        coins: 50,
        streak: 1,
        level: 'beginner'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Alice Martin',
        email: 'alice@example.com',
        password: hashedPassword,
        xp: 2500,
        coins: 150,
        streak: 15,
        level: 'intermediate'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bob Dubois',
        email: 'bob@example.com',
        password: hashedPassword,
        xp: 1800,
        coins: 120,
        streak: 8,
        level: 'beginner'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Claire Rousseau',
        email: 'claire@example.com',
        password: hashedPassword,
        xp: 3200,
        coins: 200,
        streak: 22,
        level: 'advanced'
      }
    }),
    prisma.user.create({
      data: {
        name: 'David Moreau',
        email: 'david@example.com',
        password: hashedPassword,
        xp: 1200,
        coins: 80,
        streak: 5,
        level: 'beginner'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Emma Leroy',
        email: 'emma@example.com',
        password: hashedPassword,
        xp: 2800,
        coins: 180,
        streak: 12,
        level: 'intermediate'
      }
    })
  ]);

  // Seed Chapter 1: The Basics
  const chapter1 = await prisma.chapter.create({
    data: {
      title: 'Chapter 1: The Basics',
      description: 'Learn fundamental greetings and introductions.',
      level: 'beginner',
      order: 1,
      lessons: {
        create: [
          {
            title: 'Lesson 1: Greetings',
            content: 'Learn how to say hello and goodbye in French. These are essential phrases for any conversation.',
            level: 'beginner',
            order: 1,
            quests: {
              create: [
                {
                  type: 'multiple_choice',
                  question: 'How do you say "Hello" in French?',
                  options: { choices: ['Bonjour', 'Au revoir', 'Merci', 'Bonsoir'] },
                  answer: 'Bonjour',
                  order: 1,
                },
                {
                  type: 'fill_blank',
                  question: 'To say "Goodbye", you say __ revoir.',
                  answer: 'Au',
                  order: 2,
                },
                {
                  type: 'multiple_choice',
                  question: 'What does "Bonsoir" mean?',
                  options: { choices: ['Good morning', 'Good evening', 'Good night', 'Goodbye'] },
                  answer: 'Good evening',
                  order: 3,
                },
              ],
            },
          },
          {
            title: 'Lesson 2: Common Phrases',
            content: 'Learn essential phrases like "Yes", "No", "Please", and "Thank you".',
            level: 'beginner',
            order: 2,
            quests: {
              create: [
                {
                  type: 'translate',
                  question: 'Translate "Thank you very much".',
                  answer: 'Merci beaucoup',
                  order: 1,
                },
                {
                  type: 'multiple_choice',
                  question: 'How do you say "Please" in French?',
                  options: { choices: ['Merci', 'Sil vous plaît', 'Excusez-moi', 'Pardon'] },
                  answer: 'Sil vous plaît',
                  order: 2,
                },
                {
                  type: 'fill_blank',
                  question: 'To say "Yes", you say __.',
                  answer: 'Oui',
                  order: 3,
                },
              ],
            },
          },
          {
            title: 'Lesson 3: Introductions',
            content: 'Learn how to introduce yourself and ask for names.',
            level: 'beginner',
            order: 3,
            quests: {
              create: [
                {
                  type: 'translate',
                  question: 'Translate "My name is..."',
                  answer: 'Je mappelle',
                  order: 1,
                },
                {
                  type: 'multiple_choice',
                  question: 'How do you ask "What is your name?" formally?',
                  options: { choices: ['Comment tu tappelles?', 'Comment vous appelez-vous?', 'Quel est ton nom?', 'Qui êtes-vous?'] },
                  answer: 'Comment vous appelez-vous?',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Seed Chapter 2: Numbers and Time
  const chapter2 = await prisma.chapter.create({
    data: {
      title: 'Chapter 2: Numbers and Time',
      description: 'Master French numbers and time expressions.',
      level: 'beginner',
      order: 2,
      lessons: {
        create: [
          {
            title: 'Lesson 1: Numbers 1-20',
            content: 'Learn to count from 1 to 20 in French.',
            level: 'beginner',
            order: 1,
            quests: {
              create: [
                {
                  type: 'multiple_choice',
                  question: 'How do you say "five" in French?',
                  options: { choices: ['quatre', 'cinq', 'six', 'sept'] },
                  answer: 'cinq',
                  order: 1,
                },
                {
                  type: 'translate',
                  question: 'Translate "fifteen"',
                  answer: 'quinze',
                  order: 2,
                },
                {
                  type: 'fill_blank',
                  question: 'The number "ten" in French is __.',
                  answer: 'dix',
                  order: 3,
                },
              ],
            },
          },
          {
            title: 'Lesson 2: Telling Time',
            content: 'Learn how to ask and tell time in French.',
            level: 'beginner',
            order: 2,
            quests: {
              create: [
                {
                  type: 'multiple_choice',
                  question: 'How do you ask "What time is it?"',
                  options: { choices: ['Quelle heure est-il?', 'Combien dheure?', 'Quel temps fait-il?', 'À quelle heure?'] },
                  answer: 'Quelle heure est-il?',
                  order: 1,
                },
                {
                  type: 'translate',
                  question: 'Translate "It is 3 oclock"',
                  answer: 'Il est trois heures',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Seed Chapter 3: Family and Relationships
  const chapter3 = await prisma.chapter.create({
    data: {
      title: 'Chapter 3: Family and Relationships',
      description: 'Learn vocabulary about family members and relationships.',
      level: 'intermediate',
      order: 3,
      lessons: {
        create: [
          {
            title: 'Lesson 1: Family Members',
            content: 'Learn the names of family members in French.',
            level: 'intermediate',
            order: 1,
            quests: {
              create: [
                {
                  type: 'multiple_choice',
                  question: 'How do you say "mother" in French?',
                  options: { choices: ['père', 'mère', 'sœur', 'frère'] },
                  answer: 'mère',
                  order: 1,
                },
                {
                  type: 'translate',
                  question: 'Translate "my brother"',
                  answer: 'mon frère',
                  order: 2,
                },
                {
                  type: 'fill_blank',
                  question: 'The word for "sister" is __.',
                  answer: 'sœur',
                  order: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create flashcards for different users
  const flashcardData = [
    { front: 'Bonjour', back: 'Hello / Good morning', difficulty: 'new', source: 'lesson' },
    { front: 'Au revoir', back: 'Goodbye', difficulty: 'learning', source: 'lesson' },
    { front: 'Merci beaucoup', back: 'Thank you very much', difficulty: 'new', source: 'lesson' },
    { front: 'Sil vous plaît', back: 'Please (formal)', difficulty: 'review', source: 'lesson' },
    { front: 'Je mappelle', back: 'My name is', difficulty: 'new', source: 'lesson' },
    { front: 'Comment vous appelez-vous?', back: 'What is your name? (formal)', difficulty: 'learning', source: 'lesson' },
    { front: 'Quelle heure est-il?', back: 'What time is it?', difficulty: 'new', source: 'lesson' },
    { front: 'Il est trois heures', back: 'It is 3 oclock', difficulty: 'review', source: 'lesson' },
    { front: 'Ma famille', back: 'My family', difficulty: 'new', source: 'lesson' },
    { front: 'Mon père et ma mère', back: 'My father and my mother', difficulty: 'mastered', source: 'lesson' },
    { front: 'Excusez-moi', back: 'Excuse me', difficulty: 'learning', source: 'lesson' },
    { front: 'Je ne comprends pas', back: 'I dont understand', difficulty: 'new', source: 'lesson' }
  ];

  const flashcards = [];
  for (let i = 0; i < flashcardData.length; i++) {
    const userIndex = i % users.length; // Distribute flashcards among users
    const flashcard = await prisma.flashcard.create({
      data: {
        ...flashcardData[i],
        userId: users[userIndex].id,
        interval: flashcardData[i].difficulty === 'mastered' ? 30 :
          flashcardData[i].difficulty === 'review' ? 7 :
            flashcardData[i].difficulty === 'learning' ? 3 : 1,
        repetitions: flashcardData[i].difficulty === 'mastered' ? 5 :
          flashcardData[i].difficulty === 'review' ? 3 :
            flashcardData[i].difficulty === 'learning' ? 1 : 0,
        timesReviewed: flashcardData[i].difficulty === 'new' ? 0 : Math.floor(Math.random() * 5) + 1,
        timesCorrect: flashcardData[i].difficulty === 'mastered' ? 5 : Math.floor(Math.random() * 3),
        nextReview: new Date(Date.now() + (flashcardData[i].difficulty === 'new' ? 0 : Math.random() * 7 * 24 * 60 * 60 * 1000))
      }
    });
    flashcards.push(flashcard);
  }

  // Get some quests for creating mistakes
  const quests = await prisma.quest.findMany({ take: 10 });

  // Create sample mistakes for review system
  const mistakes = await Promise.all([
    prisma.mistake.create({
      data: {
        userId: users[0].id,
        questId: quests[0].id,
        userAnswer: 'Au revoir',
        correctAnswer: 'Bonjour',
        category: 'greetings',
        reviewed: false
      }
    }),
    prisma.mistake.create({
      data: {
        userId: users[0].id,
        questId: quests[1].id,
        userAnswer: 'Le',
        correctAnswer: 'Au',
        category: 'greetings',
        reviewed: false
      }
    }),
    prisma.mistake.create({
      data: {
        userId: users[1].id,
        questId: quests[2].id,
        userAnswer: 'Good night',
        correctAnswer: 'Good evening',
        category: 'greetings',
        reviewed: false
      }
    }),
    prisma.mistake.create({
      data: {
        userId: users[1].id,
        questId: quests[3].id,
        userAnswer: 'Merci',
        correctAnswer: 'Merci beaucoup',
        category: 'politeness',
        reviewed: true,
        reviewCount: 2
      }
    }),
    prisma.mistake.create({
      data: {
        userId: users[2].id,
        questId: quests[4].id,
        userAnswer: 'Merci',
        correctAnswer: 'Sil vous plaît',
        category: 'politeness',
        reviewed: false
      }
    }),
    prisma.mistake.create({
      data: {
        userId: users[3].id,
        questId: quests[5].id,
        userAnswer: 'Non',
        correctAnswer: 'Oui',
        category: 'basic_responses',
        reviewed: false
      }
    })
  ]);

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        category: 'completion',
        condition: { type: 'lessons_completed', value: 1 },
        coinReward: 10
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'streak',
        condition: { type: 'streak', value: 7 },
        coinReward: 25
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'XP Hunter',
        description: 'Earn 1000 XP points',
        icon: '⭐',
        category: 'xp',
        condition: { type: 'total_xp', value: 1000 },
        coinReward: 50
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Perfect Score',
        description: 'Get 100% accuracy in a lesson',
        icon: '💯',
        category: 'accuracy',
        condition: { type: 'lesson_accuracy', value: 100 },
        coinReward: 15
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Chapter Master',
        description: 'Complete an entire chapter',
        icon: '📚',
        category: 'completion',
        condition: { type: 'chapters_completed', value: 1 },
        coinReward: 30
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Flashcard Pro',
        description: 'Review 50 flashcards',
        icon: '🃏',
        category: 'completion',
        condition: { type: 'flashcards_reviewed', value: 50 },
        coinReward: 20
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Dedication',
        description: 'Maintain a 30-day learning streak',
        icon: '🏆',
        category: 'streak',
        condition: { type: 'streak', value: 30 },
        coinReward: 100
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'XP Master',
        description: 'Earn 5000 XP points',
        icon: '🌟',
        category: 'xp',
        condition: { type: 'total_xp', value: 5000 },
        coinReward: 150
      }
    })
  ]);

  // Create some progress records for users
  const lessons = await prisma.lesson.findMany({ take: 5 });
  const progressRecords = [];
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const userLessons = lessons.slice(0, Math.floor(Math.random() * 3) + 1); // 1-3 lessons per user
    
    for (const lesson of userLessons) {
      const progress = await prisma.progress.create({
        data: {
          userId: user.id,
          lessonId: lesson.id,
          completed: Math.random() > 0.3, // 70% chance of completion
          accuracy: Math.random() * 40 + 60, // 60-100% accuracy
          attempts: Math.floor(Math.random() * 3) + 1,
          questsCompleted: Math.floor(Math.random() * 5) + 1,
          questsTotal: 5,
          timeSpent: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
          xpEarned: Math.floor(Math.random() * 50) + 25,
          coinsEarned: Math.floor(Math.random() * 20) + 5,
          completedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null
        }
      });
      progressRecords.push(progress);
    }
  }

  // Award some achievements to users
  const userAchievements = await Promise.all([
    // Alice gets several achievements
    prisma.userAchievement.create({
      data: {
        userId: users[0].id,
        achievementId: achievements[0].id, // First Steps
        unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[0].id,
        achievementId: achievements[1].id, // Week Warrior
        unlockedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[0].id,
        achievementId: achievements[2].id, // XP Hunter
        unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    }),
    // Claire gets the most achievements (highest XP)
    prisma.userAchievement.create({
      data: {
        userId: users[2].id,
        achievementId: achievements[0].id, // First Steps
        unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[2].id,
        achievementId: achievements[1].id, // Week Warrior
        unlockedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[2].id,
        achievementId: achievements[2].id, // XP Hunter
        unlockedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[2].id,
        achievementId: achievements[4].id, // Chapter Master
        unlockedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[2].id,
        achievementId: achievements[7].id, // XP Master
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    }),
    // Bob gets basic achievements
    prisma.userAchievement.create({
      data: {
        userId: users[1].id,
        achievementId: achievements[0].id, // First Steps
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[1].id,
        achievementId: achievements[3].id, // Perfect Score
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    })
  ]);

  console.log('Seeding completed successfully!');
  console.log(`Created ${users.length} users`);
  console.log(`Created 3 chapters with multiple lessons and quests`);
  console.log(`Created ${flashcards.length} flashcards`);
  console.log(`Created ${progressRecords.length} progress records`);
  console.log(`Created ${mistakes.length} mistakes for review system`);
  console.log(`Created ${achievements.length} achievements`);
  console.log(`Awarded ${userAchievements.length} achievements to users`);
  console.log('Sample users for leaderboard:');
  users.forEach(user => {
    console.log(`- ${user.name} (${user.email}): ${user.xp} XP, ${user.streak} day streak`);
  });
  console.log('\nTest login credentials:');
  console.log('Email: test@test.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });