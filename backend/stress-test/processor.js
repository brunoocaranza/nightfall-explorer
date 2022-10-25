const fs = require('fs');

const proposerAddresses = require('./resources/proposers.json');
const blockHashes = require('./resources/blockHashes.json');
const numbersL2 = require('./resources/numbersL2.json');
const numbersL1 = require('./resources/numbersL1.json');
const transactionHashL2 = require('./resources/transactionHashL2.json');
const transactionHashL1 = require('./resources/transactionHashL1.json');
const stats = require('./resources/stats.json');

const allData = [proposerAddresses, blockHashes, numbersL1, numbersL2, transactionHashL1, transactionHashL2];

const sortDirection = ['asc', 'desc'];

const randomNumBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getEndPoint = (url) => url.split('v1')[1];

const write5xx4xxErrors = (url, response) => {
  const data = `${getEndPoint(url)}: ${response} `;
  fs.appendFile(`./reports/errors-report.txt`, `\n ${data}`, (err) => {
    if (err) console.log('Something went wrong when trying to append file with 5xx response');
  });
};

const printStatus = (requstParams, response, ctx, ee, next) => {
  if (response.statusCode >= 400) write5xx4xxErrors(requstParams.url, response.body);
  next();
};

const generateSearchValue = (requstParams, ctx, ee, next) => {
  const collection = allData[randomNumBetween(0, allData.length - 1)];
  ctx.vars['q'] = collection[randomNumBetween(0, collection.length - 1)];

  next();
};

const generateBlockNumber = (requstParams, ctx, ee, next) => {
  const collection = allData[3];
  ctx.vars['blockNumber'] = collection[randomNumBetween(0, collection.length - 1)];

  next();
};

const generateTxHash = (requstParams, ctx, ee, next) => {
  const collection = allData[5];
  ctx.vars['txHash'] = collection[randomNumBetween(0, collection.length - 1)];

  next();
};
const generateBlockPagination = (requstParams, ctx, ee, next) => {
  const limit = randomNumBetween(1, 10);
  ctx.vars['limit'] = limit;
  ctx.vars['page'] = 1;
  ctx.vars['sortDirection'] = 'desc';
  ctx.vars['sortColumn'] = 'blockNumberL2';
  next();
};

const generateBlockPaginationProposer = (requstParams, ctx, ee, next) => {
  ctx.vars['limit'] = randomNumBetween(1, 10);
  ctx.vars['page'] = 1;
  ctx.vars['sortDirection'] = sortDirection[randomNumBetween(0, 1)];
  ctx.vars['sortColumn'] = 'blockNumberL2';
  const proposers = allData[0];
  ctx.vars['proposer'] = proposers[randomNumBetween(0, proposers.length - 1)];
  next();
};

const generateProposerAddress = (requstParams, ctx, ee, next) => {
  const proposers = allData[0];
  ctx.vars['address'] = proposers[randomNumBetween(0, proposers.length - 1)];
  next();
};

const sortColumnProposer = ['goodBlocks', 'badBlocks'];
const generateProposerPagination = (requstParams, ctx, ee, next) => {
  const limit = randomNumBetween(1, 10);
  const blockCount = proposerAddresses.length;
  const max = Math.round(blockCount / limit);
  ctx.vars['limit'] = limit;
  ctx.vars['page'] = randomNumBetween(1, max);
  ctx.vars['sortDirection'] = sortDirection[randomNumBetween(0, 1)];
  ctx.vars['sortColumn'] = sortColumnProposer[randomNumBetween(0, 1)];
  next();
};

module.exports = {
  printStatus,
  generateSearchValue,
  generateBlockNumber,
  generateTxHash,
  generateBlockPagination,
  generateBlockPaginationProposer,
  generateProposerAddress,
  generateProposerPagination,
};
