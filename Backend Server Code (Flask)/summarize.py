import requests
from bs4 import BeautifulSoup
import json


class summaryGenerator():
    def __init__(self):
        pass

    def getSummary(self, url):
        s = requests.session()
        s.headers = {
            'authority': 'www.cnn.com',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'referer': 'https://www.cnn.com/',
            'accept-language': 'en-US,en;q=0.9',
        }
        response = s.get(url)
        soup = BeautifulSoup(response.text, 'lxml')
        mainText = soup.find("section", {"data-zone-label": "bodyText"}).text
        s.headers['api-key'] = "bbd98f91-b440-470f-865c-b158962183e5"
        data = {
            'key': '49f3708526cd08282206b001f7dec868',
            'of' : 'json',
            'txt' : mainText,
            'sentences' : 2
        }

        response = s.post("https://api.meaningcloud.com/summarization-1.0", data=data)
        data = json.loads(response.text)
        return data['summary']
        
