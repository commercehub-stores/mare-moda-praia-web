import type { Product } from "./commerce/index.ts";
import { commerce } from "./store.ts";

/**
 * "Diário da Maré" — the store's editorial (Figma D7 · Blog and D8 · Matéria shop the look).
 * Posts live in code for the demo; products are referenced by VTEX slug and read live from the catalog,
 * so prices, sizes and stock always match the store.
 */

export const BLOG_TOPICS = ["Estampas", "Praias do Rio", "Estilo", "Bastidores", "Guias"] as const;
export type BlogTopic = (typeof BLOG_TOPICS)[number];

export const topicSlug = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

export type Block =
  | { type: "p"; text: string; dropcap?: boolean }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; by: string }
  | { type: "images"; images: { src: string; alt: string }[] }
  | { type: "products" };

export interface Hotspot {
  slug: string;
  /** Position over the look photo, in % of its width/height. */
  x: number;
  y: number;
}

export interface Post {
  slug: string;
  topic: BlogTopic;
  title: string;
  /** Short title used in "de: …" product tags. */
  short: string;
  dek: string;
  author: { name: string; initials: string };
  date: string;
  minutes: number;
  cover: string;
  look?: { image: string; caption: string; hotspots: Hotspot[] };
  products: string[];
  tags: string[];
  body: Block[];
}

const LIA = { name: "Lia Andrade", initials: "LA" };
const TOM = { name: "Tomás Reis", initials: "TR" };

export const EDITION = { number: 14, month: "Outubro 2026", season: "Verão 27" };

