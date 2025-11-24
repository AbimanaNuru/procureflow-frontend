import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const newRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(2000, { message: "Description must be less than 2000 characters" }),
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  proforma: z
    .instanceof(File, { message: "Proforma document is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine(
      (file) =>
        ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(
          file.type
        ),
      {
        message: "File must be PDF, JPG, or PNG",
      }
    ),
});

export const approveRejectSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, { message: "Comment is required" })
    .max(500, { message: "Comment must be less than 500 characters" }),
});

export const receiptSchema = z.object({
  receipt: z
    .instanceof(File, { message: "Receipt is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine(
      (file) =>
        ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(
          file.type
        ),
      {
        message: "File must be PDF, JPG, or PNG",
      }
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type NewRequestInput = z.infer<typeof newRequestSchema>;
export type ApproveRejectInput = z.infer<typeof approveRejectSchema>;
export type ReceiptInput = z.infer<typeof receiptSchema>;
