# -*- coding: utf-8 -*-

import scrapy
import urlparse
import itertools

from metaphors.items import MetaphorsItem


def flatten(foo):
    flat = []
    for x in foo:
        if hasattr(x, '__iter__'):
            for y in flatten(x):
                flat.append(y)
        else:
            flat.append(x)
    return flat


class MetaphorSpider(scrapy.Spider):
    '''
    Spider
    '''

    name = 'metaphors'
    allowed_domains = ['metaphor.icsi.berkeley.edu']
    start_urls = ['https://metaphor.icsi.berkeley.edu/pub/en/index.php/Category:Metaphor']

    def parse(self, response):
        # links = response.xpath("//a[contains(@href, '/c/')]/@href")
        # links = response.xpath("//h2/a[contains(@href, '/film/')]/@href")
        links = response.xpath("//div[@id = 'bodyContent']//ul/li/a[contains(@href, '/Metaphor:')]/@href")
        for href in links:
            url = response.urljoin(href.extract())

            yield scrapy.Request(url, callback=self.parse_metaphor_page)


    def parse_metaphor_page(self, response):
        meta = MetaphorsItem()

        fields = {}

        tables = response.css('.wikitable')
        for table in tables:
            for row in table.css('tr'):
                key = row.css('th::text').extract_first()
                if key:
                    key = key.strip()
                value = row.css('td::text').extract_first()
                if value:
                    value = value.strip()
                if key:
                    if key in fields:
                        fields[key] = [fields[key], value]
                    else:
                        fields[key] = value
        meta['fields'] = fields
        meta['url'] = response.url
        yield meta
