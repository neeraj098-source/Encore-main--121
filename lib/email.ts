import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    // Log link in development for debugging
    if (process.env.NODE_ENV === 'development') {
        console.log('====================================================');
        console.log(`[DEV] Verification Link for ${email} (via SMTP):`);
        console.log(verificationLink);
        console.log('====================================================');
    }

    // Check for SMTP credentials
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.error("Missing SMTP Credentials in .env");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.mailersend.net",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Encore" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`, // sender address
            to: email, // list of receivers
            subject: "Verify your email", // Subject line
            text: `Please verify your email via this link: ${verificationLink}`, // plain text body
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify your email address</h2>
            <p>Thanks for signing up! Please verify your email address by clicking the link below:</p>
            <p>
                <a href="${verificationLink}" style="display: inline-block; background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
            </p>
            <p style="color: #666; font-size: 14px;">If the button doesn't work, verify using this link: <br> <a href="${verificationLink}">${verificationLink}</a></p>
        </div>
      `, // html body
        });

        console.log(`Verification email sent to ${email} via SMTP. MessageId: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email via SMTP:", error);
    }
}
