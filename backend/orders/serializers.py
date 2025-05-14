from rest_framework import serializers
from .models import Order, OrderItem, Payment
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'price', 'quantity', 'color', 'size']


class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'variant', 'quantity', 'color', 'size']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'payment_method', 'transaction_id', 'amount', 'status', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'status', 'total_price', 'created_at', 'updated_at', 'items', 'payment']


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'first_name', 'last_name', 'email', 'address', 'city', 'state',
            'postal_code', 'country', 'phone', 'total_price', 'status',
            'payment_id', 'created_at', 'updated_at', 'items', 'payment'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)
    payment_method = serializers.CharField(write_only=True)
    
    class Meta:
        model = Order
        fields = [
            'first_name', 'last_name', 'email', 'address', 'city', 'state',
            'postal_code', 'country', 'phone', 'items', 'payment_method'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        payment_method = validated_data.pop('payment_method')
        
        # Calculate total price
        total_price = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            total_price += product.price * quantity
        
        # Create order
        validated_data['user'] = self.context['request'].user
        validated_data['total_price'] = total_price
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item_data in items_data:
            product = item_data['product']
            variant = item_data.get('variant')
            OrderItem.objects.create(
                order=order,
                product=product,
                variant=variant,
                price=product.price,
                quantity=item_data['quantity'],
                color=item_data.get('color', ''),
                size=item_data.get('size', '')
            )
        
        # Create payment
        Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=total_price,
            status='pending'
        )
        
        return order
