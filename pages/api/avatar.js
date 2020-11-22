import { insertAvatarUrlByUserId } from '../../util/database';

var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'snapdragon',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default async function handler(request, response) {
  const { data, userId, token, username } = request.body;
  const options = { public_id: username, folder: 'geoquiz' };
  const cloudinaryResponse = await cloudinary.uploader.upload(
    data,
    options,
    function (error, result) {
      try {
        insertAvatarUrlByUserId(userId, result.secure_url, token);
        console.log(result, error);
        return response
          .status(200)
          .send({ success: true, newUrl: result.secure_url });
      } catch (err) {
        console.error('Avatar could not be updated');
        return response.status(500).send({ success: false });
      }
    },
  );
  // return response
  //   .status(200)
  //   .send({ success: true, newUrl: cloudinaryResponse.secure_url });
}
