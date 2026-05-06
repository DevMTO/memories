import type { Tour, Package } from '../../core/domain/models';
import type { ITourRepository } from '../../core/domain/ports/ITourRepository';
import { toursData } from './toursData';
import { packagesData } from './packagesData';

type Destination = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export class MockTourRepository implements ITourRepository {
 
  async getAllTours(): Promise<Tour[]> {
    return toursData;
  }

  async getTourById(id: string): Promise<Tour | null> {
    return toursData.find((tour) => tour.id === id) || null;
  }

  async getTourBySlug(slug: string): Promise<Tour | null> {
    return toursData.find((tour) => tour.slug === slug) || null;
  }

  async getFeaturedTours(): Promise<Tour[]> {
    return toursData.filter((tour) => tour.isFeatured);
  }

  async getAllPackages(): Promise<Package[]> {
    return packagesData;
  }

  async getPackageById(id: string): Promise<Package | null> {
    return packagesData.find((pkg) => pkg.id === id) || null;
  }

  async getPackageBySlug(slug: string): Promise<Package | null> {
    return packagesData.find((pkg) => pkg.slug === slug) || null;
  }

  async getFeaturedPackages(): Promise<Package[]> {
    return packagesData.filter((pkg) => pkg.isFeatured);
  }

  async getDestinations(): Promise<Destination[]> {
    const map = new Map<string, Destination>();

    for (const tour of toursData) {
      if (!map.has(tour.destinationSlug)) {
        map.set(tour.destinationSlug, {
          id: tour.destinationSlug,
          name: tour.destinationName,
          slug: tour.destinationSlug,
          imageUrl: `/images/dest-${tour.destinationSlug}.jpg`
        });
      }
    }

    for (const pkg of packagesData) {
      for (const destination of pkg.destinations) {
        if (!map.has(destination.slug)) {
          map.set(destination.slug, {
            id: destination.slug,
            name: destination.name,
            slug: destination.slug,
            imageUrl: `/images/dest-${destination.slug}.jpg`
          });
        }
      }
    }

    return Array.from(map.values());
  }

  async getToursByDestination(slug: string): Promise<Tour[]> {
    return toursData.filter((tour) => tour.destinationSlug === slug);
  }

  async getPackagesByDestination(slug: string): Promise<Package[]> {
    return packagesData.filter((pkg) =>
      pkg.destinations.some((destination: { slug: string }) => destination.slug === slug)
    );
  }
}