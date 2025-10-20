import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed Chapter 1
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
            content: 'Learn how to say hello and goodbye.',
            level: 'beginner',
            order: 1,
            quests: {
              create: [
                {
                  type: 'multiple_choice',
                  question: 'How do you say "Hello" in French?',
                  options: { choices: ['Bonjour', 'Au revoir', 'Merci'] },
                  answer: 'Bonjour',
                  order: 1,
                },
                {
                  type: 'fill_blank',
                  question: 'To say "Goodbye", you say __ revoir.',
                  answer: 'Au',
                  order: 2,
                },
              ],
            },
          },
          {
            title: 'Lesson 2: Common Phrases',
            content: 'Learn how to say "Yes", "No", and "Thank you".',
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
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Seeding finished. Created chapter with ID: ${chapter1.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });