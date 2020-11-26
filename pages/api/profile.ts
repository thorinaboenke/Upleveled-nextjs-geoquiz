import { insertAvatarUrlByUserId } from '../../util/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { userId, avatarUrl, token } = request.body;
  try {
    await insertAvatarUrlByUserId(userId, avatarUrl, token);
  } catch (err) {
    console.error('Avatar could not be updated');
    return response.status(500).send({ success: false });
  }

  response.status(200).send({ success: true });
}
