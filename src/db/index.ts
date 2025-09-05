import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// Use the connection string directly instead of the neon function
export const db = drizzle(process.env.DATABASE_URL!, { schema });