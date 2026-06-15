import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE !== "false", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendResetCode(email: string, code: string) {
  const mailOptions = {
    from: `"Ink & Insight" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your Ink & Insight password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f5f7;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 500px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #e1e4ea;
          }
          .header {
            background: linear-gradient(135deg, #3B3FA0 0%, #4F6DF5 100%);
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 40px 30px;
            color: #2e384d;
            line-height: 1.6;
          }
          .content p {
            margin: 0 0 20px 0;
            font-size: 16px;
          }
          .code-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #3B3FA0;
            margin: 0;
            padding-left: 8px; /* offset the last letter-spacing */
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #8798ad;
            border-top: 1px solid #e1e4ea;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ink & Insight</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your administrator password. Use the following 6-digit verification code to complete the process. This code will expire in 15 minutes.</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from your Ink & Insight dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendNewsletterEmail(email: string, subject: string, htmlContent: string) {
  const mailOptions = {
    from: `"Ink & Insight" <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f5f7;
            margin: 0;
            padding: 0;
            color: #2e384d;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #e1e4ea;
          }
          .header {
            background: linear-gradient(135deg, #3B3FA0 0%, #4F6DF5 100%);
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            font-family: Georgia, serif;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 40px 30px;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 11px;
            color: #8798ad;
            border-top: 1px solid #e1e4ea;
          }
          .footer a {
            color: #4F6DF5;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ink & Insight</h1>
          </div>
          <div class="content">
            ${htmlContent}
          </div>
          <div class="footer">
            <p>You received this email because you subscribed to the Ink & Insight Sunday Letter.</p>
            <p>If you wish to stop receiving these emails, you can unsubscribe at any time.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
  await transporter.sendMail(mailOptions)
}

