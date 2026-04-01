export type TechniqueCategory = "Ukemi" | "Nage-waza" | "Katame-waza";

export interface Technique {
  id: string; // kebab-case
  name: string;
  category: TechniqueCategory;
  videoUrl?: string; // YouTube embed URL
  images?: string[]; 
  beltId: string; // reference to original belt
}

export interface Belt {
  id: string;
  name: string;
  slug: string;
  order: number; // For progression
  color: string; // Hex or Tailwind class
  history: string[];
  techniques: Technique[];
}

export const BELTS: Belt[] = [
  {
    id: "belt-branca-cinza",
    name: "Branca/Cinza",
    slug: "branca-cinza",
    order: 1,
    color: "bg-gray-100", // Soft mix
    history: [
      "O início do caminho do judoca.",
      "Aprendizado das quedas (Ukemi) para segurança básica."
    ],
    techniques: [
      { id: "ushiro-ukemi", name: "Ushiro-ukemi", category: "Ukemi", beltId: "belt-branca-cinza", videoUrl: "https://www.youtube.com/embed/example" },
      { id: "o-soto-gari", name: "O-soto-gari", category: "Nage-waza", beltId: "belt-branca-cinza" }
    ]
  },
  {
    id: "belt-cinza",
    name: "Cinza",
    slug: "cinza",
    order: 2,
    color: "bg-gray-500",
    history: [
      "Consolidação da base física.",
      "Introdução às imobilizações em solo."
    ],
    techniques: [
      { id: "o-goshi", name: "O-goshi", category: "Nage-waza", beltId: "belt-cinza" },
      { id: "hon-kesa-gatame", name: "Hon-kesa-gatame", category: "Katame-waza", beltId: "belt-cinza" }
    ]
  },
  {
    id: "belt-cinza-azul",
    name: "Cinza/Azul",
    slug: "cinza-azul",
    order: 3,
    color: "bg-blue-300",
    history: [
      "Fase de transição com foco em movimentos mais amplos."
    ],
    techniques: [
      { id: "ippon-seoi-nage", name: "Ippon-seoi-nage", category: "Nage-waza", beltId: "belt-cinza-azul" },
      { id: "yoko-shiho-gatame", name: "Yoko-shiho-gatame", category: "Katame-waza", beltId: "belt-cinza-azul" }
    ]
  },
  {
    id: "belt-azul",
    name: "Azul",
    slug: "azul",
    order: 4,
    color: "bg-blue-600",
    history: [
      "Maior dinâmica de quadril e velocidade.",
      "Estudos iniciais de estrangulamentos básicos (quando aplicável ou simulado para conhecimento)."
    ],
    techniques: [
      { id: "ko-uchi-gari", name: "Ko-uchi-gari", category: "Nage-waza", beltId: "belt-azul" },
      { id: "kami-shiho-gatame", name: "Kami-shiho-gatame", category: "Katame-waza", beltId: "belt-azul" }
    ]
  },
  {
    id: "belt-azul-amarela",
    name: "Azul/Amarela",
    slug: "azul-amarela",
    order: 5,
    color: "bg-yellow-200",
    history: [
      "Desenvolvimento de combinações e sequência de pernas."
    ],
    techniques: [
      { id: "o-uchi-gari", name: "O-uchi-gari", category: "Nage-waza", beltId: "belt-azul-amarela" },
      { id: "tate-shiho-gatame", name: "Tate-shiho-gatame", category: "Katame-waza", beltId: "belt-azul-amarela" }
    ]
  },
  {
    id: "belt-amarela",
    name: "Amarela",
    slug: "amarela",
    order: 6,
    color: "bg-yellow-400",
    history: [
      "Forte presença no randori (luta de treinamento).",
      "Combinações avançadas e independência em combate."
    ],
    techniques: [
      { id: "tsuri-komi-goshi", name: "Tsuri-komi-goshi", category: "Nage-waza", beltId: "belt-amarela" },
      { id: "kata-gatame", name: "Kata-gatame", category: "Katame-waza", beltId: "belt-amarela" }
    ]
  },
  {
    id: "belt-amarela-laranja",
    name: "Amarela/Laranja",
    slug: "amarela-laranja",
    order: 7,
    color: "bg-orange-300",
    history: [
      "Exploração do centro de gravidade e ashi-waza complexos."
    ],
    techniques: [
      { id: "harai-goshi", name: "Harai-goshi", category: "Nage-waza", beltId: "belt-amarela-laranja" },
      { id: "kuzure-kesa-gatame", name: "Kuzure-kesa-gatame", category: "Katame-waza", beltId: "belt-amarela-laranja" }
    ]
  },
  {
    id: "belt-laranja",
    name: "Laranja",
    slug: "laranja",
    order: 8,
    color: "bg-orange-500",
    history: [
      "Refinamento das técnicas de sacrifício iniciantes.",
      "Melhor controle de pegada (Kumi-kata)."
    ],
    techniques: [
      { id: "uchi-mata", name: "Uchi-mata", category: "Nage-waza", beltId: "belt-laranja" },
      { id: "nami-juji-jime", name: "Nami-juji-jime", category: "Katame-waza", beltId: "belt-laranja" }
    ]
  },
  {
    id: "belt-verde",
    name: "Verde",
    slug: "verde",
    order: 9,
    color: "bg-green-600",
    history: [
      "Domínio das transições (Nage-waza para Ne-waza).",
      "Sutemi-waza formal em progressão."
    ],
    techniques: [
      { id: "tomoe-nage", name: "Tomoe-nage", category: "Nage-waza", beltId: "belt-verde" },
      { id: "gyaku-juji-jime", name: "Gyaku-juji-jime", category: "Katame-waza", beltId: "belt-verde" }
    ]
  },
  {
    id: "belt-roxa",
    name: "Roxa",
    slug: "roxa",
    order: 10,
    color: "bg-purple-600",
    history: [
      "Domínio de contragolpes (kaeshi-waza).",
      "Alavancas e chaves articulares sistêmicas (Kansetsu-waza)."
    ],
    techniques: [
      { id: "sumi-gaeshi", name: "Sumi-gaeshi", category: "Nage-waza", beltId: "belt-roxa" },
      { id: "ude-hishigi-juji-gatame", name: "Ude-hishigi-juji-gatame", category: "Katame-waza", beltId: "belt-roxa" }
    ]
  },
  {
    id: "belt-marrom",
    name: "Marrom",
    slug: "marrom",
    order: 11,
    color: "bg-amber-800",
    history: [
      "Estudos focais do Gokyo e Nage-no-kata integrais.",
      "Preparação máxima para a graduação."
    ],
    techniques: [
      { id: "yoko-wakare", name: "Yoko-wakare", category: "Nage-waza", beltId: "belt-marrom" },
      { id: "ude-garami", name: "Ude-garami", category: "Katame-waza", beltId: "belt-marrom" }
    ]
  },
  {
    id: "belt-preta",
    name: "Preta",
    slug: "preta",
    order: 12,
    color: "bg-black",
    history: [
      "O domínio do caminho suave e o início de uma nova jornada como expert."
    ],
    techniques: [
      { id: "ura-nage", name: "Ura-nage", category: "Nage-waza", beltId: "belt-preta" },
      { id: "okuri-eri-jime", name: "Okuri-eri-jime", category: "Katame-waza", beltId: "belt-preta" }
    ]
  }
];

/**
 * find current belt
 * collect all belts with order <= current
 * merge all techniques
 * return unified list
 */
export function getTechniquesForBelt(beltId: string): Technique[] {
  const targetBelt = BELTS.find(b => b.id === beltId || b.slug === beltId);
  if (!targetBelt) return [];

  return BELTS
    .filter(b => b.order <= targetBelt.order)
    .flatMap(b => b.techniques);
}

/**
 * Returns a belt payload containing its cumulative aggregated techniques
 */
export function getBeltData(beltSlug: string): (Belt & { allTechniques: Technique[] }) | undefined {
  const targetBelt = BELTS.find(b => b.slug === beltSlug);
  if (!targetBelt) return undefined;

  const allTechniques = getTechniquesForBelt(targetBelt.id);
  
  return {
    ...targetBelt,
    allTechniques
  };
}
