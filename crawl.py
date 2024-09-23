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
collection = db['products']

maxPage = 23
base_url = 'https://routine.vn/thoi-trang-nam.html'
tags_list = ["Bán chạy", "Freeship", "Hot sale"]
statusStock = ['stock', 'outStock', 'preOrder']
colors = ["Đỏ", "Cam", "Vàng", "Lam", "Xanh", "Chàm", "Tím", "Trắng", "Đen"]
sizes = ["S", "M", "L", "XL", "XXL"]
productUrl = 'https://picsum.photos/276/380'

# catIds = [
#  '66e9076f71049ba8da1a8040', '66e9076f71049ba8da1a8041', '66e9076f71049ba8da1a8042',
#  '66e9076f71049ba8da1a8043', '66e9076f71049ba8da1a8044', '66e9076f71049ba8da1a8045',
#  '66e9076f71049ba8da1a8046', '66e9076f71049ba8da1a8047', '66e9076f71049ba8da1a8048',
#  '66e9076f71049ba8da1a8049', '66e9076f71049ba8da1a804a', '66e9076f71049ba8da1a804b',
#  '66e9076f71049ba8da1a804c', '66e9076f71049ba8da1a804d', '66e9076f71049ba8da1a804e',
#  '66e9076f71049ba8da1a804f', '66e9076f71049ba8da1a8050', '66e9076f71049ba8da1a8051',
#  '66e9076f71049ba8da1a8052', '66e9076f71049ba8da1a8053', '66e9076f71049ba8da1a8054',
#  '66e9076f71049ba8da1a8055', '66e9076f71049ba8da1a8056', '66e9076f71049ba8da1a8057',
#  '66e9076f71049ba8da1a8058', '66e9076f71049ba8da1a8059', '66e9076f71049ba8da1a805a',
#  '66e9076f71049ba8da1a805b', '66e9076f71049ba8da1a805c', '66e9076f71049ba8da1a805d',
#  '66e9076f71049ba8da1a805e', '66e9076f71049ba8da1a805f', '66e9076f71049ba8da1a8060',
#  '66e9076f71049ba8da1a8061', '66e9076f71049ba8da1a8062', '66e9076f71049ba8da1a8063',
#  '66e9076f71049ba8da1a8064', '66e9076f71049ba8da1a8065', '66e90a8c71049ba8da1a8066',
#  '66e90a8c71049ba8da1a8067', '66e90a8c71049ba8da1a8068', '66e90a8c71049ba8da1a8069',
#  '66e90a8c71049ba8da1a806a', '66e90a8c71049ba8da1a806b', '66e90a8c71049ba8da1a806d',
#  '66e90a8c71049ba8da1a806e', '66e90a8c71049ba8da1a806f', '66e90a8c71049ba8da1a8070',
#  '66e90a8c71049ba8da1a8071', '66e90a8c71049ba8da1a8072', '66e90a8c71049ba8da1a8073',
#  '66e90a8c71049ba8da1a8075', '66e90a8c71049ba8da1a8076', '66e90a8c71049ba8da1a8078',
#  '66e90a8c71049ba8da1a807b', '66e90a8c71049ba8da1a807c', '66e90a8c71049ba8da1a807e',
#  '66e90a8c71049ba8da1a807f', '66e90a8c71049ba8da1a8082', '66e90a8c71049ba8da1a8083',
#  '66e90a8c71049ba8da1a8084', '66e90a8c71049ba8da1a8085', '66e90a8c71049ba8da1a8086',
#  '66e90a8c71049ba8da1a8087', '66e90a8c71049ba8da1a8088', '66e90a8c71049ba8da1a8089',
#  '66e90a8c71049ba8da1a808a', '66e90a8c71049ba8da1a808b', '66e90a8c71049ba8da1a808c',
#  '66e9242c71049ba8da1a8093', '66e9242c71049ba8da1a809b', '66e9242c71049ba8da1a809e',
#  '66e9242c71049ba8da1a80a0', '66e9242c71049ba8da1a80a1', '66e9242c71049ba8da1a80a2',
#  '66e9242c71049ba8da1a80a3', '66e9242c71049ba8da1a80a4', '66e9242c71049ba8da1a80a5',
#  '66e9242c71049ba8da1a80a7'
# ]


