import sys
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import re

sys.stdout.reconfigure(encoding='utf-8')

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['crawl_test']
collection = db['products']

url = 'https://routine.vn/thoi-trang-nam/ao-nam.html'

response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')

    products = soup.findAll('div', class_='product-item-info')
    
    for product in products:
        title = product.find('a', class_='product-item-link').text.strip()
        price = product.find('span', class_='price').text.strip()
        image_url = product.find('img')['src']
        
        price_number = re.sub(r'\D', '', price)
        price_number = int(price_number)

        product_data = {
            'title': title,
            'price': price_number,
            'image_url': image_url
        }
        print(product_data)

        collection.insert_one(product_data)

    print("Data saved!")
else:
    print("Cannot get data:", response.status_code)
