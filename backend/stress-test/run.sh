#!/bin/bash

cd reports
> errors-report.txt
> artillery-report.json
cd ..

artillery run -o ./reports/artillery-report.json stress-test.yml