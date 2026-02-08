import { auth } from "@/auth";
import pool from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ hasApplication: false });
  }

  try {
    const result = await pool.query(
      `SELECT sa.id, sa.status, sa.created_at
       FROM skill_applications sa
       JOIN users u ON sa.user_id = u.id
       WHERE u.google_id = $1 AND sa.creator_slug = 'senamile-zungu'
         AND sa.status NOT IN ('rejected')
       LIMIT 1`,
      [session.user.id]
    );

    return Response.json({
      hasApplication: result.rows.length > 0,
      application: result.rows[0] || null,
    });
  } catch (err) {
    console.error("Check application error:", err);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
