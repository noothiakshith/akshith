import { Ollama } from 'ollama';
import prisma from '../utils/prisma.js';

class AIService {
  constructor() {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
  }

  async generateChapters(level, language = 'French') {
    const prompt = `Generate a comprehensive ${language} learning curriculum for ${level} level students. 
    
    Create 8-10 chapters with the following structure:
    - Each chapter should have a clear title and description
    - Order them from basic to advanced concepts
    - Include XP requirements (starting from 0, then 100, 200, 400, 800, etc.)
    
    Return ONLY a JSON array with this exact structure:
    [
      {
        "title": "Chapter Title",
        "description": "Brief description",
        "level": "${level}",
        "order": 1,
        "xpRequired": 0
      }
    ]`;

    return await this.generateContent('chapter', prompt);
  }

  async generateLessons(chapterId, chapterTitle, level, language = 'French') {
    const prompt = `Generate 4-6 lessons for the ${language} chapter: "${chapterTitle}" at ${level} level.
    
    Each lesson should include:
    - Title and content (detailed explanation)
    - Vocabulary array with word, meaning, phonetic, example
    - Grammar notes if applicable
    - XP and coin rewards
    
    Return ONLY a JSON array with this exact structure:
    [
      {
        "title": "Lesson Title",
        "content": "Detailed lesson content explaining concepts...",
        "vocabulary": [
          {
            "word": "bonjour",
            "meaning": "hello",
            "phonetic": "bon-ZHOOR",
            "example": "Bonjour, comment allez-vous?"
          }
        ],
        "grammar": "Grammar explanation if applicable",
        "level": "${level}",
        "order": 1,
        "xpReward": 15,
        "coinReward": 8
      }
    ]`;

    return await this.generateContent('lesson', prompt);
  }

  async generateQuests(lessonId, lessonTitle, vocabulary, level, language = 'French') {
    const vocabText = vocabulary ? JSON.stringify(vocabulary) : 'No specific vocabulary';
    
    const prompt = `Generate 3-4 interactive quests for the ${language} lesson: "${lessonTitle}" at ${level} level.
    
    Vocabulary context: ${vocabText}
    
    Create diverse quest types:
    - fill_blank: Fill in missing words
    - jumble: Unscramble sentences
    - multiple_choice: Choose correct answer
    - translate: Translate between languages
    
    Return ONLY a JSON array with this exact structure:
    [
      {
        "type": "multiple_choice",
        "question": "What does 'bonjour' mean?",
        "options": ["hello", "goodbye", "please", "thank you"],
        "answer": "hello",
        "hint": "It's a greeting",
        "difficulty": "easy",
        "order": 1,
        "xpReward": 5
      }
    ]`;

    return await this.generateContent('quest', prompt);
  }

  async generateAdaptiveLessons(userId, mistakes, level, language = 'French') {
    const mistakeCategories = mistakes.map(m => m.category).join(', ');
    const commonMistakes = mistakes.slice(0, 5).map(m => 
      `Question: ${m.quest?.question}, User Answer: ${m.userAnswer}, Correct: ${m.correctAnswer}`
    ).join('\n');

    const prompt = `Generate 2-3 adaptive lessons for a ${level} ${language} learner who struggles with: ${mistakeCategories}
    
    Recent mistakes:
    ${commonMistakes}
    
    Create focused lessons that address these specific weaknesses with:
    - Targeted explanations
    - Reinforcement exercises
    - Gradual difficulty progression
    
    Return ONLY a JSON array with the lesson structure as before.`;

    return await this.generateContent('adaptive_lesson', prompt);
  }

  async generateFlashcards(mistakes, language = 'French') {
    const mistakeText = mistakes.map(m => 
      `${m.quest?.question} - Correct: ${m.correctAnswer}`
    ).join('\n');

    const prompt = `Generate flashcards for ${language} learning based on these mistakes:
    ${mistakeText}
    
    Create flashcards that help reinforce the correct answers.
    
    Return ONLY a JSON array with this structure:
    [
      {
        "front": "French word or phrase",
        "back": "English meaning + phonetic + example sentence",
        "difficulty": "new"
      }
    ]`;

    return await this.generateContent('flashcard', prompt);
  }

