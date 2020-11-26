import { insertAvatarUrlByUserId } from '../../util/database';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  UploadApiOptions,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'snapdragon',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { data, userId, token, username } = request.body;
  const options: UploadApiOptions = { public_id: username, folder: 'geoquiz' };
  const cloudinaryResponse = await cloudinary.uploader.upload(
    data,
    options,
    function (error: UploadApiErrorResponse, result: UploadApiResponse) {
      try {
        insertAvatarUrlByUserId(userId, result.secure_url, token);
        return response
          .status(200)
          .send({ success: true, newUrl: result.secure_url });
      } catch (err) {
        console.error('Avatar could not be updated');
        return response.status(500).send({ success: false });
      }
    },
  );
}
