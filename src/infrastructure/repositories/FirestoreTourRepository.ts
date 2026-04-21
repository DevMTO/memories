import type { Tour, Destination } from '../../core/domain/models';
import type { ITourRepository } from '../../core/domain/ports/ITourRepository';
import { db } from '../firebase';
import { MockTourRepository } from './MockTourRepository';

export class FirestoreTourRepository implements ITourRepository {
  private collection = db.collection('tours');
  private isConfigured = !!import.meta.env.FIREBASE_PROJECT_ID;
  private mockRepo = new MockTourRepository();

  async getAllTours(): Promise<Tour[]> {
    if (!this.isConfigured) {
      console.warn('⚠️ Usando MockTourRepository porque FIREBASE_PROJECT_ID no está configurado.');
      return this.mockRepo.getAllTours();
    }

    await this.seedIfEmpty();
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
  }

  async getTourById(id: string): Promise<Tour | null> {
    if (!this.isConfigured) {
      return this.mockRepo.getTourById(id);
    }
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Tour;
  }

  async getFeaturedTours(): Promise<Tour[]> {
    if (!this.isConfigured) {
      return this.mockRepo.getFeaturedTours();
    }
    await this.seedIfEmpty();
    const snapshot = await this.collection.limit(3).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
  }

  async getDestinations(): Promise<Destination[]> {
    const tours = await this.getAllTours();
    const destinationsMap = new Map<string, Destination>();

    tours.forEach(tour => {
      if (tour.cities && Array.isArray(tour.cities)) {
        tour.cities.forEach(city => {
          // Ensure city is a string (handle cases where it might be an object)
          const cityStr = typeof city === 'string' ? city : String(city);
          if (cityStr && !destinationsMap.has(cityStr)) {
            // Convert to lowercase and replace spaces with hyphens for a simple ID
            const id = cityStr.toLowerCase().replace(/\s+/g, '-');
            destinationsMap.set(cityStr, {
              id: id,
              name: cityStr,
              imageUrl: tour.imageUrl || '/images/hero.jpg' // Fallback to tour image or default
            });
          }
        });
      }
    });

    return Array.from(destinationsMap.values());
  }

  private async seedIfEmpty() {
    if (!this.isConfigured) return;
    
    const snapshot = await this.collection.limit(1).get();
    if (snapshot.empty) {
      console.log('Seeding Firestore with mock data...');
      const mockRepo = new MockTourRepository();
      const mockTours = await mockRepo.getAllTours();
      
      const batch = db.batch();
      for (const tour of mockTours) {
        const docRef = this.collection.doc(tour.id);
        batch.set(docRef, tour);
      }
      await batch.commit();
      console.log('Firestore seeded successfully.');
    }
  }
}
