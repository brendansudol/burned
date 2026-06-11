// lib/exemplars.ts
//
// Curated few-shot bank for the burn generator.
//
// This file is metadata-only. Joke text lives in data/corpus.json, built from
// your source corpus by scripts/build-corpus.ts. Each `slug` is the slugified
// title from the corpus file (duplicate titles get -2, -3... in order of
// appearance — e.g. the first "Pickleball" is `pickleball`, the second is
// `pickleball-2`).
//
// Curation notes:
// - Public-figure roasts are excluded on purpose; the app gates named real
//   people out entirely (see CLASSIFY_SYSTEM in pipeline.ts).
// - The one-liner burns (Honeydew, Skittles, etc.) are excluded: they skip the
//   recognition-truth layer and coast on format — not a pattern to teach.
// - Exemplars within a bucket are chosen for MOVE DIVERSITY so any selected
//   trio demonstrates a menu of techniques, not one trick three times.

export type Bucket =
  | "food_drink"
  | "sports_fitness"
  | "holidays_traditions"
  | "places_institutions"
  | "objects_products"
  | "behaviors_people"
  | "media_culture"
  | "systems_phenomena";

export const BUCKETS: Bucket[] = [
  "food_drink",
  "sports_fitness",
  "holidays_traditions",
  "places_institutions",
  "objects_products",
  "behaviors_people",
  "media_culture",
  "systems_phenomena",
];

/** How the burn opens. */
export type Opener =
  | "redefinition" // "Let's call you what you are..." — hostile literal rebrand
  | "infomercial" // "Love X but wish it was [worse]? Try..." — sarcastic ad copy
  | "direct_challenge"; // opens by interrogating/accusing the target directly

/** Reusable attack patterns observed in the corpus. */
export type Move =
  | "x_of_y" // "you're the HPV of media" — cross-domain insult mapping
  | "logic_interrogation" // prosecute the target's design/rules/existence
  | "escalated_scene" // imagined mini-sketch pushed one beat past plausible
  | "sideburn" // a comparison victim catches collateral damage
  | "self_implication" // narrator confesses something worse about himself
  | "hyper_specificity" // proper nouns over categories
  | "dark_literal" // grim honest description of what's actually happening
  | "spelled_kicker" // pun kicker spelled out letter by letter
  | "elite_kicker"; // unusually strong domain-bridging pun ("Ken Burned")

export interface Exemplar {
  slug: string;
  bucket: Bucket;
  opener: Opener;
  moves: Move[];
}

