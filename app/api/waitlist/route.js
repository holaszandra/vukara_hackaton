import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req) {

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const query = `
      INSERT INTO waitlist (email)
      VALUES ($1)
      ON CONFLICT (email) DO NOTHING
    `;

    await pool.query(query, [email]);

    return new Response(JSON.stringify({ message: "Successfully added to waitlist" }), { status: 200 });
  } catch (err) {
    console.error("Waitlist POST error:", err.message); // <-- log error message
    console.error(err); // <-- full error
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
