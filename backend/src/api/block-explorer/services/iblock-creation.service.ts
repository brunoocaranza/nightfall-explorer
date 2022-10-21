import { AverageBlockCreationDTO } from '../../../models';

export interface IBlockCreationService {
  findAverageBlockCreation(): Promise<AverageBlockCreationDTO | string>;
}
