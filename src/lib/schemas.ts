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

export const SupportJSONSchema = zodToJsonSchema(SupportZod);

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

export function safeJson<T>(s: string): { ok: true; data: T } | { ok: false; error: string } {
  try {
    return { ok: true, data: JSON.parse(s) as T };
  }
  catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'parse failed' };
  }
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
  issues?: Array<{ path: (string | number)[]; message: string; code: string }>;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  processingTime?: number;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface ParsedResult {
  sentiment?: string;
  department?: string;
  priority?: string;
  reply?: string;
  confidence: number;
  errors: string[];
  method: 'manual' | 'regex';
}

export function parseManually(text: string): ParsedResult {
  const errors: string[] = [];
  let confidence = 0.2;
  
  let sentiment: string | undefined;
  const lowerText = text.toLowerCase();
  if (lowerText.includes('sorry') || lowerText.includes('apologize') || lowerText.includes('understand') || lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('delay') || lowerText.includes('frustrating') || lowerText.includes('unprofessional')) {
    sentiment = 'negative';
    confidence += 0.15;
  } else if (lowerText.includes('thank') || lowerText.includes('great') || lowerText.includes('excellent') || lowerText.includes('appreciate') || lowerText.includes('wonderful') || lowerText.includes('happy')) {
    sentiment = 'positive';
    confidence += 0.15;
  } else {
    sentiment = 'neutral';
    if (!lowerText.includes('hello') && !lowerText.includes('hi') && !lowerText.includes('help')) {
      errors.push('Sentiment unclear without obvious indicators');
      confidence -= 0.05;
    } else {
      confidence += 0.1;
    }
  }

  let department: string | undefined;
  if (lowerText.includes('order') || lowerText.includes('purchase') || lowerText.includes('buy') || lowerText.includes('#') || lowerText.includes('cart')) {
    department = 'online_ordering';
    confidence += 0.15;
  } else if (lowerText.includes('ship') || lowerText.includes('delivery') || lowerText.includes('track') || lowerText.includes('package') || lowerText.includes('expedite')) {
    department = 'shipping_and_delivery';
    confidence += 0.15;
  } else if (lowerText.includes('quality') || lowerText.includes('defect') || lowerText.includes('broken') || lowerText.includes('damaged') || lowerText.includes('faulty')) {
    department = 'product_quality';
    confidence += 0.15;
  } else {
    department = 'customer_support';
    if (!lowerText.includes('help') && !lowerText.includes('support') && !lowerText.includes('question')) {
      errors.push('No specific department indicators found');
      confidence -= 0.1;
    } else {
      confidence += 0.05;
    }
  }

  let priority: string | undefined;
  if (lowerText.includes('urgent') || lowerText.includes('urgently') || lowerText.includes('asap') || lowerText.includes('immediately') || lowerText.includes('tomorrow') || lowerText.includes('today') || lowerText.includes('emergency')) {
    priority = 'high';
    confidence += 0.2;
  } else if (lowerText.includes('when possible') || lowerText.includes('no rush') || lowerText.includes('whenever') || lowerText.includes('eventually')) {
    priority = 'low';
    confidence += 0.15;
  } else {
    priority = 'medium';
    if (text.length < 30) {
      errors.push('Too little context to determine priority');
      confidence -= 0.05;
    } else {
      confidence += 0.05;
    }
  }

  let reply = '';
  const lowerCaseText = text.toLowerCase();
  const replyKeyword = 'reply:';
  const replyIndex = lowerCaseText.indexOf(replyKeyword);

  if (replyIndex !== -1) {
    reply = text.substring(replyIndex + replyKeyword.length).trim();
    confidence += 0.3;
  } else {
    const paragraphs = text.split('\n\n');
    if (paragraphs.length > 1) {
      reply = paragraphs.reduce((longest, current) => current.length > longest.length ? current : longest, '');
      errors.push("Used fallback paragraph extraction; result may be imprecise.");
      confidence += 0.1;
    } else {
      reply = text;
      errors.push("Failed to find a clear reply section.");
      confidence = 0.1;
    }
  }

  return {
    sentiment,
    department,
    priority,
    reply,
    confidence: Math.max(0.1, Math.min(confidence, 0.9)),
    errors,
    method: 'manual'
  };
}

export function parseWithRegex(llmText: string): ParsedResult {
  const errors: string[] = [];
  let confidence = 0.3;
  
  const RE_CODEFENCE_REPLY = /```(?:reply|text|markdown)?\s*([\s\S]*?)```/i;
  const RE_TAG_REPLY = /\[reply\]\s*([\s\S]*?)\s*\[\/reply\]/i;
  const RE_XML_REPLY = /<reply[^>]*>\s*([\s\S]*?)\s*<\/reply>/i;
  const RE_LABEL_PROPOSED =
    /(?:^|\n)[ \t]*?(?:proposed\s+reply|customer\s+reply|final\s+reply)\s*:\s*([\s\S]+?)(?:\n{2,}|$)/i;
  const RE_MARKER_REPLY = /reply\s*start[\s\S]*?\n([\s\S]*?)\n[\s\S]*?reply\s*end/i;

  const patterns = [
    { re: RE_CODEFENCE_REPLY, confidenceBoost: 0.5 },
    { re: RE_TAG_REPLY, confidenceBoost: 0.6 },
    { re: RE_XML_REPLY, confidenceBoost: 0.5 },
    { re: RE_LABEL_PROPOSED, confidenceBoost: 0.4 },
    { re: RE_MARKER_REPLY, confidenceBoost: 0.4 },
  ];

  let reply = "";

  function cleanReply(s: string) {
    return s
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/^[ \t]*([>*-]\s*)+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  for (const pattern of patterns) {
    const m = pattern.re.exec(llmText);
    if (m && m[1]) {
      reply = cleanReply(m[1]);
      confidence += pattern.confidenceBoost;
      break;
    }
  }

  if (!reply) {
    const para = llmText
      .split(/\n{2,}/)
      .map(s => s.trim())
      .find(s => /[.!?]["’”)]?\s*$/.test(s) && s.length > 40);
    if (para) {
      reply = cleanReply(para);
      confidence += 0.2;
      errors.push("Used fallback paragraph extraction; result may be imprecise.");
    } else {
      reply = llmText;
      errors.push("Failed to extract a specific reply block.");
      confidence = 0.1;
    }
  }

  let sentiment: string | undefined;
  if (/\b(negative|frustrated|angry|disappointed)\b/i.test(llmText)) {
    sentiment = 'negative';
  } else if (/\b(positive|happy|pleased|satisfied)\b/i.test(llmText)) {
    sentiment = 'positive';
  } else {
    sentiment = 'neutral';
  }

  let department: string | undefined;
  if (/\b(shipping|logistics|delivery)\b/i.test(llmText)) {
    department = 'shipping_and_delivery';
  } else if (/\b(order|ordering|purchase)\b/i.test(llmText)) {
    department = 'online_ordering';
  } else if (/\b(quality|defect|broken)\b/i.test(llmText)) {
    department = 'product_quality';
  } else {
    department = 'customer_support';
  }

  let priority: string | undefined;
  if (/\b(high|urgent|critical|immediately)\b/i.test(llmText)) {
    priority = 'high';
  } else if (/\b(low|non-urgent)\b/i.test(llmText)) {
    priority = 'low';
  } else {
    priority = 'medium';
  }

  return {
    sentiment,
    department,
    priority,
    reply,
    confidence: Math.min(confidence, 0.95),
    errors,
    method: 'regex'
  };
}