## Description

Backend application for Nightfall Block Explorer.

## Installation

```bash
$ npm install
```

Node - v16.17.0 <br />
Npm - v8.15.0

## Running the app

```bash
# development - watch mode
$ npm start
```

Service startup depends on database and optimist service. If one of those two is not reachable then service will not be up and running.

On initialization, service is calling optimist service to fetch contract address && abi.

## Test

```bash
# Run tests
$ npm test
```

Test command will run all tests and print code coverage report

## Swagger Documentation

This is only available in local or Private environment

```bash
http://localhost:3000/api/docs
```

## Code structure

- [.github](.github) - PR template && github workflows (sonarcube, tests, owasp scanner)
- [husky](husky) - Precommit script which runs lint and tests
- [db-seed](/db-seed) - Script for creating fake data for testing
- [stress-test](/stress-test) - Artillery JS script for testing
- [src](src)
  - api - business logic, controllers etc.
  - config - database, winston logger, swagger, env variables and application configuration
  - guards - holds rate limit application guard
  - middlewares - request middlewares
  - models - all dtos and types
  - pipes - input validators. Mostly used in controllers
  - repositories - database layer
  - schemas - mongo models
  - utils - constants, exception handler, helper service etc.
  - app.module.ts - main model
  - main.ts - application entry point
- [test](test) - Unit tests
