/**
 * WazaHub - Core Data Layer
 * Real Structured Judo Data with Cumulative Progression logic.
 */

export type Technique = {
  id: string;
  name: string;
  category: string;
  videoUrl?: string;
  images?: string[];
};

export type Belt = {
  id: string;
  name: string;
  history: string[];
  techniques: Technique[];
  // UI Specific fields (added for compatibility)
  colors: string[];
  slug: string;
};

// Internal mapping for UI aesthetics (colors from previous design system)
const BELT_COLORS: Record<string, string[]> = {
  "branca-cinza": ["bg-white", "bg-gray-400"],
  "cinza": ["bg-gray-400"],
  "cinza-azul": ["bg-gray-400", "bg-blue-600"],
  "azul": ["bg-blue-600"],
  "azul-amarela": ["bg-blue-600", "bg-yellow-400"],
  "amarela": ["bg-yellow-400"],
  "amarela-laranja": ["bg-yellow-400", "bg-orange-500"],
  "laranja": ["bg-orange-500"],
  "verde": ["bg-green-600"],
  "roxa": ["bg-purple-600"],
  "marrom": ["bg-amber-800"],
  "preta": ["bg-black"],
};

const rawData = {
  "belts": [
    {
      "id": "branca-cinza",
      "name": "Branca/Cinza",
      "history": [
        "Saudações: Ritsu-Rei (em pé) e Za-Rei (ajoelhado)",
        "Vocabulário: SENSEI - Professor"
      ],
      "techniques": [
        {
          "id": "ushiro-ukemi",
          "name": "Ushiro Ukemi",
          "category": "Ukemi"
        },
        {
          "id": "yoko-ukemi",
          "name": "Yoko Ukemi",
          "category": "Ukemi"
        },
        {
          "id": "o-soto-gari",
          "name": "O-Soto-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        }
      ]
    },
    {
      "id": "cinza",
      "name": "Cinza",
      "history": [
        "Histórico: JIGORO KANO - Nome do criador do JUDÔ",
        "Vocabulário: TATAMI - Peças que compõe o local de treinamento",
        "Vocabulário: JUDOGI - Uniforme do praticante de judô",
        "Vocabulário: CONTAR ATÉ 10 - Ichi, ni, san, shi, go, roku, shiti, hachi, kyuu, juu"
      ],
      "techniques": [
        {
          "id": "ushiro-ukemi",
          "name": "Ushiro Ukemi",
          "category": "Ukemi"
        },
        {
          "id": "yoko-ukemi",
          "name": "Yoko Ukemi",
          "category": "Ukemi"
        },
        {
          "id": "zenpo-kaiten-ukemi",
          "name": "Zenpo-Kaiten-Ukemi",
          "category": "Ukemi"
        },
        {
          "id": "o-soto-gari",
          "name": "O-Soto-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "o-uchi-gari",
          "name": "O-Uchi-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        }
      ]
    },
    {
      "id": "cinza-azul",
      "name": "Cinza/Azul",
      "history": [
        "Histórico: KODOKAN - Primeira escola de JUDÔ",
        "Vocabulário: MATTE - Parar",
        "Vocabulário: HAJIME - Começar",
        "Vocabulário: SOREMADE - Terminou",
        "Vocabulário: SONOMAMA - Não se mova",
        "Vocabulário: KIOTSUKE - Atenção, posição de sentido"
      ],
      "techniques": [
        {
          "id": "formas-kumi-kata",
          "name": "Formas de pegar no Judogi",
          "category": "Kumi-kata"
        },
        {
          "id": "ushiro-ukemi",
          "name": "Ushiro Ukemi",
          "category": "Ukemi"
        },
        {
          "id": "yoko-ukemi",
          "name": "Yoko Ukemi",
          "category": "Ukemi"
        },
        {
          "id": "zenpo-kaiten-ukemi",
          "name": "Zenpo-Kaiten-Ukemi",
          "category": "Ukemi"
        },
        {
          "id": "o-soto-gari",
          "name": "O-Soto-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "o-uchi-gari",
          "name": "O-Uchi-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "uki-goshi",
          "name": "Uki-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        }
      ]
    },
    {
      "id": "azul",
      "name": "Azul",
      "history": [
        "Princípio do Judô: Quem teme perder já está vencido.",
        "Histórico: FUNDAÇÃO DA KODOKAN: Maio de 1882",
        "Histórico: JU JUTSU: Arte que deu origem ao JUDÔ",
        "Saber amarrar a faixa corretamente",
        "Vocabulário: JUDOGI (Uniforme para prática de JUDÔ), SHITABAKI (Calça), UWAGI (Casaco), OBI (Faixa), ZORI (Chinelo)"
      ],
      "techniques": [
        {
          "id": "happo-kuzushi",
          "name": "Happo-Kuzushi (8 direções de desequilíbrio)",
          "category": "Kuzushi"
        },
        {
          "id": "o-soto-gari",
          "name": "O-Soto-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "o-uchi-gari",
          "name": "O-Uchi-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "uki-goshi",
          "name": "Uki-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "de-ashi-harai",
          "name": "De-Ashi-Harai",
          "category": "Nage-waza"
        },
        {
          "id": "renraku-ouchi-deashi",
          "name": "O-Uchi-Gari > De-Ashi-Harai",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        }
      ]
    },
    {
      "id": "azul-amarela",
      "name": "Azul/Amarela",
      "history": [
        "Princípio do Judô: Conhecer-se é dominar-se, dominar-se é triunfar.",
        "Histórico: NASCIMENTO JIGORO KANO: 28 de Outubro de 1860, Mikage, JAPÃO",
        "Saber ordem das faixas no Judô (Básicas, Intermediárias, Yudansha, Kodansha)",
        "Vocabulário: UCHI-KOMI (Treinamento de entrada de técnicas), RANDORI (Treinamento livre), SHIAI (Competição), SHIAI-JÔ (Área de competição), DOJÔ (Área de treinamento)"
      ],
      "techniques": [
        {
          "id": "shizen-hon-tai",
          "name": "Shizen-Hon-Tai (Migi e Hidari)",
          "category": "Shisei"
        },
        {
          "id": "jigo-hon-tai",
          "name": "Jigo-Hon-Tai (Migi e Hidari)",
          "category": "Shisei"
        },
        {
          "id": "o-soto-gari",
          "name": "O-Soto-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "o-uchi-gari",
          "name": "O-Uchi-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "uki-goshi",
          "name": "Uki-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "de-ashi-harai",
          "name": "De-Ashi-Harai",
          "category": "Nage-waza"
        },
        {
          "id": "o-goshi",
          "name": "O-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kami-shiho-gatame",
          "name": "Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "renraku-ouchi-deashi",
          "name": "O-Uchi-Gari > De-Ashi-Harai",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-osoto-kesa",
          "name": "O-Soto-Gari > Kesa-Gatame",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "kaeshi-ouchi-ogoshi",
          "name": "O-Uchi-Gari > O-Goshi",
          "category": "Kaeshi-waza"
        }
      ]
    },
    {
      "id": "amarela",
      "name": "Amarela",
      "history": [
        "Princípio do Judô: O Judoca não se aperfeiçoa para lutar, luta para se aperfeiçoar.",
        "Histórico: MORTE JIGORO KANO: 4 de maio de 1938 a bordo de um navio, voltando do Cairo, Egito",
        "Vocabulário: UKE (Judoca passivo), TORI (Judoca ativo)"
      ],
      "techniques": [
        {
          "id": "ayumi-ashi",
          "name": "Ayumi-Ashi",
          "category": "Shintai"
        },
        {
          "id": "tsugi-ashi",
          "name": "Tsugi-Ashi",
          "category": "Shintai"
        },
        {
          "id": "o-soto-gari",
          "name": "O-Soto-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "o-uchi-gari",
          "name": "O-Uchi-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "uki-goshi",
          "name": "Uki-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "de-ashi-harai",
          "name": "De-Ashi-Harai",
          "category": "Nage-waza"
        },
        {
          "id": "o-goshi",
          "name": "O-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "seoi-nage",
          "name": "Seoi-Nage",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kami-shiho-gatame",
          "name": "Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "ushiro-kesa-gatame",
          "name": "Ushiro-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "renraku-ouchi-deashi",
          "name": "O-Uchi-Gari > De-Ashi-Harai",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-osoto-kesa",
          "name": "O-Soto-Gari > Kesa-Gatame",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-deashi-osoto",
          "name": "De-Ashi-Harai > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "kaeshi-ouchi-ogoshi",
          "name": "O-Uchi-Gari > O-Goshi",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-seoi",
          "name": "O-Uchi-Gari > Seoi-Nage",
          "category": "Kaeshi-waza"
        }
      ]
    },
    {
      "id": "amarela-laranja",
      "name": "Amarela/Laranja",
      "history": [
        "Princípios do Judô: Melhor uso da energia (SEIRYOKU ZEN'YO). Prosperidade e benefícios mútuos (JITA KYOEI)",
        "Histórico: PRIMEIRO CAMPEONATO BRASILEIRO DE JUDÔ: Ocorreu no ano de 1954, no Rio de Janeiro - RJ",
        "Vocabulário: JU: Suave, DO: Caminho, JUDO: Caminho Suave"
      ],
      "techniques": [
        {
          "id": "mae-sabaki",
          "name": "Mae-Sabaki (Migi e Hidari)",
          "category": "Tai-sabaki"
        },
        {
          "id": "ushiro-sabaki",
          "name": "Ushiro-Sabaki (Migi e Hidari)",
          "category": "Tai-sabaki"
        },
        {
          "id": "mae-mawari-sabaki",
          "name": "Mae-Mawari-Sabaki (Migi e Hidari)",
          "category": "Tai-sabaki"
        },
        {
          "id": "ushiro-mawari-sabaki",
          "name": "Ushiro-Mawari-Sabaki (Migi e Hidari)",
          "category": "Tai-sabaki"
        },
        {
          "id": "o-soto-gari",
          "name": "O-Soto-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "o-uchi-gari",
          "name": "O-Uchi-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "uki-goshi",
          "name": "Uki-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "de-ashi-harai",
          "name": "De-Ashi-Harai",
          "category": "Nage-waza"
        },
        {
          "id": "o-goshi",
          "name": "O-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "seoi-nage",
          "name": "Seoi-Nage",
          "category": "Nage-waza"
        },
        {
          "id": "hiza-guruma",
          "name": "Hiza-Guruma",
          "category": "Nage-waza"
        },
        {
          "id": "sasae-tsuri-komi-ashi",
          "name": "Sasae-Tsuri-Komi-Ashi",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kami-shiho-gatame",
          "name": "Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "ushiro-kesa-gatame",
          "name": "Ushiro-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "tate-shiho-gatame",
          "name": "Tate-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "renraku-ouchi-deashi",
          "name": "O-Uchi-Gari > De-Ashi-Harai",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-osoto-kesa",
          "name": "O-Soto-Gari > Kesa-Gatame",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-deashi-osoto",
          "name": "De-Ashi-Harai > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-hiza-seoi",
          "name": "Hiza-Guruma > Seoi-Nage",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "kaeshi-ouchi-ogoshi",
          "name": "O-Uchi-Gari > O-Goshi",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-seoi",
          "name": "O-Uchi-Gari > Seoi-Nage",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-sasae-deashi",
          "name": "Sasae-Tsuri-Komi-Ashi > De-Ashi-Harai",
          "category": "Kaeshi-waza"
        }
      ]
    },
    {
      "id": "laranja",
      "name": "Laranja",
      "history": [
        "Princípios do Judô: Somente se aproxima da perfeição, quem a procura com constância, sabedoria e sobretudo, humildade.",
        "Histórico: INCLUSÃO DO JUDÔ NOS JOGOS OLÍMPICOS: A primeira vez em 1964, nas olimpíadas de Tóquio, como teste. E em 1972 oficial.",
        "Vocabulário: FASES DA PROJEÇÃO (KUZUSHI, TSUKURI, KAKE, HAPPO-KUZUSHI), LADOS (MIGI, HIDARI), MOKUSÔ, NAGE-WAZA, OSAE-KOMI-WAZA"
      ],
      "techniques": [
        {
          "id": "ko-soto-gari",
          "name": "Ko-Soto-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "ko-uchi-gari",
          "name": "Ko-Uchi-Gari",
          "category": "Nage-waza"
        },
        {
          "id": "koshi-guruma",
          "name": "Koshi-Guruma",
          "category": "Nage-waza"
        },
        {
          "id": "tsuri-komi-goshi",
          "name": "Tsuri-Komi-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "okuri-ashi-harai",
          "name": "Okuri-Ashi-Harai",
          "category": "Nage-waza"
        },
        {
          "id": "tai-otoshi",
          "name": "Tai-Otoshi",
          "category": "Nage-waza"
        },
        {
          "id": "harai-goshi",
          "name": "Harai-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "uchi-mata",
          "name": "Uchi-Mata",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kami-shiho-gatame",
          "name": "Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "ushiro-kesa-gatame",
          "name": "Ushiro-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "tate-shiho-gatame",
          "name": "Tate-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kami-shiho-gatame",
          "name": "Kuzure-Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "renraku-ouchi-deashi",
          "name": "O-Uchi-Gari > De-Ashi-Harai",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-osoto-kesa",
          "name": "O-Soto-Gari > Kesa-Gatame",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-deashi-osoto",
          "name": "De-Ashi-Harai > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-hiza-seoi",
          "name": "Hiza-Guruma > Seoi-Nage",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-uchimata-kouchi",
          "name": "Uchi-Mata > Ko-Uchi-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "kaeshi-ouchi-ogoshi",
          "name": "O-Uchi-Gari > O-Goshi",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-seoi",
          "name": "O-Uchi-Gari > Seoi-Nage",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-sasae-deashi",
          "name": "Sasae-Tsuri-Komi-Ashi > De-Ashi-Harai",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ukigoshi-koshiguruma",
          "name": "Uki-Goshi > Koshi-Guruma",
          "category": "Kaeshi-waza"
        }
      ]
    },
    {
      "id": "verde",
      "name": "Verde",
      "history": [
        "Princípios do Judô: A única vitória que perdura, é a que se conquista sobre a própria ignorância.",
        "Histórico: CAMPEONATOS MUNDIAIS NO BRASIL: 1965, 2007,2013... PRIMEIRO CAMPEONATO MUNDIAL: Em 1956 no Japão.",
        "Vocabulário: RANDORI: Treinamento livre, KATA: Formas, SHIAI: Competição"
      ],
      "techniques": [
        {
          "id": "ko-soto-gake",
          "name": "Ko-Soto-Gake",
          "category": "Nage-waza"
        },
        {
          "id": "tsuri-goshi",
          "name": "Tsuri-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "yoko-otoshi",
          "name": "Yoko-Otoshi",
          "category": "Nage-waza"
        },
        {
          "id": "ashi-guruma",
          "name": "Ashi-Guruma",
          "category": "Nage-waza"
        },
        {
          "id": "hane-goshi",
          "name": "Hane-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "tomoe-nage",
          "name": "Tomoe-Nage",
          "category": "Nage-waza"
        },
        {
          "id": "kata-guruma",
          "name": "Kata-Guruma",
          "category": "Nage-waza"
        },
        {
          "id": "harai-tsuri-komi-ashi",
          "name": "Harai-Tsuri-Komi-Ashi",
          "category": "Nage-waza"
        },
        {
          "id": "uki-otoshi",
          "name": "Uki-Otoshi",
          "category": "Nage-waza"
        },
        {
          "id": "seoi-nage",
          "name": "Seoi-Nage",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kami-shiho-gatame",
          "name": "Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "ushiro-kesa-gatame",
          "name": "Ushiro-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "tate-shiho-gatame",
          "name": "Tate-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kami-shiho-gatame",
          "name": "Kuzure-Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kata-gatame",
          "name": "Kata-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "renraku-ouchi-deashi",
          "name": "O-Uchi-Gari > De-Ashi-Harai",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-osoto-kesa",
          "name": "O-Soto-Gari > Kesa-Gatame",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-deashi-osoto",
          "name": "De-Ashi-Harai > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-hiza-seoi",
          "name": "Hiza-Guruma > Seoi-Nage",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-uchimata-kouchi",
          "name": "Uchi-Mata > Ko-Uchi-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-haraigoshi-osoto",
          "name": "Harai-Goshi > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "kaeshi-ouchi-ogoshi",
          "name": "O-Uchi-Gari > O-Goshi",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-seoi",
          "name": "O-Uchi-Gari > Seoi-Nage",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-sasae-deashi",
          "name": "Sasae-Tsuri-Komi-Ashi > De-Ashi-Harai",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ukigoshi-koshiguruma",
          "name": "Uki-Goshi > Koshi-Guruma",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-tomoenage",
          "name": "O-Uchi-Gari > Tomoe-Nage",
          "category": "Kaeshi-waza"
        }
      ]
    },
    {
      "id": "roxa",
      "name": "Roxa",
      "history": [
        "Princípios do Judô: Nunca te orgulhes de haver vencido um adversário, ao que venceste hoje, poderá vencer-te amanhã.",
        "Vocabulário: Saber classificação das técnicas de JUDÔ (NAGE-WAZA, TACHI-WAZA, TE-WAZA, KOSHI-WAZA, ASHI-WAZA, SUTEMI-WAZA, MA-SUTEMI-WAZA, YOKO-SUTEMI-WAZA, KATAME-WAZA, OSAE-KOMI-WAZA, SHIME-WAZA, KANSETSU-WAZA, ATEMI-WAZA)"
      ],
      "techniques": [
        {
          "id": "sumi-gaeshi",
          "name": "Sumi-Gaeshi",
          "category": "Nage-waza"
        },
        {
          "id": "tani-otoshi",
          "name": "Tani-Otoshi",
          "category": "Nage-waza"
        },
        {
          "id": "hane-makikomi",
          "name": "Hane-Makikomi",
          "category": "Nage-waza"
        },
        {
          "id": "sukui-nage",
          "name": "Sukui-Nage",
          "category": "Nage-waza"
        },
        {
          "id": "utsuri-goshi",
          "name": "Utsuri-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "o-guruma",
          "name": "O-Guruma",
          "category": "Nage-waza"
        },
        {
          "id": "soto-makikomi",
          "name": "Soto-Makikomi",
          "category": "Nage-waza"
        },
        {
          "id": "uki-otoshi",
          "name": "Uki-Otoshi",
          "category": "Nage-waza"
        },
        {
          "id": "uki-goshi",
          "name": "Uki-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "harai-goshi",
          "name": "Harai-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "tsuri-komi-goshi",
          "name": "Tsuri-Komi-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kami-shiho-gatame",
          "name": "Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "ushiro-kesa-gatame",
          "name": "Ushiro-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "tate-shiho-gatame",
          "name": "Tate-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kami-shiho-gatame",
          "name": "Kuzure-Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kata-gatame",
          "name": "Kata-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "ura-gatame",
          "name": "Ura-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "hadaka-jime",
          "name": "Hadaka-Jime",
          "category": "Shime-waza"
        },
        {
          "id": "okuri-eri-jime",
          "name": "Okuri-Eri-Jime",
          "category": "Shime-waza"
        },
        {
          "id": "renraku-ouchi-deashi",
          "name": "O-Uchi-Gari > De-Ashi-Harai",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-osoto-kesa",
          "name": "O-Soto-Gari > Kesa-Gatame",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-deashi-osoto",
          "name": "De-Ashi-Harai > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-hiza-seoi",
          "name": "Hiza-Guruma > Seoi-Nage",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-uchimata-kouchi",
          "name": "Uchi-Mata > Ko-Uchi-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-haraigoshi-osoto",
          "name": "Harai-Goshi > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-haraigoshi-sotomakikomi",
          "name": "Harai-Goshi > Soto-Makikomi",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "kaeshi-ouchi-ogoshi",
          "name": "O-Uchi-Gari > O-Goshi",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-seoi",
          "name": "O-Uchi-Gari > Seoi-Nage",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-sasae-deashi",
          "name": "Sasae-Tsuri-Komi-Ashi > De-Ashi-Harai",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ukigoshi-koshiguruma",
          "name": "Uki-Goshi > Koshi-Guruma",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-tomoenage",
          "name": "O-Uchi-Gari > Tomoe-Nage",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-koshiguruma-utsurigoshi",
          "name": "Koshi-Guruma > Utsuri-Goshi",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-haraigoshi-ushirogoshi",
          "name": "Harai-Goshi > Ushiro-Goshi",
          "category": "Kaeshi-waza"
        }
      ]
    },
    {
      "id": "marrom",
      "name": "Marrom",
      "history": [
        "Princípios do Judô: Quando verificares com tristeza que nada sabes, terás feito teu primeiro progresso no aprendizado.",
        "Vocabulário: KÔDANSHA - Título de alta graduação, específico do Judô, criado pelo Instituto Kodokan...",
        "Noções Básicas de Arbitragem: PONTUAÇÕES (IPPON, WAZARI, WAZARI-AWASETE-IPPON). COMANDOS (MATTE, HAJIME, SORDEMADE, SONOMAMA, OSAE-KOMI, TOKETA). PUNIÇÕES (SHIDO, HANSOKU-MAKE).",
        "SABER GESTOS, VOZ DE COMANDO E AVALIAÇÃO DE PONTUAÇÕES E ATUAR COMO OFICIAL EM MESAS DE COMPETIÇÃO"
      ],
      "techniques": [
        {
          "id": "o-soto-guruma",
          "name": "O-Soto-Guruma",
          "category": "Nage-waza"
        },
        {
          "id": "uki-waza",
          "name": "Uki-Waza",
          "category": "Nage-waza"
        },
        {
          "id": "yoko-wakare",
          "name": "Yoko-Wakare",
          "category": "Nage-waza"
        },
        {
          "id": "yoko-guruma",
          "name": "Yoko-Guruma",
          "category": "Nage-waza"
        },
        {
          "id": "ushiro-goshi",
          "name": "Ushiro-Goshi",
          "category": "Nage-waza"
        },
        {
          "id": "ura-nage",
          "name": "Ura-Nage",
          "category": "Nage-waza"
        },
        {
          "id": "sumi-otoshi",
          "name": "Sumi-Otoshi",
          "category": "Nage-waza"
        },
        {
          "id": "yoko-gake",
          "name": "Yoko-Gake",
          "category": "Nage-waza"
        },
        {
          "id": "okuri-ashi-harai",
          "name": "Okuri-Ashi-Harai",
          "category": "Nage-waza"
        },
        {
          "id": "sasae-tsuri-komi-ashi",
          "name": "Sasae-Tsuri-Komi-Ashi",
          "category": "Nage-waza"
        },
        {
          "id": "uchi-mata",
          "name": "Uchi-Mata",
          "category": "Nage-waza"
        },
        {
          "id": "kesa-gatame",
          "name": "Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kesa-gatame",
          "name": "Kuzure-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "yoko-shiho-gatame",
          "name": "Yoko-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kami-shiho-gatame",
          "name": "Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "ushiro-kesa-gatame",
          "name": "Ushiro-Kesa-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "tate-shiho-gatame",
          "name": "Tate-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kuzure-kami-shiho-gatame",
          "name": "Kuzure-Kami-Shiho-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "kata-gatame",
          "name": "Kata-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "ura-gatame",
          "name": "Ura-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "uki-gatame",
          "name": "Uki-Gatame",
          "category": "Osae-komi-waza"
        },
        {
          "id": "hadaka-jime",
          "name": "Hadaka-Jime",
          "category": "Shime-waza"
        },
        {
          "id": "okuri-eri-jime",
          "name": "Okuri-Eri-Jime",
          "category": "Shime-waza"
        },
        {
          "id": "kata-ha-jime",
          "name": "Kata-Ha-Jime",
          "category": "Shime-waza"
        },
        {
          "id": "sode-guruma-jime",
          "name": "Sode-Guruma-Jime",
          "category": "Shime-waza"
        },
        {
          "id": "renraku-ouchi-deashi",
          "name": "O-Uchi-Gari > De-Ashi-Harai",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-osoto-kesa",
          "name": "O-Soto-Gari > Kesa-Gatame",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-deashi-osoto",
          "name": "De-Ashi-Harai > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-hiza-seoi",
          "name": "Hiza-Guruma > Seoi-Nage",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-uchimata-kouchi",
          "name": "Uchi-Mata > Ko-Uchi-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-haraigoshi-osoto",
          "name": "Harai-Goshi > O-Soto-Gari",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "renraku-haraigoshi-sotomakikomi",
          "name": "Harai-Goshi > Soto-Makikomi",
          "category": "Renraku-henka-waza"
        },
        {
          "id": "kaeshi-ouchi-ogoshi",
          "name": "O-Uchi-Gari > O-Goshi",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-seoi",
          "name": "O-Uchi-Gari > Seoi-Nage",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-sasae-deashi",
          "name": "Sasae-Tsuri-Komi-Ashi > De-Ashi-Harai",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ukigoshi-koshiguruma",
          "name": "Uki-Goshi > Koshi-Guruma",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-ouchi-tomoenage",
          "name": "O-Uchi-Gari > Tomoe-Nage",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-koshiguruma-utsurigoshi",
          "name": "Koshi-Guruma > Utsuri-Goshi",
          "category": "Kaeshi-waza"
        },
        {
          "id": "kaeshi-haraigoshi-ushirogoshi",
          "name": "Harai-Goshi > Ushiro-Goshi",
          "category": "Kaeshi-waza"
        }
      ]
    },
    {
      "id": "preta",
      "name": "Preta",
      "history": [],
      "techniques": []
    }
  ]
};

export const BELTS: Belt[] = rawData.belts.map(b => ({
  ...b,
  colors: BELT_COLORS[b.id] || ["bg-white"],
  slug: b.id // User's id are now the slugs
}));

/**
 * Returns a belt payload containing its cumulative aggregated techniques and history
 */
export function getBeltWithCumulativeData(beltIdOrSlug: string): Belt | undefined {
  const currentIndex = BELTS.findIndex(b => b.id === beltIdOrSlug || b.slug === beltIdOrSlug);
  if (currentIndex === -1) return undefined;

  const currentBelt = BELTS[currentIndex];
  
  // Aggregate all history and techniques from [0...currentIndex]
  const beltsUpToNow = BELTS.slice(0, currentIndex + 1);
  
  const allHistory = beltsUpToNow.flatMap(b => b.history);
  
  // Flatten techniques and deduplicate by id
  const techniqueMap = new Map<string, Technique>();
  beltsUpToNow.forEach(b => {
    b.techniques.forEach(t => {
      techniqueMap.set(t.id, t);
    });
  });

  return {
    ...currentBelt,
    history: allHistory,
    techniques: Array.from(techniqueMap.values())
  };
}
