import type { ITourRepository } from "../domain/ports/ITourRepository";

export class GetToursUseCase {
  constructor(private readonly tourRepository: ITourRepository) {}

  async executeAll() {
    return this.tourRepository.getAllTours();
  }

  async executeFeatured() {
    return this.tourRepository.getFeaturedTours();
  }

  async executeBySlug(slug: string) {
    return this.tourRepository.getTourBySlug(slug);
  }

  async executeDestinations() {
    return this.tourRepository.getDestinations();
  }

  async executePackages() {
    return this.tourRepository.getAllPackages();
  }

  async executePackageBySlug(slug: string) {
    return this.tourRepository.getPackageBySlug(slug);
  }

  async executeById(id: string) {
  return this.tourRepository.getTourById(id);
}
}