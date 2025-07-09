# 🗺️ McDonald's Outlet Locator - Next.js Frontend

A modern, interactive web application for discovering McDonald's outlets with AI-powered search and real-time mapping capabilities.

## ✨ Features

- 🗺️ **Interactive Map**: Real-time outlet visualization using React Leaflet
- 🤖 **AI-Powered Search**: Natural language queries for finding specific outlets
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🔍 **Smart Filtering**: Search and filter outlets by location and features
- 📊 **Real-time Data**: Live integration with FastAPI backend
- 🎯 **Location Markers**: Custom McDonald's markers on the map
- ⚡ **Fast Performance**: Next.js optimizations with server-side rendering
- 🎨 **Modern UI**: Clean, intuitive interface with loading states

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.5 (Pages Router)
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 4.0
- **Maps**: React Leaflet 4.2.1 + Leaflet 1.9.4
- **HTTP Client**: Axios 1.7.0
- **Build Tool**: Turbopack (Next.js)
- **Linting**: ESLint with Next.js config

## 📋 Prerequisites

- Node.js 18.0+ 
- npm, yarn, pnpm, or bun package manager
- FastAPI backend running (see backend README)

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd Frontend/McDonalds-Outlet-Scraper-NEXTJS-Frontend
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 3. Configure Environment
Create a `.env.local` file in the project root:
```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000

# Map Configuration
NEXT_PUBLIC_DEFAULT_LAT=3.1390
NEXT_PUBLIC_DEFAULT_LNG=101.6869
NEXT_PUBLIC_DEFAULT_ZOOM=11

# Development
NEXT_PUBLIC_ENV=development
```

### 4. Update API Configuration
Edit `variables.js` to point to your backend:
```javascript
export const API_BASE_URL = 'http://localhost:8000'; // Your backend URL
```

### 5. Run Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

### 6. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── components/              # Reusable React components
│   ├── MapIcon.js          # Custom map marker icon
│   └── OutletMap.js        # Interactive map component
├── pages/                  # Next.js pages (Pages Router)
│   ├── _app.js            # App wrapper and global providers
│   ├── _document.js       # HTML document customization
│   └── index.js           # Main application page
├── public/                 # Static assets
│   ├── favicon.ico        # App favicon
│   └── *.svg              # SVG icons and images
├── styles/                 # Global styles
│   └── globals.css        # Global CSS with Tailwind imports
├── variables.js           # API endpoints and configuration
├── package.json           # Dependencies and scripts
└── next.config.mjs        # Next.js configuration
```

## 📱 Components

### OutletMap Component
Interactive map displaying McDonald's outlets with real-time data.

**Props:**
- `outlets` (Array): Array of outlet objects
- `center` (Object): Map center coordinates `{lat, lng}`
- `zoom` (Number): Initial zoom level

**Features:**
- Custom McDonald's markers
- Popup information on marker click
- Responsive map sizing
- Loading states

```javascript
<OutletMap 
  outlets={outlets} 
  center={{lat: 3.1390, lng: 101.6869}} 
  zoom={11} 
/>
```

### MapIcon Component
Custom marker icon for McDonald's outlets.

**Features:**
- McDonald's branded styling
- Consistent sizing across zoom levels
- Accessible design

## 🎨 UI Features

### Search Interface
- **Location Search**: Scrape outlets by search term
- **AI Search**: Natural language queries for intelligent filtering
- **Real-time Results**: Instant feedback and loading states

### Interactive Map
- **Custom Markers**: McDonald's branded location markers
- **Outlet Information**: Detailed popups with:
  - Name and address
  - Operating hours
  - Phone number
  - Special attributes (Drive-thru, McCafe, etc.)
  - Waze navigation links

### Responsive Design
- Mobile-optimized layout
- Touch-friendly interactions
- Adaptive map sizing
- Progressive loading

## 📡 API Integration

### Configuration
API endpoints are configured in `variables.js`:

```javascript
export const API_ENDPOINTS = {
  scrapeAndSave: '/save-outlets',    // Scrape and save outlets
  outlets: '/outlets',               // Get outlet data
  deleteAllOutlets: '/outlets',      // Delete all outlets
  aiSearch: '/api/v1/search',       // AI-powered search
};
```

### API Functions

#### Scrape Outlets
Triggers backend scraping for a specific location:
```javascript
const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.scrapeAndSave}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    search_term: 'Kuala Lumpur',
    overwrite_existing: false
  })
});
```

#### Fetch Outlets
Retrieve stored outlet data with pagination:
```javascript
const response = await fetch(
  `${API_BASE_URL}${API_ENDPOINTS.outlets}?per_page=1000`
);
const data = await response.json();
```

#### AI Search
Perform intelligent searches using natural language:
```javascript
const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.aiSearch}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Find 24-hour outlets with drive-thru' })
});
```

## 🎯 Usage Examples

### Basic Workflow
1. **Search for Outlets**: Enter a location (e.g., "Kuala Lumpur")
2. **View on Map**: Outlets appear as markers on the interactive map
3. **Get Details**: Click markers to see outlet information
4. **AI Search**: Ask questions like "Which outlets are open 24 hours?"
5. **Navigate**: Use Waze links for turn-by-turn navigation

### AI Search Examples
- "Find McDonald's with McCafe near KLCC"
- "Show me 24-hour outlets with drive-thru"
- "Which outlets have WiFi and are in Petaling Jaya?"
- "Find outlets with delivery service in Kuala Lumpur"

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000` | ✅ |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `30000` | ❌ |
| `NEXT_PUBLIC_DEFAULT_LAT` | Default map latitude | `3.1390` | ❌ |
| `NEXT_PUBLIC_DEFAULT_LNG` | Default map longitude | `101.6869` | ❌ |
| `NEXT_PUBLIC_DEFAULT_ZOOM` | Default map zoom level | `11` | ❌ |

