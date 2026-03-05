import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { cartAPI, orderAPI } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingItem, setUpdatingItem] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.cart || []);
    } catch (err) {
      setError(err.message || 'Failed to load cart');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cropId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItem(cropId);
      setError('');
      await cartAPI.updateCartItem(cropId, newQuantity);
      setCart(cart.map(item => 
        item.crop._id === cropId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } catch (err) {
      setError(err.message || 'Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeFromCart = async (cropId) => {
    try {
      setError('');
      await cartAPI.removeFromCart(cropId);
      setCart(cart.filter(item => item.crop._id !== cropId));
      setSuccessMessage('Item removed from cart');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setError(err.message || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setCheckingOut(true);
      setError('');

      // Create orders for each cart item
      const orderPromises = cart.map(item => 
        orderAPI.createOrder({
          cropId: item.crop._id,
          quantity: item.quantity,
          notes: ''
        })
      );

      await Promise.all(orderPromises);

      // Clear cart after successful checkout
      await cartAPI.clearCart();

      setSuccessMessage('Orders placed successfully!');
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to place orders');
    } finally {
      setCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.crop.price * item.quantity);
    }, 0);
  };

  const calculateItemTotal = (item) => {
    return item.crop.price * item.quantity;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">Shopping Cart</h1>
          <p className="text-muted-foreground">Review your items and checkout</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fadeInUp">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm animate-fadeInUp">
            {successMessage}
          </div>
        )}

        {cart.length === 0 ? (
          <Card className="text-center py-16 animate-fadeInUp">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some items from the marketplace to get started</p>
              <Link to="/marketplace">
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <Card key={item.crop._id} className="hover-lift animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.crop.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'} 
                          alt={item.crop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.crop.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              By {item.crop.farmer?.name || 'Unknown Farmer'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.crop.farmer?.city}, {item.crop.farmer?.state}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFromCart(item.crop._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.crop._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItem === item.crop._id}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.crop._id, item.quantity + 1)}
                              disabled={item.quantity >= item.crop.quantity || updatingItem === item.crop._id}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground ml-2">
                              {item.crop.unit}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              ₹{item.crop.price}/{item.crop.unit}
                            </p>
                            <p className="text-lg font-bold gradient-text">
                              ₹{calculateItemTotal(item).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 hover-glow animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>{cart.length} item(s) in cart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-xl gradient-text">
                          ₹{calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={checkingOut || cart.length === 0}
                  >
                    {checkingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <Link to="/marketplace">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>

                  <div className="pt-4 text-xs text-muted-foreground space-y-1">
                    <p>✓ Direct from local farmers</p>
                    <p>✓ Fresh produce guaranteed</p>
                    <p>✓ Secure payment options</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
