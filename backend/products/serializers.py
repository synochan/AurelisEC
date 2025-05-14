from rest_framework import serializers
from .models import Category, Product, ProductVariant, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_featured']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'color', 'size', 'stock', 'sku']


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category', 'price', 'featured_image', 'in_stock']

    def get_featured_image(self, obj):
        featured_image = obj.images.filter(is_featured=True).first()
        if not featured_image and obj.images.exists():
            featured_image = obj.images.first()
        
        if featured_image:
            return ProductImageSerializer(featured_image).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category', 'description', 'price', 
                 'image', 'in_stock', 'is_active', 'created_at', 'images', 'variants']
