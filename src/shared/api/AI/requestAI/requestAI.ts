interface Prompt {
  role: 'user' | 'developer' | 'system';
  content: string;
}

export const requestAi = async (prompts: Prompt[]) => {
  const response = await fetch('https://routerai.ru/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-VJYm9TLvOSZY--3UOkAr0JI9AbNRXj8S',
    },
    body: JSON.stringify({
      model: 'arcee-ai/trinity-large-thinking',
      messages: prompts,
    }),
  });

  const body = await response.json();

  return body.choices[0].message.content;
};
