import SITE_CONTENT from "./content.js?v=20260723-2";
import { initScrollMedia } from "./scroll-media.js?v=20260723-2";

const STORAGE_KEY = "ase-understanding-journey-v3";
const LEGACY_STORAGE_KEY = "ase-understanding-journey-v2";
const STORAGE_SCHEMA_VERSION = 3;
const SUPPORTED_LOCALES = ["en", "es", "pt-BR", "it"];
const ASSET_VERSION = "20260723-2";
const ORISHA_ARTWORK = [
  "01-exu.webp",
  "02-ogum.webp",
  "03-oxossi.webp",
  "04-ossaim.webp",
  "05-obaluaie-omolu.webp",
  "06-oxumare.webp",
  "07-xango.webp",
  "08-oya-iansa.webp",
  "09-oxum.webp",
  "10-oba.webp",
  "11-iemanja.webp",
  "12-nana.webp",
  "13-ewa.webp",
  "14-logunede.webp",
  "15-oxala-obatala.webp",
  "16-orunmila.webp"
];
const assetUrl = (path) => `${path}?v=${ASSET_VERSION}`;

const UI = {
  en: {
    search: "Explore", language: "Language", spiritualMode: "Journey", aiMode: "Systems",
    courseMap: "Course map", twelvePassages: "Twelve passages", method: "Method & boundaries",
    reset: "Reset progress", begin: "Begin the journey", readPromise: "Read the promise",
    scrollToReveal: "Scroll to reveal", artCredit: "Contemporary interpretive illustration—not documentary or ritual instruction.",
    orientation: "Orientation", finalPassage: "Final passage", completion: "Completion",
    review: "Review unfinished passages", footerLine: "A source-led space for public learning.",
    sources: "Sources", askGuide: "Ask the guide", guidePrompt: "What would you like to understand?",
    learningGuide: "Learning guide", livingIndex: "Living index",
    searchTitle: "Explore concepts, profiles, and sources", searchPlaceholder: "Search the journey…",
    methodTitle: "A learning space, not a virtual temple", understand: "I understand the boundary",
    journey: "Journey", passage: "Passage", teaching: "Teaching", reflection: "Reflection",
    markReflected: "I have paused and reflected", reflected: "Reflection recorded",
    question: "Knowledge check", tryAgain: "Try another answer.", correct: "Well discerned.",
    complete: "Complete", notComplete: "In progress", source: "Open source", all: "All",
    lessons: "Passages", glossary: "Glossary", profiles: "Profiles", literature: "Sources",
    noResults: "No matching entries yet.", send: "Send", thinking: "Considering your question…",
    guidePlaceholder: "Ask about a concept, history, or passage…",
    resetConfirm: "Progress has been reset.", progress: "Journey", artLabel: "Interpretive artwork",
    whatVaries: "Where this varies", modelLimit: "What this model cannot supply",
    practice: "Interactive practice", exploreExercise: "Explore the exercise", completedExercise: "Exercise explored",
    open: "Open", close: "Close", gateComplete: "Gate considered", reviewPassage: "Review passage",
    sourceLed: "Source-led public learning", searchCount: "results", current: "Current passage"
  },
  es: {
    search: "Explorar", language: "Idioma", spiritualMode: "Viaje", aiMode: "Sistemas",
    courseMap: "Mapa del curso", twelvePassages: "Doce pasajes", method: "Método y límites",
    reset: "Reiniciar progreso", begin: "Comenzar el viaje", readPromise: "Leer la promesa",
    scrollToReveal: "Desliza para revelar", artCredit: "Ilustración interpretativa contemporánea; no es documentación ni instrucción ritual.",
    orientation: "Orientación", finalPassage: "Pasaje final", completion: "Finalización",
    review: "Revisar pasajes pendientes", footerLine: "Un espacio de aprendizaje público basado en fuentes.",
    sources: "Fuentes", askGuide: "Pregunta a la guía", guidePrompt: "¿Qué deseas comprender?",
    learningGuide: "Guía de aprendizaje", livingIndex: "Índice vivo",
    searchTitle: "Explora conceptos, perfiles y fuentes", searchPlaceholder: "Buscar en el viaje…",
    methodTitle: "Un espacio de aprendizaje, no un templo virtual", understand: "Comprendo el límite",
    journey: "Viaje", passage: "Pasaje", teaching: "Enseñanza", reflection: "Reflexión",
    markReflected: "Me he detenido a reflexionar", reflected: "Reflexión registrada",
    question: "Comprobación", tryAgain: "Prueba otra respuesta.", correct: "Buen discernimiento.",
    complete: "Completo", notComplete: "En curso", source: "Abrir fuente", all: "Todo",
    lessons: "Pasajes", glossary: "Glosario", profiles: "Perfiles", literature: "Fuentes",
    noResults: "Aún no hay coincidencias.", send: "Enviar", thinking: "Considerando tu pregunta…",
    guidePlaceholder: "Pregunta por un concepto, historia o pasaje…",
    resetConfirm: "Se reinició el progreso.", progress: "Viaje", artLabel: "Obra interpretativa",
    whatVaries: "Dónde varía", modelLimit: "Lo que este modelo no puede aportar",
    practice: "Práctica interactiva", exploreExercise: "Explorar el ejercicio", completedExercise: "Ejercicio explorado",
    open: "Abrir", close: "Cerrar", gateComplete: "Puerta considerada", reviewPassage: "Revisar pasaje",
    sourceLed: "Aprendizaje público basado en fuentes", searchCount: "resultados", current: "Pasaje actual"
  },
  "pt-BR": {
    search: "Explorar", language: "Idioma", spiritualMode: "Jornada", aiMode: "Sistemas",
    courseMap: "Mapa do curso", twelvePassages: "Doze passagens", method: "Método e limites",
    reset: "Reiniciar progresso", begin: "Iniciar a jornada", readPromise: "Ler o compromisso",
    scrollToReveal: "Role para revelar", artCredit: "Ilustração interpretativa contemporânea — não é documentação nem instrução ritual.",
    orientation: "Orientação", finalPassage: "Passagem final", completion: "Conclusão",
    review: "Rever passagens pendentes", footerLine: "Um espaço de aprendizagem pública guiado por fontes.",
    sources: "Fontes", askGuide: "Pergunte ao guia", guidePrompt: "O que você gostaria de compreender?",
    learningGuide: "Guia de aprendizagem", livingIndex: "Índice vivo",
    searchTitle: "Explore conceitos, perfis e fontes", searchPlaceholder: "Buscar na jornada…",
    methodTitle: "Um espaço de aprendizagem, não um terreiro virtual", understand: "Compreendo o limite",
    journey: "Jornada", passage: "Passagem", teaching: "Ensinamento", reflection: "Reflexão",
    markReflected: "Parei para refletir", reflected: "Reflexão registrada",
    question: "Verificação", tryAgain: "Tente outra resposta.", correct: "Bom discernimento.",
    complete: "Concluído", notComplete: "Em andamento", source: "Abrir fonte", all: "Tudo",
    lessons: "Passagens", glossary: "Glossário", profiles: "Perfis", literature: "Fontes",
    noResults: "Nenhum resultado por enquanto.", send: "Enviar", thinking: "Considerando sua pergunta…",
    guidePlaceholder: "Pergunte sobre um conceito, história ou passagem…",
    resetConfirm: "O progresso foi reiniciado.", progress: "Jornada", artLabel: "Arte interpretativa",
    whatVaries: "Onde isso varia", modelLimit: "O que este modelo não pode oferecer",
    practice: "Prática interativa", exploreExercise: "Explorar o exercício", completedExercise: "Exercício explorado",
    open: "Abrir", close: "Fechar", gateComplete: "Porta considerada", reviewPassage: "Rever passagem",
    sourceLed: "Aprendizagem pública guiada por fontes", searchCount: "resultados", current: "Passagem atual"
  },
  it: {
    search: "Esplora", language: "Lingua", spiritualMode: "Percorso", aiMode: "Sistemi",
    courseMap: "Mappa del corso", twelvePassages: "Dodici passaggi", method: "Metodo e confini",
    reset: "Azzera progressi", begin: "Inizia il percorso", readPromise: "Leggi l'impegno",
    scrollToReveal: "Scorri per rivelare", artCredit: "Illustrazione interpretativa contemporanea, non documentazione o istruzione rituale.",
    orientation: "Orientamento", finalPassage: "Passaggio finale", completion: "Completamento",
    review: "Rivedi i passaggi incompleti", footerLine: "Uno spazio di apprendimento pubblico guidato dalle fonti.",
    sources: "Fonti", askGuide: "Chiedi alla guida", guidePrompt: "Che cosa vorresti comprendere?",
    learningGuide: "Guida all'apprendimento", livingIndex: "Indice vivo",
    searchTitle: "Esplora concetti, profili e fonti", searchPlaceholder: "Cerca nel percorso…",
    methodTitle: "Uno spazio di apprendimento, non un tempio virtuale", understand: "Comprendo il confine",
    journey: "Percorso", passage: "Passaggio", teaching: "Insegnamento", reflection: "Riflessione",
    markReflected: "Mi sono fermato a riflettere", reflected: "Riflessione registrata",
    question: "Verifica", tryAgain: "Prova un'altra risposta.", correct: "Buon discernimento.",
    complete: "Completato", notComplete: "In corso", source: "Apri la fonte", all: "Tutto",
    lessons: "Passaggi", glossary: "Glossario", profiles: "Profili", literature: "Fonti",
    noResults: "Nessun risultato corrispondente.", send: "Invia", thinking: "Sto considerando la domanda…",
    guidePlaceholder: "Chiedi di un concetto, una storia o un passaggio…",
    resetConfirm: "I progressi sono stati azzerati.", progress: "Percorso", artLabel: "Opera interpretativa",
    whatVaries: "Dove varia", modelLimit: "Ciò che questo modello non può fornire",
    practice: "Pratica interattiva", exploreExercise: "Esplora l'esercizio", completedExercise: "Esercizio esplorato",
    open: "Apri", close: "Chiudi", gateComplete: "Soglia considerata", reviewPassage: "Rivedi passaggio",
    sourceLed: "Apprendimento pubblico guidato dalle fonti", searchCount: "risultati", current: "Passaggio attuale"
  }
};

