import os
import django
from django.utils.text import slugify

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from django.contrib.auth.models import User
from products.models import Category, Product, ProductVariant

def create_samples():
    # Create categories
    categories = [
        {"name": "Men", "description": "Men's clothing and accessories"},
        {"name": "Women", "description": "Women's clothing and accessories"},
        {"name": "Accessories", "description": "Fashion accessories for all"},
        {"name": "Footwear", "description": "Shoes, boots, and sandals"}
    ]
    
    for cat_data in categories:
        Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'slug': slugify(cat_data['name']),
                'description': cat_data['description']
            }
        )
    
    print(f"Created {len(categories)} categories")
    
    # Create products
    products = [
        {
            "name": "Classic Black T-Shirt",
            "category": "Men",
            "description": "A comfortable black t-shirt made from 100% cotton. Perfect for everyday wear.",
            "price": 19.99,
        },
        {
            "name": "Slim Fit Jeans",
            "category": "Men",
            "description": "Modern slim fit jeans with a stylish wash. Comfortable stretch denim.",
            "price": 49.99,
        },
        {
            "name": "Floral Summer Dress",
            "category": "Women",
            "description": "A beautiful floral dress perfect for summer days. Light and flowing fabric.",
            "price": 39.99,
        },
        {
            "name": "Classic Leather Jacket",
            "category": "Women",
            "description": "A timeless leather jacket that adds edge to any outfit. Made from premium leather.",
            "price": 129.99,
        },
        {
            "name": "Canvas Tote Bag",
            "category": "Accessories",
            "description": "A durable canvas tote bag perfect for shopping or daily use. Environmentally friendly.",
            "price": 24.99,
        },
        {
            "name": "Leather Boots",
            "category": "Footwear",
            "description": "Classic leather boots with a durable sole. Perfect for all seasons.",
            "price": 89.99,
        },
    ]
    
    for product_data in products:
        category_name = product_data.pop('category')
        category = Category.objects.get(name=category_name)
        
        product, created = Product.objects.get_or_create(
            name=product_data['name'],
            defaults={
                **product_data,
                'slug': slugify(product_data['name']),
                'category': category,
                'in_stock': True,
                'is_active': True
            }
        )
        
        if created:
            # Create some variants
            if category_name in ["Men", "Women"]:
                for size in ["S", "M", "L", "XL"]:
                    ProductVariant.objects.create(
                        product=product,
                        color="Black",
                        size=size,
                        stock=10,
                        sku=f"{slugify(product_data['name'])}-{size}".upper()
                    )
            elif category_name == "Accessories":
                ProductVariant.objects.create(
                    product=product,
                    color="Black",
                    size="One Size",
                    stock=20,
                    sku=f"{slugify(product_data['name'])}-OS".upper()
                )
            elif category_name == "Footwear":
                for size in ["8", "9", "10", "11"]:
                    ProductVariant.objects.create(
                        product=product,
                        color="Brown",
                        size=size,
                        stock=8,
                        sku=f"{slugify(product_data['name'])}-{size}".upper()
                    )
    
    print(f"Created {len(products)} products with variants")
    
    # Ensure admin user exists
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("Created admin user")
    
    print("Sample data creation complete!")

if __name__ == "__main__":
    create_samples()