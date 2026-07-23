# Àṣẹ & Understanding

A multilingual, source-led learning journey about public knowledge in Ifá and Candomblé, paired with a separately authored secular systems lens.

## Experience

- Twelve passages from first orientation to advanced public literacy.
- Distinct Tradition and Systems modes with different writing, visual language, color, motion, and explicit boundaries.
- English, Spanish, Brazilian Portuguese, and Italian.
- Twelve commissioned contemporary interpretive illustrations.
- A 72-frame, scroll-controlled hero sequence with reverse playback, responsive rendering, reduced-motion support, and a data-saving fallback.
- Lesson exercises, knowledge checks, reflections, course progress, a searchable glossary, public-facing profiles, literature, and source links.
- A three-gate public ritual-literacy capstone that teaches preparation, respectful observation, and responsible return without reconstructing a rite.
- A floating learning guide backed by Cloudflare Workers AI, with a safe local retrieval fallback.

## Boundaries

This experience teaches advanced public literacy—not initiation, divination, spiritual diagnosis, ritual office, or mastery of house-restricted knowledge.

Ifá and Candomblé are related but not interchangeable. Candomblé remains internally plural: Ketu/Nagô, Jeje, Angola/Congo, and other traditions retain distinct vocabularies and authority. The app excludes initiatory procedures, sacrifice, offerings and prescriptions, private liturgy, plant formulas, trance induction, personal Òrìṣà or odù identification, and impersonation of clergy.

The Systems mode is a secular technical interpretation. It discusses data, representations, constraints, inference, uncertainty, evaluation, and human governance. It does not present structural analogies as proof of shared identity, consciousness, or authority.

All generated spiritual-mode artwork is labeled as contemporary interpretive illustration, not documentary imagery or a literal portrait of a divinity.

## Run locally

Use the Desktop launcher provided with the project, or serve this directory with a local static server. The static lessons, exercises, search, translations, and local guide fallback work offline. Live guide responses require the deployed Cloudflare Pages Function.

The browser stores only language, lens, and course progress in local storage. The chat endpoint does not persist conversations.

## Architecture

- `index.html`, `styles.css`, `app.js`: interface and interaction layer.
- `content.js`: localized curriculum, profiles, glossary, exercises, and sources.
- `scroll-media.js`: progressive scroll-scrub video and image-sequence engine.
- `assets/images/journey/`: optimized interpretive illustrations.
- `assets/sequence/threshold/`: locally derived hero frames.
- `functions/api/chat.js`: bounded multilingual learning guide.
- `functions/_shared/knowledge.js`: public-only source context and safety language.
- `wrangler.jsonc`: Cloudflare Pages and Workers AI binding.

## Deployment

- Production: <https://loss0.projectdominion.com>
- Cloudflare Pages: <https://silicon-ase-atlas.pages.dev>
- Source: <https://github.com/Bizeagle85/silicon-ase-atlas>

The Pages project is connected to the repository's `main` branch. The `AI` binding supplies Workers AI to the Pages Function.
