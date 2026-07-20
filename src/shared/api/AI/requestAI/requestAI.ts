import { backend } from '@/shared/api/backend';

export interface Prompt {
  role: 'user' | 'developer' | 'assistant';
  content: string;
}

export const requestAi = async (prompts: Prompt[]) => {
  const data = await backend.invoke<string>('ai-request', {
    prompt: prompts,
  });

  if (typeof data !== 'string' || !data.trim()) {
    throw new Error('AI_INVALID_RESPONSE');
  }

  return data.replace(/[*|#]|---/g, '');
};
