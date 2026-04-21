export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  durationDays: number;
  durationNights?: number;
  location?: string;
  cities?: string[];
  imageUrl: string;
  features?: string[];
  itinerary?: {
    day: number;
    title: string;
    description: string;
    accommodations?: string;
    meals?: string;
  }[];
  includes?: string[];
  notIncludes?: string[];
}

export interface Destination {
  id: string;
  name: string;
  imageUrl: string;
}
