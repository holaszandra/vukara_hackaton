import { auth } from "@/auth";
import pool from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user ID from google_id
    const userResult = await pool.query(
      `SELECT id FROM users WHERE google_id = $1`,
      [session.user.id]
    );

    if (userResult.rows.length === 0) {
      return Response.json({ donations: [], stats: { totalBacked: 0, thisMonth: 0, activeRecurring: 0, buildersSupported: 0, subscriptionCount: 0 } });
    }

    const userId = userResult.rows[0].id;

    // Fetch all donations for this user
    const donationsResult = await pool.query(
      `SELECT id, amount_cents, currency, frequency, is_public, status, created_at, creator_slug
       FROM donations
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    // Compute stats
    const donations = donationsResult.rows;

    const totalBacked = donations.reduce((sum, d) => sum + d.amount_cents, 0);

    // This month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = donations
      .filter((d) => new Date(d.created_at) >= startOfMonth)
      .reduce((sum, d) => sum + d.amount_cents, 0);

    // Active recurring (monthly donations)
    const monthlyDonations = donations.filter((d) => d.frequency === "monthly");
    const activeRecurring = monthlyDonations.reduce((sum, d) => sum + d.amount_cents, 0);
    const subscriptionCount = monthlyDonations.length;

    // Unique builders
    const uniqueBuilders = new Set(donations.map((d) => d.creator_slug));

    return Response.json({
      donations: donations.map((d) => ({
        id: d.id,
        amount: d.amount_cents / 100,
        currency: d.currency,
        frequency: d.frequency,
        isPublic: d.is_public,
        status: d.status,
        createdAt: d.created_at,
        creatorSlug: d.creator_slug,
      })),
      stats: {
        totalBacked: totalBacked / 100,
        thisMonth: thisMonth / 100,
        activeRecurring: activeRecurring / 100,
        buildersSupported: uniqueBuilders.size,
        subscriptionCount,
      },
    });
  } catch (err) {
    console.error("Donations list error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
