import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendEmailCode(to: string, code: string) {
  const t = getTransporter();

  await t.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "🔐 Ваш код подтверждения — RabotaVsem",
    text: `Здравствуйте!

Ваш код подтверждения для регистрации на RabotaVsem:

${code}

Код действителен 10 минут.

Если это были не вы, просто проигнорируйте это письмо.

С уважением,
Команда RabotaVsem`,
    html: `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Код подтверждения — RabotaVsem</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 8px; padding: 40px;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="margin: 0; font-size: 24px; color: #1a1a1a;">RabotaVsem</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 20px;">
              <p style="margin: 0 0 10px; font-size: 16px; color: #1a1a1a;">Здравствуйте!</p>
              <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                Ваш код подтверждения для регистрации:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 30px; text-align: center;">
              <div style="background-color: #667eea; border-radius: 8px; padding: 20px; display: inline-block;">
                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: monospace;">
                  ${code}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 20px;">
              <p style="margin: 0; font-size: 13px; color: #999999;">
                Код действителен 10 минут. Если это были не вы, проигнорируйте это письмо.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #999999;">
                © ${new Date().getFullYear()} RabotaVsem
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}
