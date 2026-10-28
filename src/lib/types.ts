export type TravelProductKind = 'tour' | 'trekking' | 'package';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodations?: string;
  meals?: string[];
  includes?: string[];
  notIncludes?: string[];
}

export interface TravelProductBase {
  id: string;
  kind: TravelProductKind;
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
  itinerary?: ItineraryDay[];
  includes?: string[];
  notIncludes?: string[];
  whatToBring?: string[];
  importantNotes?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  sourceFile?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tour extends TravelProductBase {
  kind: 'tour' | 'trekking';
}

export interface Package extends TravelProductBase {
  kind: 'package';
  destinations: {
    id?: string;
    name: string;
    slug: string;
  }[];
}

export type TravelProduct = Tour | Package;

export interface Destination {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}
