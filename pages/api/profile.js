import { insertAvatarUrlByUserId } from '../../util/database';

export default async function handler(request, response) {
  const { userId, avatarUrl,token} = request.body;
  try {
    const avatar = await insertAvatarUrlByUserId(userId, avatarUrl,token);
  } catch (err) {
    console.error('Avatar could not be updated');
    return response.status(500).send({ success: false });
  }

  response.send({ success: true });
}
