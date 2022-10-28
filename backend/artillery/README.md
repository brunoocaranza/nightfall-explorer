## Description

Application for stress/load testing.

- [data](data) - contains small app that fetches random blocks, txs and proposers and saves them in json format at ./resources folder.
- processor.js - uses data from ./resources folder to generate test queries, uri params for stress test script
- stress-test.yml - Artillery JS uses yaml definition for configuration and definition of test scenarios

## Installation

```bash
$ npm install
```

Node - v16.17.0 <br />
Npm - v8.15.0

## Setup

Before running setup script make sure you have access to optimist_data db

```bash
$ ./setup.sh
```

## Run script

```bash
$ ./run.sh
```
