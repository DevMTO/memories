import { MockTourRepository } from "./repositories/MockTourRepository";
import { GetToursUseCase } from "../core/application/GetToursUseCase";

const tourRepository = new MockTourRepository();

export const getToursUseCase = new GetToursUseCase(tourRepository);