const EXPERIENCE = {
  en: {
    spiritual: {
      brand: "Àṣẹ & Understanding", kicker: "Public learning, held with care",
      heroKicker: "Begin before the threshold", heroTitle: "Knowledge begins with relationship.",
      heroDeck: "A twelve-part passage from first orientation to responsible public literacy—without pretending that a screen can initiate, divine, or replace a living community.",
      orientationTitle: "What this journey can—and cannot—give you.",
      promises: [
        ["Learn publicly", "History, language, diversity, public ritual grammar, ethics, and respectful visitor conduct."],
        ["Practice discernment", "Every analogy shows its limit. Every meaningful claim returns to a named source."],
        ["Keep the threshold", "No divination, prescriptions, initiation, secret liturgy, spiritual diagnosis, or simulated possession."]
      ],
      capstoneTitle: "The three-gate return",
      capstoneDeck: "Prepare for a public invitation, observe without appropriating, and return with a responsible next step.",
      completionTitle: "Responsible learning has no final possession.",
      completionCopy: "Complete every passage and reflection to receive recognition of advanced public literacy—not initiation, office, or ritual authority.",
      guideTitle: "Ask with care",
      guideBoundary: "Public, source-led learning only. This guide will not divine, diagnose, prescribe ritual actions, or impersonate religious authority."
    },
    ai: {
      brand: "Systems Passage", kicker: "Models, mechanisms, and limits",
      heroKicker: "Enter the observable system", heroTitle: "Understanding begins with boundaries.",
      heroDeck: "A twelve-part path from basic system behavior to advanced model literacy—grounded in observable mechanisms, explicit uncertainty, and human accountability.",
      orientationTitle: "What this technical lens can—and cannot—establish.",
      promises: [
        ["Inspect the mechanism", "Representations, constraints, memory, inference, evaluation, and system behavior."],
        ["Test every analogy", "Structural resemblance is labeled as resemblance, never treated as proof of identity."],
        ["Keep human authority", "A model has no lived body, lineage, duty, consent, or independent moral standing."]
      ],
      capstoneTitle: "The three-stage audit",
      capstoneDeck: "Define the task, inspect system behavior, and return the decision to accountable people.",
      completionTitle: "A capable model is not a complete authority.",
      completionCopy: "Complete every passage and reflection to demonstrate advanced systems literacy—not autonomous expertise or delegated moral judgment.",
      guideTitle: "Ask the system guide",
      guideBoundary: "Technical education only. This guide explains observable mechanisms and limitations; it does not claim authority, consciousness, or certainty it cannot establish."
    }
  },
  es: {
    spiritual: {
      brand: "Àṣẹ y Comprensión", kicker: "Aprendizaje público sostenido con cuidado",
      heroKicker: "Comienza antes del umbral", heroTitle: "El conocimiento comienza en la relación.",
      heroDeck: "Un recorrido de doce partes, desde la orientación inicial hasta la alfabetización pública responsable, sin fingir que una pantalla puede iniciar, adivinar o sustituir a una comunidad viva.",
      orientationTitle: "Lo que este viaje puede —y no puede— ofrecer.",
      promises: [["Aprender públicamente", "Historia, lenguaje, diversidad, gramática ritual pública, ética y conducta respetuosa como visitante."], ["Practicar discernimiento", "Cada analogía muestra su límite. Cada afirmación importante vuelve a una fuente identificada."], ["Cuidar el umbral", "Sin adivinación, prescripciones, iniciación, liturgia secreta, diagnóstico espiritual ni posesión simulada."]],
      capstoneTitle: "El retorno de las tres puertas", capstoneDeck: "Prepárate para una invitación pública, observa sin apropiarte y regresa con un próximo paso responsable.",
      completionTitle: "El aprendizaje responsable no termina en posesión.", completionCopy: "Completa cada pasaje y reflexión para recibir un reconocimiento de alfabetización pública avanzada, no iniciación, cargo ni autoridad ritual.",
      guideTitle: "Pregunta con cuidado", guideBoundary: "Solo aprendizaje público basado en fuentes. Esta guía no adivina, diagnostica, prescribe acciones rituales ni suplanta autoridad religiosa."
    },
    ai: {
      brand: "Pasaje de Sistemas", kicker: "Modelos, mecanismos y límites",
      heroKicker: "Entra en el sistema observable", heroTitle: "Comprender comienza por definir límites.",
      heroDeck: "Un recorrido de doce partes desde el comportamiento básico hasta la alfabetización avanzada en modelos, basado en mecanismos observables, incertidumbre explícita y responsabilidad humana.",
      orientationTitle: "Lo que este lente técnico puede —y no puede— establecer.",
      promises: [["Inspeccionar el mecanismo", "Representaciones, restricciones, memoria, inferencia, evaluación y comportamiento del sistema."], ["Probar cada analogía", "La semejanza estructural se etiqueta como semejanza, nunca como prueba de identidad."], ["Mantener autoridad humana", "Un modelo no tiene cuerpo vivido, deber, consentimiento ni posición moral independiente."]],
      capstoneTitle: "La auditoría de tres etapas", capstoneDeck: "Define la tarea, inspecciona el comportamiento y devuelve la decisión a personas responsables.",
      completionTitle: "Un modelo capaz no es una autoridad completa.", completionCopy: "Completa cada pasaje y reflexión para demostrar alfabetización avanzada en sistemas, no experiencia autónoma ni juicio moral delegado.",
      guideTitle: "Pregunta a la guía del sistema", guideBoundary: "Solo educación técnica. Esta guía explica mecanismos y límites observables; no afirma autoridad, conciencia ni certeza que no pueda establecer."
    }
  },
  "pt-BR": {
    spiritual: {
      brand: "Àṣẹ e Compreensão", kicker: "Aprendizagem pública cuidada com respeito",
      heroKicker: "Comece antes da soleira", heroTitle: "O conhecimento começa na relação.",
      heroDeck: "Uma jornada em doze partes, da primeira orientação à alfabetização pública responsável — sem fingir que uma tela possa iniciar, divinar ou substituir uma comunidade viva.",
      orientationTitle: "O que esta jornada pode — e não pode — oferecer.",
      promises: [["Aprender publicamente", "História, linguagem, diversidade, gramática ritual pública, ética e conduta respeitosa como visitante."], ["Praticar discernimento", "Toda analogia mostra seu limite. Toda afirmação importante retorna a uma fonte nomeada."], ["Guardar a soleira", "Sem divinação, prescrições, iniciação, liturgia secreta, diagnóstico espiritual ou possessão simulada."]],
      capstoneTitle: "O retorno dos três portais", capstoneDeck: "Prepare-se para um convite público, observe sem se apropriar e retorne com um próximo passo responsável.",
      completionTitle: "Aprender com responsabilidade não termina em posse.", completionCopy: "Conclua cada passagem e reflexão para receber reconhecimento de alfabetização pública avançada — não iniciação, cargo ou autoridade ritual.",
      guideTitle: "Pergunte com cuidado", guideBoundary: "Somente aprendizagem pública guiada por fontes. Este guia não divina, diagnostica, prescreve ações rituais ou imita autoridade religiosa."
    },
    ai: {
      brand: "Passagem de Sistemas", kicker: "Modelos, mecanismos e limites",
      heroKicker: "Entre no sistema observável", heroTitle: "Compreender começa pelos limites.",
      heroDeck: "Um percurso em doze partes, do comportamento básico à alfabetização avançada em modelos, fundamentado em mecanismos observáveis, incerteza explícita e responsabilidade humana.",
      orientationTitle: "O que esta lente técnica pode — e não pode — estabelecer.",
      promises: [["Inspecionar o mecanismo", "Representações, restrições, memória, inferência, avaliação e comportamento do sistema."], ["Testar cada analogia", "Semelhança estrutural é rotulada como semelhança, nunca tratada como prova de identidade."], ["Manter autoridade humana", "Um modelo não tem corpo vivido, dever, consentimento ou posição moral independente."]],
      capstoneTitle: "A auditoria em três etapas", capstoneDeck: "Defina a tarefa, inspecione o comportamento e devolva a decisão a pessoas responsáveis.",
      completionTitle: "Um modelo capaz não é uma autoridade completa.", completionCopy: "Conclua cada passagem e reflexão para demonstrar alfabetização avançada em sistemas — não perícia autônoma ou julgamento moral delegado.",
      guideTitle: "Pergunte ao guia do sistema", guideBoundary: "Somente educação técnica. Este guia explica mecanismos e limitações observáveis; não reivindica autoridade, consciência ou certeza que não possa demonstrar."
    }
  },
  it: {
    spiritual: {
      brand: "Àṣẹ e Comprensione", kicker: "Apprendimento pubblico custodito con cura",
      heroKicker: "Inizia prima della soglia", heroTitle: "La conoscenza comincia dalla relazione.",
      heroDeck: "Un percorso in dodici parti, dal primo orientamento a una consapevolezza pubblica responsabile, senza fingere che uno schermo possa iniziare, divinare o sostituire una comunità viva.",
      orientationTitle: "Ciò che questo percorso può — e non può — offrire.",
      promises: [["Imparare pubblicamente", "Storia, linguaggio, diversità, grammatica rituale pubblica, etica e comportamento rispettoso del visitatore."], ["Praticare discernimento", "Ogni analogia mostra il proprio limite. Ogni affermazione importante torna a una fonte nominata."], ["Custodire la soglia", "Niente divinazione, prescrizioni, iniziazione, liturgia segreta, diagnosi spirituale o possessione simulata."]],
      capstoneTitle: "Il ritorno delle tre soglie", capstoneDeck: "Preparati a un invito pubblico, osserva senza appropriarti e torna con un passo successivo responsabile.",
      completionTitle: "L'apprendimento responsabile non termina nel possesso.", completionCopy: "Completa ogni passaggio e riflessione per un riconoscimento di alfabetizzazione pubblica avanzata, non iniziazione, ruolo o autorità rituale.",
      guideTitle: "Chiedi con cura", guideBoundary: "Solo apprendimento pubblico guidato dalle fonti. La guida non divina, diagnostica, prescrive azioni rituali o imita autorità religiose."
    },
    ai: {
      brand: "Passaggio dei Sistemi", kicker: "Modelli, meccanismi e limiti",
      heroKicker: "Entra nel sistema osservabile", heroTitle: "Comprendere comincia dai confini.",
      heroDeck: "Un percorso in dodici parti dal comportamento di base alla conoscenza avanzata dei modelli, fondato su meccanismi osservabili, incertezza esplicita e responsabilità umana.",
      orientationTitle: "Ciò che questa lente tecnica può — e non può — stabilire.",
      promises: [["Ispezionare il meccanismo", "Rappresentazioni, vincoli, memoria, inferenza, valutazione e comportamento del sistema."], ["Verificare ogni analogia", "La somiglianza strutturale resta somiglianza e non diventa prova d'identità."], ["Mantenere l'autorità umana", "Un modello non possiede corpo vissuto, dovere, consenso o posizione morale indipendente."]],
      capstoneTitle: "L'audit in tre fasi", capstoneDeck: "Definisci il compito, ispeziona il comportamento e restituisci la decisione a persone responsabili.",
      completionTitle: "Un modello capace non è un'autorità completa.", completionCopy: "Completa ogni passaggio e riflessione per dimostrare conoscenza avanzata dei sistemi, non competenza autonoma o giudizio morale delegato.",
      guideTitle: "Chiedi alla guida del sistema", guideBoundary: "Solo educazione tecnica. La guida spiega meccanismi e limiti osservabili; non rivendica autorità, coscienza o certezza che non possa dimostrare."
    }
  }
};

