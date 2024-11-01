import sys
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from unidecode import unidecode
from bson import ObjectId
import random
import re

sys.stdout.reconfigure(encoding='utf-8')

client = MongoClient('mongodb+srv://admin1:admin1@datn.5mgkgxf.mongodb.net/?retryWrites=true&w=majority&appName=datn')
db = client['datn']
collection = db['blogs']

maxPage = 50
base_url = 'https://vnexpress.net/kinh-doanh'
tags_list = ["Khuyến mãi hot", "Cẩm nang mua sắm", "Mẹo vặt", "Cộng đồng"]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def generate_slug(title):
    title_no_diacritics = unidecode(title)
    slug = re.sub(r'\s+', '-', title_no_diacritics.strip().lower())
    return slug

def crawl_blog_detail(blog_url, thumbnail_url):
    blog_response = requests.get(blog_url, headers=headers)
    
    if blog_response.status_code == 200:
        blog_soup = BeautifulSoup(blog_response.content, 'html.parser')
        
        title = blog_soup.find('h1', class_='title-detail').get_text(strip=True)
        short_desc = blog_soup.find('p', class_='description').get_text(strip=True)
        content = blog_soup.find('article', class_='fck_detail').get_text(strip=True)
        
        slug = generate_slug(title)
        
        blog_data = {
            'title': title,
            'shortDesc': short_desc,
            'content': content,
            'tags': random.sample(tags_list, random.randint(1, 3)),
            'thumbnail': thumbnail_url,
            'authID': ObjectId('66e7ef1a32c291eec36d52d0'),
            'status': random.choice(['public', 'private', 'waiting', 'reject']),
            'views': random.randint(0, 200),
            'createdAt': 1728577736517,
            'updatedAt': 1728577736517,
            'slug': slug,
            'metaDescription': short_desc,
            'metaKeywords': random.sample(tags_list, random.randint(1, 3)),
            'createdAt': 1726476852277,
            'updatedAt': 1726476852277
        }
        
        collection.insert_one(blog_data)
        print(f"Đã lưu bài viết: {title}")
    else:
        print(f"Không thể truy cập bài viết: {blog_url}")

for page in range(12, maxPage + 1):
    page_url = f"{base_url}-p{page}"
    response = requests.get(page_url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        blogs = soup.find_all('h2', class_='title-news')
        
        for blog in blogs:
            blog_link = blog.find('a')
            if blog_link and 'href' in blog_link.attrs:
                blog_url = blog_link['href']
                
                thumb_art = blog.find_previous_sibling('div', class_='thumb-art')
                thumbnail_url = None
                if thumb_art:
                    img_tag = thumb_art.find('img')
                    if img_tag and 'data-src' in img_tag.attrs:
                        thumbnail_url = img_tag['data-src']
                        
                
                if thumbnail_url:
                    print(f"Đang crawl bài viết: {blog_url} với hình ảnh {thumbnail_url}")
                    crawl_blog_detail(blog_url, thumbnail_url)
                else:
                    print(f"Không thể lấy hình ảnh từ bài viết: {blog_url}")
    else:
        print(f"Không thể lấy dữ liệu từ trang {page}: {response.status_code}")

print("Hoàn thành việc crawl!")
