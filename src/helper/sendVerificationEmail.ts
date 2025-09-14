import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "@/lib/resend";

export async function sentVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", //defaults
      to: email,
      subject: "todo | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}

// react is in this context
// This is not standard React usage in the browser.
// The react property is part of Resend API (or similar email-sending libraries that support React).
// It allows you to pass a React component, which will be rendered to HTML and sent as the email body.

// How it works
// VerificationEmail({ username, otp: verifyCode }) is a React component you wrote for the email.
// Resend takes this component and renders it to HTML using something like ReactDOMServer.renderToStaticMarkup.
// The generated HTML becomes the email content that is sent to the user.