export const POSTS: Post[] = [
  {
    slug: "a-palmeira-que-virou-assinatura",
    topic: "Estampas",
    title: "A palmeira que virou assinatura: como nasce uma estampa da Maré",
    short: "Matéria de capa",
    dek: "Do pincel no ateliê em Santa Teresa ao short que seca em dez minutos: 40 dias de uma estampa, do primeiro rabisco à vitrine.",
    author: LIA,
    date: "2026-10-21",
    minutes: 8,
    cover: "/mare/blog/capa.jpg",
    look: {
      image: "/mare/blog/capa.jpg",
      caption: "Camisa Palmeiras Douradas e Short Praia Aster no ensaio da coleção Verão 27.",
      hotspots: [
        { slug: "camisa-manga-curta-palmeiras-douradas-146045", x: 11.5, y: 40 },
        { slug: "short-praia-aster-146684", x: 38, y: 74 },
        { slug: "camisa-manga-curta-bananeiras-145642", x: 63, y: 37 },
        { slug: "short-praia-palmar-146742", x: 90, y: 77 },
      ],
    },
    products: ["camisa-manga-curta-palmeiras-douradas-146045", "short-praia-aster-146684", "short-praia-palmar-146742"],
    tags: ["estampas", "verão27", "feitonorio", "viscose"],
    body: [
      { type: "h2", text: "O primeiro rabisco" },
      {
        type: "p",
        dropcap: true,
        text: "Tudo começou numa manhã de abril, com um galho de palmeira caído na calçada da Rua Almirante Alexandrino. A Juliana, que desenha nossas estampas há seis verões, levou o galho para o ateliê, encostou numa folha de papel e passou o dia inteiro tentando entender a sombra que ele fazia.",
      },
      { type: "h2", text: "Da tela para o tecido" },
      {
        type: "p",
        text: "Foram 23 versões até chegar ao dourado certo: quente o bastante para lembrar fim de tarde, discreto o bastante para usar no almoço de domingo. A viscose recebeu a estampa em sublimação, e o nylon do short ganhou a versão em tie dye, que mancha como água salgada no papel.",
      },
      { type: "quote", text: "Uma estampa boa é aquela que você reconhece de longe, na areia, antes de ver quem está usando.", by: "Juliana Prado, designer de estampas" },
      {
        type: "images",
        images: [
          { src: "/mare/blog/materia-p55b.jpg", alt: "Short Praia Aster, estampa de palmeiras em tie dye azul" },
          { src: "/mare/blog/materia-p22b.jpg", alt: "Camisa Palmeiras Douradas em viscose off-white" },
        ],
      },
      { type: "products" },
      { type: "h2", text: "O teste do mar" },
      {
        type: "p",
        text: "Antes de qualquer peça ir para a loja, ela passa uma semana com a equipe na praia. Sal, sol, areia e máquina de lavar. A estampa que desbota no terceiro mergulho não volta para o ateliê, volta para a gaveta.",
      },
      { type: "h2", text: "Como usar" },
      {
        type: "p",
        text: "A camisa pede pouco: aberta sobre o short liso na areia, fechada com bermuda de linho no jantar. Se a estampa estiver em cima, deixe a de baixo calma — e vice-versa. A palmeira gosta de ser a única protagonista do look.",
      },
    ],
  },
  {
    slug: "linho-na-orla",
    topic: "Estilo",
    title: "Linho na orla: o guia para não amassar (muito)",
    short: "Linho na orla",
    dek: "Três jeitos de usar a camisa de linho do almoço ao luau, e por que um pouco de amassado é charme.",
    author: TOM,
    date: "2026-10-17",
    minutes: 5,
    cover: "/mare/blog/linho.jpg",
    products: ["camisa-bata-costa-natural-145058", "camisa-manga-longa-mar-144666"],
    tags: ["linho", "estilo", "verão27"],
    body: [
      { type: "h2", text: "Por que linho" },
      {
        type: "p",
        dropcap: true,
        text: "O linho é a fibra que mais respira entre as naturais: seca rápido, não gruda no corpo e fica mais macio a cada lavagem. O preço disso é o amassado — e a gente acha que vale. Uma camisa de linho lisinha demais parece que nunca saiu do cabide.",
      },
      { type: "h2", text: "Do almoço ao luau" },
      {
        type: "p",
        text: "No almoço, manga dobrada duas vezes e para dentro da bermuda. No fim de tarde, aberta sobre a camiseta branca. No luau, fechada até o penúltimo botão, com a calça de linho no mesmo tom. Três looks, uma camisa.",
      },
      { type: "quote", text: "O amassado do linho conta onde você esteve. Ninguém deveria passar isso a ferro.", by: "Tomás Reis, stylist da Maré" },
      { type: "products" },
      { type: "h2", text: "Cuidados" },
      {
        type: "p",
        text: "Lave do avesso, em água fria, e pendure ainda úmida no cabide: o próprio peso tira boa parte das dobras. Se precisar de ferro, use o vapor e passe com a peça ainda levemente úmida.",
      },
    ],
  },
  {
    slug: "peixes-em-viscose",
    topic: "Bastidores",
    title: "Peixes em viscose: a estampa que nasceu de um mergulho em Arraial",
    short: "Bastidores",
    dek: "Uma câmera à prova d'água, um cardume de sargentinhos e a estampa mais pedida do verão.",
    author: LIA,
    date: "2026-10-10",
    minutes: 4,
    cover: "/mare/blog/peixes.jpg",
    products: ["camisa-manga-curta-peixes-145269"],
    tags: ["bastidores", "estampas", "viscose"],
    body: [
      { type: "h2", text: "Um mergulho de férias" },
      {
        type: "p",
        dropcap: true,
        text: "A ideia veio de uma foto tirada em Arraial do Cabo, a três metros de profundidade: um cardume de sargentinhos passando em fila na frente da câmera. A Juliana redesenhou cada peixe à mão e espalhou o cardume pela camisa como se ele estivesse atravessando o tecido.",
      },
      { type: "h2", text: "Por que viscose" },
      {
        type: "p",
        text: "A viscose cai bem, é fresca e segura a cor da estampa com nitidez. Para os peixes, que têm traço fino, era o único tecido que mantinha os detalhes depois de lavar.",
      },
      { type: "products" },
    ],
  },
  {
    slug: "prainha-grumari-abrico",
    topic: "Praias do Rio",
    title: "Prainha, Grumari, Abricó: o roteiro de quem foge do Arpoador lotado",
    short: "Praias do Rio",
    dek: "Três praias a menos de uma hora do centro, com mar limpo, areia sobrando e nenhum guarda-sol colado no seu.",
    author: TOM,
    date: "2026-10-03",
    minutes: 6,
    cover: "/mare/blog/praias.jpg",
    products: ["camisa-manga-curta-bananeiras-145642", "boardshort-surf-solo-verde-145595"],
    tags: ["praiasdorio", "roteiro", "verão27"],
    body: [
      { type: "h2", text: "Prainha" },
      {
        type: "p",
        dropcap: true,
        text: "Cercada de mata atlântica, a Prainha é área de proteção ambiental e tem as melhores ondas do Rio para quem surfa. Chegue cedo: o estacionamento lota antes das dez nos fins de semana.",
      },
      { type: "h2", text: "Grumari" },
      {
        type: "p",
        text: "Logo depois da Prainha, Grumari tem areia avermelhada, quiosques simples e mar mais calmo no canto direito. Na volta, pare na Estrada do Grumari para ver o pôr do sol do mirante.",
      },
      { type: "h2", text: "Abricó" },
      {
        type: "p",
        text: "Pequena, escondida e tranquila, Abricó fica no fim da trilha curta depois de Grumari. Leve água e pouca coisa na bolsa: um boardshort que seca rápido e uma camisa leve resolvem o dia.",
      },
      { type: "products" },
    ],
  },
  {
    slug: "short-ou-boardshort",
    topic: "Guias",
    title: "Short de praia ou boardshort? A diferença que você sente no mar",
    short: "Short ou boardshort?",
    dek: "Comprimento, cós e tecido: o que muda entre os dois e qual levar para cada tipo de praia.",
    author: LIA,
    date: "2026-09-26",
    minutes: 3,
    cover: "/mare/blog/boardshort.jpg",
    products: ["short-praia-folhagem-140608", "boardshort-surf-solo-verde-145595"],
    tags: ["guias", "shorts", "boardshort"],
    body: [
      { type: "h2", text: "Short de praia" },
      {
        type: "p",
        dropcap: true,
        text: "Mais curto, com cós de elástico e cordão, forro de tela e bolsos laterais. É o short do dia inteiro: da areia ao bar sem trocar de roupa, e seca em minutos no corpo.",
      },
      { type: "h2", text: "Boardshort" },
      {
        type: "p",
        text: "Mais longo, sem forro e com cós fixo de amarração na frente, feito para não descer na onda. O tecido tem elastano para acompanhar o movimento da remada. Se o plano é surfar ou nadar no mar aberto, é ele.",
      },
      { type: "products" },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug) ?? null;

export function readingDate(iso: string) {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

/** Products by slug, in the given order, skipping any that are no longer in the catalog. */
export async function productsBySlug(slugs: string[]): Promise<Map<string, Product>> {
  const unique = [...new Set(slugs)];
  const found = await Promise.all(unique.map((s) => commerce.catalog.getProduct(s).catch(() => null)));
  return new Map(found.flatMap((p, i) => (p ? [[unique[i] as string, p] as const] : [])));
}

/** Every product the edition's posts feature, with the post it came from. */
export function editionProducts(): { slug: string; post: Post }[] {
  const seen = new Set<string>();
  const out: { slug: string; post: Post }[] = [];
  for (const post of POSTS) {
    for (const slug of [...post.products, ...(post.look?.hotspots.map((h) => h.slug) ?? [])]) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({ slug, post });
    }
  }
  return out;
}

export const headingId = (text: string) => topicSlug(text);