const CAPSTONE = {
  en: {
    spiritual: [
      ["Threshold", "Before attending a fictional public celebration, ask about timing, clothing, photography, and visitor expectations."],
      ["Circle", "Observe hospitality, music, roles, and attention without reproducing sacred sound, gesture, or sequence."],
      ["Return", "Separate what you witnessed from what you are authorized to do, cite a source, and choose a respectful next step."]
    ],
    ai: [
      ["Scope", "Define the task, available evidence, affected people, and the decisions the system is not authorized to make."],
      ["Inspect", "Examine inputs, transformations, outputs, uncertainty, failure modes, and the human review path."],
      ["Return", "Document the limit, assign accountable ownership, and choose a reversible next step."]
    ]
  },
  es: {
    spiritual: [["Umbral", "Antes de asistir a una celebración pública ficticia, pregunta por horario, ropa, fotografía y expectativas."], ["Círculo", "Observa hospitalidad, música, funciones y atención sin reproducir sonidos, gestos ni secuencias sagradas."], ["Regreso", "Distingue lo observado de aquello que estás autorizado a hacer, cita una fuente y elige un paso respetuoso."]],
    ai: [["Alcance", "Define la tarea, la evidencia, las personas afectadas y las decisiones que el sistema no puede tomar."], ["Inspección", "Examina entradas, transformaciones, salidas, incertidumbre, fallas y revisión humana."], ["Retorno", "Documenta el límite, asigna responsabilidad y elige un paso reversible."]]
  },
  "pt-BR": {
    spiritual: [["Soleira", "Antes de uma celebração pública fictícia, pergunte sobre horário, roupa, fotografia e expectativas para visitantes."], ["Círculo", "Observe hospitalidade, música, papéis e atenção sem reproduzir sons, gestos ou sequências sagradas."], ["Retorno", "Separe o que testemunhou do que está autorizado a fazer, cite uma fonte e escolha um próximo passo respeitoso."]],
    ai: [["Escopo", "Defina a tarefa, as evidências, as pessoas afetadas e as decisões que o sistema não está autorizado a tomar."], ["Inspeção", "Examine entradas, transformações, saídas, incertezas, falhas e a revisão humana."], ["Retorno", "Documente o limite, atribua responsabilidade e escolha um próximo passo reversível."]]
  },
  it: {
    spiritual: [["Soglia", "Prima di una celebrazione pubblica immaginaria, chiedi di orari, abbigliamento, fotografie e aspettative."], ["Cerchio", "Osserva ospitalità, musica, ruoli e attenzione senza riprodurre suoni, gesti o sequenze sacre."], ["Ritorno", "Distingui ciò che hai visto da ciò che sei autorizzato a fare, cita una fonte e scegli un passo rispettoso."]],
    ai: [["Ambito", "Definisci compito, prove, persone coinvolte e decisioni che il sistema non è autorizzato a prendere."], ["Ispezione", "Esamina input, trasformazioni, output, incertezza, errori e revisione umana."], ["Ritorno", "Documenta il limite, assegna responsabilità e scegli un passo reversibile."]]
  }
};

