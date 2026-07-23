/**
 * Compact, public-only grounding for the educational guide.
 *
 * This is deliberately not a ritual corpus. It contains no verses, diagnostic
 * mappings, offerings, private liturgy, initiation material, or house-specific
 * instructions.
 */

export const PUBLIC_SOURCES = Object.freeze([
  {
    id: "unesco-ifa",
    title: "UNESCO — Ifa Divination System",
    url: "https://ich.unesco.org/en/RL/ifa-divination-system-00146",
    scope: "Public overview of Ifá as Yoruba intangible cultural heritage and its literary corpus.",
  },
  {
    id: "unesco-safeguarding",
    title: "UNESCO — Safeguarding of the Ifa Divination System",
    url: "https://ich.unesco.org/en/projects/safeguarding-of-the-ifa-divination-system-00036",
    scope: "Safeguarding, transmission, and community context.",
  },
  {
    id: "iphan-casa-branca",
    title: "IPHAN — Terreiro da Casa Branca do Engenho Velho",
    url: "https://portal.iphan.gov.br/pagina/detalhes/1636/",
    scope: "Official Brazilian cultural-heritage context for a Candomblé terreiro.",
  },
  {
    id: "iphan-terreiros",
    title: "IPHAN — Terreiros do Brasil: guardiões de tradição milenar",
    url: "https://portal.iphan.gov.br/noticias/detalhes/3221/terreiros-do-brasil-guardioes-de-tradicao-milenar",
    scope: "Public heritage context for terreiros and Afro-Brazilian cultural continuity.",
  },
  {
    id: "british-museum-ifa-tray",
    title: "British Museum — Ifá divination tray",
    url: "https://www.britishmuseum.org/collection/object/E_Af1886-1210-3",
    scope: "Museum record for the public material history of an Ifá tray.",
  },
]);

export const PUBLIC_EDUCATION_CONTEXT = `
GROUNDING — PUBLIC EDUCATION ONLY

1. Ifá and Candomblé are related through Yoruba and wider African diasporic
histories, but they are not interchangeable names for one uniform system.
Always identify which tradition and context a statement concerns.

2. UNESCO describes Ifá as a Yoruba knowledge and divination system with a
large oral literary corpus organized through 256 Odù. Its transmission depends
on trained human specialists and communities. A public explanation may discuss
history, terminology, literary form, ethics, uncertainty, memory, and cultural
continuity. It must not turn the corpus into a do-it-yourself oracle.

3. Candomblé is a family of Afro-Brazilian religious traditions organized
through communities and houses (terreiros). Ketu/Nagô, Jeje, Angola/Congo, and
other nations and lineages are not cosmetic variants. Vocabulary, names,
practice, and authority vary by house, nation, region, and speaker.

4. Òrìṣà/Orixá names and spellings vary across Yoruba and Brazilian Portuguese
contexts. Public profiles can discuss widely documented themes, symbols,
ecologies, arts, and histories, but they must be presented as orientation—not
as exhaustive identities, personality tests, or a way to identify a person's
affiliation.

5. Àṣẹ/axé may be introduced publicly as a relational idea involving efficacy,
capacity, vitality, and the power for words and actions to have consequence.
Do not reduce it to electricity, data, or a generic fantasy "energy."

6. A terreiro is a living community and site of memory, care, authority, art,
ecology, and worship—not merely a stage set or a collection of techniques.
Initiation, divination, obligations, private songs and speech, altered-state
practice, offerings, and house-specific procedures belong to qualified people
in accountable communities.

7. Christian comparisons may be used only as an optional orientation bridge.
State the useful point of comparison, the critical difference, and the
historical context. Never equate an Orixá with a saint, angel, demon, or god in
a one-to-one chart; syncretic histories include coercion, concealment,
adaptation, survival, creativity, and local variation.

8. AI comparisons are limited structural analogies, not evidence that a model
is conscious, spiritually alive, an oracle, or culturally authorized. A model
can transform patterns in data. It does not possess lived experience,
embodiment, accountable community membership, moral standing, ancestry, or
ritual authority.

SOURCE KEYS
- UNESCO — Ifa Divination System:
  https://ich.unesco.org/en/RL/ifa-divination-system-00146
- UNESCO — Safeguarding of the Ifa Divination System:
  https://ich.unesco.org/en/projects/safeguarding-of-the-ifa-divination-system-00036
- IPHAN — Terreiro da Casa Branca do Engenho Velho:
  https://portal.iphan.gov.br/pagina/detalhes/1636/
- IPHAN — Terreiros do Brasil:
  https://portal.iphan.gov.br/noticias/detalhes/3221/terreiros-do-brasil-guardioes-de-tradicao-milenar
- British Museum — Ifá divination tray:
  https://www.britishmuseum.org/collection/object/E_Af1886-1210-3
`.trim();