  async generateContent(type, prompt) {
    const startTime = Date.now();
    let successful = true;
    let error = null;
    let response = '';

    try {
      const result = await this.ollama.chat({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert language learning content creator. Always respond with valid JSON only, no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false
      });

      response = result.message.content.trim();
      
      // Clean up response to ensure valid JSON
      if (response.startsWith('```json')) {
        response = response.replace(/```json\n?/, '').replace(/\n?```$/, '');
      }
      if (response.startsWith('```')) {
        response = response.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      // Validate JSON
      const parsedResponse = JSON.parse(response);
      
      return parsedResponse;

    } catch (err) {
      successful = false;
      error = err.message;
      console.error(`AI Generation Error (${type}):`, err);
      throw new Error(`Failed to generate ${type}: ${err.message}`);
    } finally {
      // Log the generation attempt
      await this.logGeneration(type, prompt, response, Date.now() - startTime, successful, error);
    }
  }

  async logGeneration(type, prompt, response, duration, successful, error) {
    try {
      await prisma.aiGenerationLog.create({
        data: {
          type,
          prompt,
          response,
          model: this.model,
          duration,
          successful,
          error
        }
      });
    } catch (logError) {
      console.error('Failed to log AI generation:', logError);
    }
  }

  async analyzeUserWeaknesses(userId) {
    const mistakes = await prisma.mistake.findMany({
      where: { userId },
      include: { quest: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    });

    const categories = {};
    mistakes.forEach(mistake => {
      if (mistake.category) {
        categories[mistake.category] = (categories[mistake.category] || 0) + 1;
      }
    });

    // Calculate learning metrics
    const accuracyTrend = userProgress?.accuracy || 0;
    const needsDifficultlyAdjustment = accuracyTrend < 50 || accuracyTrend > 80;

    return {
      totalMistakes: mistakes.length,
      categories,
      recentMistakes: mistakes.slice(0, 5),
      needsAdaptiveContent: mistakes.length >= 5,
      accuracyTrend,
      needsDifficultlyAdjustment,
      recommendedFocus: this.getRecommendedFocus(categories, accuracyTrend)
    };
  }

  async generateReviewSummary(userId) {
    const analysis = await this.analyzeUserWeaknesses(userId);
    
    const prompt = `Create a focused review summary based on user's performance:
    Accuracy: ${analysis.accuracyTrend}%
    Common mistakes in: ${Object.keys(analysis.categories).join(', ')}
    
    Generate:
    1. Key points to review
    2. Practice recommendations
    3. Study tips
    
    Return as JSON with structure:
    {
      "keyPoints": ["point1", "point2"],
      "practiceAreas": ["area1", "area2"],
      "studyTips": ["tip1", "tip2"]
    }`;

    return await this.generateContent('review_summary', prompt);
  }

  async generateProgressUpdate(userId) {
    const progress = await prisma.userProgress.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            level: true,
            streak: true,
            xp: true
          }
        }
      }
    });

    const prompt = `Generate a motivational progress update for a language learner:
    Level: ${progress.user.level}
    Streak: ${progress.user.streak} days
    XP: ${progress.user.xp}
    Accuracy: ${progress.accuracy}%
    
    Return as JSON with structure:
    {
      "achievement": "Main achievement to highlight",
      "encouragement": "Motivational message",
      "nextGoal": "Suggested next goal",
      "tip": "Personalized learning tip"
    }`;

    return await this.generateContent('progress_update', prompt);
  }

  getRecommendedFocus(categories, accuracy) {
    // Convert mistake categories into learning priorities
    const priorities = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .map(([category]) => category);

    if (accuracy < 50) {
      return {
        difficultyAdjustment: 'decrease',
        focusAreas: priorities.slice(0, 2),
        recommendedFormat: 'basic drills'
      };
    } else if (accuracy > 80) {
      return {
        difficultyAdjustment: 'increase',
        focusAreas: priorities,
        recommendedFormat: 'advanced challenges'
      };
    } else {
      return {
        difficultyAdjustment: 'maintain',
        focusAreas: priorities.slice(0, 3),
        recommendedFormat: 'mixed practice'
      };
    }
  }
}

export default new AIService();