### Map Configuration
Customize map settings in `variables.js`:
```javascript
export const MAP_CONFIG = {
  DEFAULT_CENTER: [3.1390, 101.6869], // Kuala Lumpur
  DEFAULT_ZOOM: 11,
  MAX_OUTLETS_PER_REQUEST: 1000
};
```

## 📦 Build and Deployment

### Development Build
```bash
npm run dev    # Start development server with hot reload
```

### Production Build
```bash
npm run build  # Create optimized production build
npm run start  # Start production server
```

### Linting
```bash
npm run lint   # Run ESLint for code quality checks
```

### Docker Deployment
```bash
# Build Docker image
docker build -t mcdonalds-frontend .

# Run container
docker run -p 3000:3000 mcdonalds-frontend
```

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configurations:

- **Design System**: Consistent colors, spacing, and typography
- **Responsive Design**: Mobile-first approach
- **Components**: Reusable utility classes
- **Dark Mode**: Ready for dark mode implementation

### Custom Components
- Loading spinners with McDonald's branding
- Interactive buttons with hover states
- Responsive grid layouts
- Custom form inputs

## 🔍 SEO and Performance

### Next.js Optimizations
- **Server-Side Rendering**: Fast initial page loads
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic bundle splitting
- **Prefetching**: Link prefetching for faster navigation

### Performance Features
- Dynamic imports for map components (avoiding SSR issues)
- Efficient re-rendering with React hooks
- Optimized API calls with loading states
- Responsive images and icons

## 🧪 Testing

### Manual Testing Checklist
- [ ] Map loads correctly without errors
- [ ] Outlets display as markers on the map
- [ ] Marker popups show correct information
- [ ] Search functionality works properly
- [ ] AI search returns relevant results
- [ ] Responsive design works on mobile
- [ ] Loading states display correctly
- [ ] Error handling works for failed requests

### Future Testing Implementation
Consider adding:
- Jest for unit testing
- React Testing Library for component testing
- Cypress for end-to-end testing
- Performance testing with Lighthouse

## 🚀 Performance Optimization

### Best Practices Implemented
- **Dynamic Imports**: Map components loaded only on client-side
- **Memoization**: React hooks prevent unnecessary re-renders
- **Lazy Loading**: Components load as needed
- **Optimized Images**: Next.js automatic image optimization
- **Bundle Splitting**: Automatic code splitting

### Monitoring
- Use React DevTools for component analysis
- Monitor bundle size with Next.js analyzer
- Check Core Web Vitals in production
- Monitor API response times

## 🛠️ Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use TypeScript for type safety (future enhancement)

### Component Development
- Keep components small and focused
- Use proper prop validation
- Implement loading and error states
- Follow accessibility guidelines

## 🌟 Future Enhancements

### Planned Features
- [ ] **User Authentication**: Save favorite outlets
- [ ] **Route Planning**: Multi-stop route optimization
- [ ] **Offline Support**: Progressive Web App features
- [ ] **Push Notifications**: Outlet updates and promotions
- [ ] **Advanced Filters**: Filter by amenities, ratings
- [ ] **Social Features**: Share outlets and reviews
- [ ] **TypeScript Migration**: Enhanced type safety
- [ ] **Testing Suite**: Comprehensive test coverage

### Technical Improvements
- [ ] State management with Redux/Zustand
- [ ] GraphQL integration
- [ ] Service worker for offline support
- [ ] Enhanced error tracking
- [ ] Performance monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Update documentation if needed
6. Submit a pull request

### Coding Standards
- Use ESLint configuration provided
- Follow React/Next.js best practices
- Write clear, self-documenting code
- Add comments for complex logic
- Ensure responsive design compatibility

## 🐛 Troubleshooting

### Common Issues

**Map not loading:**
- Check if backend API is running
- Verify API_BASE_URL in variables.js
- Check browser console for JavaScript errors

**No outlets showing:**
- Ensure backend has outlet data
- Check network requests in DevTools
- Verify API endpoints are correct

**Styling issues:**
- Clear browser cache
- Check Tailwind CSS compilation
- Verify responsive breakpoints

**Performance issues:**
- Check React DevTools for unnecessary renders
- Monitor network requests
- Verify image optimization

## 📞 Support

For support and questions:
- Check browser console for error messages
- Verify backend API is running and accessible
- Review network requests in DevTools
- Check the backend API documentation at `/docs`

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Next.js and modern React practices**
