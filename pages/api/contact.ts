import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import mailGun, { AuthOptions, Options } from 'nodemailer-mailgun-transport';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { messageText, senderName, emailAddress } = request.body;
  if (process.env.MAILGUN_KEY === 'git') {
    return response.status(200).send({
      success: true,
      message: 'Message was sent',
    });
  }

  if (process.env.MAILGUN_KEY) {
    const options: AuthOptions = {
      api_key: process.env.MAILGUN_KEY,
      domain: 'sandboxce57c5ee359741e1992241e4df0b611d.mailgun.org',
    };

    const auth: Options = {
      auth: options,
    };
    const transporter = nodemailer.createTransport(mailGun(auth));
    const mailOptions = {
      sender: senderName,
      from: `${senderName} <${emailAddress}>`,
      to: 'thorina10@gmail.com',
      subject: 'Geoquiz',
      text: messageText,
    };

    try {
      const data = await transporter.sendMail(mailOptions);
    } catch (error) {
      return response.status(500).send({
        success: false,
        message: 'Message could not be sent',
      });
    }
    return response.status(200).send({
      success: true,
      message: 'Message was sent',
    });
  } else {
    return response.status(401).send({
      success: false,
      message: 'Message could not be sent',
    });
  }
}
