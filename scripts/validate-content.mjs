import { access, readdir } from "node:fs/promises";
import SITE_CONTENT from "../content.js";

const expectedLocales = ["en", "es", "pt-BR", "it"];
const forbiddenTechnicalTerms = new RegExp(`\\b(?:${[
  "ifa", "candomble", "orisa", "orisha", "orixa", "odu", "axe", "ase",
  "exu", "ogun", "ogum", "oxum", "xango", "yemanja", "terreiro",
  "divin\\w*", "oracle", "ritual\\w*", "sacred", "spiritual\\w*", "religio\\w*",
  "deity", "ancestor\\w*", "offering\\w*", "litur\\w*", "priest\\w*",
  "trance", "possession\\w*"
].join("|")})\\b`, "iu");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function visibleCopy(copy) {
  return [
    copy.eyebrow,
    copy.navTitle,
    copy.title,
    copy.lede,
    ...(copy.body || []),
    ...(copy.concepts || []),
    copy.limit,
    copy.quiz?.title,
    copy.quiz?.prompt,
    ...(copy.quiz?.choices || []).flatMap((choice) => [choice.text, choice.feedback]),
    copy.exercise?.title,
    copy.exercise?.prompt,
    ...(copy.exercise?.options || []).flatMap((option) => [option.text, option.insight])
  ].filter(Boolean).join(" ");
}

assert(SITE_CONTENT.lessons.length === 12, "Expected twelve lessons.");
assert(SITE_CONTENT.orishas.length === 16, "Expected sixteen public-facing profiles.");
assert(SITE_CONTENT.comparisons.length >= 8, "Expected a substantial optional comparison bridge.");
assert(SITE_CONTENT.glossary.length >= 20, "Expected a substantial public glossary.");
assert(SITE_CONTENT.aiGlossary.length >= 12, "Expected a technical mechanism index.");
assert(JSON.stringify(SITE_CONTENT.locales) === JSON.stringify(expectedLocales), "Locale set changed.");

for (const lesson of SITE_CONTENT.lessons) {
  await access(new URL(`../${lesson.image}`, import.meta.url));
  for (const locale of expectedLocales) {
    for (const mode of ["spiritual", "ai"]) {
      const copy = lesson.content?.[locale]?.[mode];
      assert(copy?.title && copy?.lede, `${lesson.id}/${locale}/${mode} has incomplete headings.`);
      assert(copy.body?.length === 2, `${lesson.id}/${locale}/${mode} needs two teaching paragraphs.`);
      assert(copy.concepts?.length === 3, `${lesson.id}/${locale}/${mode} needs three concepts.`);
      assert(copy.quiz?.choices?.length === 3, `${lesson.id}/${locale}/${mode} needs a three-choice check.`);
      assert(copy.exercise?.options?.length === 3, `${lesson.id}/${locale}/${mode} needs three exercise paths.`);
      if (mode === "ai") {
        assert(!forbiddenTechnicalTerms.test(visibleCopy(copy)), `${lesson.id}/${locale} leaks source-tradition vocabulary into technical mode.`);
        assert(copy.limit, `${lesson.id}/${locale} needs an explicit model limitation.`);
      }
    }
  }
}

for (let frame = 1; frame <= 72; frame += 1) {
  await access(new URL(`../assets/sequence/threshold/frame-${String(frame).padStart(3, "0")}.webp`, import.meta.url));
}

const profileArtwork = (await readdir(new URL("../assets/images/orishas/", import.meta.url)))
  .filter((filename) => filename.endsWith(".webp"));
assert(profileArtwork.length === SITE_CONTENT.orishas.length, "Every public-facing profile needs one interpretive artwork.");

for (const source of SITE_CONTENT.sources) {
  assert(/^https:\/\//.test(source.url), `Source ${source.id} must use HTTPS.`);
}

console.log(JSON.stringify({
  lessons: SITE_CONTENT.lessons.length,
  localizedLessonViews: SITE_CONTENT.lessons.length * expectedLocales.length * 2,
  profiles: SITE_CONTENT.orishas.length,
  glossaryEntries: SITE_CONTENT.glossary.length,
  technicalEntries: SITE_CONTENT.aiGlossary.length,
  comparisonCards: SITE_CONTENT.comparisons.length,
  scrollFrames: 72,
  profileArtworks: profileArtwork.length
}));
