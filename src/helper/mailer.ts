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

export const sendMail = async (props: EmailProps) => {
  try {
    // Generate access token
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    if (!accessToken) {
      throw new Error("Failed to retrieve access token");
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
        accessToken: accessToken,
      },
    });

    // Verify connection configuration
    await new Promise<void>((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("Transporter verification failed:", error);
          reject(error);
        } else {
          console.log("Transporter verified successfully:", success);
          resolve();
        }
      });
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
    await new Promise<void>((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
        } else {
          console.log("Email sent successfully:", info);
          resolve();
        }
      });
    });

    console.log("Email sending process completed");
  } catch (error) {
   
    if(error instanceof Error)
    {
      console.error("Error occurred during email sending:", error.message || error);
      throw error;
    }
  }
};
