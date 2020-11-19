export default async function handler(request, response) {
  const {messageText, senderName, emailAddress} = request.body;
  cloudinary.uploader.upload(data, function (error, result) {
    try {
      response.status(200).send({ success: true });
      console.log(result, error);
    } catch (err) {
      console.error('Message could not be sent');
      return response.status(500).send({ success: false });
    }
  });
}
