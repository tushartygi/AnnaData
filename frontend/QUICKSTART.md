# AnnaData - Quick Start Guide

## 🚀 Getting Started

### 1. First Time Setup
```bash
cd E:\Kisaan\frontend
npm install
npm run dev
```

Open browser at: http://localhost:5173

### 2. Test the Application

#### As a Customer:
1. Click "Register as Customer" on the homepage
2. Fill in your details (name, email, address, etc.)
3. Login with your credentials
4. Browse the Marketplace
5. Search for crops and farmers near you

#### As a Farmer:
1. Click "Register as Farmer" on the homepage
2. Fill in farm details (farm size, location, etc.)
3. Login with your credentials
4. Add crops from your dashboard
5. Manage your crop listings

## 📁 Key Files

### Components
- `src/components/Header.jsx` - Navigation header with auth
- `src/components/Footer.jsx` - Site footer
- `src/components/ui/*` - shadcn/ui components

### Pages
- `src/pages/Home.jsx` - Landing page
- `src/pages/Login.jsx` - Login with role tabs
- `src/pages/Register.jsx` - Registration with role tabs
- `src/pages/Marketplace.jsx` - Browse crops
- `src/pages/farmer/FarmerDashboard.jsx` - Farmer dashboard
- `src/pages/customer/CustomerDashboard.jsx` - Customer dashboard

### Configuration
- `tailwind.config.js` - TailwindCSS config with nature theme
- `vite.config.js` - Vite config with path aliases
- `src/index.css` - Global styles and CSS variables

## 🎨 Customization

### Change Color Theme
Edit `src/index.css` and modify the CSS variables:
```css
:root {
  --primary: 142 76% 36%;    /* Main green color */
  --accent: 45 93% 47%;       /* Wheat gold */
  --secondary: 30 20% 85%;    /* Earth brown */
}
```

### Add New Pages
1. Create new file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `Header.jsx`

### Add New Components
```bash
# Create in src/components/
# Import and use in pages
```

## 🔑 Mock Authentication

Current implementation uses localStorage:
- User data stored in: `localStorage.getItem('user')`
- Login: Sets user object
- Logout: Removes user object
- Protected routes check for user presence

**For Production**: Replace with JWT authentication and backend API.

## 📱 Testing Responsive Design

- **Desktop**: Full screen (> 1024px)
- **Tablet**: Resize to 768-1024px
- **Mobile**: Resize to < 768px or use browser DevTools

## 🛠️ Common Tasks

### Add a New Crop Category
Edit `src/pages/Marketplace.jsx` filter buttons section

### Modify Farmer Dashboard Stats
Edit `src/pages/farmer/FarmerDashboard.jsx` stats cards

### Change Homepage Hero Text
Edit `src/pages/Home.jsx` hero section

### Update Navigation Links
Edit `src/components/Header.jsx` navigation section

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# Or use different port
npm run dev -- --port 3000
```

### Styling Not Applied
```bash
# Restart dev server
# Clear cache
rm -rf node_modules/.vite
npm run dev
```

### Component Not Found
Check path alias in `vite.config.js`:
```javascript
"@": path.resolve(__dirname, "./src")
```

## 📦 Dependencies

### Core
- react: ^18.3.1
- react-dom: ^18.3.1
- react-router-dom: ^7.1.1

### UI
- @radix-ui/react-*: UI primitives
- lucide-react: Icons
- tailwindcss: Styling
- class-variance-authority: Component variants
- clsx & tailwind-merge: Utility classes

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

## 📞 Support

For issues or questions:
1. Check the main README.md
2. Review component documentation
3. Check browser console for errors

---

**Happy Coding! 🌾**
