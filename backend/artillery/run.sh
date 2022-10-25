#!/bin/bash

cd reports
> errors-report.txt
> artillery-report.json
cd ..

DEBUG=http:request artillery run -o ./reports/artillery-report.json stress-test.yml