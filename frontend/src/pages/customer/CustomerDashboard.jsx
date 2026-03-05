import { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Link } from 'react-router-dom';
import { cartAPI } from '../../services/api';
export default function CustomerDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoadingCart(true);
      const response = await cartAPI.getCart();
      setCart(response.cart || []);
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoadingCart(false);
    }
  };

  const orders = [
    { id: 1, farmer: 'Ramesh Kumar', crop: 'Wheat', quantity: '50 kg', total: '₹1,250', status: 'Delivered', date: '2025-12-15' },
    { id: 2, farmer: 'Suresh Patel', crop: 'Rice', quantity: '30 kg', total: '₹1,200', status: 'In Transit', date: '2025-12-20' },
    { id: 3, farmer: 'Mahesh Singh', crop: 'Tomatoes', quantity: '10 kg', total: '₹300', status: 'Processing', date: '2025-12-22' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="gradient-text">{user.name}</span>!</h1>
          <p className="text-muted-foreground">Discover fresh produce from local farmers</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/marketplace" className="animate-fadeInUp">
            <Card className="hover-lift hover-glow cursor-pointer group border-2">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Browse Marketplace</CardTitle>
                    <CardDescription>Find fresh produce near you</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/marketplace?nearby=true" className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <Card className="hover-lift hover-glow cursor-pointer group border-2">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-accent/10 rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors">Nearby Farmers</CardTitle>
                    <CardDescription>Discover farmers in your area</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/cart" className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <Card className="hover-lift hover-glow cursor-pointer group border-2">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="relative p-3 bg-blue-500/10 rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <ShoppingCart className="h-6 w-6 text-blue-500" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-soft">
                        {cart.length}
                      </span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-blue-500 transition-colors">My Cart</CardTitle>
                    <CardDescription>{cart.length} items in cart</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift hover-glow group cursor-pointer animate-fadeInUp border-l-4 border-l-primary" style={{animationDelay: '0.3s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform inline-block">{orders.length}</span>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow group cursor-pointer animate-fadeInUp border-l-4 border-l-blue-500" style={{animationDelay: '0.4s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-blue-500 group-hover:scale-110 transition-transform inline-block">{orders.filter(o => o.status === 'In Transit').length}</span>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow group cursor-pointer animate-fadeInUp border-l-4 border-l-green-500" style={{animationDelay: '0.5s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-green-500 group-hover:scale-110 transition-transform inline-block">{orders.filter(o => o.status === 'Delivered').length}</span>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow group cursor-pointer animate-fadeInUp border-l-4 border-l-accent" style={{animationDelay: '0.6s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold gradient-text group-hover:scale-110 transition-transform inline-block">₹2,750</span>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="animate-fadeInUp" style={{animationDelay: '0.7s'}}>
          <CardHeader>
            <CardTitle className="text-2xl">Recent Orders</CardTitle>
            <CardDescription>Track your recent purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between p-4 border-2 rounded-lg hover-lift hover-glow transition-all group cursor-pointer animate-fadeInUp" style={{animationDelay: `${0.8 + index * 0.05}s`}}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">{order.crop}</h4>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-600 ring-1 ring-green-500/20' :
                        order.status === 'In Transit' ? 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20' :
                        'bg-yellow-500/10 text-yellow-600 ring-1 ring-yellow-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">From: {order.farmer}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg gradient-text">{order.total}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">Start shopping from our marketplace</p>
                <Link to="/marketplace">
                  <Button>
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
