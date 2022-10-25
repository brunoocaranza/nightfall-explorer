import { ProposerDTO } from '../../../models';

export interface IContractClientService {
  getCurrentProposer(): Promise<ProposerDTO>;
  getContractAddress(contractName: string): Promise<string>;
  getContractAddresses(): Record<string, string>[];
}
