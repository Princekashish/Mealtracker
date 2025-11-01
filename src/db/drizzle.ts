import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DB is not connected");
}

const db = drizzle(process.env.DATABASE_URL, { schema });
export default db;
