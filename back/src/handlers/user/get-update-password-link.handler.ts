import { StatusCodes } from 'http-status-codes';
import * as nodemailer from 'nodemailer';
import { WebError } from '../../models/error';
import userService from '../../services/user-service';
import { makeTokens } from '../../utils';

export default async (origin, email) => {
  const user = await userService.findByEmail(email);
  if (!user) {
    throw new WebError(StatusCodes.NOT_FOUND);
  }
  const { accessToken } = makeTokens({ userId: user.id });
  const url = `${origin}/update-password?token=${accessToken}`;
  const transporter = nodemailer.createTransport({
    host: 'smtp.beget.com',
    port: 25,
    secure: false,
    auth: {
      user: 'info@progoff.ru',
      pass: '9900islidE%',
    },
  });

  await transporter.sendMail({
    from: '"Agile system" <info@progoff.ru>',
    to: email,
    subject: 'Изменение пароля',
    html: `<p>Чтобы изменить пароль учетной записи, перейдите по ссылке:</p>
    <a href="${url}">${url}</a>`,
  });
};
