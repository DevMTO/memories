import { FirestoreTourRepository } from './repositories/FirestoreTourRepository';
import { GetToursUseCase } from '../core/application/GetToursUseCase';

// Composition Root
const tourRepository = new FirestoreTourRepository();

export const getToursUseCase = new GetToursUseCase(tourRepository);
