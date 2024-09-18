import {ImagesResponse} from 'openai/resources';
import fetchData from '../../lib/fetchData';
import {NextFunction, Request, Response} from 'express';

const imagePost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    const response = await fetchData<ImagesResponse>(
      `${process.env.OPENAI_API_URL}/v1/images/generations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: req.body.text,
          n: 1,
          size: '1024x1024',
        }),
      }
    );
    if (!response.data || !response.data[0].url) {
      throw new Error('Failed to generate response');
    }
    res.json({response: response.data[0].url});
  } catch (error) {
    next(error);
  }
};

export {imagePost};
