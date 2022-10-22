import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IProposerService, ITransactionService } from '../services';
import { TransactionDTO } from '../../../models';
import { PROPOSER_SERVICE, TRANSACTION_SERVICE } from '../../../utils';
import { HashPipe } from '../../../pipes';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE) private readonly _transactionService: ITransactionService,
    @Inject(PROPOSER_SERVICE) private readonly _proposerService: IProposerService
  ) {}

  @Get('/:hash')
  @ApiResponse({ status: 200, type: TransactionDTO })
  findTransaction(@Param('hash', new HashPipe()) hash: string): Promise<TransactionDTO> {
    return this._transactionService.findL2Transaction(hash);
  }

  @Get('/stats/count')
  @ApiResponse({ status: 200, type: Number })
  count(): Promise<number> {
    return this._transactionService.count();
  }

  @Get('/stats/pending/count')
  @ApiResponse({ status: 200, type: Number })
  pendingCount(): Promise<number | string> {
    return this._proposerService.getPendingTransactions();
  }
}
