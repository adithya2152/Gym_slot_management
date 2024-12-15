import nodemailer from "nodemailer";
import { google } from "googleapis";

// Environment variables
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN!;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

type EmailProps = {
  email: string;
  subject: string;
  text: string;
  html: string;
};

// Single function to send email
export const sendMail = async (props: EmailProps) => {
  try {
    // Generate access token
    const accessToken = await oAuth2Client.getAccessToken();

    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // Configure transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL port
      secure: true, // Use SSL
      auth: {
        type: "OAuth2",
        user: "adithyabharadwaj15@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token as string,
      },
    });

    // Email options
    const mailOptions = {
      from: "ABC THE GREAT <adithyabharadwaj15@gmail.com>",
      to: props.email,
      subject: props.subject,
      text: props.text,
      html: props.html,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
