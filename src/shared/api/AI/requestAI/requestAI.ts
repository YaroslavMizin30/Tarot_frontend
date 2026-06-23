import http from '../../http/http';

export interface Prompt {
  role: 'user' | 'developer' | 'assistant';
  content: string;
}

export const requestAi = async (prompts: Prompt[]) => {
  const answer = await http<string>(
    'https://hadjujaanfwgepckluqy.supabase.co/functions/v1/ai-request',
    {
      method: 'POST',
      body: { prompt: prompts },
    },
  );

  return (answer as unknown as string).replace(/[*|#]|---/g, '');
};
