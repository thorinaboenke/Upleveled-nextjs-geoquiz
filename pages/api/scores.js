import { updateScoresByUserId } from '../../util/database';

export default async function handler(request, response) {
  const {
    userId,
    answeredQuestions,
    correctQuestions,
    categoryAnswer,
    region,
  } = request.body;

  const scores = await updateScoresByUserId(
    userId,
    answeredQuestions,
    correctQuestions,
    categoryAnswer,
    region,
  );
  response.send({ success: true });
}