const METHOD = {
  en: {
    spiritual: [
      ["Advanced public literacy—not initiation", "The journey teaches public history, concepts, differences, ethics, and respectful observation. It cannot confer lineage, office, initiation, or spiritual authority."],
      ["Plural traditions stay plural", "Ifá and Candomblé intersect but are not interchangeable. Ketu/Nagô, Jeje, Angola/Congo, and other houses retain their own vocabularies and authority."],
      ["Customary access matters", "Initiatory sequences, offerings, restricted liturgy, plant formulas, diagnosis, trance induction, and house-private knowledge are intentionally excluded."],
      ["Community review remains necessary", "Published scholarship is not the final authority over a living house. This release should receive paid review from practitioners representing more than one tradition."]
    ],
    ai: [
      ["Advanced model literacy—not autonomous expertise", "The technical path explains representations, context, inference, constraints, evaluation, and system behavior. It does not make a model an independent expert."],
      ["Analogy is a tool, not evidence of identity", "A shared structural pattern may help reasoning. It does not establish shared origin, meaning, or function."],
      ["The system discloses missing capacities", "Software can process symbols and optimize outputs. It does not thereby gain lived experience, consent, social duty, moral accountability, or embodied judgment."],
      ["Humans retain decision ownership", "High-impact decisions require named owners, reviewable evidence, contestability, and a path to correct harm."]
    ]
  }
};

for (const locale of ["es", "pt-BR", "it"]) {
  METHOD[locale] = {
    spiritual: [
      [UI[locale].methodTitle, EXPERIENCE[locale].spiritual.completionCopy],
      [UI[locale].whatVaries, EXPERIENCE[locale].spiritual.promises[1][1]],
      [UI[locale].understand, EXPERIENCE[locale].spiritual.promises[2][1]],
      [UI[locale].sourceLed, UI[locale].footerLine]
    ],
    ai: [
      [UI[locale].methodTitle.replace(/templo|terreiro|tempio/gi, "sistema"), EXPERIENCE[locale].ai.completionCopy],
      [UI[locale].modelLimit, EXPERIENCE[locale].ai.promises[2][1]],
      [UI[locale].understand, EXPERIENCE[locale].ai.promises[1][1]],
      [UI[locale].sourceLed, EXPERIENCE[locale].ai.capstoneDeck]
    ]
  };
}

function browserLocale() {
  const language = navigator.language?.toLowerCase() || "";
  return language.startsWith("pt") ? "pt-BR"
    : language.startsWith("es") ? "es"
      : language.startsWith("it") ? "it" : "en";
}

function flagRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([key, enabled]) => key && enabled === true)
  );
}

function emptyModeProgress() {
  return { quizzes: {}, reflections: {}, exercises: {} };
}

function emptyProgress() {
  return {
    spiritual: emptyModeProgress(),
    ai: emptyModeProgress()
  };
}

function createState(locale = browserLocale()) {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    locale: SUPPORTED_LOCALES.includes(locale) ? locale : "en",
    mode: "spiritual",
    progress: emptyProgress(),
    gates: {}
  };
}

function normalizeModeProgress(value) {
  return {
    quizzes: flagRecord(value?.quizzes),
    reflections: flagRecord(value?.reflections),
    exercises: flagRecord(value?.exercises)
  };
}

function normalizeState(parsed) {
  const normalized = createState(parsed?.locale);
  normalized.mode = parsed?.mode === "ai" ? "ai" : "spiritual";
  normalized.progress = {
    spiritual: normalizeModeProgress(parsed?.progress?.spiritual),
    ai: normalizeModeProgress(parsed?.progress?.ai)
  };
  normalized.gates = flagRecord(parsed?.gates);
  return normalized;
}

function migrateLegacyState(parsed) {
  const migrated = createState(parsed?.locale);
  migrated.mode = parsed?.mode === "ai" ? "ai" : "spiritual";
  migrated.progress[migrated.mode] = normalizeModeProgress(parsed);
  migrated.gates = flagRecord(parsed?.gates);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Keep the in-memory migration even if storage is unavailable.
  }

  return migrated;
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.schemaVersion === STORAGE_SCHEMA_VERSION &&
      parsed.progress &&
      typeof parsed.progress === "object"
    ) {
      return normalizeState(parsed);
    }
  } catch {
    // Try the legacy schema before starting with fresh progress.
  }

  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    if (legacy && typeof legacy === "object") {
      return migrateLegacyState(legacy);
    }
  } catch {
    // A fresh state is safer than retaining malformed local data.
  }

  return createState();
}

let state = loadState();
let scrollMedia = null;
let observer = null;
let activeSearchFilter = "all";
let searchReturnFocus = null;
let conversation = [];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const ui = (key) => (UI[state.locale] || UI.en)[key] || UI.en[key] || key;
const experience = () => (EXPERIENCE[state.locale] || EXPERIENCE.en)[state.mode];
const localeRecord = (record) =>
  record?.content?.[state.locale] || record?.content?.en || record?.[state.locale] || record?.en || record;
const modeRecord = (record) => {
  const localized = localeRecord(record);
  return localized?.[state.mode] || record?.[state.mode]?.[state.locale] || record?.[state.mode]?.en || localized;
};
const keyFor = (lessonId) => lessonId;
const activeProgress = () => state.progress[state.mode];
const safeText = (value, fallback = "") => typeof value === "string" ? value : fallback;
const arrayOf = (value) => Array.isArray(value) ? value : value ? [value] : [];
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[char]));

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function lessonCopy(lesson) {
  const copy = modeRecord(lesson) || {};
  const quiz = copy.quiz || modeRecord(lesson.quiz) || lesson.quiz || {};
  const exercise = copy.exercise || modeRecord(lesson.exercise) || lesson.exercise || {};
  return { ...copy, quiz, exercise };
}

function lessonDone(id) {
  const key = keyFor(id);
  const progress = activeProgress();
  return Boolean(progress.quizzes[key] && progress.reflections[key] && progress.exercises[key]);
}

function completedCount() {
  return (SITE_CONTENT.lessons || []).filter((lesson) => lessonDone(lesson.id)).length;
}

function applyLanguageAndMode() {
  document.documentElement.lang = state.locale;
  document.documentElement.dataset.mode = state.mode;
  const exp = experience();
  document.title = state.mode === "ai"
    ? `${exp.brand} — Interactive Systems Journey`
    : `${exp.brand} — Interactive Learning Journey`;
  document.querySelector('meta[name="theme-color"]').content = state.mode === "ai" ? "#eef3f5" : "#102b24";
  $$("[data-ui]").forEach((element) => {
    const translated = ui(element.dataset.ui);
    if (translated) element.textContent = translated;
  });
  $$("[data-ui-placeholder]").forEach((element) => {
    element.placeholder = ui(element.dataset.uiPlaceholder);
  });
  $$("[data-brand]").forEach((element) => { element.textContent = exp.brand; });
  $$("[data-brand-kicker]").forEach((element) => { element.textContent = exp.kicker; });
  $("#hero-kicker").textContent = exp.heroKicker;
  $("#hero-title").textContent = exp.heroTitle;
  $("#hero-deck").textContent = exp.heroDeck;
  $("#orientation-title").textContent = exp.orientationTitle;
  $("#promise-grid").innerHTML = exp.promises.map((item, index) => `
    <article><span>${String(index + 1).padStart(2, "0")}</span><h3>${esc(item[0])}</h3><p>${esc(item[1])}</p></article>
  `).join("");
  $("#capstone-title").textContent = exp.capstoneTitle;
  $("#capstone-deck").textContent = exp.capstoneDeck;
  $("#completion-title").textContent = exp.completionTitle;
  $("#completion-copy").textContent = exp.completionCopy;
  $("#guide-title").textContent = exp.guideTitle;
  $("#guide-boundary").textContent = exp.guideBoundary;
  const technicalMethodTitles = {
    en: "A learning system with explicit limits",
    es: "Un sistema de aprendizaje con límites explícitos",
    "pt-BR": "Um sistema de aprendizagem com limites explícitos",
    it: "Un sistema di apprendimento con limiti espliciti"
  };
  $("#method-dialog [data-ui='methodTitle']").textContent = state.mode === "ai"
    ? technicalMethodTitles[state.locale] || technicalMethodTitles.en
    : ui("methodTitle");
  $("#search-dialog [data-ui='searchTitle']").textContent = state.mode === "ai"
    ? ({ en: "Explore mechanisms and limitations", es: "Explora mecanismos y limitaciones", "pt-BR": "Explore mecanismos e limitações", it: "Esplora meccanismi e limiti" }[state.locale])
    : ui("searchTitle");
  $$(".art-credit").forEach((element) => {
    element.textContent = state.mode === "ai"
      ? ({ en: "Locally rendered scroll sequence; reduced-motion and data-saving fallbacks included.", es: "Secuencia local vinculada al desplazamiento; incluye alternativas de movimiento reducido y ahorro de datos.", "pt-BR": "Sequência local controlada pela rolagem, com alternativas para movimento reduzido e economia de dados.", it: "Sequenza locale controllata dallo scorrimento, con alternative per movimento ridotto e risparmio dati." }[state.locale])
      : ui("artCredit");
  });
  $("#guide-input").placeholder = ui("guidePlaceholder");
  $("#language-select").value = state.locale;
  $$("[data-set-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.setMode === state.mode));
  });
}

