import { z } from "zod";

const serverEnvSchema = z.object({
  ACRU_API_URL: z.string().url().default("http://localhost:4000"),
  ACRU_WEB_SERVICE_TOKEN: z.string().min(1).optional(),
  ACRU_ENVIRONMENT: z.enum(["development", "test", "staging", "production"]).default("development")
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse(process.env);
}
