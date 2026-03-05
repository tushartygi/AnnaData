import { useState, useEffect } from 'react';
import { Plus, Package, TrendingUp, Users, Edit, Trash2, ImagePlus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { cropAPI, orderAPI, getCurrentUser } from '../../services/api';

export default function FarmerDashboard() {
  const user = getCurrentUser();
  
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCrop, setEditingCrop] = useState(null);

  const [newCrop, setNewCrop] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    description: '',
    image: '',
    category: 'other'
  });

  // Fetch crops and orders function
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch farmer's crops
      const cropsResponse = await cropAPI.getFarmerCrops(user.id);
      setCrops(cropsResponse.crops || []);
      
      // Fetch farmer's orders
      try {
        const ordersResponse = await orderAPI.getAllOrders();
        setOrders(ordersResponse.orders || []);
        console.log('Fetched orders:', ordersResponse.orders);
      } catch (orderErr) {
        console.error('Failed to fetch orders:', orderErr);
        setOrders([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCrop = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const cropData = {
        name: newCrop.name,
        quantity: parseFloat(newCrop.quantity),
        unit: newCrop.unit,
        price: parseFloat(newCrop.price),
        description: newCrop.description,
        image: newCrop.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
        category: newCrop.category
      };

      if (editingCrop) {
        // Update existing crop
        await cropAPI.updateCrop(editingCrop._id, cropData);
        setEditingCrop(null);
      } else {
        // Create new crop
        await cropAPI.createCrop(cropData);
      }
      
      // Reset form and refresh crops
      setNewCrop({ name: '', quantity: '', unit: 'kg', price: '', description: '', image: '', category: 'other' });
      setShowAddCrop(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save crop');
      console.error('Save crop error:', err);
    }
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setNewCrop({
      name: crop.name,
      quantity: crop.quantity.toString(),
      unit: crop.unit,
      price: crop.price.toString(),
      description: crop.description,
      image: crop.image,
      category: crop.category
    });
    setShowAddCrop(true);
  };

  const deleteCrop = async (id) => {
    if (!confirm('Are you sure you want to delete this crop?')) return;
    
    try {
      await cropAPI.deleteCrop(id);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete crop');
      console.error('Delete crop error:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setError('');
      console.log('Updating order:', orderId, 'to status:', newStatus);
      await orderAPI.updateOrderStatus(orderId, newStatus);
      await fetchData();
    } catch (err) {
      const errorMsg = err.message || 'Failed to update order status';
      setError(errorMsg);
      console.error('Update order status error:', err);
    }
  };

  const stats = {
    totalCrops: crops.length,
    totalOrders: orders.length,
    totalCustomers: new Set(orders.map(o => o.customer)).size,
    totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="gradient-text">{user.name}</span>!</h1>
          <p className="text-muted-foreground">Manage your crops and track your sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift hover-glow group cursor-pointer animate-fadeInUp border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform">{stats.totalCrops}</span>
                <div className="p-3 bg-primary/10 rounded-full group-hover:rotate-12 transition-transform">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow group cursor-pointer animate-fadeInUp border-l-4 border-l-accent" style={{animationDelay: '0.1s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-accent group-hover:scale-110 transition-transform">{stats.totalOrders}</span>
                <div className="p-3 bg-accent/10 rounded-full group-hover:rotate-12 transition-transform">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow group cursor-pointer animate-fadeInUp border-l-4 border-l-blue-500" style={{animationDelay: '0.2s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-500 group-hover:scale-110 transition-transform">{stats.totalCustomers}</span>
                <div className="p-3 bg-blue-500/10 rounded-full group-hover:rotate-12 transition-transform">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow group cursor-pointer animate-fadeInUp border-l-4 border-l-green-500" style={{animationDelay: '0.3s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (Total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-500 group-hover:scale-110 transition-transform">₹{stats.totalRevenue.toLocaleString()}</span>
                <div className="p-3 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crops Management */}
        <Card className="animate-fadeInUp" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">My Crops</CardTitle>
                <CardDescription>Manage your crop listings and prices</CardDescription>
              </div>
              <Button 
                onClick={() => {
                  setShowAddCrop(!showAddCrop);
                  if (showAddCrop) {
                    setEditingCrop(null);
                    setNewCrop({ name: '', quantity: '', unit: 'kg', price: '', description: '', image: '', category: 'other' });
                  }
                }} 
                className="hover-scale hover-glow group"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                {editingCrop ? 'Cancel Edit' : 'Add New Crop'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {showAddCrop && (
              <form onSubmit={handleAddCrop} className="mb-6 p-6 border-2 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 space-y-4 animate-fadeInScale">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <span className="w-2 h-8 bg-primary rounded mr-2"></span>
                  {editingCrop ? 'Edit Crop' : 'Add New Crop'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop-name">Crop Name</Label>
                    <Input
                      id="crop-name"
                      placeholder="e.g., Wheat, Rice, Tomatoes"
                      value={newCrop.name}
                      onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                      className="focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop-quantity">Quantity Available</Label>
                    <Input
                      id="crop-quantity"
                      placeholder="e.g., 1000 kg"
                      value={newCrop.quantity}
                      onChange={(e) => setNewCrop({...newCrop, quantity: e.target.value})}
                      className="focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop-price">Price per Unit</Label>
                    <Input
                      id="crop-price"
                      placeholder="e.g., ₹25/kg"
                      value={newCrop.price}
                      onChange={(e) => setNewCrop({...newCrop, price: e.target.value})}
                      className="focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop-image">Image URL (Optional)</Label>
                    <Input
                      id="crop-image"
                      type="url"
                      placeholder="https://..."
                      value={newCrop.image}
                      onChange={(e) => setNewCrop({...newCrop, image: e.target.value})}
                      className="focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crop-description">Description</Label>
                  <Input
                    id="crop-description"
                    placeholder="Brief description of the crop quality, organic status, etc."
                    value={newCrop.description}
                    onChange={(e) => setNewCrop({...newCrop, description: e.target.value})}
                    className="focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="hover-scale">
                    {editingCrop ? 'Update Crop' : 'Add Crop'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddCrop(false)} className="hover-scale">
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Crops List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading your crops...</p>
              </div>
            ) : crops.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl font-semibold mb-2">No crops yet</p>
                <p className="text-muted-foreground mb-4">Start by adding your first crop listing</p>
                <Button onClick={() => setShowAddCrop(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Crop
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crops.map((crop, index) => (
                  <Card key={crop._id} className="overflow-hidden hover-lift hover-glow group border-2 animate-fadeInUp" style={{animationDelay: `${0.5 + index * 0.05}s`}}>
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {crop.image ? (
                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
                          <ImagePlus className="h-12 w-12 text-muted-foreground group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                      <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                        crop.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {crop.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{crop.name}</CardTitle>
                      <CardDescription>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-semibold text-foreground text-lg gradient-text">₹{crop.price}/{crop.unit}</span>
                          <span className="text-sm">{crop.quantity} {crop.unit}</span>
                        </div>
                        <p className="text-xs mt-2 line-clamp-2">{crop.description}</p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover-scale group/btn"
                          onClick={() => handleEditCrop(crop)}
                        >
                          <Edit className="h-3 w-3 mr-1 group-hover/btn:rotate-12 transition-transform" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1 hover-scale"
                          onClick={() => deleteCrop(crop._id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {crops.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No crops listed yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first crop listing</p>
                <Button onClick={() => setShowAddCrop(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Crop
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card className="shadow-lg border-2 hover-glow animate-fadeInUp" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Orders received for your crops</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold gradient-text">{orders.length}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl font-semibold mb-2">No orders yet</p>
                <p className="text-muted-foreground">Orders from customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order, index) => (
                  <div 
                    key={order._id} 
                    className="p-4 border-2 rounded-lg hover-lift bg-card animate-fadeInUp"
                    style={{animationDelay: `${0.6 + index * 0.05}s`}}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{order.cropName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Confirmed' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Customer:</span> {order.customerName}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Phone:</span> {order.customerPhone}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Quantity:</span> {order.quantity} {order.unit}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Amount:</span> ₹{order.totalAmount}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {order.status === 'Processing' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                            className="hover-scale"
                          >
                            Confirm
                          </Button>
                        )}
                        {order.status === 'Confirmed' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateOrderStatus(order._id, 'In Transit')}
                            className="hover-scale"
                          >
                            Ship
                          </Button>
                        )}
                        {order.status === 'In Transit' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                            className="hover-scale"
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
