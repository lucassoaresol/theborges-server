import { z } from 'zod';

const schema = z.object({
  jwtSecret: z.string().min(2),
  port: z
    .string()
    .default('3000')
    .transform((val) => parseInt(val, 10)),
  urlApiWpp: z.string().url(),
  clientId: z.string().min(1),
});

export const env = schema.parse({
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  urlApiWpp: process.env.URL_API_WPP,
  clientId: process.env.CLIENT_ID,
});
