import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, ShoppingCart, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { cropAPI, cartAPI, getCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Marketplace() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch crops on mount
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await cropAPI.getAllCrops();
      setProducts(response.crops || []);
    } catch (err) {
      setError(err.message || 'Failed to load crops');
      console.error('Fetch crops error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchQuery,
        city: locationFilter,
        category: categoryFilter !== 'all' ? categoryFilter : undefined
      };
      const response = await cropAPI.getAllCrops(filters);
      setProducts(response.crops || []);
    } catch (err) {
      setError(err.message || 'Failed to search crops');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user || user.role !== 'customer') {
      setError('Please login as a customer to add items to cart');
      return;
    }

    try {
      setAddingToCart(product._id);
      setError('');
      await cartAPI.addToCart(product._id, 1);
      setSuccessMessage(`${product.name} added to cart!`);
      
      // Navigate to cart after 1 second
      setTimeout(() => {
        navigate('/cart');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to add to cart');
      console.error('Add to cart error:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">Marketplace</h1>
          <p className="text-muted-foreground">Discover fresh produce from local farmers</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 hover-glow transition-all duration-300 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                {successMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search for crops or farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter by city..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <Button onClick={handleSearch} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Button variant="outline" size="sm" className="hover-scale group">
                <Filter className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                All Categories
              </Button>
              <Button variant="outline" size="sm" className="hover-glow hover-scale">Grains</Button>
              <Button variant="outline" size="sm" className="hover-glow hover-scale">Vegetables</Button>
              <Button variant="outline" size="sm" className="hover-glow hover-scale">Fruits</Button>
              <Button variant="outline" size="sm" className="hover-glow hover-scale">Pulses</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">No crops available</p>
            <p className="text-muted-foreground">Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card key={product._id} className="overflow-hidden hover-lift hover-glow group cursor-pointer border-2 animate-fadeInUp" style={{animationDelay: `${0.3 + index * 0.05}s`}}>
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 gradient-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg group-hover:scale-110 transition-transform">
                    ₹{product.price}/{product.unit}
                  </div>
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">Sold Out</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{product.name}</CardTitle>
                  <CardDescription>
                    <div className="space-y-1">
                      <p className="flex items-center text-sm">
                        <span className="font-semibold text-foreground">By: {product.farmerName}</span>
                      </p>
                      <p className="flex items-center text-sm group-hover:text-primary transition-colors">
                        <MapPin className="h-3 w-3 mr-1" />
                        {product.farmerCity}, {product.farmerState}
                        {product.distance && ` • ${product.distance}`}
                      </p>
                      <p className="text-sm">Available: <span className="font-medium text-foreground">{product.quantity} {product.unit}</span></p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full hover-scale group/btn" 
                    disabled={!product.isAvailable || (user && user.role !== 'customer') || addingToCart === product._id}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                    {addingToCart === product._id ? 'Adding...' : (user?.role === 'customer' ? 'Add to Cart' : 'View Details')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
