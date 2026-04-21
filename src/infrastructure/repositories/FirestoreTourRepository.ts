import type { Tour, Destination } from '../../core/domain/models';
import type { ITourRepository } from '../../core/domain/ports/ITourRepository';
import { db } from '../firebase';
import { MockTourRepository } from './MockTourRepository';

export class FirestoreTourRepository implements ITourRepository {
  private collection = db.collection('tours');
  private destinationsCollection = db.collection('destinations');

  async getAllTours(): Promise<Tour[]> {
    await this.seedIfEmpty();
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
  }

  async getTourById(id: string): Promise<Tour | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Tour;
  }

  async getFeaturedTours(): Promise<Tour[]> {
    await this.seedIfEmpty();
    const snapshot = await this.collection.limit(3).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
  }

  async getDestinations(): Promise<Destination[]> {
    const snapshot = await this.destinationsCollection.get();
    if (snapshot.empty) {
      const mockRepo = new MockTourRepository();
      const mockDestinations = await mockRepo.getDestinations();
      const batch = db.batch();
      for (const dest of mockDestinations) {
        const docRef = this.destinationsCollection.doc(dest.id);
        batch.set(docRef, dest);
      }
      await batch.commit();
      return mockDestinations;
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
  }

  private async seedIfEmpty() {
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
