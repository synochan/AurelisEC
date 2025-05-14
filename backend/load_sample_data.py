import os
import django
from django.utils.text import slugify

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from django.contrib.auth.models import User
from products.models import Category, Product, ProductVariant, ProductImage
from accounts.models import UserProfile

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
    
    categories = Category.objects.all()
    
    products = [
        {
            "name": "Classic Black T-Shirt",
            "category": "Men",
            "description": "A comfortable black t-shirt made from 100% cotton. Perfect for everyday wear.",
            "price": 19.99,
            "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
            "variants": [
                {"color": "Black", "size": "S", "stock": 15, "sku": "BTS-001"},
                {"color": "Black", "size": "M", "stock": 20, "sku": "BTM-002"},
                {"color": "Black", "size": "L", "stock": 18, "sku": "BTL-003"},
                {"color": "Black", "size": "XL", "stock": 12, "sku": "BTXL-004"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop", "alt_text": "Black T-Shirt Front"},
                {"image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop", "alt_text": "Black T-Shirt Back"}
            ]
        },
        {
            "name": "Slim Fit Jeans",
            "category": "Men",
            "description": "Modern slim fit jeans with a stylish wash. Comfortable stretch denim.",
            "price": 49.99,
            "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop",
            "variants": [
                {"color": "Blue", "size": "30", "stock": 10, "sku": "SJ30-001"},
                {"color": "Blue", "size": "32", "stock": 15, "sku": "SJ32-002"},
                {"color": "Blue", "size": "34", "stock": 12, "sku": "SJ34-003"},
                {"color": "Blue", "size": "36", "stock": 8, "sku": "SJ36-004"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1000&auto=format&fit=crop", "alt_text": "Jeans Front"},
                {"image_url": "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1000&auto=format&fit=crop", "alt_text": "Jeans Back"}
            ]
        },
        {
            "name": "Floral Summer Dress",
            "category": "Women",
            "description": "A beautiful floral dress perfect for summer days. Light and flowing fabric.",
            "price": 39.99,
            "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
            "variants": [
                {"color": "Floral", "size": "XS", "stock": 8, "sku": "FSD-XS-001"},
                {"color": "Floral", "size": "S", "stock": 12, "sku": "FSD-S-002"},
                {"color": "Floral", "size": "M", "stock": 15, "sku": "FSD-M-003"},
                {"color": "Floral", "size": "L", "stock": 10, "sku": "FSD-L-004"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop", "alt_text": "Floral Dress Front"},
                {"image_url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop", "alt_text": "Floral Dress Detail"}
            ]
        },
        {
            "name": "Classic Leather Jacket",
            "category": "Women",
            "description": "A timeless leather jacket that adds edge to any outfit. Made from premium leather.",
            "price": 129.99,
            "image_url": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop",
            "variants": [
                {"color": "Black", "size": "S", "stock": 5, "sku": "LJ-S-001"},
                {"color": "Black", "size": "M", "stock": 8, "sku": "LJ-M-002"},
                {"color": "Black", "size": "L", "stock": 6, "sku": "LJ-L-003"},
                {"color": "Brown", "size": "S", "stock": 4, "sku": "LJ-BS-004"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=1000&auto=format&fit=crop", "alt_text": "Leather Jacket Alt"},
                {"image_url": "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1000&auto=format&fit=crop", "alt_text": "Leather Jacket Detail"}
            ]
        },
        {
            "name": "Canvas Tote Bag",
            "category": "Accessories",
            "description": "A durable canvas tote bag perfect for shopping or daily use. Environmentally friendly.",
            "price": 24.99,
            "image_url": "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop",
            "variants": [
                {"color": "Natural", "size": "One Size", "stock": 25, "sku": "TB-NAT-001"},
                {"color": "Black", "size": "One Size", "stock": 20, "sku": "TB-BLK-002"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop", "alt_text": "Tote Bag Detail"},
                {"image_url": "https://images.unsplash.com/photo-1498925008800-019c6d0f71b3?q=80&w=1000&auto=format&fit=crop", "alt_text": "Tote Bag Usage"}
            ]
        },
        {
            "name": "Leather Boots",
            "category": "Footwear",
            "description": "Classic leather boots with a durable sole. Perfect for all seasons.",
            "price": 89.99,
            "image_url": "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop",
            "variants": [
                {"color": "Brown", "size": "8", "stock": 6, "sku": "LB-8-001"},
                {"color": "Brown", "size": "9", "stock": 8, "sku": "LB-9-002"},
                {"color": "Brown", "size": "10", "stock": 10, "sku": "LB-10-003"},
                {"color": "Brown", "size": "11", "stock": 7, "sku": "LB-11-004"},
                {"color": "Black", "size": "9", "stock": 6, "sku": "LB-9-005"},
                {"color": "Black", "size": "10", "stock": 8, "sku": "LB-10-006"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1542838309-5dcac7ba10de?q=80&w=1000&auto=format&fit=crop", "alt_text": "Boots Side View"},
                {"image_url": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1000&auto=format&fit=crop", "alt_text": "Boots Top View"}
            ]
        },
        {
            "name": "Minimalist Watch",
            "category": "Accessories",
            "description": "A sleek minimalist watch with a leather strap. Adds sophistication to any outfit.",
            "price": 59.99,
            "image_url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop",
            "variants": [
                {"color": "Black/Brown", "size": "One Size", "stock": 15, "sku": "MW-BB-001"},
                {"color": "Silver/Black", "size": "One Size", "stock": 12, "sku": "MW-SB-002"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1000&auto=format&fit=crop", "alt_text": "Watch Close-up"},
                {"image_url": "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=1000&auto=format&fit=crop", "alt_text": "Watch on Wrist"}
            ]
        },
        {
            "name": "Running Shoes",
            "category": "Footwear",
            "description": "Lightweight and comfortable running shoes. Perfect for jogging or casual wear.",
            "price": 79.99,
            "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
            "variants": [
                {"color": "Gray", "size": "8", "stock": 8, "sku": "RS-8G-001"},
                {"color": "Gray", "size": "9", "stock": 10, "sku": "RS-9G-002"},
                {"color": "Gray", "size": "10", "stock": 12, "sku": "RS-10G-003"},
                {"color": "Black", "size": "9", "stock": 7, "sku": "RS-9B-004"},
                {"color": "Black", "size": "10", "stock": 9, "sku": "RS-10B-005"}
            ],
            "additional_images": [
                {"image_url": "https://images.unsplash.com/photo-1584736286294-cece7abf9c8a?q=80&w=1000&auto=format&fit=crop", "alt_text": "Running Shoes Side"},
                {"image_url": "https://images.unsplash.com/photo-1465479423260-c4afc24172c6?q=80&w=1000&auto=format&fit=crop", "alt_text": "Running Shoes Top"}
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
        product, created = Product.objects.get_or_create(
            slug=slug,
            defaults={
                **product_data,
                'category': category,
                'in_stock': True,
                'is_active': True
            }
        )
        
        if created:
            # Save main image
            product.image = image_url
            product.save()
            
            # Create variants
            for variant_data in variants_data:
                ProductVariant.objects.create(
                    product=product,
                    **variant_data
                )
            
            # Create additional images
            for img_data in additional_images_data:
                ProductImage.objects.create(
                    product=product,
                    image=img_data['image_url'],
                    alt_text=img_data['alt_text'],
                    is_featured=(img_data == additional_images_data[0])  # First one is featured
                )
    
    print(f"Created {len(products)} products with variants and images")

if __name__ == "__main__":
    # Create categories
    create_sample_categories()
    
    # Create products
    create_sample_products()
    
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
    
    print("Data loading complete!")