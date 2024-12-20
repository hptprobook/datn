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

maxPage = 65
base_url = 'https://j-p.vn/collections/tat-ca-san-pham-1'
tags_list = ["Bán chạy", "Freeship", "Hot sale"]
statusStock = ['stock', 'outStock', 'preOrder', 'stock', 'stock', 'stock', 'stock', 'stock']
colors = ["Đỏ", "Xanh lá cây", "Xanh", "Xanh dương", "Vàng", "Cam", "Tím", "Hồng", "Đen", "Trắng", "Xám", "Nâu", "Xanh lơ", "Hồng cánh sen", "Xanh lá nhạt", "Xanh đậm", "Tím nhạt"]
sizes = ["S", "M", "L", "XL", "XXL"]
productUrl = 'https://picsum.photos/276/380'

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
    'Nam', 'Nữ', 'Trẻ em'
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def create_slug(product_name):
    slug = unidecode(product_name).lower().replace(' ', '-')
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    random_number = random.randint(1000, 9999)
    return f"{slug}-{random_number}"


def distribute_stock(total_stock, num_sizes):
    stock_distribution = [random.randint(1, total_stock // num_sizes) for _ in range(num_sizes - 1)]
    stock_distribution.append(total_stock - sum(stock_distribution))
    random.shuffle(stock_distribution)
    return stock_distribution

image_counter = 1 

def random_review_content():
    contents = [
        "Sản phẩm tuyệt vời, rất hài lòng!",
        "Chất lượng có thể tốt hơn, nhưng nhìn chung khá ổn.",
        "Tuyệt vời, đúng thứ tôi cần.",
        "Không đáng giá tiền, không khuyến khích mua.",
        "Chất lượng và thiết kế xuất sắc, rất đáng để giới thiệu!",
        "Sản phẩm giao đúng hẹn và hoạt động hoàn hảo.",
        "Gặp một số vấn đề về kích thước, nhưng dịch vụ khách hàng rất hữu ích.",
        "Tuyệt vời! Vượt xa mong đợi của tôi.",
        "Thất vọng với bao bì, nhưng sản phẩm thì tốt.",
        "Sẽ chắc chắn mua lại từ cửa hàng này."
    ]

    return random.choice(contents)

def generate_reviews(product_id):
    reviews = []
    num_reviews = random.randint(1, 10) 
    
    for _ in range(num_reviews):
        review = {
            'userId': ObjectId('672332bb3eb63a6c62287dc6'),
            'orderId': ObjectId('672510f996adbc5a3addec0e'),
            'username': 'Michael Tâm',
            'avatar': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG_Rl6R9cl-rzTJnhqViIqlaOsRRQbMnKoVQ&s',
            'variantColor': random.choice(colors),
            'variantSize': random.choice(sizes),
            'images': [
                'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fhcm.fstorage.vn%2Fgppm2%2Fprod%2Fcms%2F17326902676729618_512.png&w=1920&q=75',
                'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fhcm.fstorage.vn%2Fgppm2%2Fprod%2Fcms%2F17322456477825184_512.JPG&w=1920&q=75',
                'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fhcm.fstorage.vn%2Fgppm2%2Fprod%2Fcms%2F17326932962295246_512.png&w=1920&q=75'
            ],
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

        product_name_before = product_soup.find('div', class_='pro-content-head').find('h1').get_text(strip=True)
        product_name = f"{product_name_before}"
        price_text = product_soup.find('span', class_='price-now').get_text(strip=True)
        product_price = float(re.sub(r'[^\d]', '', price_text))
        price = product_price + random.randrange(10000, 100001, 10000)

        image_elements = product_soup.find_all('img', class_='lazyload-cus dt-width-100')
        imgUrls = [img.get('src') for img in image_elements if img.get('src')]

        if not imgUrls:
            print(f"Không thể lấy hình ảnh từ sản phẩm: {product_url}")
            return

        thumbnail = imgUrls[0]
        selected_colors = random.sample(colors, random.randint(1, len(colors)))

        variants = []
        for color in selected_colors:
            imgUrl = random.choice(imgUrls)
            varStock = random.randint(100, 300)

            has_sizes = random.choice([True, False])
            sku_color = create_slug(f"{product_name_before} {color}").replace('-', '').upper()
            warehouse_id = ObjectId('66ed216af9110113ec059bd2')
            
            variant = {
                'warehouseId': warehouse_id,
                'stock': varStock,
                'price': price,
                'marketPrice': price,
                'capitalPrice': product_price,
                'onlinePrice': price,
                'saleOff': price,
                'sellCount': random.randint(0, 300),
                'sku': sku_color,
                'color': color,
                'image': imgUrl,
                'sizes': []
            }

            if has_sizes:
                sizeStocks = distribute_stock(varStock, len(sizes))
                for i, size in enumerate(sizes):
                    size_sku = f"{sku_color}{size}"
                    sale_quantity = random.randint(1, sizeStocks[i])
                    
                    sizeData = {
                        'size': size,
                        'price': price + random.randrange(10000, 100001, 10000),
                        'stock': sale_quantity,
                        'sale': sale_quantity,
                        'trading': 0,
                        'sku': size_sku
                    }
                    
                    variant['sizes'].append(sizeData)
            else:
                sizeData = {
                    'size': 'FREESIZE',
                    'price': price,
                    'stock': varStock,
                    'sale': random.randint(1, varStock),
                    'trading': random.randint(0, 199),
                    'sku': f"{sku_color}FREESIZE"
                }
                variant['sizes'].append(sizeData)

            variants.append(variant)

        cat_id = ObjectId(random.choice(catIds))
        brand = ObjectId(random.choice(brandIds))
        tags = random.sample(tags_list, random.randint(1, len(tags_list)))
        stock = random.randint(100, 300)
        weight = random.randint(1, 100)
        height = random.randint(1, 100)
        slug = create_slug(product_name)
        minInventory = max(0, stock - random.randint(0, 20))
        maxInventory = stock + random.randint(10, 50)

        productDescription = """<div><h2>Sản phẩm thời trang cao cấp</h2><p>Khám phá sự kết hợp hoàn hảo giữa phong cách và chất lượng với<strong>sản phẩm thời trang cao cấp</strong> của chúng tôi. Thiết kế tinh tế, chất liệu mềm mại, mang đến sự thoải mái và vẻ ngoài nổi bật. </p><ul><li>Chất liệu: Cotton 100%, thân thiện với làn da.</li><li>Kiểu dáng: Hiện đại, phù hợp cho mọi dịp.</li><li>Màu sắc: Đa dạng, dễ dàng phối đồ.</li></ul><p>Hãy sở hữu ngay hôm nay để trải nghiệm phong cách vượt trội!</p></div>"""
        
        productContent = """<div><h2>Sản phẩm thời trang cao cấp - Định nghĩa mới về phong cách</h2><p>Sản phẩm của chúng tôi không chỉ đơn thuần là một món đồ thời trang, mà còn là biểu tượng của sự tinh tế và đẳng cấp. Với thiết kế hiện đại, chất liệu cao cấp và sự chú trọng đến từng chi tiết nhỏ nhất, chúng tôi tự hào mang đến cho bạn một sản phẩm xứng tầm phong cách sống. </p><p><strong>Đặc điểm nổi bật:</strong></p><ul><li><strong>Chất liệu cao cấp:</strong> Cotton tự nhiên 100% kết hợp với công nghệ dệt tiên tiến, mang lại cảm giác mềm mại, thoáng mát và bền bỉ. Không gây kích ứng da, phù hợp cho cả làn da nhạy cảm. </li><li><strong>Thiết kế tinh tế:</strong> Được sáng tạo bởi các nhà thiết kế hàng đầu, sản phẩm mang phong cách hiện đại nhưng không kém phần cổ điển, giúp bạn nổi bật trong mọi hoàn cảnh. </li><li><strong>Phù hợp với mọi dịp:</strong> Từ những buổi dạo phố, hẹn hò, đến các sự kiện quan trọng, sản phẩm này đều đáp ứng mọi nhu cầu thời trang của bạn. </li><li><strong>Màu sắc đa dạng:</strong> Có nhiều tùy chọn màu sắc thời thượng, dễ dàng kết hợp với các phụ kiện và trang phục khác trong tủ đồ của bạn. </li></ul><p> <strong>Lợi ích khi sử dụng:</strong>Mang lại sự tự tin và thoải mái cho người mặc, giúp bạn thể hiện phong cách cá nhân và để lại ấn tượng mạnh mẽ trong mắt người đối diện. Sản phẩm không chỉ là món đồ thời trang, mà còn là tuyên ngôn về gu thẩm mỹ và chất lượng cuộc sống. </p><p><strong>Hướng dẫn bảo quản:</strong></p><ul><li>Giặt ở nhiệt độ dưới 30°C để bảo vệ sợi vải.</li><li>Không sử dụng chất tẩy mạnh để tránh làm phai màu.</li><li>Ủi ở nhiệt độ trung bình để giữ nếp vải luôn đẹp.</li><li>Bảo quản ở nơi khô ráo, thoáng mát.</li></ul> <p>Đừng chần chừ! Sở hữu ngay sản phẩm thời trang cao cấp này để khẳng định phong cách riêng của bạn. Hãy đặt hàng ngay hôm nay để nhận ưu đãi đặc biệt! </p></div>"""

        # SEO Options
        seoOptions = {
            'title': product_name,
            'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'alias': slug
        }

        product_data = {
            'name': product_name,
            'description': productDescription,
            'content': productContent,
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
            'views': random.randint(0, 200),
            'productType': random.sample(productTypes, random.randint(1, 2)),
            'weight': weight,
            'height': height,
            'inventory': stock,
            'minInventory': minInventory,
            'maxInventory': maxInventory,
            'seoOptions': seoOptions,
            'createdAt': 1726476852277,
            'updatedAt': 1726476852277
        }

        product_id = collection.insert_one(product_data).inserted_id
        reviews = generate_reviews(product_id)
        collection.update_one({'_id': product_id}, {'$set': {'reviews': reviews}})
        print(f"Đã lưu sản phẩm: {product_name}")
    else:
        print(f"Không thể truy cập sản phẩm: {product_url}")


for page in range(2, maxPage + 1):
    page_url = f"{base_url}?page={page}"
    response = requests.get(page_url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        products = soup.findAll('a', class_='image-resize')
        
        for product in products:
            product_url = 'https://j-p.vn' + product['href']
            print(f"Đang crawl sản phẩm: {product_url}")
            
            crawl_product_detail(product_url)
    else:
        print(f"Không thể lấy dữ liệu từ trang {page}: {response.status_code}")

print("Hoàn thành việc crawl!")
