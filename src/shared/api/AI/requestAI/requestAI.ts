export const requestAi = async (prompt: string, role: string = 'user') => {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${'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'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-3-4b-it:free',
        messages: [
          {
            role,
            content: prompt,
          },
        ],
      }),
    },
  );

  return response.json();
};
