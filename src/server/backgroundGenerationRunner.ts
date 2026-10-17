import { generationJobStore, GenerationJob } from './generationJobStore';
import { Type } from '@google/genai';
import { recordAiUsage } from './aiUsageTracker';

export async function runGenerationJob(
  job: GenerationJob,
  ai: any,
  user?: { uid?: string; email?: string; name?: string },
  abortSignal?: AbortSignal
): Promise<void> {
  const { type, params } = job;
  const uid = job.ownerUid !== 'guest' ? job.ownerUid : user?.uid;

  try {
    generationJobStore.updateJobProgress(job.id, 20, 'Analyzing inputs and notes...');

    if (abortSignal?.aborted) return;

    if (type === 'notes_summary') {
      const { text, attachments, subject, topic, educationLevel } = params;
      const parts: any[] = [];
      if (attachments && Array.isArray(attachments)) {
        for (const att of attachments) {
          if (att.url && att.url.startsWith('data:')) {
            const match = att.url.match(/^data:([^;]+);base64,(.+)$/);
            if (match) {
              parts.push({
                inlineData: { mimeType: match[1], data: match[2] }
              });
            }
          }
        }
      }

      const prompt = `You are an expert academic tutor for secondary and high school exam students (WAEC/JAMB/GCSE/SAT/International).
Thoroughly analyze and summarize the following study notes.

Subject: ${subject || 'General Academic'}
Topic: ${topic || 'Key Concepts'}
Education Level: ${educationLevel || 'Secondary / High School'}

Study Notes:
${text || '(Notes provided in the attached document/image)'}

Formatting & Content Guidelines:
- Format cleanly in readable Markdown.
- DO NOT use raw unrendered LaTeX formatting. Convert mathematical expressions into readable unicode (e.g. ×, ÷, ², ³, ±, √, π, θ).
- Structure your summary into:
  1. # 📌 Executive Summary (A clear, 2-3 paragraph overview of the fundamental theme and scope)
  2. ## 🔑 Key Takeaways & Core Concepts (bullet points detailing every critical concept thoroughly)
  3. ## 📐 Important Formulas, Laws & Definitions (vital terms, laws, and equations to memorize)
  4. ## 💡 High-Yield Exam Memory Tips (frequent examiner traps, key test hooks, and mnemonics)`;

      parts.push({ text: prompt });

      generationJobStore.updateJobProgress(job.id, 45, 'Generating comprehensive summary...');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts }]
      });

      if (abortSignal?.aborted) return;

      generationJobStore.updateJobProgress(job.id, 90, 'Finalizing summary...');

      const summary = response.text || 'Summary generated successfully.';
      generationJobStore.completeJob(job.id, { summary, action: 'summarize' }, 'Summary generated successfully!');

      if (uid) {
        recordAiUsage({
          uid,
          email: user?.email,
          displayName: user?.name,
          category: 'tutor',
          model: 'gemini-3.8-flash',
          inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.usageMetadata?.totalTokenCount ?? 0
        });
      }
    } else if (type === 'notes_explain') {
      const { text, attachments, subject, topic, educationLevel } = params;
      const parts: any[] = [];
      if (attachments && Array.isArray(attachments)) {
        for (const att of attachments) {
          if (att.url && att.url.startsWith('data:')) {
            const match = att.url.match(/^data:([^;]+);base64,(.+)$/);
            if (match) {
              parts.push({
                inlineData: { mimeType: match[1], data: match[2] }
              });
            }
          }
        }
      }

      const prompt = `You are an engaging, world-class personal tutor. Provide a crystal-clear, deep pedagogical explanation of the concepts in these study notes.

Subject: ${subject || 'General Academic'}
Topic: ${topic || 'Key Concepts'}
Education Level: ${educationLevel || 'Secondary / High School'}

Study Notes:
${text || '(Notes provided in the attached document/image)'}

Formatting & Content Guidelines:
- Format in clean, readable Markdown without raw LaTeX tags.
- Structure into:
  1. ## 🎯 Core Intuition & The Big Picture
  2. ## 🔍 Step-by-Step Breakdown
  3. ## 🌍 Real-World Analogies & Practical Applications
  4. ## ⚠️ Common Pitfalls & Examiner Traps
  5. ## 🧪 Quick Self-Check Challenge`;

      parts.push({ text: prompt });

      generationJobStore.updateJobProgress(job.id, 50, 'Explaining concepts in detail...');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts }]
      });

      if (abortSignal?.aborted) return;

      generationJobStore.updateJobProgress(job.id, 90, 'Finalizing pedagogical explanation...');

      const explanation = response.text || 'Explanation generated successfully.';
      generationJobStore.completeJob(job.id, { explanation, action: 'explain' }, 'Explanation ready!');

      if (uid) {
        recordAiUsage({
          uid,
          email: user?.email,
          displayName: user?.name,
          category: 'tutor',
          model: 'gemini-3.8-flash',
          inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.usageMetadata?.totalTokenCount ?? 0
        });
      }
    } else if (type === 'notes_flashcards') {
      const { text, subject, topic, educationLevel, count = 10 } = params;
      const targetCount = Math.min(Math.max(Number(count) || 10, 5), 100);

      const prompt = `Generate exactly ${targetCount} high-yield study flashcards based on the following notes.
Subject: ${subject || 'General'}
Topic: ${topic || 'Core Concepts'}
Education Level: ${educationLevel || 'Secondary'}

Notes:
${text || '(Notes content)'}

Each flashcard must have:
- front: A specific, clear conceptual question, term, or problem.
- back: A concise, accurate, direct answer.
- explanation: A helpful hint or mnemonic.`;

      const config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ['front', 'back']
          }
        }
      };

      generationJobStore.updateJobProgress(job.id, 40, `Generating ${targetCount} study flashcards...`);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config
      });

      if (abortSignal?.aborted) return;

      generationJobStore.updateJobProgress(job.id, 85, 'Deduplicating and organizing deck...');

      const parsed = JSON.parse(response.text || '[]');
      const flashcards = parsed.map((c: any, idx: number) => ({
        id: `card_${Date.now()}_${idx}`,
        front: c.front,
        back: c.back,
        explanation: c.explanation || ''
      }));

      generationJobStore.completeJob(job.id, { flashcards, action: 'flashcards' }, `${flashcards.length} flashcards generated!`);

      if (uid) {
        recordAiUsage({
          uid,
          email: user?.email,
          displayName: user?.name,
          category: 'flashcards',
          model: 'gemini-3.8-flash',
          inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.usageMetadata?.totalTokenCount ?? 0
        });
      }
    } else if (type === 'notes_questions') {
      const { text, subject, topic, educationLevel, count = 10 } = params;
      const targetCount = Math.min(Math.max(Number(count) || 10, 5), 50);

      const prompt = `Generate ${targetCount} multiple-choice practice questions based on these notes.
Subject: ${subject || 'General'}
Topic: ${topic || 'Core Concepts'}
Education Level: ${educationLevel || 'Secondary'}

Notes:
${text || '(Notes content)'}

Requirements:
- Exactly 4 options per question (A, B, C, D).
- correctAnswer must be 0, 1, 2, or 3.
- Detailed step-by-step explanation for each question.`;

      const config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswer', 'explanation']
          }
        }
      };

      generationJobStore.updateJobProgress(job.id, 45, `Synthesizing ${targetCount} exam practice questions...`);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config
      });

      if (abortSignal?.aborted) return;

      generationJobStore.updateJobProgress(job.id, 90, 'Validating question answers and explanations...');

      const parsed = JSON.parse(response.text || '[]');
      const questions = parsed.map((q: any, idx: number) => ({
        id: `q_${Date.now()}_${idx}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }));

      generationJobStore.completeJob(job.id, { questions, action: 'questions' }, `${questions.length} questions ready!`);

      if (uid) {
        recordAiUsage({
          uid,
          email: user?.email,
          displayName: user?.name,
          category: 'practice',
          model: 'gemini-3.8-flash',
          inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.usageMetadata?.totalTokenCount ?? 0
        });
      }
    } else if (type === 'practice_generation') {
      const { subject, topic, difficulty, amount, educationLevel, country, practiceMode, examType } = params;
      const count = Math.min(Math.max(Number(amount) || 5, 1), 50);

      const prompt = `Generate ${count} practice questions for a student.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty || 'medium'}
Education Level: ${educationLevel || 'General'}
Exam Type: ${examType || 'Standard'}
Practice Mode: ${practiceMode || 'Custom'}

Strict Multiple Choice format: 4 options, 1 correct index (0-3), detailed explanation.`;

      const config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswer', 'explanation']
          }
        }
      };

      generationJobStore.updateJobProgress(job.id, 50, `Generating ${count} ${subject} questions...`);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config
      });

      if (abortSignal?.aborted) return;

      const questions = JSON.parse(response.text || '[]');
      generationJobStore.completeJob(job.id, { questions }, `${questions.length} questions generated!`);
    } else {
      generationJobStore.failJob(job.id, `Unsupported job type: ${type}`);
    }
  } catch (error: any) {
    if (abortSignal?.aborted || job.status === 'cancelled') {
      return;
    }
    console.error(`Background Job [${job.id}] failed:`, error);
    generationJobStore.failJob(job.id, error?.message || 'Generation failed');
  }
}
