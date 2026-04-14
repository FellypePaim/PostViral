export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  slug: string;
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "weekly",
    name: "Semanal",
    price: "R$37,90",
    period: "/semana",
    slug: "7cP0YtV5ud",
  },
  {
    id: "monthly",
    name: "Mensal",
    price: "R$67,90",
    period: "/mes",
    slug: "7cP9MohkR7",
    highlight: true,
  },
  {
    id: "annual",
    name: "Anual",
    price: "R$197,90",
    period: "/ano",
    slug: "3oCZzowYZZ",
  },
];

export function getCheckoutUrl(slug: string): string {
  return `https://infinitypay.io/checkout/${slug}`;
}
