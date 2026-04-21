export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  durationDays: number;
  location: string;
  imageUrl: string;
  features?: string[];
}

export interface Destination {
  id: string;
  name: string;
  imageUrl: string;
}
