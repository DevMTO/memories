import type { Tour, Destination } from '../../domain/models';
import type { ITourRepository } from '../../domain/ports/ITourRepository';

export class MockTourRepository implements ITourRepository {
  private tours: Tour[] = [
    {
      id: '1',
      title: 'Cusco Imperial',
      description: 'Sumérjase en la historia viva de los Incas. Este viaje exclusivo comienza en las calles empedradas de Cusco, donde la arquitectura colonial se fusiona con muros incaicos. Explorará los tesoros del Valle Sagrado, disfrutará de experiencias gastronómicas de clase mundial y culminará su aventura con una visita privada a Machu Picchu al amanecer.',
      price: 2800,
      durationDays: 12,
      location: 'Cusco, Peru',
      imageUrl: '/images/tour1.jpg'
    },
    {
      id: '2',
      title: 'Esencia De Los Andes',
      description: 'Desde La Costa Gastronómica De Lima Hasta La Majestuosidad De Machu Picchu, Pasando Por El Mítico Lago Titicaca.',
      price: 2400,
      durationDays: 12,
      location: 'Cusco, Peru',
      imageUrl: '/images/tour2.jpg'
    },
    {
      id: '3',
      title: 'Esencia De Los Andes',
      description: 'Desde La Costa Gastronómica De Lima Hasta La Majestuosidad De Machu Picchu, Pasando Por El Mítico Lago Titicaca.',
      price: 2400,
      durationDays: 12,
      location: 'Cusco, Peru',
      imageUrl: '/images/tour3.jpg'
    },
    {
      id: '4',
      title: 'Esencia De Los Andes',
      description: 'Desde La Costa Gastronómica De Lima Hasta La Majestuosidad De Machu Picchu, Pasando Por El Mítico Lago Titicaca.',
      price: 2100,
      durationDays: 10,
      location: 'Cusco, Peru',
      imageUrl: '/images/tour4.jpg'
    }
  ];

  private destinations: Destination[] = [
    { id: '1', name: 'Cusco', imageUrl: '/images/dest-cusco.jpg' },
    { id: '2', name: 'Lima', imageUrl: '/images/dest-lima.jpg' },
    { id: '3', name: 'Ica', imageUrl: '/images/dest-ica.jpg' },
    { id: '4', name: 'Puno', imageUrl: '/images/dest-puno.jpg' },
  ];

  async getAllTours(): Promise<Tour[]> {
    return this.tours;
  }

  async getTourById(id: string): Promise<Tour | null> {
    return this.tours.find(t => t.id === id) || null;
  }

  async getFeaturedTours(): Promise<Tour[]> {
    return this.tours.slice(0, 3);
  }

  async getDestinations(): Promise<Destination[]> {
    return this.destinations;
  }
}
