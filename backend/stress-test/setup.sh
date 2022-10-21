#!/bin/bash

rm -rf reports
rm -rf resources

mkdir reports
mkdir resources

cd data
npm install
npm start
cd ..