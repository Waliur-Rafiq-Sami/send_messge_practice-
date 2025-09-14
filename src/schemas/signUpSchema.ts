import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 character")
  .max(20, "Username must be no more then 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 character" })
    .max(20, { message: "Password must be no more than 20 character" })
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must contain at least one uppercase one lowercase, one number, and one special character"
    ),
});

// ^(?=.*[A-Z]) → at least one uppercase letter
// (?=.*[a-z]) → at least one lowercase letter
// (?=.*\d) → at least one digit
// (?=.*[\W_]) → at least one special character
// .+$ → ensures at least one character (after applying all rules)
