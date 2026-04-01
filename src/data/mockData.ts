export type TechniqueCategory = "Ukemi" | "Nage-waza" | "Katame-waza" | "Kumi-kata";

export interface Technique {
  id: string;
  name: string;
  category: TechniqueCategory;
  videoId?: string; // YouTube video ID (e.g., dQw4w9WgXcQ)
}

export interface Belt {
  id: string;
  name: string;
  slug: string;
  colorVar: string; // CSS variable for background
  description: string;
  order: number;
  techniques: Technique[];
}

export const BELTS: Belt[] = [
  {
    id: "b1",
    name: "Branca/Cinza",
    slug: "branca-cinza",
    colorVar: "var(--color-belt-branca)",
    order: 1,
    description: "O início do caminho. Onde o praticante aprende a cair e os princípios básicos do desequilíbrio e pegada.",
    techniques: [
      { id: "t1", name: "Ushiro-Ukemi", category: "Ukemi", videoId: "example" },
      { id: "t2", name: "O-soto-gari", category: "Nage-waza", videoId: "example" }
    ]
  },
  {
    id: "b2",
    name: "Cinza",
    slug: "cinza",
    colorVar: "var(--color-belt-cinza)",
    order: 2,
    description: "Consolidação dos fundamentos básicos. Mais projeções com apoio das duas pernas.",
    techniques: [
      { id: "t3", name: "O-goshi", category: "Nage-waza", videoId: "example" },
      { id: "t4", name: "Kesa-gatame", category: "Katame-waza", videoId: "example" }
    ]
  },
  {
    id: "b3",
    name: "Cinza/Azul",
    slug: "cinza-azul",
    colorVar: "var(--color-belt-azul)", // For simplicity, we just use the dominant color
    order: 3,
    description: "Transição para técnicas de maior amplitude.",
    techniques: [
      { id: "t5", name: "Ippon-seoi-nage", category: "Nage-waza" }
    ]
  },
  {
    id: "b4",
    name: "Azul",
    slug: "azul",
    colorVar: "var(--color-belt-azul)",
    order: 4,
    description: "Técnicas que requerem mais giro do quadril e coordenação.",
    techniques: [
      { id: "t6", name: "Tai-otoshi", category: "Nage-waza" },
      { id: "t7", name: "Yoko-shiho-gatame", category: "Katame-waza" }
    ]
  },
  {
    id: "b5",
    name: "Azul/Amarela",
    slug: "azul-amarela",
    colorVar: "var(--color-belt-amarela)",
    order: 5,
    description: "Fase intermediária.",
    techniques: [
      { id: "t8", name: "Ko-uchi-gari", category: "Nage-waza" }
    ]
  },
  {
    id: "b6",
    name: "Amarela",
    slug: "amarela",
    colorVar: "var(--color-belt-amarela)",
    order: 6,
    description: "O praticante ganha independência no randori.",
    techniques: [
      { id: "t9", name: "O-uchi-gari", category: "Nage-waza" },
      { id: "t10", name: "Kami-shiho-gatame", category: "Katame-waza" }
    ]
  },
  {
    id: "b7",
    name: "Amarela/Laranja",
    slug: "amarela-laranja",
    colorVar: "var(--color-belt-laranja)",
    order: 7,
    description: "Aprofundamento nas combinações de ashi-waza.",
    techniques: [
      { id: "t11", name: "Tsuri-komi-goshi", category: "Nage-waza" }
    ]
  },
  {
    id: "b8",
    name: "Laranja",
    slug: "laranja",
    colorVar: "var(--color-belt-laranja)",
    order: 8,
    description: "Maior entendimento do centro de gravidade do oponente.",
    techniques: [
      { id: "t12", name: "Harai-goshi", category: "Nage-waza" },
      { id: "t13", name: "Tate-shiho-gatame", category: "Katame-waza" }
    ]
  },
  {
    id: "b9",
    name: "Verde",
    slug: "verde",
    colorVar: "var(--color-belt-verde)",
    order: 9,
    description: "Introdução a técnicas de sacrifício (sutemi-waza) e estrangulamentos básicos.",
    techniques: [
      { id: "t14", name: "Uchi-mata", category: "Nage-waza" },
      { id: "t15", name: "Nami-juji-jime", category: "Katame-waza" }
    ]
  },
  {
    id: "b10",
    name: "Roxa",
    slug: "roxa",
    colorVar: "var(--color-belt-roxa)",
    order: 10,
    description: "Domínio de contragolpes (kaeshi-waza) e alavancas iniciais.",
    techniques: [
      { id: "t16", name: "Seoi-otoshi", category: "Nage-waza" },
      { id: "t17", name: "Ude-garami", category: "Katame-waza" }
    ]
  },
  {
    id: "b11",
    name: "Marrom",
    slug: "marrom",
    colorVar: "var(--color-belt-marrom)",
    order: 11,
    description: "Aperfeiçoamento focado para o exame final, englobando o Gokyo e Nage-no-kata.",
    techniques: [
      { id: "t18", name: "Sumi-gaeshi", category: "Nage-waza" },
      { id: "t19", name: "Juji-gatame", category: "Katame-waza" }
    ]
  },
  {
    id: "b12",
    name: "Preta",
    slug: "preta",
    colorVar: "var(--color-belt-preta)",
    order: 12,
    description: "O recomeço.",
    techniques: [
      { id: "t20", name: "Yoko-wakare", category: "Nage-waza" }
    ]
  }
];

/**
 * Returns the requested belt and dynamically aggregates ALL techniques
 * from this belt and all previous belts in the progression, exactly as requested.
 * Prevents duplicating data structures.
 */
export function getBeltWithCumulativeTechniques(slug: string): Belt | undefined {
  const targetBelt = BELTS.find(b => b.slug === slug);
  if (!targetBelt) return undefined;

  // Aggregate techniques from all belts up to (and including) the target belt
  const accumulatedTechniques = BELTS
    .filter(b => b.order <= targetBelt.order)
    .flatMap(b => b.techniques);

  return {
    ...targetBelt,
    techniques: accumulatedTechniques
  };
}
