import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
});
