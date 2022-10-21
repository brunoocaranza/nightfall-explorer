import { PaginationModel, ProposerPaginationParams, ProposerDTO, ProposerItemDTO } from '../../../models';

export interface IProposerService {
  countPendingTransactions(): Promise<number | string>;
  queryProposer(address: string): Promise<ProposerDTO>;
  getProposerInfo(address: string): Promise<ProposerDTO>;
  findPaginated(paginationParams: ProposerPaginationParams): Promise<PaginationModel<ProposerItemDTO>>;
  getProposerAddresses(): Promise<string[]>;
}