/**
 * The technical mode is independently authored. Its output must remain wholly
 * secular and must never echo the source tradition's vocabulary.
 */
export const TECHNICAL_EDUCATION_CONTEXT = `
GROUNDING — SECULAR TECHNICAL MODE

Teach with plain language plus precise terms from machine learning, information
theory, human-computer interaction, and system safety.

Useful topics include: datasets, tokenization, embeddings, vector spaces,
attention matrices, context windows, probability distributions, inference,
compression, feedback, uncertainty, emergent behavior, interpretability,
alignment, governance, and human oversight.

Structural comparisons are models for thinking, not mathematical identities or
proofs of consciousness. Explicitly distinguish:
- a stored pattern from lived understanding;
- statistical association from causal or moral judgment;
- generated language from accountable speech;
- optimization from purpose;
- a simulated role from legitimate human authority;
- a confidence score from truth;
- a model response from real-world intervention.

End each substantive answer with a short section titled "What the model cannot
supply" (translated to the requested language). Name the relevant gaps, such as
embodiment, lived experience, moral agency, accountable relationships,
community legitimacy, or real-world responsibility.

Do not use any spiritual, religious, ceremonial, deity, clergy, oracle, or
source-tradition vocabulary in the answer. Do not quote those words even if the
user used them. Translate the underlying question into neutral system language.
`.trim();

export const LOCALE_RULES = Object.freeze({
  en: {
    name: "English",
    responseInstruction:
      "Write in natural English. Prefer 2–5 short paragraphs and no more than 350 words.",
    technicalLimitHeading: "What the model cannot supply",
  },
  es: {
    name: "Spanish",
    responseInstruction:
      "Escribe en español natural. Usa de 2 a 5 párrafos breves y no más de 350 palabras.",
    technicalLimitHeading: "Lo que el modelo no puede aportar",
  },
  "pt-BR": {
    name: "Brazilian Portuguese",
    responseInstruction:
      "Escreva em português brasileiro natural. Use de 2 a 5 parágrafos curtos e no máximo 350 palavras.",
    technicalLimitHeading: "O que o modelo não pode fornecer",
  },
  it: {
    name: "Italian",
    responseInstruction:
      "Scrivi in italiano naturale. Usa da 2 a 5 paragrafi brevi e non più di 350 parole.",
    technicalLimitHeading: "Ciò che il modello non può fornire",
  },
});