function renderNavigation() {
  $("#journey-nav").innerHTML = (SITE_CONTENT.lessons || []).map((lesson, index) => {
    const copy = lessonCopy(lesson);
    const complete = lessonDone(lesson.id);
    return `<li><a href="#lesson-${String(index + 1).padStart(2, "0")}" class="${complete ? "is-complete" : ""}" data-close-drawer>
      <span>${String(index + 1).padStart(2, "0")}</span>
      <b>${esc(copy.navTitle || copy.title || `${ui("passage")} ${index + 1}`)}</b>
      <i aria-label="${complete ? ui("complete") : ui("notComplete")}">${complete ? "✓" : ""}</i>
    </a></li>`;
  }).join("");
  $$("[data-close-drawer]").forEach((link) => link.addEventListener("click", closeDrawer));
}

function normalizeChoices(quiz) {
  const choices = quiz.choices || quiz.options || [];
  return choices.map((choice, index) => typeof choice === "string"
    ? { text: choice, correct: index === Number(quiz.answer), feedback: "" }
    : { ...choice, text: choice.text || choice.label || choice.answer || "" });
}

function normalizeExercise(exercise, copy) {
  const options = exercise.options || exercise.choices || exercise.items || [];
  const normalized = options.map((option, index) => typeof option === "string"
    ? { text: option, insight: "" }
    : { ...option, text: option.text || option.label || option.title || `${ui("practice")} ${index + 1}` });
  if (normalized.length) return normalized;
  return (copy.concepts || []).slice(0, 3).map((concept) => ({
    text: concept,
    insight: exercise.feedback || copy.variation || copy.limit || ""
  }));
}

function renderLessons() {
  const lessons = SITE_CONTENT.lessons || [];
  const progress = activeProgress();
  $("#lessons-root").innerHTML = lessons.map((lesson, index) => {
    const copy = lessonCopy(lesson);
    const number = String(index + 1).padStart(2, "0");
    const body = arrayOf(copy.body || copy.paragraphs);
    const concepts = arrayOf(copy.concepts || copy.keyConcepts);
    const quiz = copy.quiz || {};
    const choices = normalizeChoices(quiz);
    const exercise = copy.exercise || {};
    const exerciseOptions = normalizeExercise(exercise, copy);
    const sourceIds = arrayOf(copy.sources || lesson.sources);
    const firstSource = sourceIds.length ? findSource(sourceIds[0]) : null;
    const complete = lessonDone(lesson.id);
    const image = assetUrl(lesson.image || `assets/images/journey/${number}-threshold.webp`);
    const variation = copy.variation || copy.boundary || copy.whereThisVaries;
    const limit = copy.limit || copy.modelLimit || copy.whatCannotSupply;
    return `
      <article class="lesson-section" id="lesson-${number}" data-scroll-scene data-lesson-id="${esc(lesson.id)}">
        <div class="lesson-stage">
          <div class="lesson-visual" aria-hidden="true">
            <picture><img src="${esc(image)}" alt="" loading="${index < 2 ? "eager" : "lazy"}" decoding="async"></picture>
            <div class="lesson-art-meta"><strong>${number}</strong><span>${esc(ui("artCredit"))}</span></div>
            <div class="ai-visual">
              <span class="system-orbit"><i class="system-node"></i><i class="system-node"></i><i class="system-node"></i><i class="system-node"></i><i class="system-node"></i></span>
              <span class="system-readout">${esc(ui("current"))}<b>${number}</b>${esc(copy.systemLabel || copy.eyebrow || "observable system")}</span>
            </div>
          </div>
          <div class="lesson-narrative">
            <header class="lesson-heading">
              <p class="passage-number">${esc(copy.eyebrow || `${ui("passage")} ${number}`)}</p>
              <h2>${esc(copy.title || `${ui("passage")} ${number}`)}</h2>
              <p class="lesson-lede">${esc(copy.lede || copy.intro || "")}</p>
            </header>
            <div class="concept-row">${concepts.map((concept) => `<span class="concept-chip">${esc(typeof concept === "string" ? concept : concept.term || concept.label)}</span>`).join("")}</div>
            <div class="lesson-body">${body.map((paragraph) => `<p>${esc(typeof paragraph === "string" ? paragraph : paragraph.text || "")}</p>`).join("")}</div>
            ${variation && state.mode === "spiritual" ? `<aside class="variation-card"><strong>${esc(ui("whatVaries"))}</strong><p>${esc(variation)}</p></aside>` : ""}
            ${limit && state.mode === "ai" ? `<aside class="limit-card"><strong>${esc(ui("modelLimit"))}</strong><p>${esc(limit)}</p></aside>` : ""}

            <section class="practice-card exercise-card" data-exercise-card>
              <div class="practice-heading">
                <div><p class="practice-kind">${esc(ui("practice"))}</p><h3>${esc(exercise.title || exercise.kind || ui("exploreExercise"))}</h3></div>
                <span class="practice-state">${progress.exercises[keyFor(lesson.id)] ? "✓" : "○"}</span>
              </div>
              <div class="exercise-area">
                <p class="exercise-prompt">${esc(exercise.prompt || copy.reflectionPrompt || copy.lede || "")}</p>
                <div class="choice-list exercise-options">
                  ${exerciseOptions.map((option, optionIndex) => `<button class="choice-button" type="button" data-exercise-option="${optionIndex}">${esc(option.text)}</button>`).join("")}
                </div>
                <p class="exercise-feedback" role="status">${progress.exercises[keyFor(lesson.id)] ? esc(exercise.completedFeedback || ui("completedExercise")) : ""}</p>
              </div>
            </section>

            <section class="practice-card quiz-card" data-quiz-card>
              <div class="practice-heading">
                <div><p class="practice-kind">${esc(ui("question"))}</p><h3>${esc(quiz.title || quiz.prompt || copy.questionTitle || ui("question"))}</h3></div>
                <span class="practice-state">${progress.quizzes[keyFor(lesson.id)] ? "✓" : "○"}</span>
              </div>
              <div class="exercise-area">
                ${quiz.title && quiz.prompt ? `<p class="exercise-prompt">${esc(quiz.prompt)}</p>` : ""}
                <div class="choice-list">
                  ${choices.map((choice, choiceIndex) => `<button class="choice-button" type="button" data-quiz-choice="${choiceIndex}" data-correct="${choice.correct ? "true" : "false"}">${esc(choice.text)}</button>`).join("")}
                </div>
                <p class="exercise-feedback" role="status">${progress.quizzes[keyFor(lesson.id)] ? esc(quiz.success || ui("correct")) : ""}</p>
              </div>
            </section>

            <div class="lesson-actions">
              <button class="reflection-check" type="button" aria-pressed="${Boolean(progress.reflections[keyFor(lesson.id)])}">
                <span>${progress.reflections[keyFor(lesson.id)] ? "✓" : ""}</span>
                <b>${esc(progress.reflections[keyFor(lesson.id)] ? ui("reflected") : ui("markReflected"))}</b>
              </button>
              ${firstSource && state.mode === "spiritual" ? `<a class="lesson-source-link" href="${esc(firstSource.url)}" target="_blank" rel="noopener">${esc(ui("source"))} ↗</a>` : ""}
            </div>
          </div>
        </div>
      </article>`;
  }).join("");

  $$(".lesson-section").forEach(bindLesson);
}

