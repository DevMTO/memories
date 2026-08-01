import { GetToursUseCase } from '../core/application/GetToursUseCase';
import { SqliteTravelRepository } from './repositories/SqliteTravelRepository';

export const travelRepository = new SqliteTravelRepository();
export const getToursUseCase = new GetToursUseCase(travelRepository);
