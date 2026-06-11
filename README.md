# BURNED.

A roast machine. Type a topic, get a late-night-style burn delivered on a cue
card, kicker line ignites. Targets are things, not people.

## How it works

```
topic ──▶ POST /api/burn
            │
            ├─ rate limit (8/min/IP, in-memory)
            │
            ├─ classifyTopic()        claude-haiku-4-5 (pinned snapshot)
            │    content gate + bucket + normalized topic
            │    (topic sanitized + tag-wrapped: treated as inert data)
            │
            ├─ selectExemplars()      coverage-greedy pick of 3 few-shots
            │    from the bucket-matched bank (lib/exemplars.ts)
            │
            ├─ generateBurn()         claude-sonnet-4-6 (BURN_MODEL to override)
            │    structured output: kicker brainstorm ▶ chosen kicker ▶ burn
            │    returns angles_used for the re-roll avoid-list
            │
            └─ auditBurn()            claude-haiku-4-5, checks the OUTPUT
                 fail ▶ regenerate once with the auditor's reason as feedback
                 fail again ▶ friendly rejection. Calibrated so meanness
                 toward things never fails — only real-person targets,
                 protected-class punchlines, slurs, or sexual/graphic content.
```

The quality system is the few-shot bank: 47 corpus exemplars tagged with
`{bucket, opener, moves[]}` across 8 topic categories. Selection greedily
maximizes opener/move diversity so the model always sees a menu of techniques.
The generation call forces a kicker-pun brainstorm *before* writing, because
the closing pun is the part a single unstructured sample most often flubs.

"Burn it again" passes the previous takes' `anglesUsed` back as an avoid-list,
so re-rolls explore instead of converging.

## Setup

```bash
npm install
cp .env.example .env.local         # add your ANTHROPIC_API_KEY

# Build the few-shot corpus (one-time):
#   1. Save the source burns to data/corpus.txt
#      (title line + joke per block, blank line between blocks)
#   2. Parse it:
npm run corpus
#      Expect: "All exemplar slugs resolved. ✓"

npm run dev
```

The corpus files are gitignored on purpose — the source material is
professional TV writing, so keep it local. Longer term, replace the bank with
your own favorite generated outputs (self-distillation): update the slugs in
`lib/exemplars.ts` and rebuild `corpus.json`.

## Files

```
app/page.tsx              UI: input, loading bit, typewriter cue card
app/layout.tsx            fonts: Anton / Courier Prime / Archivo
app/globals.css           token system + cue card + igniting kicker
app/api/burn/route.ts     validation, rate limit, pipeline call
lib/exemplars.ts          curated few-shot bank + coverage-greedy selection
lib/pipeline.ts           classify gate ▶ few-shot render ▶ generation
scripts/build-corpus.ts   corpus.txt ▶ corpus.json (slug-keyed)
```

## Before sharing the URL

- Swap the in-memory rate limiter for Upstash (it resets per serverless
  instance as-is).
- Log `{topic, exemplarSlugs, anglesUsed, burn}` somewhere queryable, and add
  a 🔥/💀 vote — that's labeled data for tuning later.
- If quality feels inconsistent, bolt best-of-3 onto `generateBurn`: run it
  in parallel, have a cheap judge pick (rubric: truth core, specificity,
  comparison distance, kicker bridge). It slots in without touching anything
  else.
- Seed `selectExemplars`' rng with `topic + attempt` if you want re-rolls to
  rotate few-shots too.
