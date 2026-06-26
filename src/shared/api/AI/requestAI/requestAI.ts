export interface Prompt {
  role: 'user' | 'developer' | 'assistant';
  content: string;
}

export const requestAi = async (prompts: Prompt[]) => {
  const { data } = await window.supabase.functions.invoke('ai-request', {
    body: { prompt: prompts },
  });

  return data.replace(/[*|#]|---/g, '');
};
