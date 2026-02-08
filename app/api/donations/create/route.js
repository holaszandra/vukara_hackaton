import { auth } from "@/auth";
import pool from "@/lib/db";

export async function POST(req) {
  const session = await auth();

  try {
    const body = await req.json();
    const { amount, currency, frequency, isPublic, isGuest } = body;

    // Validation
    if (!amount || amount < 1) {
      return Response.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }
    if (!["one-time", "monthly"].includes(frequency)) {
      return Response.json(
        { error: "Invalid frequency" },
        { status: 400 }
      );
    }

    // If not guest, require auth
    if (!isGuest && !session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId = null;

    // Upsert user record for authenticated users
    if (!isGuest && session?.user) {
      const userResult = await pool.query(
        `INSERT INTO users (google_id, name, email, image_url)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (google_id) DO UPDATE SET name = $2, image_url = $4
         RETURNING id`,
        [
          session.user.id,
          session.user.name,
          session.user.email,
          session.user.image,
        ]
      );
      userId = userResult.rows[0].id;
    }

    const amountCents = Math.round(amount * 100);

    await pool.query(
      `INSERT INTO donations
        (user_id, donor_name, donor_email, is_guest, amount_cents, currency, frequency, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId,
        isGuest ? "Anonymous" : session?.user?.name,
        isGuest ? null : session?.user?.email,
        isGuest,
        amountCents,
        currency || "EUR",
        frequency,
        isPublic || false,
      ]
    );

    return Response.json(
      { message: "Donation recorded successfully", amount, frequency },
      { status: 201 }
    );
  } catch (err) {
    console.error("Donation error:", err);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
