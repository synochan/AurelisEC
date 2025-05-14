import os
import django
from django.utils.text import slugify
import requests
from io import BytesIO
from django.core.files import File

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from django.contrib.auth.models import User
from products.models import Category, Product, ProductVariant, ProductImage
from accounts.models import UserProfile

def download_image(url):
    """Download an image from a URL and return it as a Django File object"""
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to download image from {url}")
        return None
    
    image_name = url.split("/")[-1]
    if '?' in image_name:
        image_name = image_name.split('?')[0]
    
    # If image has no extension, add .jpg
    if '.' not in image_name:
        image_name = f"{image_name}.jpg"
    
    return File(BytesIO(response.content), name=image_name)

def create_sample_categories():
    categories = [
        {"name": "Men", "description": "Men's clothing and accessories"},
        {"name": "Women", "description": "Women's clothing and accessories"},
        {"name": "Accessories", "description": "Fashion accessories for all"},
        {"name": "Footwear", "description": "Shoes, boots, and sandals"}
    ]
    
    for cat in categories:
        slug = slugify(cat['name'])
        Category.objects.get_or_create(
            name=cat['name'],
            defaults={
                'slug': slug,
                'description': cat['description']
            }
        )
    
    print(f"Created {len(categories)} categories")

def create_sample_products():
    # Make sure we have categories
    if Category.objects.count() == 0:
        create_sample_categories()
    
    products = [
        {
            "name": "Classic Black T-Shirt",
            "category": "Men",
            "description": "A comfortable black t-shirt made from 100% cotton. Perfect for everyday wear.",
            "price": 19.99,
            "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
            "variants": [
                {"color": "Black", "size": "S", "stock": 15, "sku": "BTS-001"},
                {"color": "Black", "size": "M", "stock": 20, "sku": "BTM-002"},
                {"color": "Black", "size": "L", "stock": 18, "sku": "BTL-003"},
                {"color": "Black", "size": "XL", "stock": 12, "sku": "BTXL-004"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600", "alt_text": "Black T-Shirt Front"},
                {"image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600", "alt_text": "Black T-Shirt Back"}
            ]
        },
        {
            "name": "Slim Fit Jeans",
            "category": "Men",
            "description": "Modern slim fit jeans with a stylish wash. Comfortable stretch denim.",
            "price": 49.99,
            "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
            "variants": [
                {"color": "Blue", "size": "30", "stock": 10, "sku": "SJ30-001"},
                {"color": "Blue", "size": "32", "stock": 15, "sku": "SJ32-002"},
                {"color": "Blue", "size": "34", "stock": 12, "sku": "SJ34-003"},
                {"color": "Blue", "size": "36", "stock": 8, "sku": "SJ36-004"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600", "alt_text": "Jeans Front"},
                {"image_url": "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600", "alt_text": "Jeans Back"}
            ]
        },
        {
            "name": "Floral Summer Dress",
            "category": "Women",
            "description": "A beautiful floral dress perfect for summer days. Light and flowing fabric.",
            "price": 39.99,
            "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
            "variants": [
                {"color": "Floral", "size": "XS", "stock": 8, "sku": "FSD-XS-001"},
                {"color": "Floral", "size": "S", "stock": 12, "sku": "FSD-S-002"},
                {"color": "Floral", "size": "M", "stock": 15, "sku": "FSD-M-003"},
                {"color": "Floral", "size": "L", "stock": 10, "sku": "FSD-L-004"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600", "alt_text": "Floral Dress Front"},
                {"image_url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600", "alt_text": "Floral Dress Detail"}
            ]
        },
        {
            "name": "Minimalist Watch",
            "category": "Accessories",
            "description": "A sleek minimalist watch with a leather strap. Adds sophistication to any outfit.",
            "price": 59.99,
            "image_url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600",
            "variants": [
                {"color": "Black/Brown", "size": "One Size", "stock": 15, "sku": "MW-BB-001"},
                {"color": "Silver/Black", "size": "One Size", "stock": 12, "sku": "MW-SB-002"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600", "alt_text": "Watch Close-up"},
                {"image_url": "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600", "alt_text": "Watch on Wrist"}
            ]
        }
    ]
    
    for product_data in products:
        category_name = product_data.pop('category')
        variants_data = product_data.pop('variants')
        additional_images_data = product_data.pop('additional_images')
        image_url = product_data.pop('image_url')
        
        # Get category
        category = Category.objects.get(name=category_name)
        
        # Create or update product
        slug = slugify(product_data['name'])
        product, created = Product.objects.update_or_create(
            slug=slug,
            defaults={
                **product_data,
                'category': category,
                'in_stock': True,
                'is_active': True
            }
        )
        
        # Set main image
        try:
            main_image = download_image(image_url)
            if main_image:
                product.image = main_image
                product.save()
        except Exception as e:
            print(f"Error downloading main image for {product.name}: {e}")
        
        # Create variants
        for variant_data in variants_data:
            ProductVariant.objects.update_or_create(
                product=product, 
                color=variant_data['color'],
                size=variant_data['size'],
                defaults={
                    'stock': variant_data['stock'],
                    'sku': variant_data['sku']
                }
            )
        
        # Create additional images
        for img_data in additional_images_data:
            try:
                img_file = download_image(img_data['image_url'])
                if img_file:
                    ProductImage.objects.update_or_create(
                        product=product,
                        alt_text=img_data['alt_text'],
                        defaults={
                            'image': img_file,
                            'is_featured': (img_data == additional_images_data[0])  # First one is featured
                        }
                    )
            except Exception as e:
                print(f"Error downloading additional image for {product.name}: {e}")
    
    print(f"Created or updated {len(products)} products with variants and images")

def ensure_admin_user():
    # Ensure admin user exists with profile
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("Created admin user")
    
    # Create profile for admin if doesn't exist
    UserProfile.objects.get_or_create(
        user=admin_user,
        defaults={
            'phone_number': '+1234567890',
            'address': '123 Admin St',
            'city': 'Admin City',
            'state': 'Admin State',
            'postal_code': '12345',
            'country': 'Admin Country'
        }
    )

    print("Admin user and profile ready")

if __name__ == "__main__":
    # Create categories
    create_sample_categories()
    
    # Create products
    create_sample_products()
    
    # Ensure admin user
    ensure_admin_user()
    
    print("Data loading complete!")