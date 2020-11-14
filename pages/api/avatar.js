import { insertAvatarUrlByUserId } from '../../util/database';
const url = 'https://api.cloudinary.com/v1_1/snapdragon/image/upload';
// send API request to cloudinary.
// get the secure URl back from cloudinary
// put secure_url in database
// send back secure url to the frontend

var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'snapdragon',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default async function handler(request, response) {
  const { data, userId, token } = request.body;
  cloudinary.uploader.upload(data, function (error, result) {
    try {
      insertAvatarUrlByUserId(userId, result.secure_url, token);
      response.status(200).send({ success: true, newUrl: result.secure_url });
      console.log(result, error);
    } catch (err) {
      console.error('Avatar could not be updated');
      return response.status(500).send({ success: false });
    }
  });
}