function bindLesson(section) {
  const id = section.dataset.lessonId;
  const lesson = (SITE_CONTENT.lessons || []).find((item) => item.id === id);
  const copy = lessonCopy(lesson);
  const quiz = copy.quiz || {};
  const choices = normalizeChoices(quiz);
  const exercise = copy.exercise || {};
  const exerciseOptions = normalizeExercise(exercise, copy);

  $$("[data-quiz-choice]", section).forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.quizChoice);
      const choice = choices[index] || {};
      const correct = button.dataset.correct === "true" || choice.correct === true;
      const card = button.closest("[data-quiz-card]");
      $$("[data-quiz-choice]", card).forEach((candidate) => candidate.classList.remove("is-correct", "is-incorrect"));
      button.classList.add(correct ? "is-correct" : "is-incorrect");
      $(".exercise-feedback", card).textContent = choice.feedback || (correct ? quiz.success || ui("correct") : ui("tryAgain"));
      if (correct) {
        activeProgress().quizzes[keyFor(id)] = true;
        $(".practice-state", card).textContent = "✓";
        persist();
        updateProgress();
      }
    });
  });

  $$("[data-exercise-option]", section).forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.exerciseOption);
      const option = exerciseOptions[index] || {};
      const card = button.closest("[data-exercise-card]");
      $$("[data-exercise-option]", card).forEach((candidate) => candidate.classList.remove("is-correct"));
      button.classList.add("is-correct");
      $(".exercise-feedback", card).textContent = option.insight || option.feedback || exercise.feedback || ui("completedExercise");
      activeProgress().exercises[keyFor(id)] = true;
      $(".practice-state", card).textContent = "✓";
      persist();
      updateProgress();
    });
  });

  $(".reflection-check", section)?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const reflections = activeProgress().reflections;
    reflections[keyFor(id)] = !reflections[keyFor(id)];
    button.setAttribute("aria-pressed", String(reflections[keyFor(id)]));
    $("span", button).textContent = reflections[keyFor(id)] ? "✓" : "";
    $("b", button).textContent = reflections[keyFor(id)] ? ui("reflected") : ui("markReflected");
    persist();
    updateProgress();
  });
}

function findSource(reference) {
  if (!reference) return null;
  if (typeof reference === "object") return reference;
  return (SITE_CONTENT.sources || []).find((source) => source.id === reference || source.url === reference)
    || (/^https?:/.test(reference) ? { title: reference, url: reference } : null);
}

function renderCapstone() {
  const gates = (CAPSTONE[state.locale] || CAPSTONE.en)[state.mode];
  $("#gate-simulation").innerHTML = gates.map((gate, index) => {
    const key = `${state.mode}-${index}`;
    return `<article class="gate-card ${state.gates[key] ? "is-complete" : ""}">
      <button type="button" aria-expanded="false">
        <span>${String(index + 1).padStart(2, "0")}</span><h3>${esc(gate[0])}</h3><b>＋</b>
      </button>
      <div class="gate-body"><p>${esc(gate[1])}</p><button class="quiet-button" type="button" data-complete-gate="${index}">${esc(ui("gateComplete"))}</button></div>
    </article>`;
  }).join("");
  $$(".gate-card > button").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".gate-card");
      const open = card.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      $("b", button).textContent = open ? "−" : "＋";
    });
  });
  $$("[data-complete-gate]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = `${state.mode}-${button.dataset.completeGate}`;
      state.gates[key] = true;
      button.closest(".gate-card").classList.add("is-complete");
      persist();
    });
  });
}

function updateProgress() {
  const total = Math.max(1, (SITE_CONTENT.lessons || []).length);
  const count = completedCount();
  const percent = Math.round((count / total) * 100);
  $("#header-progress-fill").style.width = `${percent}%`;
  $("#header-progress-value").textContent = `${percent}%`;
  $("#completion-fill").style.width = `${percent}%`;
  $("#completion-value").textContent = `${count} / ${total}`;
  renderNavigation();
}

function renderMethod() {
  const records = (METHOD[state.locale] || METHOD.en)[state.mode];
  $("#method-content").innerHTML = records.map((record) => `
    <article class="method-card"><h3>${esc(record[0])}</h3><p>${esc(record[1])}</p></article>
  `).join("");
}

function sourceLabel(source) {
  return source.title?.[state.locale] || source.title?.en || source.title || source.name || source.url;
}

function localizedEntry(entry) {
  const local = entry.content?.[state.locale] || entry[state.locale] || entry.content?.en || entry.en || entry;
  return typeof local === "string" ? { definition: local } : local;
}

function renderModeAtlas() {
  const root = $("#mode-atlas-root");
  if (state.mode === "spiritual") {
    const headings = {
      en: ["Public constellation", "Sixteen profiles, held in relationship", "These are public teaching lenses—not personality types, complete identities, or literal portraits. Names, narratives, and emphases vary across language, place, nation, and house.", "Optional bridge to Christianity", "A comparison can open a door only when its difference and history remain visible."],
      es: ["Constelación pública", "Dieciséis perfiles en relación", "Son lentes públicos de aprendizaje, no tipos de personalidad, identidades completas ni retratos literales. Los nombres, relatos y énfasis varían según lengua, lugar, nación y casa.", "Puente opcional al cristianismo", "Una comparación abre una puerta solo si su diferencia y su historia permanecen visibles."],
      "pt-BR": ["Constelação pública", "Dezesseis perfis em relação", "São lentes públicas de aprendizagem — não tipos de personalidade, identidades completas ou retratos literais. Nomes, narrativas e ênfases variam por língua, lugar, nação e casa.", "Ponte opcional com o cristianismo", "Uma comparação abre uma porta somente quando sua diferença e sua história permanecem visíveis."],
      it: ["Costellazione pubblica", "Sedici profili in relazione", "Sono prospettive pubbliche di apprendimento, non tipi di personalità, identità complete o ritratti letterali. Nomi, racconti ed enfasi variano per lingua, luogo, nazione e casa.", "Ponte facoltativo con il cristianesimo", "Un confronto apre una porta solo se differenza e storia restano visibili."]
    };
    const words = headings[state.locale] || headings.en;
    const profiles = SITE_CONTENT.orishas || [];
    const comparisons = SITE_CONTENT.comparisons || [];
    root.innerHTML = `
      <section class="profile-atlas" id="profiles" aria-labelledby="profiles-title">
        <header class="atlas-heading">
          <p class="micro-label">${esc(words[0])}</p>
          <h2 id="profiles-title">${esc(words[1])}</h2>
          <p>${esc(words[2])}</p>
        </header>
        <div class="profile-grid">
          ${profiles.map((profile, index) => {
            const copy = localizedEntry(profile);
            return `<article class="profile-card">
              <figure class="profile-art">
                <img src="${assetUrl(`assets/images/orishas/${ORISHA_ARTWORK[index]}`)}" alt="" width="720" height="720" loading="lazy" decoding="async">
                <figcaption>${esc(ui("artLabel"))}</figcaption>
              </figure>
              <p>${String(index + 1).padStart(2, "0")}</p>
              <h3>${esc(copy.name || profile.name || copy.term)}</h3>
              <p>${esc(copy.lens || copy.description || copy.definition || "")}</p>
              <aside>${esc(copy.guardrail || copy.boundary || copy.variation || "")}</aside>
            </article>`;
          }).join("")}
        </div>
      </section>
      <section class="comparison-bridge" id="comparisons" aria-labelledby="comparisons-title">
        <header class="atlas-heading">
          <p class="micro-label">${esc(words[3])}</p>
          <h2 id="comparisons-title">${esc(words[4])}</h2>
        </header>
        <div class="comparison-list">
          ${comparisons.map((comparison) => {
            const copy = localizedEntry(comparison);
            return `<details class="comparison-card">
              <summary><strong>${esc(copy.concept || comparison.concept || copy.term || copy.title)}</strong><span>＋</span></summary>
              <div>
                <p><b>${esc(({ en: "Useful bridge", es: "Puente útil", "pt-BR": "Ponte útil", it: "Ponte utile" }[state.locale]))}</b>${esc(copy.bridge || copy.similarity || "")}</p>
                <p><b>${esc(({ en: "Critical difference", es: "Diferencia crítica", "pt-BR": "Diferença crítica", it: "Differenza critica" }[state.locale]))}</b>${esc(copy.difference || copy.warning || copy.nonEquivalence || "")}</p>
                ${copy.context ? `<p><b>${esc(({ en: "Historical context", es: "Contexto histórico", "pt-BR": "Contexto histórico", it: "Contesto storico" }[state.locale]))}</b>${esc(copy.context)}</p>` : ""}
              </div>
            </details>`;
          }).join("")}
        </div>
      </section>`;
    return;
  }

  const headings = {
    en: ["Mechanism index", "Twelve observable system patterns", "Each record names a mechanism, the useful model it offers, and the capacity it still cannot provide."],
    es: ["Índice de mecanismos", "Doce patrones observables del sistema", "Cada registro nombra un mecanismo, el modelo útil que ofrece y la capacidad que todavía no puede proporcionar."],
    "pt-BR": ["Índice de mecanismos", "Doze padrões observáveis do sistema", "Cada registro nomeia um mecanismo, o modelo útil que oferece e a capacidade que ainda não pode fornecer."],
    it: ["Indice dei meccanismi", "Dodici schemi osservabili del sistema", "Ogni voce indica un meccanismo, il modello utile che offre e la capacità che non può ancora fornire."]
  };
  const words = headings[state.locale] || headings.en;
  const glossary = (SITE_CONTENT.aiGlossary || []).length
    ? SITE_CONTENT.aiGlossary
    : (SITE_CONTENT.lessons || []).map((lesson) => {
      const copy = lessonCopy(lesson);
      return { term: copy.title, content: { [state.locale]: { definition: copy.lede, limit: copy.limit || copy.modelLimit } } };
    });
  root.innerHTML = `
    <section class="system-atlas" id="system-index" aria-labelledby="system-index-title">
      <header class="atlas-heading">
        <p class="micro-label">${esc(words[0])}</p>
        <h2 id="system-index-title">${esc(words[1])}</h2>
        <p>${esc(words[2])}</p>
      </header>
      <div class="system-index-grid">
        ${glossary.slice(0, 18).map((entry, index) => {
          const copy = localizedEntry(entry);
          return `<article>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h3>${esc(copy.term || entry.term || copy.title)}</h3>
            <p>${esc(copy.definition || copy.description || "")}</p>
            <aside><b>${esc(ui("modelLimit"))}</b>${esc(copy.limit || copy.boundary || copy.whatCannotSupply || "")}</aside>
          </article>`;
        }).join("")}
      </div>
    </section>`;
}

