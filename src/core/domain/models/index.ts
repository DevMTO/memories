export interface Tour {
  id: string;
  title: string;
  slug: string;

  description: string;
  shortDescription?: string;

  price: number;
  durationDays: number;
  durationNights?: number;

  destinationName: string;
  destinationSlug: string;

  location?: string;
  cities?: string[];

  imageUrl: string;
  gallery?: string[];

  features?: string[];
  highlights?: string[];

  itinerary?: {
    day: number;
    title: string;
    description: string;
    accommodations?: string;
    meals?: string[];
    includes?: string[];
    notIncludes?: string[];
  }[];

  // estos quedarían como generales del producto completo
  includes?: string[];
  notIncludes?: string[];
  whatToBring?: string[];

  seoTitle?: string;
  seoDescription?: string;

  isActive?: boolean;
  isFeatured?: boolean;
}

export interface Package {
  id: string;
  title: string;
  slug: string;

  description: string;
  shortDescription?: string;

  price: number;
  durationDays: number;
  durationNights?: number;

  destinations: {
    name: string;
    slug: string;
  }[];

  imageUrl: string;
  gallery?: string[];

  features?: string[];
  highlights?: string[];

  itinerary?: {
    day: number;
    title: string;
    description: string;
    accommodations?: string;
    meals?: string[];
    includes?: string[];
    notIncludes?: string[];
  }[];

  // generales del paquete completo
  includes?: string[];
  notIncludes?: string[];
  whatToBring?: string[];

  seoTitle?: string;
  seoDescription?: string;

  isActive?: boolean;
  isFeatured?: boolean;
}
