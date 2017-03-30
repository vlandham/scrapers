#!/bin/bash

mkdir -p ../data
rm -f ../data/metaphors.json
scrapy crawl metaphors -o ../data/metaphors.json
