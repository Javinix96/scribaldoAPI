// import pkg from "pg";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
// "postgresql://postgres:FksNA86Jm3KppEy9@db.feflkuqdrbwwpmggtgoe.supabase.co:5432/postgres";
const pool = postgres(connectionString, {
  ssl: "require",
});

export default pool;

// const { Pool } = pkg;

// const pool = new Pool({
//   host: "db.feflkuqdrbwwpmggtgoe.supabase.co",
//   port: 5432,
//   user: "postgres",
//   password: "FksNA86Jm3KppEy9",
//   database: "postgres",
//   ssl: {
//     rejectUnauthorized: false, // Necesario para Supabase
//   },
// });

// export default pool;