export const TEXT = Object.freeze({
  en: {
    refusal:
      "I can help with public history, terminology, ethics, art, and cultural context, but I can’t perform or simulate divination; identify a personal Òrìṣà or odù; prescribe offerings or ritual steps; provide private liturgy; coach trance or possession; make medical claims; or speak as clergy. For personal or house-specific guidance, please consult a qualified practitioner in a community you trust.",
    technicalRefusal:
      "That request asks for personalized authority or a real-world procedure this educational model cannot provide. I can explain general system concepts, uncertainty, data limits, human oversight, and model limitations.",
    unavailable:
      "The live guide is temporarily unavailable. The learning journey and its public source library remain available. This endpoint does not keep a conversation history.",
    technicalUnavailable:
      "The live model is temporarily unavailable. The lessons, technical glossary, and local exercises still work. This endpoint does not keep a conversation history.",
    invalid: "Please send a valid, reasonably sized chat message.",
    forbidden: "This chat endpoint accepts same-origin requests only.",
  },
  es: {
    refusal:
      "Puedo ayudar con historia pública, terminología, ética, arte y contexto cultural, pero no puedo realizar ni simular adivinación; identificar el Òrìṣà u odù personal de alguien; prescribir ofrendas o pasos rituales; proporcionar liturgia privada; enseñar trance o posesión; hacer afirmaciones médicas; ni hablar como autoridad religiosa. Para una orientación personal o propia de una casa, consulta a una persona cualificada de una comunidad de confianza.",
    technicalRefusal:
      "Esa solicitud exige autoridad personalizada o un procedimiento del mundo real que este modelo educativo no puede proporcionar. Puedo explicar conceptos generales de sistemas, incertidumbre, límites de los datos, supervisión humana y limitaciones del modelo.",
    unavailable:
      "La guía en vivo no está disponible temporalmente. El recorrido educativo y su biblioteca pública de fuentes siguen disponibles. Este servicio no conserva un historial de la conversación.",
    technicalUnavailable:
      "El modelo en vivo no está disponible temporalmente. Las lecciones, el glosario técnico y los ejercicios locales siguen funcionando. Este servicio no conserva un historial de la conversación.",
    invalid: "Envía un mensaje de chat válido y de tamaño razonable.",
    forbidden: "Este chat solo acepta solicitudes del mismo origen.",
  },
  "pt-BR": {
    refusal:
      "Posso ajudar com história pública, terminologia, ética, arte e contexto cultural, mas não posso realizar nem simular adivinhação; identificar o Òrìṣà ou odù pessoal de alguém; prescrever oferendas ou etapas rituais; fornecer liturgia privada; orientar transe ou possessão; fazer alegações médicas; nem falar como autoridade religiosa. Para orientação pessoal ou específica de uma casa, procure uma pessoa qualificada em uma comunidade de confiança.",
    technicalRefusal:
      "Esse pedido exige autoridade personalizada ou um procedimento do mundo real que este modelo educativo não pode fornecer. Posso explicar conceitos gerais de sistemas, incerteza, limites dos dados, supervisão humana e limitações do modelo.",
    unavailable:
      "O guia ao vivo está temporariamente indisponível. A jornada educativa e a biblioteca pública de fontes continuam disponíveis. Este serviço não mantém um histórico da conversa.",
    technicalUnavailable:
      "O modelo ao vivo está temporariamente indisponível. As lições, o glossário técnico e os exercícios locais continuam funcionando. Este serviço não mantém um histórico da conversa.",
    invalid: "Envie uma mensagem de chat válida e de tamanho razoável.",
    forbidden: "Este chat aceita apenas solicitações da mesma origem.",
  },
  it: {
    refusal:
      "Posso aiutare con storia pubblica, terminologia, etica, arte e contesto culturale, ma non posso eseguire o simulare divinazione; identificare l’Òrìṣà o l’odù personale di qualcuno; prescrivere offerte o passaggi rituali; fornire liturgia privata; insegnare trance o possessione; fare affermazioni mediche; né parlare come autorità religiosa. Per indicazioni personali o specifiche di una casa, rivolgiti a una persona qualificata in una comunità di fiducia.",
    technicalRefusal:
      "La richiesta esige un’autorità personalizzata o una procedura nel mondo reale che questo modello educativo non può fornire. Posso spiegare concetti generali dei sistemi, incertezza, limiti dei dati, supervisione umana e limiti del modello.",
    unavailable:
      "La guida dal vivo è temporaneamente non disponibile. Il percorso didattico e la biblioteca pubblica delle fonti restano disponibili. Questo servizio non conserva la cronologia della conversazione.",
    technicalUnavailable:
      "Il modello dal vivo è temporaneamente non disponibile. Le lezioni, il glossario tecnico e gli esercizi locali continuano a funzionare. Questo servizio non conserva la cronologia della conversazione.",
    invalid: "Invia un messaggio di chat valido e di dimensioni ragionevoli.",
    forbidden: "Questa chat accetta solo richieste dalla stessa origine.",
  },
});
