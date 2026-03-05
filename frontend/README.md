# AnnaData - Farm to Customer Direct Platform

![AnnaData](https://img.shields.io/badge/AnnaData-Agricultural%20Platform-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.3-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## 🌾 About AnnaData

**AnnaData** is a revolutionary agricultural platform that connects farmers directly with local customers, eliminating middlemen and ensuring fair prices for both parties. The platform empowers farmers to showcase their produce and enables customers to purchase fresh, locally-sourced products.

### Key Features

- **🌱 Nature-Themed Design**: Clean, modern UI with earth-tone color palette
- **👨‍🌾 Dual User Roles**: Separate interfaces for Farmers and Customers
- **📍 Location-Based Search**: Find farmers and produce near you
- **💰 Direct Trade**: No middlemen, fair prices for all
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Modern UI Components**: Built with shadcn/ui for consistency and accessibility

## 🚀 Technology Stack

- **Frontend Framework**: React 18.3 with Vite
- **Styling**: TailwindCSS with custom nature theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

## 📦 Installation

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.jsx       # Navigation header
│   │   └── Footer.jsx       # Site footer
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login with role selection
│   │   ├── Register.jsx     # Registration with role selection
│   │   ├── Marketplace.jsx  # Browse crops
│   │   ├── farmer/
│   │   │   └── FarmerDashboard.jsx
│   │   └── customer/
│   │       └── CustomerDashboard.jsx
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & theme
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## 🎨 Design System

### Color Palette (Nature Theme)

- **Primary (Green)**: Agriculture and growth - `hsl(142, 76%, 36%)`
- **Secondary (Earth Brown)**: Soil and earth - `hsl(30, 20%, 85%)`
- **Accent (Wheat Gold)**: Harvest and abundance - `hsl(45, 93%, 47%)`
- **Background**: Clean whites and soft greens
- **Text**: Natural dark tones

## 👥 User Roles

### Farmer
- Register with farm details
- Upload crop listings with images, quantities, and prices
- Manage crop inventory
- Track orders and sales
- View customer analytics

### Customer
- Register with location details
- Browse marketplace
- Search by crop name or location
- Filter by distance
- Track orders

## 🔐 Authentication

- **Login Page**: Users select their role (Farmer/Customer) before logging in
- **Register Page**: Users provide role-specific information during registration
- **Protected Routes**: Dashboards are protected and role-specific
- **Session Management**: Uses localStorage (can be upgraded to JWT)

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚧 Future Enhancements

- Map integration (Google Maps/Mapbox)
- Real-time chat between farmers and customers
- Payment gateway integration
- Order tracking with notifications
- Multi-language support
- Mobile app (React Native)

## 👨‍💻 Developer

Built with ❤️ by a senior frontend engineer with 12+ years of experience.

---

**Note**: This is a frontend demonstration. For production use, integrate with a backend API for user authentication, database operations, file uploads, and payment processing.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
