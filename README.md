# DelishDrop Restaurant Website

A modern, professional restaurant website built with React, TypeScript, and Tailwind CSS featuring role-based authentication, lazy loading, animations, and table booking functionality.

## Features

### Core Features
- 🎨 Modern, responsive UI design
- 🔐 Role-based authentication (Guest, Customer, Admin)
- 🛒 Shopping cart with persistent storage
- 📅 Table booking system
- 🎭 Smooth animations with Framer Motion
- ⚡ Lazy loading for optimal performance
- 📱 Fully responsive design
- 💾 State management with Zustand

### User Roles
- **Guest**: Can browse menu and view content
- **Customer**: Can book tables, manage bookings, and make orders
- **Admin**: Full access to all features (future: manage menu, bookings, users)

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Build Tool**: Vite
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Button, Header, Footer)
│   ├── sections/        # Page sections (Hero, Categories, MenuCard)
│   ├── auth/           # Authentication components
│   └── booking/        # Booking related components
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── MenuPage.tsx
│   ├── CartPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── BookingsPage.tsx
├── store/              # Zustand stores
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── bookingStore.ts
├── routes/             # Route configuration
│   └── ProtectedRoute.tsx
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and data
└── App.tsx            # Main app component
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Demo Credentials

### Admin Account
- Email: admin@delishdrop.com
- Password: admin123

### Customer Account
- Email: customer@example.com
- Password: customer123

## Key Features Implementation

### Role-Based Authentication
- Protected routes using HOC pattern
- Role hierarchy (Guest < Customer < Admin)
- Persistent authentication with Zustand persist middleware

### Lazy Loading
- Code splitting with React.lazy()
- Suspense boundaries for loading states
- Image lazy loading with native browser support
- Route-based code splitting

### Animations
- Page transitions with Framer Motion
- Scroll-triggered animations
- Hover and tap interactions
- Loading spinners and skeletons

### Table Booking
- Form validation with React Hook Form
- Date and time slot selection
- Special requests handling
- Booking status management (Pending, Confirmed, Cancelled)

### Shopping Cart
- Add/remove items
- Quantity management
- Persistent storage
- Real-time total calculation

## Performance Optimizations

- Code splitting by routes
- Lazy loading of images
- Optimized bundle size with Vite
- CSS purging with Tailwind
- Component memoization where needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Payment integration
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Menu management
- [ ] User reviews and ratings
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

## License

MIT License - feel free to use this project for learning or commercial purposes.
