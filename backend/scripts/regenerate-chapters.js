// Script to regenerate chapters using Ollama
import { PrismaClient } from '@prisma/client';
import aiService from '../src/services/ai.service.js';

const prisma = new PrismaClient();

async function regenerateChapters() {
  try {
    console.log('🧹 Clearing existing chapters, lessons, and quests...');
    
    // Delete all existing content in order (due to foreign key constraints)
    await prisma.quest.deleteMany({});
    await prisma.progress.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.chapter.deleteMany({});
    
    console.log('✅ Database cleared');
    
    // Generate chapters for each level
    const levels = ['beginner', 'intermediate', 'advanced'];
    
    for (const level of levels) {
      console.log(`\n🤖 Generating ${level} curriculum with Ollama...`);
      
      try {
        // Generate chapters using Ollama
        const chapters = await aiService.generateChapters(level);
        console.log(`📚 Generated ${chapters.length} chapters for ${level} level`);
        
        // Create chapters in database
        for (const chapterData of chapters) {
          console.log(`  Creating chapter: ${chapterData.title}`);
          
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
          console.log(`    Generating lessons for: ${chapter.title}`);
          const lessons = await aiService.generateLessons(
            chapter.id, 
            chapter.title, 
            level
          );

          // Create lessons in database
          for (const lessonData of lessons) {
            console.log(`      Creating lesson: ${lessonData.title}`);
            
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
            console.log(`        Generating quests for: ${lesson.title}`);
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
            
            console.log(`        ✅ Created ${quests.length} quests`);
          }
          
          console.log(`    ✅ Created ${lessons.length} lessons`);
        }
        
        console.log(`✅ ${level} curriculum completed`);
        
      } catch (error) {
        console.error(`❌ Error generating ${level} curriculum:`, error.message);
        console.log('Make sure Ollama is running: ollama serve');
        console.log('And you have a model installed: ollama pull llama3.2');
      }
    }
    
    // Show final statistics
    const chapterCount = await prisma.chapter.count();
    const lessonCount = await prisma.lesson.count();
    const questCount = await prisma.quest.count();
    
    console.log('\n📊 Final Statistics:');
    console.log(`  Chapters: ${chapterCount}`);
    console.log(`  Lessons: ${lessonCount}`);
    console.log(`  Quests: ${questCount}`);
    
    console.log('\n🎉 Chapter regeneration completed!');
    console.log('You can now sign up with a new user to test the system.');
    
  } catch (error) {
    console.error('❌ Error during regeneration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
regenerateChapters();
