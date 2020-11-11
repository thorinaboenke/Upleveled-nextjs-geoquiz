import { updateScoresByUserId } from '../../util/database';

export default async function handler(request, response) {
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
    );
  } catch (err) {
    console.error('scores could not be updated');
    return response.status(500).send({ success: false });
  }

  response.send({ success: true });
}
