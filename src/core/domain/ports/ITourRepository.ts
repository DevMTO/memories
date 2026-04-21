import type { Tour, Destination } from '../models';

export interface ITourRepository {
  getAllTours(): Promise<Tour[]>;
  getTourById(id: string): Promise<Tour | null>;
  getFeaturedTours(): Promise<Tour[]>;
  getDestinations(): Promise<Destination[]>;
}
