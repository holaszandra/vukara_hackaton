import { auth } from "@/auth";
import pool from "@/lib/db";

export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      displayName,
      skillArea,
      applicationLetter,
      resumeBase64,
      resumeFilename,
      resumeMimetype,
      linkedinUrl,
      portfolioUrl,
    } = body;

    if (!displayName || !skillArea || !applicationLetter || !resumeBase64) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resumeBuffer = Buffer.from(resumeBase64, "base64");
    if (resumeBuffer.length > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Resume file too large (max 5MB)" },
        { status: 400 }
      );
    }

    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
    ];
    if (!allowedMimeTypes.includes(resumeMimetype)) {
      return Response.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Upsert user record
    const userResult = await pool.query(
      `INSERT INTO users (google_id, name, email, image_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_id) DO UPDATE SET name = $2, image_url = $4
       RETURNING id`,
      [session.user.id, session.user.name, session.user.email, session.user.image]
    );
    const userId = userResult.rows[0].id;

    // Insert skill application
    await pool.query(
      `INSERT INTO skill_applications
        (user_id, display_name, resume_filename, resume_mimetype, resume_data,
         linkedin_url, portfolio_url, skill_area, application_letter)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        displayName,
        resumeFilename,
        resumeMimetype,
        resumeBuffer,
        linkedinUrl || null,
        portfolioUrl || null,
        skillArea,
        applicationLetter,
      ]
    );

    return Response.json(
      { message: "Application submitted successfully", name: displayName },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === "23505") {
      return Response.json(
        { error: "You already have an active application for this creator" },
        { status: 409 }
      );
    }
    console.error("Skill application error:", err);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