catIds = [
  "66e90a8c71049ba8da1a8066",
  "66e90a8c71049ba8da1a8067",
  "66e90a8c71049ba8da1a8068",
  "66e90a8c71049ba8da1a8069",
  "66e90a8c71049ba8da1a806a",
  "66e90a8c71049ba8da1a806b",
  "66e90a8c71049ba8da1a806d",
  "66e90a8c71049ba8da1a806e",
  "66e90a8c71049ba8da1a8070",
  "66e90a8c71049ba8da1a8071",
  "66e90a8c71049ba8da1a8075",
  "66e90a8c71049ba8da1a8076",
  "66e90a8c71049ba8da1a8078",
  "66e90a8c71049ba8da1a807b",
  "66e90a8c71049ba8da1a807c",
  "66e90a8c71049ba8da1a807e",
  "66e90a8c71049ba8da1a807f",
  "66e90a8c71049ba8da1a8082",
  "66e90a8c71049ba8da1a8083",
  "66e90a8c71049ba8da1a8084",
  "66e90a8c71049ba8da1a8085",
  "66e90a8c71049ba8da1a8086",
  "66e90a8c71049ba8da1a8087",
  "66e90a8c71049ba8da1a8088",
  "66e90a8c71049ba8da1a8089",
  "66e90a8c71049ba8da1a808a",
  "66e90a8c71049ba8da1a808b",
  "66e90a8c71049ba8da1a808c",
  "66e9242c71049ba8da1a8093",
  "66e9242c71049ba8da1a809b",
  "66e9242c71049ba8da1a809e",
  "66e9242c71049ba8da1a80a0",
  "66e9242c71049ba8da1a80a1",
  "66e9242c71049ba8da1a80a2",
  "66e9242c71049ba8da1a80a3",
  "66e9242c71049ba8da1a80a4",
  "66e9242c71049ba8da1a80a5",
  "66e9242c71049ba8da1a80a7",
  "66e9242c71049ba8da1a80a8",
  "66e9242c71049ba8da1a80b5",
  "66e9242c71049ba8da1a80b9",
  "66e9242c71049ba8da1a80bb",
  "66e9242c71049ba8da1a80bd",
  "66e9242c71049ba8da1a80bf",
  "66e9242c71049ba8da1a80c0",
  "66e9242c71049ba8da1a80c3",
  "66e9242c71049ba8da1a80d5",
  "66e9242c71049ba8da1a80d6",
  "66e9242c71049ba8da1a80dd",
  "66e9242c71049ba8da1a80df",
  "66e9242c71049ba8da1a80e0",
  "66e9242c71049ba8da1a80e1",
  "66e9242c71049ba8da1a80e2",
  "66e9242c71049ba8da1a80e3",
  "66e9242c71049ba8da1a80e4",
  "66e9242c71049ba8da1a80e5",
  "66e9242c71049ba8da1a80e6",
  "66e9242c71049ba8da1a80e7",
  "66e9242c71049ba8da1a80e8",
  "66e9242c71049ba8da1a80e9",
  "66e9242c71049ba8da1a80ea",
  "66e9242c71049ba8da1a80eb",
  "66e9242c71049ba8da1a80ec",
  "66e9242c71049ba8da1a80ee",
  "66e9242c71049ba8da1a80ef",
  "66e9242c71049ba8da1a80f0",
  "66e9242c71049ba8da1a80f1",
  "66e9242c71049ba8da1a80f2",
  "66e9242c71049ba8da1a80f3",
  "66e9242c71049ba8da1a80f4",
  "66e9242c71049ba8da1a80f5",
  "66e9242c71049ba8da1a80f6",
  "66e9242c71049ba8da1a80f7",
  "66e9242c71049ba8da1a80f8",
  "66e9242c71049ba8da1a80f9",
  "66e9242c71049ba8da1a80fa",
  "66e9242c71049ba8da1a80fb",
  "66e9242c71049ba8da1a80fc",
  "66e9242c71049ba8da1a80fd",
  "66e9242c71049ba8da1a80fe",
  "66e9242c71049ba8da1a8101",
  "66e9242c71049ba8da1a8102",
  "66e9242c71049ba8da1a8105",
  "66e9242c71049ba8da1a8107",
  "66e9242c71049ba8da1a8108",
  "66e9242c71049ba8da1a8109",
  "66e9242c71049ba8da1a810a",
  "66e9242c71049ba8da1a810b",
  "66e9242c71049ba8da1a810c",
  "66e9242c71049ba8da1a810f",
  "66e9242c71049ba8da1a8111",
  "66e9242c71049ba8da1a8112",
  "66e9242c71049ba8da1a8113",
  "66e9242c71049ba8da1a8114",
  "66e9242c71049ba8da1a8116",
  "66e9242c71049ba8da1a8117",
  "66e946e488c674d20941671f"
]

