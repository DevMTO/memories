import type { Destination, Package, Tour, TravelProduct } from '../models';

export interface ITourRepository {
  getAllTours(): Promise<Tour[]>;
  getTourById(id: string): Promise<Tour | null>;
  getTourBySlug(slug: string): Promise<Tour | null>;
  getFeaturedTours(): Promise<Tour[]>;

  getAllPackages(): Promise<Package[]>;
  getPackageById(id: string): Promise<Package | null>;
  getPackageBySlug(slug: string): Promise<Package | null>;
  getFeaturedPackages(): Promise<Package[]>;

  getDestinations(): Promise<Destination[]>;
  getToursByDestination(slug: string): Promise<Tour[]>;
  getPackagesByDestination(slug: string): Promise<Package[]>;

  getAllProductsForAdmin(): Promise<TravelProduct[]>;
  createProduct(product: TravelProduct): Promise<TravelProduct>;
  updateProduct(id: string, product: TravelProduct): Promise<TravelProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
}
