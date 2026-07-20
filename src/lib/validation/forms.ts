import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  clientType: z.enum(["individual", "business"]).default("individual"),
  company: z.string().max(160).optional().or(z.literal("")),
  serviceInterest: z.string().max(160).optional().or(z.literal("")),
  message: z.string().max(5000).optional().or(z.literal("")),
  timeline: z.string().max(120).optional().or(z.literal("")),
  preferredContact: z.enum(["email", "phone", "either"]).default("either"),
  consent: z.literal(true, {
    message: "Consent is required to submit this form.",
  }),
  honeypot: z.string().max(0).optional().or(z.literal("")),
  formType: z
    .enum(["consultation", "contact", "service", "calculator"])
    .default("consultation"),
  leadSource: z.string().max(120).optional(),
  landingPage: z.string().max(300).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  turnstileToken: z.string().optional(),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().max(120).optional().or(z.literal("")),
  consent: z.literal(true, {
    message: "Consent is required.",
  }),
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export const mortgageCalcSchema = z.object({
  principal: z.coerce.number().positive().max(50_000_000),
  annualRatePercent: z.coerce.number().min(0).max(30),
  amortizationYears: z.coerce.number().min(1).max(40),
  frequency: z.enum([
    "monthly",
    "biweekly",
    "accelerated-biweekly",
    "weekly",
    "accelerated-weekly",
  ]),
});

export const coverageCalcSchema = z.object({
  annualIncome: z.coerce.number().min(0).max(10_000_000),
  incomeReplacementYears: z.coerce.number().min(0).max(50),
  outstandingDebt: z.coerce.number().min(0).max(50_000_000),
  educationGoal: z.coerce.number().min(0).max(5_000_000),
  existingCoverage: z.coerce.number().min(0).max(50_000_000),
  finalExpenseEstimate: z.coerce.number().min(0).max(500_000),
});
