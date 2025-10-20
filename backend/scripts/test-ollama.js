// Test script to verify Ollama is working
import aiService from '../src/services/ai.service.js';

async function testOllama() {
  try {
    console.log('🤖 Testing Ollama connection...');
    console.log('Make sure Ollama is running: ollama serve');
    console.log('And you have a model: ollama pull llama3.2\n');
    
    // Test generating chapters for beginner level
    console.log('📚 Generating sample chapters for beginner level...');
    const chapters = await aiService.generateChapters('beginner');
    
    console.log('\n✅ Success! Generated chapters:');
    chapters.forEach((chapter, index) => {
      console.log(`${index + 1}. ${chapter.title}`);
      console.log(`   Description: ${chapter.description}`);
      console.log(`   XP Required: ${chapter.xpRequired}`);
      console.log('');
    });
    
    // Test generating lessons for first chapter
    if (chapters.length > 0) {
      console.log('📖 Generating sample lessons...');
      const lessons = await aiService.generateLessons(
        1, // dummy chapter ID
        chapters[0].title,
        'beginner'
      );
      
      console.log('\n✅ Generated lessons:');
      lessons.forEach((lesson, index) => {
        console.log(`${index + 1}. ${lesson.title}`);
        console.log(`   XP Reward: ${lesson.xpReward}`);
        console.log(`   Vocabulary: ${lesson.vocabulary?.length || 0} words`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing Ollama:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Ollama is running: ollama serve');
    console.log('2. Check if model is installed: ollama list');
    console.log('3. Install a model: ollama pull llama3.2');
    console.log('4. Check Ollama host in .env file');
  }
}

testOllama();
