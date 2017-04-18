# -*- coding: utf-8 -*-
import scrapy
import urlparse
from poems.items import PoemsItem

class PoemsSpiderSpider(scrapy.Spider):
    name = "poems_spider"
    allowed_domains = ["poemhunter.com"]
    start_urls = (
        'https://www.poemhunter.com/poems/classical-poems/',
    )

    def parse(self, response):
        links = response.css('#content .title a::attr(href)')
        for href in links:
            xhref = href.extract()

            if "poem" in xhref:
                url = response.urljoin(xhref)

                yield scrapy.Request(url, callback=self.parse_poem)

        # Get More Pages
        next_page = response.css(".pagination .next a::attr(href)").extract_first()
        if next_page is not None:
            # next_page = "http://letterboxd.com" + next_page
            next_page = response.urljoin(next_page)
            yield scrapy.Request(next_page, callback=self.parse)

    def parse_poem(self, response):
        poem = PoemsItem()
        title = response.css('h1.title::text').extract_first()
        print(title)
        text = response.css('.KonaBody p::text').extract()
        poem['title'] = title
        poem['text'] = text
        yield poem