export const EXEMPLARS: Exemplar[] = [
  // ── food_drink ────────────────────────────────────────────────────────────
  // Register: brutal ingredient-literalism, origin interrogation, texture disgust.
  { slug: "stuffing", bucket: "food_drink", opener: "redefinition", moves: ["dark_literal", "x_of_y"] },
  { slug: "oatmeal", bucket: "food_drink", opener: "infomercial", moves: ["escalated_scene", "x_of_y", "hyper_specificity"] },
  { slug: "hummus", bucket: "food_drink", opener: "redefinition", moves: ["logic_interrogation", "x_of_y"] },
  { slug: "quinoa", bucket: "food_drink", opener: "direct_challenge", moves: ["x_of_y", "hyper_specificity"] },
  { slug: "wedge-salads", bucket: "food_drink", opener: "direct_challenge", moves: ["logic_interrogation", "escalated_scene"] },
  { slug: "eggnog", bucket: "food_drink", opener: "direct_challenge", moves: ["logic_interrogation", "self_implication"] },

  // ── sports_fitness ────────────────────────────────────────────────────────
  // Register: who-plays-this demographics, rules-logic prosecution, injury scenes.
  { slug: "pickleball", bucket: "sports_fitness", opener: "direct_challenge", moves: ["logic_interrogation", "hyper_specificity", "escalated_scene"] },
  { slug: "water-polo", bucket: "sports_fitness", opener: "direct_challenge", moves: ["x_of_y", "escalated_scene", "hyper_specificity"] },
  { slug: "tennis", bucket: "sports_fitness", opener: "redefinition", moves: ["logic_interrogation", "hyper_specificity"] },
  { slug: "pilates", bucket: "sports_fitness", opener: "direct_challenge", moves: ["logic_interrogation", "self_implication"] },
  { slug: "elliptical-machines", bucket: "sports_fitness", opener: "infomercial", moves: ["x_of_y", "logic_interrogation"] },
  { slug: "marathons", bucket: "sports_fitness", opener: "direct_challenge", moves: ["x_of_y", "self_implication", "hyper_specificity"] },

  // ── holidays_traditions ───────────────────────────────────────────────────
  // Register: dark literal reading of the ritual + family-dynamics specificity.
  { slug: "gender-reveals", bucket: "holidays_traditions", opener: "direct_challenge", moves: ["dark_literal", "logic_interrogation"] },
  { slug: "breaking-the-wishbone", bucket: "holidays_traditions", opener: "direct_challenge", moves: ["logic_interrogation", "sideburn", "dark_literal"] },
  { slug: "caroling", bucket: "holidays_traditions", opener: "redefinition", moves: ["escalated_scene", "x_of_y", "hyper_specificity"] },
  { slug: "secret-santas", bucket: "holidays_traditions", opener: "direct_challenge", moves: ["escalated_scene", "hyper_specificity"] },
  { slug: "advent-calendars", bucket: "holidays_traditions", opener: "redefinition", moves: ["logic_interrogation", "self_implication"] },
  { slug: "pardoning-turkeys", bucket: "holidays_traditions", opener: "direct_challenge", moves: ["dark_literal", "escalated_scene"] },

  // ── places_institutions ───────────────────────────────────────────────────
  // Register: sensory misery scene-setting, "you know you're bad when" rankings.
  { slug: "costco", bucket: "places_institutions", opener: "direct_challenge", moves: ["logic_interrogation", "hyper_specificity"] },
  { slug: "laguardia-airport", bucket: "places_institutions", opener: "direct_challenge", moves: ["hyper_specificity", "logic_interrogation", "spelled_kicker"] },
  { slug: "the-new-york-city-subway", bucket: "places_institutions", opener: "redefinition", moves: ["sideburn", "escalated_scene"] },
  { slug: "the-salad-bar", bucket: "places_institutions", opener: "redefinition", moves: ["dark_literal"] },
  { slug: "sleepaway-camp", bucket: "places_institutions", opener: "redefinition", moves: ["logic_interrogation", "hyper_specificity", "dark_literal"] },
  { slug: "museums", bucket: "places_institutions", opener: "direct_challenge", moves: ["logic_interrogation", "dark_literal"] },

  // ── objects_products ──────────────────────────────────────────────────────
  // Register: design-logic prosecution ("when am I supposed to wear you?").
  { slug: "iphone-flashlight", bucket: "objects_products", opener: "redefinition", moves: ["logic_interrogation", "escalated_scene"] },
  { slug: "apple-airpods", bucket: "objects_products", opener: "direct_challenge", moves: ["logic_interrogation", "x_of_y"] },
  { slug: "checks", bucket: "objects_products", opener: "direct_challenge", moves: ["x_of_y", "sideburn", "escalated_scene"] },
  { slug: "light-jackets", bucket: "objects_products", opener: "direct_challenge", moves: ["logic_interrogation", "dark_literal"] },
  { slug: "business-cards", bucket: "objects_products", opener: "direct_challenge", moves: ["x_of_y", "escalated_scene"] },
  { slug: "single-ply-toilet-paper", bucket: "objects_products", opener: "direct_challenge", moves: ["x_of_y", "logic_interrogation", "escalated_scene"] },

  // ── behaviors_people ──────────────────────────────────────────────────────
  // Register: second-person accusation + imagined dialogue from the target.
  { slug: "people-who-say-autumn", bucket: "behaviors_people", opener: "direct_challenge", moves: ["logic_interrogation", "hyper_specificity"] },
  { slug: "people-who-clap-when-the-plane-lands", bucket: "behaviors_people", opener: "direct_challenge", moves: ["x_of_y", "logic_interrogation"] },
  { slug: "craft-beer-snobs", bucket: "behaviors_people", opener: "direct_challenge", moves: ["dark_literal", "escalated_scene"] },
  { slug: "workout-selfies", bucket: "behaviors_people", opener: "direct_challenge", moves: ["logic_interrogation", "dark_literal"] },
  { slug: "people-who-still-post-their-wordle-scores", bucket: "behaviors_people", opener: "direct_challenge", moves: ["hyper_specificity", "spelled_kicker"] },
  { slug: "once-a-year-relatives", bucket: "behaviors_people", opener: "redefinition", moves: ["hyper_specificity", "escalated_scene"] },

  // ── media_culture ─────────────────────────────────────────────────────────
  // Register: format-logic interrogation ("are you sure you shouldn't be seven?").
  { slug: "podcasts", bucket: "media_culture", opener: "redefinition", moves: ["x_of_y", "sideburn", "logic_interrogation"] },
  { slug: "renovation-shows", bucket: "media_culture", opener: "direct_challenge", moves: ["logic_interrogation"] },
  { slug: "ten-part-documentaries", bucket: "media_culture", opener: "direct_challenge", moves: ["x_of_y", "escalated_scene", "elite_kicker"] },
  { slug: "christmas-music", bucket: "media_culture", opener: "direct_challenge", moves: ["escalated_scene", "hyper_specificity"] },
  { slug: "encores", bucket: "media_culture", opener: "direct_challenge", moves: ["logic_interrogation", "hyper_specificity", "self_implication"] },

  // ── systems_phenomena ─────────────────────────────────────────────────────
  // Register: arguing with an abstraction like it's a rude bureaucrat.
  { slug: "windchill-factor", bucket: "systems_phenomena", opener: "direct_challenge", moves: ["logic_interrogation", "sideburn"] },
  { slug: "the-screen-time-report", bucket: "systems_phenomena", opener: "direct_challenge", moves: ["logic_interrogation", "x_of_y", "dark_literal"] },
  { slug: "spam-calls", bucket: "systems_phenomena", opener: "direct_challenge", moves: ["logic_interrogation", "hyper_specificity", "self_implication"] },
  { slug: "security-questions", bucket: "systems_phenomena", opener: "direct_challenge", moves: ["logic_interrogation", "dark_literal", "spelled_kicker"] },
  { slug: "leap-years", bucket: "systems_phenomena", opener: "direct_challenge", moves: ["x_of_y", "logic_interrogation"] },
  { slug: "humidity", bucket: "systems_phenomena", opener: "redefinition", moves: ["hyper_specificity", "dark_literal"] },
];

