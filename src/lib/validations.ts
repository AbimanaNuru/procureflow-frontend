import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username is required" })
    .max(150, { message: "Username must be less than 150 characters" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const requestItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Item name is required" })
    .max(200, { message: "Item name must be less than 200 characters" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Item description is required" })
    .max(500, { message: "Item description must be less than 500 characters" }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be a positive number" }),
  unit_price: z
    .string()
    .min(1, { message: "Unit price is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Unit price must be a positive number",
    }),
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
  items: z
    .array(requestItemSchema)
    .min(1, { message: "At least one item is required" }),
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

export const purchaseOrderSchema = z.object({
  vendor: z.string().trim().min(1, { message: "Vendor is required" }),
  vendor_name: z.string().trim().min(1, { message: "Vendor name is required" }),
  vendor_address: z.string().trim().min(1, { message: "Vendor address is required" }),
  payment_terms: z.string().trim().min(1, { message: "Payment terms are required" }),
  notes: z.string().trim().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RequestItemInput = z.infer<typeof requestItemSchema>;
export type NewRequestInput = z.infer<typeof newRequestSchema>;
export type ApproveRejectInput = z.infer<typeof approveRejectSchema>;
export type ReceiptInput = z.infer<typeof receiptSchema>;
export type PurchaseOrderInput = z.infer<typeof purchaseOrderSchema>;
