import { z } from "zod";

type TFunc = (key: string, options?: any) => string;

export const getPlanSchema = (t: TFunc) => z.object({
  name: z.string().min(1, t("validation.required")),
  nameEn: z.string().min(1, t("validation.required")),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0, t("validation.required")),
  currencyId: z.string().min(1, t("validation.required")),
  duration: z.coerce.number().min(1, t("validation.min", { count: 1 })),
  sessionsCount: z.coerce.number().min(0),
  sessionTime: z.coerce.number().min(1, t("validation.required")),
  planType: z.enum(['single', 'group']),
  studentsNum: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 2, "There must be at least 2 students for a group plan"),
  features: z.array(z.string()).optional().default([]),
  color: z.string().optional().default('#3b82f6'),
  isPopular: z.boolean(),
  status: z.enum(['active', 'inactive']),
});

export type PlanFormData = z.infer<ReturnType<typeof getPlanSchema>>;