/**
 * Fallback set for topics that don't classify cleanly: structurally canonical,
 * one of each opener type.
 */
export const FALLBACK_SLUGS = [
  "oatmeal", // infomercial open
  "iphone-flashlight", // redefinition open
  "people-who-say-autumn", // direct challenge open
];

// ─── Selection ───────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Pick `n` exemplars from a bucket using greedy coverage: each pick maximizes
 * NEW openers and moves relative to what's already picked, so the injected
 * few-shots demonstrate a menu of techniques rather than one trick three times.
 *
 * Pass a seeded `rng` if you want deterministic selection per topic (useful
 * for caching); default Math.random gives variety across requests.
 */
export function selectExemplars(
  bucket: Bucket | "unknown",
  n = 3,
  rng: () => number = Math.random
): Exemplar[] {
  const pool =
    bucket === "unknown"
      ? EXEMPLARS.filter((e) => FALLBACK_SLUGS.includes(e.slug))
      : EXEMPLARS.filter((e) => e.bucket === bucket);

  const candidates = shuffle(pool, rng);
  const picked: Exemplar[] = [];
  const seenOpeners = new Set<Opener>();
  const seenMoves = new Set<Move>();

  while (picked.length < n && candidates.length > 0) {
    let bestIdx = 0;
    let bestScore = -1;
    candidates.forEach((c, i) => {
      const openerNovelty = seenOpeners.has(c.opener) ? 0 : 2;
      const moveNovelty = c.moves.filter((m) => !seenMoves.has(m)).length;
      const score = openerNovelty + moveNovelty;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    });
    const [chosen] = candidates.splice(bestIdx, 1);
    picked.push(chosen);
    seenOpeners.add(chosen.opener);
    chosen.moves.forEach((m) => seenMoves.add(m));
  }

  return picked;
}
