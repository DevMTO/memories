import type { ITourRepository } from "../domain/ports/ITourRepository";

export class GetToursUseCase {
  constructor(private readonly tourRepository: ITourRepository) {}

  async executeAll() {
    return this.tourRepository.getAllTours();
  }

  async executeById(id: string) {
    return this.tourRepository.getTourById(id);
  }

  async executeBySlug(slug: string) {
    return this.tourRepository.getTourBySlug(slug);
  }

  async executeFeatured() {
    return this.tourRepository.getFeaturedTours();
  }

  async executeDestinations() {
    return this.tourRepository.getDestinations();
  }

  async executeToursByDestination(slug: string) {
    return this.tourRepository.getToursByDestination(slug);
  }

  async executePackages() {
    return this.tourRepository.getAllPackages();
  }

  async executePackageById(id: string) {
    return this.tourRepository.getPackageById(id);
  }

  async executePackageBySlug(slug: string) {
    return this.tourRepository.getPackageBySlug(slug);
  }

  async executeFeaturedPackages() {
    return this.tourRepository.getFeaturedPackages();
  }

  async executePackagesByDestination(slug: string) {
    return this.tourRepository.getPackagesByDestination(slug);
  }
}