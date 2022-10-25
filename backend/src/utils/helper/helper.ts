import { HASH_SHA1_PATTERN, HASH_SHA512_PATTERN, MILION } from '../constants';
import moment from 'moment';
import { OrQueryFilter, QueryFilter } from '../../models';
import { BlockSearchFields, TransactionSearchFields } from '../enums';

export class HelperService {
  /**
   * Checks if value is in valid hash format
   * @param value - ideally it is SHA256 hash value
   * @returns boolean
   */
  public static isHash(value: string): boolean {
    return HASH_SHA512_PATTERN.test(value);
  }

  public static isNumber(value: string): boolean {
    let result: boolean;

    // The prefix 0x indicates that the number is in hex format. Number("0x123..") or +"0x123.." will return number
    if (value.startsWith('0x')) result = false;
    else result = !isNaN(+value);
    return result;
  }

  /**
   * Checks if value is in valid hash format
   * @param value string value of proposer address
   * @returns address
   */
  public static isProposerAddress(value: string): boolean {
    return HASH_SHA1_PATTERN.test(value);
  }

  public static getWeekAgoDate(): moment.Moment {
    return moment().subtract(7, 'd');
  }

  public static weekOlderOrEqualDate(value: Date): boolean {
    return moment(value).isSameOrBefore(this.getWeekAgoDate());
  }

  public static toMinut(seconds: number): number {
    return Math.floor(seconds / 60);
  }

  public static toHour(seconds: number): number {
    return Math.floor(seconds / 3600);
  }

  public static filterFulfilledPromises(promises: PromiseSettledResult<any>[]) {
    return promises.filter((promise) => promise.status == 'fulfilled');
  }

  // Checks if settled promise is fulfilled
  public static isFullfiledPromise(promiseResult: PromiseSettledResult<any>) {
    return promiseResult.status == 'fulfilled';
  }

  // Extracts value from settled promise in case if it is filfilled
  public static getPromiseValue<T>(value: PromiseSettledResult<T>): T {
    return (value as PromiseFulfilledResult<T>).value;
  }

  public static round(num: number, decimalPlaces = 0) {
    const p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p;
  }

  public static calculateBlocksPercentage(total: number, part: number): number {
    const result = (part / total) * 100;
    const numOfDecimals = result > 1 ? 2 : total > MILION ? 5 : 3;
    return this.round(result, numOfDecimals);
  }

  public static sortArray<T>(items: T[], direction: string, byField: string): T[] {
    return items.sort((item1, item2) => {
      const value1 = item1[`${byField}`];
      const value2 = item2[`${byField}`];
      if (direction === 'asc') return value1 - value2;
      else return value2 - value1;
    });
  }

  public static isNumberType(value: any): boolean {
    return typeof value === 'number' ? true : false;
  }

  /**
   * Filter for blockNumberL & blockNumber to query blocks collection
   */
  public static getBlockNumberQuery(blockNumber: number): OrQueryFilter {
    return {
      $or: [
        {
          [BlockSearchFields.BLOCK_NUMBER]: blockNumber,
        },
        {
          [BlockSearchFields.BLOCK_NUMBER_L2]: blockNumber,
        },
      ],
    };
  }

  /**
   * Filter for blockHash to query blocks collection
   */
  public static getBlockHashQuery(hash: string): QueryFilter {
    return {
      [BlockSearchFields.BLOCK_HASH]: hash,
    };
  }

  /**
   * Filter for txHash & txHashL1 to query transaction collection
   */
  public static getTxHashQuery(hash: string): OrQueryFilter {
    return {
      $or: [
        {
          [TransactionSearchFields.TRANSACTION_HASH]: hash,
        },
        {
          [TransactionSearchFields.TRANSACTION_HASH_L1]: hash,
        },
      ],
    };
  }

  public static typeOfNumber(value: any): boolean {
    return typeof value === 'number';
  }
}
