
## Scrapy Scrapers Scrape

A repo of Web Scrapers written with [Scrapy](https://scrapy.org/)

## Scrapy Quickstart

### Install / Upgrade

If you haven't yet, use Conda to create a new python environment with scrapy in it.

Activate that environment, I called it `scrapy`

```
source activate scrapy
```

As of writing this README, the latest Scrapy version is `1.3`.

See what version of scrapy you have:

```
scrapy version
```

Update as necessary:

```
pip install scrapy --upgrade
```

### New Scraper

Use `scrapy startproject` to create a new sub-directory in this repo to store a new scraper.

For example, here we start a poem scraper in the `poems` sub-directory:

```
scrapy startproject poems
```

### New Spider

Usually I have just one spider for each scraper - but perhaps I'm doing something wrong.

We can create a new spider using `genspider`. Apparently the Spider's name cannot be the same as the scraper, so I append `_spider` to it

```
cd poems
scrapy genspider poems_spider
```

### Scrapy Shell

You're gonna want the shell, to test out xpath and css selections

```
scrapy shell 'https://www.poetryfoundation.org/poems-and-poets/poems#page=1&sort_by=recently_added'
```

In the shell, just like in your spider's parsing functions, you have access to `response`.

## Scrapy Selections

Use `.css` or `.xpath` to pull out selections of the HTML.

Examples:

Pull out the href attributes of a bunch of links using css:

```
response.css('#content .title a::attr(href)')
```

Use the `.extract()` method of a selection to get out the text
