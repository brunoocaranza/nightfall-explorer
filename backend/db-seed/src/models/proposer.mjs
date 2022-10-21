import { generateAddress, randomNumBetween, tenPercenteChance } from '../helper.mjs';

export class Proposer {
  _id;
  url;
  isActive;
  address;
  stakeAccount;
  goodBlocks;
  badBlocks;

  constructor(ind) {
    this._id = generateAddress();
    this.address = this._id;
    this.url = `https://proposer.${ind}.polygon-nightfall.technology`;
    this.goodBlocks = randomNumBetween(20, 50);
    this.badBlocks = randomNumBetween(1, 5);
    this.stakeAccount = {
      amount: randomNumBetween(100, 500).toString(),
      challengeLocked: '0',
      time: '0',
    };
    this.isActive = tenPercenteChance() ? false : true;
  }
}
