import crypto from 'crypto';

const tenPercenteChance = () => Math.random() < 0.1;

const randomNumBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let addressCounter = 0;
const generateAddress = () => {
  const hash = crypto.createHash('sha1').update(`${addressCounter}`).digest('hex');
  addressCounter++;
  return `0x${hash}`;
};

let hashCounter = 0;
const generateHash = () => {
  const hash = crypto.createHash('sha256').update(`${hashCounter}`).digest('hex');

  hashCounter++;
  return `0x${hash}`;
};

const generateHashesTimes = (times) => {
  const result = [];
  for (let i = 0; i < times; i++) {
    result.push(generateHash());
  }

  return result;
};

function addRandomNumberOfHours(date) {
  const newDate = new Date(date.getTime());
  newDate.setTime(date.getTime() + randomNumBetween(1, 6) * 60 * 60 * 1000);

  return newDate;
}

export {
  generateHash,
  generateAddress,
  randomNumBetween,
  generateHashesTimes,
  tenPercenteChance,
  addRandomNumberOfHours,
};
