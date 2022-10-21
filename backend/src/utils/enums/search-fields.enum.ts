export enum BlockSearchFields {
  BLOCK_HASH = 'blockHash',
  BLOCK_NUMBER_L2 = 'blockNumberL2',
  BLOCK_NUMBER = 'blockNumber',
  PROPOSER = 'proposer',
  TIME_BLOCK_L2 = 'timeBlockL2',
}

export enum ProposerSearchFields {
  ADDRESS = 'address',
  IS_ACTIVE = 'isActive',
}

export enum TransactionSearchFields {
  TRANSACTION_HASH_L1 = 'transactionHashL1',
  TRANSACTION_HASH = 'transactionHash',
}

export enum SearchTerms {
  BY_HASH = 'hash',
  BY_BLOCK_NUMBER = 'block_number',
  BY_PROPOSER_ADDRESS = 'proposer_address',
}
