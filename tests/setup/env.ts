import { resolve } from "node:path";
import { config } from "dotenv";

// Load Next-style env files for Vitest runs.
config({ path: resolve(process.cwd(), ".env.local"), override: false });
config({ path: resolve(process.cwd(), ".env"), override: false });