brandIds = [
    '66e3faa15b00a0eaab0b04a0', '66e9511bd7851fa4e4fcf553', '66e95134d7851fa4e4fcf554', '66e9513ed7851fa4e4fcf555', 
    '66e9514ad7851fa4e4fcf556', '66e95151d7851fa4e4fcf557'
]

productTypes = [
    '66e906d271049ba8da1a8039',
    '66e906d271049ba8da1a803a',
    '66e906d271049ba8da1a803b',
    '66e906d271049ba8da1a803c',
    '66e906d271049ba8da1a803d',
    '66e906d271049ba8da1a803e', 
    '66e906d271049ba8da1a803f'
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def create_slug(product_name):
    slug = unidecode(product_name).lower().replace(' ', '-')
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    return slug

def distribute_stock(total_stock, num_sizes):
    stock_distribution = [random.randint(1, total_stock // num_sizes) for _ in range(num_sizes - 1)]
    stock_distribution.append(total_stock - sum(stock_distribution))
    random.shuffle(stock_distribution)
    return stock_distribution

image_counter = 1 

def random_review_content():
    contents = [
        "Great product, very satisfied!",
        "Quality could be better, but overall happy.",
        "Fantastic, exactly what I needed.",
        "Not worth the price, wouldn't recommend.",
        "Excellent build quality and design, highly recommend!",
        "The product arrived on time and works perfectly.",
        "Had some issues with the size, but customer service was helpful.",
        "Amazing! Exceeded my expectations.",
        "Disappointed with the packaging, but the product itself is good.",
        "Will definitely buy again from this store."
    ]
    return random.choice(contents)

def generate_reviews(product_id):
    reviews = []
    num_reviews = random.randint(1, 10) 
    
    for _ in range(num_reviews):
        review = {
            'userId': ObjectId('66e5522603f241deb3d5fccd'),
            'orderId': ObjectId('66e2c1d8b885f7a82f6402aa'),
            'productId': ObjectId(product_id),
            'content': random_review_content(),
            'rating': random.randint(1, 5),
            'createdAt': 1726476852277,
            'updatedAt': 1726476852277
        }
        reviews.append(review)
    
    return reviews

def crawl_product_detail(product_url):
    global image_counter
    product_response = requests.get(product_url, headers=headers)
    
    if product_response.status_code == 200:
        product_soup = BeautifulSoup(product_response.content, 'html.parser')

        product_name_before = product_soup.find('h1', class_='page-title').find('span', class_='base').get_text(strip=True)

        random_number = random.randint(1000, 9999)

        # Thêm số ngẫu nhiên vào sau tên sản phẩm
        product_name = f"{product_name_before} {random_number}"

        price_text = product_soup.find('span', class_='price').get_text(strip=True)
        product_price = float(re.sub(r'[^\d]', '', price_text))
        price = product_price + random.randint(10000, 200000)

        imgUrls = [f"https://picsum.photos/276/380?random={image_counter + i}" for i in range(random.randint(3, 6))]
        image_counter += len(imgUrls)
        
        selected_colors = random.sample(colors, random.randint(1, len(colors)))

        variants = []
        for color in selected_colors:
            imgUrl = f"https://picsum.photos/276/380?random={image_counter}" 
            image_counter += 1
            varStock = random.randint(100, 300)
            sizeStocks = distribute_stock(varStock, 5)
            
            variant = {
                'stock': varStock,
                'price': price,
                'marketPrice': price,
                'capitalPrice': product_price,
                'onlinePrice': price,
                'saleOff': price,
                'sellCount': random.randint(0, 300),
                'sku': random.randint(100000, 999999),
                'color': color,
                'image': imgUrl,
                'sizes': []
            }

            for i, size in enumerate(sizes):
                sizeData = {
                    'size': size,
                    'price': price + random.randint(5000, 20000),
                    'stock': sizeStocks[i]
                }
                
                variant['sizes'].append(sizeData)
                
            variants.append(variant)


        cat_id = ObjectId(random.choice(catIds))
        brand = ObjectId(random.choice(brandIds))
        tags = random.sample(tags_list, random.randint(1, len(tags_list)))
        stock = random.randint(100, 300)
        weight = random.randint(1, 100)
        height = random.randint(1, 100)
        thumbnail = imgUrls[0] 
        slug = create_slug(product_name)
        minInventory = max(0, stock - random.randint(0, 20))
        maxInventory = stock + random.randint(10, 50)

        product_data = {
            'name': product_name,
            'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur justo vitae felis gravida, nec laoreet ligula consequat. Vivamus ac vehicula ligula. Etiam eu libero sed purus cursus tincidunt.',
            'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur justo vitae felis gravida, nec laoreet ligula consequat. Vivamus ac vehicula ligula. Etiam eu libero sed purus cursus tincidunt. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque fringilla consectetur dui, sed dictum ex blandit non. Aenean sed justo felis. Integer viverra venenatis arcu ac ullamcorper. Donec posuere ligula ac turpis suscipit, vitae tincidunt ipsum malesuada. Aliquam erat volutpat. Mauris vitae bibendum metus. Phasellus nec bibendum sapien. Aliquam erat volutpat. Suspendisse eget egestas neque, non viverra est. Aenean at est vulputate, pellentesque nunc at, efficitur ipsum.Mauris eget felis accumsan, placerat dolor nec, interdum mauris. Vestibulum tristique augue vel lorem varius, sed luctus nisl suscipit. Praesent aliquam metus sed leo viverra, et lobortis justo suscipit. Nunc ultricies ligula quis dui maximus vehicula. Integer dapibus risus nec scelerisque tincidunt. Curabitur bibendum risus at est dignissim egestas. Integer fermentum dictum felis, quis mollis lacus condimentum eget. Pellentesque convallis erat in felis consectetur, non faucibus lacus dign',
            'tags': tags,
            'brand': brand,
            'thumbnail': thumbnail,
            'images': imgUrls,
            'price': product_price,
            'status': random.choice([True, False]),
            'slug': slug,
            'variants': variants,
            'cat_id': cat_id,
            'statusStock': random.choice(statusStock),
            'view': random.randint(0, 200),
            'productType': random.choice(productTypes),
            'weight': weight,
            'height': height,
            'inventory': stock,
            'minInventory': minInventory,
            'maxInventory': maxInventory,
            'createdAt': 1726476852277,
            'updatedAt': 1726476852277
        }
        
        product_id = collection.insert_one(product_data).inserted_id
        reviews = generate_reviews(product_id)
        collection.update_one({'_id': product_id}, {'$set': {'reviews': reviews}})
        print(f"Đã lưu sản phẩm: {product_name}")
    else:
        print(f"Không thể truy cập sản phẩm: {product_url}")

for page in range(1, maxPage + 1):
    page_url = f"{base_url}?p={page}"
    response = requests.get(page_url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        products = soup.findAll('a', class_='product-item-link')
        
        for product in products:
            product_url = product['href']
            print(f"Đang crawl sản phẩm: {product_url}")
            
            crawl_product_detail(product_url)
    else:
        print(f"Không thể lấy dữ liệu từ trang {page}: {response.status_code}")

print("Hoàn thành việc crawl!")
