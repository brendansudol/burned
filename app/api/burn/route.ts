// app/api/burn/route.ts
//
// POST { topic: string, avoid?: string[] }
//   -> 200 BurnResult | 400 invalid | 422 topic rejected by gate
//      429 rate limited | 500 pipeline failure

import { NextRequest, NextResponse } from "next/server";
import { roast } from "@/lib/pipeline";

export const runtime = "nodejs";
export const maxDuration = 60; // generation can take ~10s; give headroom

// ── Rate limiting ────────────────────────────────────────────────────────────
// Naive in-memory sliding window: fine for a toy on a single instance.
// On serverless/multi-instance deploys this resets per instance — swap for
// @upstash/ratelimit (or similar) before sharing the URL widely.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Easy there, arsonist. Wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: { topic?: unknown; avoid?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Send JSON." }, { status: 400 });
  }

  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  if (!topic || topic.length > 120) {
    return NextResponse.json(
      { error: "Give me a topic — up to 120 characters." },
      { status: 400 }
    );
  }

  const avoid = Array.isArray(body.avoid)
    ? body.avoid.filter((a): a is string => typeof a === "string").slice(0, 24)
    : undefined;

  try {
    const out = await roast(topic, { avoid });
    if (!out.ok) {
      return NextResponse.json({ error: out.reason }, { status: 422 });
    }
    // exemplarSlugs is debug info — log it server-side, don't ship it.
    const { exemplarSlugs, ...result } = out.result;
    console.log(`[burn] topic="${result.topic}" exemplars=${exemplarSlugs.join(",")}`);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[burn] pipeline failure:", err);
    return NextResponse.json(
      { error: "The writers' room caught fire. Try again." },
      { status: 500 }
    );
  }
}
