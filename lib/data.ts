export type StockStatus = "op-voorraad" | "laatste-items" | "nabestelling" | "populair";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  priceExVAT: number;
  description: string;
  longDescription: string;
  features: string[];
  stock: StockStatus;
  image: string;
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
}

export const categories = [
  "Handgereedschap",
  "Elektrisch",
  "Pneumatisch",
  "Diagnostiek",
  "Sets",
  "Hefgereedschap",
  "Verlichting",
  "Garage",
];

export const faqItems = [
  {
    id: "1",
    question: "Welke betaalmethoden accepteren jullie?",
    answer:
      "Wij accepteren Bancontact, creditcards (Visa, Mastercard), iDEAL en overschrijvingen. Voor grotere reparaties en aankopen in de showroom bieden we ook financieringsmogelijkheden aan via onze partners.",
  },
  {
    id: "2",
    question: "Moet ik een afspraak maken voor onderhoud?",
    answer:
      "Voor onderhoud en reparaties raden wij aan een afspraak te maken via ons contactformulier of telefonisch. Zo kunnen we u de beste service garanderen met minimale wachttijd.",
  },
  {
    id: "3",
    question: "Bieden jullie vervangend vervoer aan?",
    answer:
      "Ja, bij reparaties die langer dan één dag duren bieden wij op aanvraag een leenwagen aan. Neem contact op voor de beschikbaarheid en voorwaarden.",
  },
];
