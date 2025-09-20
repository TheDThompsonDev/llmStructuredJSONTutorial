import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const SupportZod = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]).describe("Overall sentiment"),
  department: z.enum([
    "customer_support",
    "online_ordering", 
    "product_quality",
    "shipping_and_delivery",
    "other_off_topic",
  ]).describe("Routing bucket"),
  reply: z.string().min(1).describe("Polite, helpful reply"),
  confidence: z.number().min(0).max(1).describe("Confidence score for classification"),
  priority: z.enum(["low", "medium", "high"]).describe("Urgency level"),
});

export type Support = z.infer<typeof SupportZod>;

// Auto-generate JSON Schema from Zod (eliminates duplication)
export const SupportJSONSchema = zodToJsonSchema(SupportZod, "support");

// Department configurations for visualization
export const DEPARTMENTS = {
  customer_support: {
    name: "Customer Support",
    color: "bg-blue-500",
    icon: "👥",
    description: "General inquiries and account issues"
  },
  online_ordering: {
    name: "Online Ordering", 
    color: "bg-green-500",
    icon: "🛒",
    description: "Order placement and checkout issues"
  },
  product_quality: {
    name: "Product Quality",
    color: "bg-yellow-500", 
    icon: "⭐",
    description: "Product defects and quality concerns"
  },
  shipping_and_delivery: {
    name: "Shipping & Delivery",
    color: "bg-purple-500",
    icon: "📦",
    description: "Delivery tracking and shipping issues"
  },
  other_off_topic: {
    name: "Other/Off-topic",
    color: "bg-gray-500",
    icon: "❓",
    description: "Unrelated or unclear messages"
  }
} as const;

export type DepartmentKey = keyof typeof DEPARTMENTS;