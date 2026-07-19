export interface Prompt {
  role: 'user' | 'developer' | 'assistant';
  content: string;
}

export const requestAi = async (prompts: Prompt[]) => {
  const { data, error } = await window.supabase.functions.invoke('ai-request', {
    body: { prompt: prompts },
  });

  if (error || typeof data !== 'string' || !data.trim()) {
    throw error ?? new Error('AI_INVALID_RESPONSE');
  }

  return data.replace(/[*|#]|---/g, '');
};
