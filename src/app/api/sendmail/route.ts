import { sendMail } from "@/helper/mailer";

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(request: Request) {
  try {
    const credentials = await request.json();
    const { email, otp } = credentials;

    console.log("Received", email, otp);

    // Validate email format
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, statusText: "Bad Request" }
      );
    }

    // Send the email
    await sendMail({
      email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    });

    console.log("Email sent successfully");
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, statusText: "OK" }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
