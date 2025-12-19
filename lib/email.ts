import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



export async function sendVerificationEmail(toEmail: string, verificationLink: string) {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Verify Your Email - AI Tools Hub",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to AI Tools Hub!</h2>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${verificationLink}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                ">
                    Verify Email
                </a>
                <p>Or copy this link: <a href="${verificationLink}">${verificationLink}</a></p>
                <p>This link expires in 24 hours.</p>
                <p>If you didn't create this account, please ignore this email.</p>
            </div>
        `
    };


    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {

        console.error("Error sending verfication email:", error);
        return false;
    }
}





export async function sendResetEmail(toEmail: string, resetLink: string) {


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Password Reset Link",
        html: `<p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
    }


    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending reset email:", error);
        return false;
    }
}