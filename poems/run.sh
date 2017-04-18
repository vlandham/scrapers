#!/bin/bash

mkdir -p ../data
rm -f ../data/poems.json
scrapy crawl poems_spider -o ../data/poems.json
