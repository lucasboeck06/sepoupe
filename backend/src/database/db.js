import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
  password: process.env.DBPASS,
});

pool.on("error", (erro) => {
  console.error("Erro inesperado de uma conexão ociosa no Postgres", erro);
});
