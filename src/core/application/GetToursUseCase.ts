import type { ITourRepository } from '../domain/ports/ITourRepository';
import type { Tour, Destination } from '../domain/models';

export class GetToursUseCase {
  constructor(private tourRepository: ITourRepository) {}

  async executeAll(): Promise<Tour[]> {
    return this.tourRepository.getAllTours();
  }

  async executeFeatured(): Promise<Tour[]> {
    return this.tourRepository.getFeaturedTours();
  }

  async executeDestinations(): Promise<Destination[]> {
    return this.tourRepository.getDestinations();
  }
}