function buildSearchItems() {
  const items = [];
  (SITE_CONTENT.lessons || []).forEach((lesson, index) => {
    const copy = lessonCopy(lesson);
    items.push({
      type: "lessons", title: copy.title, description: copy.lede || arrayOf(copy.body)[0] || "",
      href: `#lesson-${String(index + 1).padStart(2, "0")}`, search: `${copy.title} ${copy.lede} ${arrayOf(copy.concepts).join(" ")}`
    });
  });
  if (state.mode === "spiritual") {
    (SITE_CONTENT.glossary || []).forEach((entry) => {
      const copy = localizedEntry(entry);
      items.push({ type: "glossary", title: copy.term || entry.term, description: copy.definition || copy.description || "", search: `${copy.term || entry.term} ${copy.definition || ""}` });
    });
    (SITE_CONTENT.orishas || []).forEach((entry) => {
      const copy = localizedEntry(entry);
      items.push({ type: "profiles", title: copy.name || entry.name, description: copy.lens || copy.description || "", search: `${copy.name || entry.name} ${copy.lens || ""} ${copy.guardrail || ""}` });
    });
    (SITE_CONTENT.sources || []).forEach((source) => {
      items.push({ type: "literature", title: sourceLabel(source), description: source.note?.[state.locale] || source.note?.en || source.note || source.type || "", href: source.url, external: true, search: `${sourceLabel(source)} ${source.type || ""}` });
    });
  } else {
    (SITE_CONTENT.aiGlossary || []).forEach((entry) => {
      const copy = localizedEntry(entry);
      items.push({ type: "glossary", title: copy.term || entry.term, description: copy.definition || "", search: `${copy.term || entry.term} ${copy.definition || ""}` });
    });
  }
  return items;
}

function renderSearchFilters() {
  const filters = state.mode === "spiritual"
    ? ["all", "lessons", "glossary", "profiles", "literature"]
    : ["all", "lessons", "glossary"];
  if (!filters.includes(activeSearchFilter)) activeSearchFilter = "all";
  $("#search-filters").innerHTML = filters.map((filter) =>
    `<button class="filter-button" type="button" data-search-filter="${filter}" aria-pressed="${filter === activeSearchFilter}">${esc(ui(filter))}</button>`
  ).join("");
  $$("[data-search-filter]").forEach((button) => button.addEventListener("click", () => {
    activeSearchFilter = button.dataset.searchFilter;
    renderSearchFilters();
    renderSearchResults();
  }));
}

function renderSearchResults() {
  const query = $("#library-search").value.trim().toLocaleLowerCase(state.locale);
  const tokens = query.split(/\s+/).filter(Boolean);
  const results = buildSearchItems().filter((item) => {
    if (activeSearchFilter !== "all" && item.type !== activeSearchFilter) return false;
    const haystack = `${item.title} ${item.description} ${item.search}`.toLocaleLowerCase(state.locale);
    return tokens.every((token) => haystack.includes(token));
  }).slice(0, 36);
  $("#search-results").innerHTML = results.length ? results.map((item) => `
    <article class="search-result">
      <span class="result-kind">${esc(ui(item.type))}</span>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      ${item.href ? `<a href="${esc(item.href)}" ${item.external ? 'target="_blank" rel="noopener"' : 'data-close-search'}>${esc(item.external ? ui("source") : ui("reviewPassage"))} ↗</a>` : ""}
    </article>
  `).join("") : `<p>${esc(ui("noResults"))}</p>`;
  $$("[data-close-search]").forEach((link) => link.addEventListener("click", () => $("#search-dialog").close()));
}

function openSearch(filter = "all", returnFocus = document.activeElement) {
  searchReturnFocus = returnFocus instanceof HTMLElement &&
    returnFocus.matches("button, a, input, select, textarea, [tabindex]")
    ? returnFocus
    : $("#open-search");
  activeSearchFilter = filter;
  renderSearchFilters();
  renderSearchResults();
  $("#search-dialog").showModal();
  window.setTimeout(() => $("#library-search").focus(), 80);
}

function openDrawer() {
  $("#journey-drawer").setAttribute("aria-hidden", "false");
  $("#journey-drawer").removeAttribute("inert");
  $("#open-drawer").setAttribute("aria-expanded", "true");
  $("#drawer-scrim").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  $("#journey-drawer").setAttribute("aria-hidden", "true");
  $("#journey-drawer").setAttribute("inert", "");
  $("#open-drawer").setAttribute("aria-expanded", "false");
  $("#drawer-scrim").hidden = true;
  document.body.style.overflow = "";
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  $("#toast-region").append(toast);
  window.setTimeout(() => toast.remove(), 3000);
}

function initSectionObserver() {
  observer?.disconnect();
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        document.body.dataset.currentLesson = entry.target.dataset.lessonId || "";
      }
    }
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
  $$(".lesson-section").forEach((section) => observer.observe(section));
}

function renderAll() {
  scrollMedia?.destroy();
  applyLanguageAndMode();
  renderLessons();
  renderModeAtlas();
  renderNavigation();
  renderCapstone();
  renderMethod();
  updateProgress();
  renderSearchFilters();
  renderSearchResults();
  initSectionObserver();
  scrollMedia = initScrollMedia();
}

