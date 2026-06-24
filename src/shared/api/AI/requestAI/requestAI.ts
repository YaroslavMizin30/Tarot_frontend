export interface Prompt {
  role: 'user' | 'developer' | 'assistant';
  content: string;
}

export const requestAi = async (prompts: Prompt[]) => {
  const response = await fetch(
    'https://hadjujaanfwgepckluqy.supabase.co/functions/v1/ai-request',
    {
      method: 'POST',
      body: JSON.stringify({ prompt: prompts }),
    },
  );

  const answer = await response.json();

  return answer.replace(/[*|#]|---/g, '');
};
