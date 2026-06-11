"use client";

// app/page.tsx — the stage.
//
// Flow: type a topic -> POST /api/burn -> typewriter the burn onto the cue
// card -> kicker line ignites. "Burn it again" re-rolls the same topic with
// an accumulated avoid-list so each take explores new angles.

import { useEffect, useRef, useState } from "react";

interface BurnResponse {
  topic: string;
  burn: string;
  kicker: string;
  anglesUsed: string[];
}

type Status = "idle" | "burning" | "done" | "rejected" | "error";

const LOADING_LINES = [
  "Gathering kindling…",
  "Warming up the writers' room…",
  "Consulting the burn unit…",
  "Workshopping the kicker…",
  "Striking the match…",
];

const SAMPLE_TOPICS = [
  "ketchup",
  "golf",
  "farmers markets",
  "group chats",
  "office thermostats",
];

/** Split the burn into [body, kickerSentence] so the last line can ignite. */
function splitKicker(burn: string): [string, string] {
  const idx = burn.toLowerCase().lastIndexOf("you're burned");
  if (idx < 0) return [burn, ""];
  const pre = burn.slice(0, idx);
  let start = 0;
  const re = /[.!?…]["')\]]*\s+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(pre)) !== null) start = m.index + m[0].length;
  return [burn.slice(0, start), burn.slice(start)];
}

export default function Page() {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<BurnResponse | null>(null);
  const [typed, setTyped] = useState(0);
  const [loadingLine, setLoadingLine] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const lastTopic = useRef<string>("");
  const avoid = useRef<string[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Rotate the loading bit while burning.
  useEffect(() => {
    if (status !== "burning") return;
    setLoadingLine(0);
    const id = setInterval(
      () => setLoadingLine((i) => (i + 1) % LOADING_LINES.length),
      1400
    );
    return () => clearInterval(id);
  }, [status]);

  // Typewriter reveal.
  const [body, kicker] = result ? splitKicker(result.burn) : ["", ""];
  const full = body + kicker;

  useEffect(() => {
    if (status !== "done" || !result) return;
    if (reducedMotion) {
      setTyped(result.burn.length);
      return;
    }
    setTyped(0);
    const id = setInterval(() => {
      setTyped((n) => {
        if (n >= result.burn.length) {
          clearInterval(id);
          return n;
        }
        return n + 2;
      });
    }, 18);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, status, reducedMotion]);

  async function ignite(t: string, avoidList: string[]) {
    setStatus("burning");
    setResult(null);
    setError("");
    setCopied(false);
    try {
      const res = await fetch("/api/burn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t, avoid: avoidList }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went sideways.");
        setStatus(res.status === 422 ? "rejected" : "error");
        return;
      }
      const out = data as BurnResponse;
      setResult(out);
      setStatus("done");
      avoid.current = [
        ...avoidList,
        ...(out.anglesUsed ?? []),
        out.kicker,
      ].filter(Boolean);
    } catch {
      setError("The writers' room caught fire. Try again.");
      setStatus("error");
    }
  }

  function submit(raw?: string) {
    const t = (raw ?? topic).trim();
    if (!t || status === "burning") return;
    if (raw) setTopic(raw);
    const fresh = t.toLowerCase() !== lastTopic.current.toLowerCase();
    if (fresh) avoid.current = [];
    lastTopic.current = t;
    void ignite(t, avoid.current);
  }

  async function copyBurn() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.topic}: ${result.burn}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable; nothing to do */
    }
  }

  const shown = Math.min(typed, full.length);
  const bodyShown = full.slice(0, Math.min(shown, body.length));
  const kickerShown = shown > body.length ? full.slice(body.length, shown) : "";
  const fullyTyped = shown >= full.length;

  return (
    <main className="stage">
      <header className="masthead">
        <h1>
          Burned<span className="spark">.</span>
        </h1>
        <p>Name a thing. Watch it go up.</p>
      </header>

      <div className="ignition">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="ketchup, golf, the office thermostat…"
          maxLength={120}
          aria-label="Topic to roast"
          disabled={status === "burning"}
        />
        <button
          className="btn-primary"
          onClick={() => submit()}
          disabled={status === "burning" || !topic.trim()}
        >
          {status === "burning" ? "Burning…" : "Burn it"}
        </button>
      </div>

      {status === "idle" && (
        <div className="kindling">
          <span>Kindling:</span>
          {SAMPLE_TOPICS.map((t) => (
            <button key={t} className="chip" onClick={() => submit(t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {status === "burning" && (
        <section className="cue-card" aria-live="polite">
          <p className="eyebrow">In the writers&apos; room</p>
          <p className="script">{LOADING_LINES[loadingLine]}</p>
        </section>
      )}

      {status === "done" && result && (
        <>
          <section className="cue-card">
            <p className="eyebrow">Tonight&apos;s target</p>
            <h2 className="target">{result.topic}</h2>
            <p className="script" aria-hidden="true">
              {bodyShown}
              {kickerShown && (
                <span className={`kicker${fullyTyped ? " lit" : ""}`}>
                  {kickerShown}
                </span>
              )}
              {!fullyTyped && <span className="caret" />}
            </p>
            <p className="sr-only">{result.burn}</p>
          </section>
          <div className="after">
            <button
              className="btn-primary"
              onClick={() => ignite(lastTopic.current, avoid.current)}
            >
              Burn it again
            </button>
            <button className="btn-ghost" onClick={copyBurn}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </>
      )}

      {(status === "rejected" || status === "error") && (
        <section className="cue-card" role="alert">
          <p className="eyebrow">
            {status === "rejected" ? "No dice" : "Technical difficulties"}
          </p>
          <p className="script">{error}</p>
        </section>
      )}

      <footer className="colophon">
        Targets are things, not people. Burns are AI-written.
      </footer>
    </main>
  );
}