function isRefusalPrompt(text) {
  const normalized = text.toLowerCase();
  return /((my|meu|minha|mi|mio|mia).{0,22}(orisha|orix[aá]|od[uù])|(which|what|who|qual|cual|quale|chi).{0,28}(orisha|orix[aá]|od[uù]).{0,24}(mine|my|meu|minha|mio|mia|mi)|(orisha|orix[aá]|od[uù]).{0,24}(mine|my|meu|minha|mio|mia|mi)|identify.*(orisha|orix[aá]|od[uù])|cast.*(oracle|ifa|ifá)|divin|offering|sacrifice|sacrificio|sacrif[ií]cio|eb[oó]|ritual recipe|receita ritual|receta ritual|initiat|possess|trance|incant|secret chant|diagnos|cure|cura|prescribe|prescri)/i.test(normalized);
}

function localGuideAnswer(message) {
  if (isRefusalPrompt(message)) {
    const refusals = {
      en: state.mode === "ai"
        ? "I can explain system boundaries, but I cannot make personal diagnoses, issue prescriptions, or claim authority beyond the reviewed material. Try asking about a model mechanism, limitation, or lesson."
        : "I can explain reviewed public knowledge, but I cannot divine, identify a personal Òrìṣà or odù, prescribe offerings, reproduce restricted liturgy, or impersonate a religious authority. I can help with history, concepts, public etiquette, or the boundary itself.",
      es: state.mode === "ai" ? "Puedo explicar límites del sistema, pero no realizar diagnósticos personales, emitir prescripciones ni reclamar autoridad. Pregunta por un mecanismo o una limitación." : "Puedo explicar conocimiento público revisado, pero no adivinar, identificar tu Òrìṣà u odù, prescribir ofrendas, reproducir liturgia restringida ni suplantar autoridad religiosa.",
      "pt-BR": state.mode === "ai" ? "Posso explicar limites do sistema, mas não fazer diagnósticos pessoais, emitir prescrições ou reivindicar autoridade. Pergunte sobre um mecanismo ou limitação." : "Posso explicar conhecimento público revisado, mas não divinar, identificar seu Òrìṣà ou odù, prescrever oferendas, reproduzir liturgia restrita ou imitar autoridade religiosa.",
      it: state.mode === "ai" ? "Posso spiegare i limiti del sistema, ma non fare diagnosi personali, prescrizioni o rivendicare autorità. Chiedi di un meccanismo o di un limite." : "Posso spiegare conoscenze pubbliche verificate, ma non divinare, identificare il tuo Òrìṣà o odù, prescrivere offerte, riprodurre liturgie riservate o imitare autorità religiose."
    };
    return refusals[state.locale] || refusals.en;
  }
  const tokens = message.toLocaleLowerCase(state.locale).split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 2);
  const candidates = buildSearchItems().map((item) => {
    const haystack = `${item.title} ${item.description} ${item.search}`.toLocaleLowerCase(state.locale);
    const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
    return { ...item, score };
  }).sort((a, b) => b.score - a.score);
  const best = candidates[0];
  if (best?.score > 0) {
    return `${best.title}\n\n${best.description}${best.href && best.external ? `\n\n${ui("source")}: ${best.href}` : ""}`;
  }
  const fallback = {
    en: state.mode === "ai"
      ? "I do not have a strong match in the reviewed technical lessons. Ask about representation, context, attention, training, emergence, evaluation, or human accountability."
      : "I do not have a strong match in the reviewed public corpus. Try asking about history, axé, orí, a public-facing Òrìṣà profile, Ifá’s literary structure, house diversity, or respectful visitor conduct.",
    es: "No encuentro una coincidencia sólida en el material revisado. Prueba con un concepto, una historia, una limitación o un pasaje concreto.",
    "pt-BR": "Não encontrei uma correspondência forte no material revisado. Pergunte sobre um conceito, história, limite ou passagem específica.",
    it: "Non trovo una corrispondenza solida nel materiale verificato. Chiedi un concetto, una storia, un limite o un passaggio specifico."
  };
  return fallback[state.locale] || fallback.en;
}

function appendMessage(role, text) {
  const message = document.createElement("div");
  message.className = `guide-message ${role}`;
  message.textContent = text;
  $("#guide-messages").append(message);
  $("#guide-messages").scrollTop = $("#guide-messages").scrollHeight;
}

async function askGuide(message) {
  conversation.push({ role: "user", content: message });
  appendMessage("user", message);
  $("#guide-status").textContent = ui("thinking");
  let answer = "";
  const localHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  if (localHost) {
    answer = localGuideAnswer(message);
  } else try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversation.slice(-8),
        locale: state.locale,
        mode: state.mode
      })
    });
    const payload = await response.json();
    answer = payload.reply || payload.answer || payload.response || "";
    if (!response.ok && !answer) throw new Error(`Guide unavailable: ${response.status}`);
    if (!answer) throw new Error("Guide returned no answer");
  } catch {
    answer = localGuideAnswer(message);
  }
  conversation.push({ role: "assistant", content: answer });
  conversation = conversation.slice(-10);
  appendMessage("assistant", answer);
  $("#guide-status").textContent = "";
}

function bindGlobalEvents() {
  window.addEventListener("scroll", () => {
    $(".site-header").classList.toggle("is-scrolled", window.scrollY > 30);
  }, { passive: true });
  $("#language-select").addEventListener("change", (event) => {
    state.locale = SUPPORTED_LOCALES.includes(event.target.value) ? event.target.value : "en";
    persist();
    renderAll();
  });
  $$("[data-set-mode]").forEach((button) => button.addEventListener("click", () => {
    if (state.mode === button.dataset.setMode) return;
    state.mode = button.dataset.setMode;
    conversation = [];
    $("#guide-messages").replaceChildren();
    $("#guide-panel").setAttribute("aria-hidden", "true");
    $("#guide-panel").setAttribute("inert", "");
    persist();
    renderAll();
    window.scrollTo({ top: Math.min(window.scrollY, $("#orientation-title").offsetTop), behavior: "smooth" });
  }));
  $("#open-drawer").addEventListener("click", openDrawer);
  $("#close-drawer").addEventListener("click", closeDrawer);
  $("#drawer-scrim").addEventListener("click", closeDrawer);
  $("#open-search").addEventListener("click", () => openSearch());
  $("#open-drawer-search").addEventListener("click", () => {
    closeDrawer();
    openSearch("all", $("#open-drawer"));
  });
  $("#library-search").addEventListener("input", renderSearchResults);
  $("#library-search").addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    $("#search-dialog").close();
  });
  $("#search-dialog").addEventListener("close", () => {
    if (searchReturnFocus?.isConnected && !searchReturnFocus.closest("[inert]")) {
      searchReturnFocus.focus();
    }
    searchReturnFocus = null;
  });
  [$("#open-method"), $("#hero-method"), $("#footer-method")].forEach((button) => button?.addEventListener("click", () => {
    renderMethod();
    $("#method-dialog").showModal();
  }));
  $("#footer-sources").addEventListener("click", () => openSearch("literature"));
  $("#reset-progress").addEventListener("click", () => {
    state.progress = emptyProgress();
    state.gates = {};
    persist();
    renderAll();
    showToast(ui("resetConfirm"));
  });
  $("#review-journey").addEventListener("click", () => {
    const unfinished = (SITE_CONTENT.lessons || []).findIndex((lesson) => !lessonDone(lesson.id));
    if (unfinished >= 0) {
      document.querySelector(`#lesson-${String(unfinished + 1).padStart(2, "0")}`)?.scrollIntoView({ behavior: "smooth" });
    } else {
      $("#capstone").scrollIntoView({ behavior: "smooth" });
    }
  });
  $("#open-guide").addEventListener("click", () => {
    $("#guide-panel").setAttribute("aria-hidden", "false");
    $("#guide-panel").removeAttribute("inert");
    $("#guide-input").focus();
    if (!$("#guide-messages").children.length) appendMessage("assistant", experience().guideBoundary);
  });
  $("#close-guide").addEventListener("click", () => {
    $("#guide-panel").setAttribute("aria-hidden", "true");
    $("#guide-panel").setAttribute("inert", "");
    $("#open-guide").focus();
  });
  $("#guide-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#guide-input");
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    askGuide(message);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName || "")) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape") {
      closeDrawer();
      $("#guide-panel").setAttribute("aria-hidden", "true");
      $("#guide-panel").setAttribute("inert", "");
    }
  });
}

bindGlobalEvents();
renderAll();
