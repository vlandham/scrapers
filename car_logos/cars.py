import os
import urllib.request
from spatula import HtmlPage, HtmlListPage, CSS, XPath, SelectorError


class CarsList(HtmlListPage):
    source = "https://www.carlogos.org/car-brands-a-z/"

    # each row represents an employee
    selector = CSS("div.a-z dl dd")

    def process_item(selfk, item):
        [link] = item.getchildren()
        url = XPath("./@href").match_one(link)
        # return dict(title=link.text, url=url)
        return CarDetail(
            dict(
                title=link.text,
                url=url,
            ),
            source=url,
        )
    def process_error_response(selfk, exception):
        print("error")


class CarDetail(HtmlPage):
    def process_error_response(selfk, exception):
        print("error")

    def process_page(self):
        logo_url = ""
        logo_basename = ""
        try:
            logo_link = CSS("div.logo-content div.content p.center a").match(self.root)[0]
            logo_url = XPath("./@href").match_one(logo_link)
            print(logo_url)
            logo_basename = os.path.basename(logo_url)
            save_filename = "./data/logos/" + logo_basename
            urllib.request.urlretrieve(logo_url, save_filename)
        except:
            print('no logo found')

        info = {}
        try:
            info_table = CSS("div.content table tbody tr").match(self.root)
            # key, value = info_table.getchildren()
            for row in info_table:
                if len(row.getchildren()) == 2:
                    key, value = row.getchildren()
                    text = ""
                    if value.text:
                        text = value.text.strip()
                    else:
                        value = value.getchildren()[0]
                        text = value.text.strip()
                    info[key.text.strip()] = text
        except:
            print('no info')
        print(info)
        return dict(
            logo_url=logo_url,
            logo_basename=logo_basename,
            info=info,
            # self.input is the data passed in from the prior scrape,
            # in this case a dict we can expand here
            **self.input,
        )
