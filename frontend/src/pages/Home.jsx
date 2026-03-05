import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, TrendingUp, MapPin, Users, Wheat, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-nature dark:gradient-nature-dark py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6 animate-fadeInScale">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-soft"></div>
                <Sprout className="h-20 w-20 text-primary relative z-10 animate-float" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground animate-fadeInUp">
              Welcome to <span className="gradient-text">AnnaData</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              Connecting Farmers Directly with Local Customers
            </p>
            <p className="text-lg mb-10 text-muted-foreground max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              Fresh produce, fair prices, zero middlemen. Empowering farmers and enriching communities through direct trade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <Link to="/register?role=farmer">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 hover-glow hover-scale group">
                  <Wheat className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Register as Farmer
                </Button>
              </Link>
              <Link to="/register?role=customer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 hover-lift group border-2">
                  <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Register as Customer
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AnnaData?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing agriculture by creating a direct link between producers and consumers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover-lift hover-glow group cursor-pointer animate-fadeInUp overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center group-hover:text-primary transition-colors">No Middlemen</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-center">
                  Direct trade between farmers and customers ensures fair prices and better profits for farmers
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover-lift hover-glow group cursor-pointer animate-fadeInUp overflow-hidden relative" style={{animationDelay: '0.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <MapPin className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center group-hover:text-primary transition-colors">Location-Based</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-center">
                  Find farmers near you and support local agriculture while getting the freshest produce
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover-lift hover-glow group cursor-pointer animate-fadeInUp overflow-hidden relative" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <TrendingUp className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center group-hover:text-primary transition-colors">Better Prices</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-center">
                  Farmers earn more, customers pay less. Win-win for everyone involved in the trade
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Farmers */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-primary rounded-full">
                  <Wheat className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold">For Farmers</h3>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Register Your Farm</h4>
                    <p className="text-muted-foreground">Create your farmer profile with farm details and location</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">List Your Crops</h4>
                    <p className="text-muted-foreground">Upload crop details with photos, quantities, and prices</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Connect & Sell</h4>
                    <p className="text-muted-foreground">Receive orders from local customers and sell directly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Customers */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-accent rounded-full">
                  <Users className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold">For Customers</h3>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Account</h4>
                    <p className="text-muted-foreground">Sign up as a customer with your location details</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Browse Produce</h4>
                    <p className="text-muted-foreground">Search for crops from farmers near your location</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Order Fresh</h4>
                    <p className="text-muted-foreground">Place orders and get fresh produce directly from farmers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 gradient-primary text-primary-foreground overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fadeInUp">
            Join AnnaData Today
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            Be part of the agricultural revolution. Whether you're a farmer looking to sell or a customer seeking fresh produce, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <Link to="/marketplace">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 hover-lift hover-glow group shadow-xl">
                <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-transparent text-primary-foreground border-primary-foreground border-2 hover:bg-primary-foreground hover:text-primary hover-scale shadow-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
