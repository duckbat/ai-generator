import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';
import {ChatCompletion} from 'openai/resources';

// TODO: Generate a sarcastic, hostile AI response to a Youtube comment, imitating an 18th-century English aristocrat, and return it as a JSON response.
// Use the text from the request body to generate the response.
// Instead of using openai library, use fetchData to make a post request to the server.
// see https://platform.openai.com/docs/api-reference/chat/create for more information
// You don't need an API key if you use the URL provided in .env.sample and Metropolia VPN
// Example: instead of https://api.openai.com/v1/chat/completions use process.env.OPENAI_API_URL + '/v1/chat/completions'

const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    const response = await fetchData<ChatCompletion>(
      `${process.env.OPENAI_API_URL}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are cringe 13 year old teenager',
            },
            {
              role: 'user',
              content: req.body.text,
            },
          ],
          temperature: 0.8,
          max_tokens: 150,
        }),
      }
    );
    if (!response.choices || !response.choices[0].message.content) {
      throw new Error('Failed to generate response');
    }
    res.json({response: response.choices[0].message.content});
  } catch (error) {
    next(error);
  }
};

export {commentPost};
