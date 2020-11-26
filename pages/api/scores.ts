import { NextApiRequest, NextApiResponse } from 'next';
import { updateScoresByUserId } from '../../util/database';

export default async function handler(request: NextApiRequest, response:NextApiResponse) {
  const {
    userId,
    answeredQuestions,
    correctQuestions,
    categoryAnswer,
    region,
  } = request.body;
  try {
    const scores = await updateScoresByUserId(
      userId,
      answeredQuestions,
      correctQuestions,
      categoryAnswer,
      region,
      request.cookies.session,
    );
  } catch (err) {
    console.error('scores could not be updated');
    return response.status(500).send({ success: false });
  }

  response.status(200).send({ success: true });
}
