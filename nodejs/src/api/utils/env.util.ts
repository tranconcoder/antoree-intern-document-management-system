import path from "path";
import { NODE_ENV } from "../configs/env.config";
import dotenv from "dotenv";

export const loadEnv = () => {
  const envFileName = path.join(__dirname, `../../../.env.${NODE_ENV}`);

  dotenv.config({ path: envFileName });
};
