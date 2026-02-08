"use client";

import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to submit. Try again.");

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#800020] py-32 flex justify-center">
      <div className="w-full max-w-2xl px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white">
          Join the waitlist
        </h2>

        <p className="mt-4 text-zinc-200">
          Be the first to know when Vukara launches.
        </p>

        {submitted ? (
          <p className="mt-8 text-green-300 font-medium">
            Thanks! You’re on the waitlist ✨
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-black"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-black text-white rounded-xl transition hover:bg-[#e6d6c3] hover:text-black ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Join the Waitlist"}
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-red-300">{error}</p>}
      </div>
    </section>
  );
}
