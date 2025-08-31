# Merchants Dashboard

A comprehensive merchant dashboard for payment processing and management, built with React and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd merchants-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dashboard**
   
   **Option 1: Using the startup script (Recommended)**
   ```bash
   ./start_dashboard.sh
   ```
   
   **Option 2: Using npm scripts**
   ```bash
   # Development mode
   npm start
   
   # Production mode
   npm run build
   npm run serve
   ```

## 🔧 Configuration

### Environment Variables

The dashboard uses the following environment variables:

- `REACT_APP_API_URL`: API base URL (defaults to `https://merchants.globpay.ai`)
- `PORT`: Dashboard port (defaults to `3000`)

### Proxy Configuration

The dashboard includes comprehensive proxy configuration to handle all API requests:

- **API Endpoints**: `/api/*` → `https://merchants.globpay.ai`
- **Authentication**: `/auth/*` → `https://merchants.globpay.ai`
- **User Management**: `/users/*` → `https://merchants.globpay.ai`
- **Role Management**: `/roles/*` → `https://merchants.globpay.ai`
- **Merchant Management**: `/merchants/*` → `https://merchants.globpay.ai`
- **Payment Processing**: `/process-payment`, `/callback`, `/globpay` → `https://merchants.globpay.ai`
- **Forex**: `/forex/*` → `https://merchants.globpay.ai`
- **Transactions**: `/transaction/*` → `https://merchants.globpay.ai`
- **Drawings**: `/drawings/*` → `https://merchants.globpay.ai`

### Recent Fixes

**Fixed 405 Method Not Allowed Errors:**
- Updated proxy configuration to match the working kotani middleware dash
- Set `secure: false` to avoid SSL/TLS issues
- Added comprehensive endpoint routing for all API calls
- Improved error handling and logging

## 📱 Features

- **Dashboard Overview**: Real-time transaction statistics and balances
- **Transaction Management**: View, filter, and manage transactions
- **User Management**: Create, update, and manage user accounts
- **Analytics**: Comprehensive reporting and analytics
- **Payment Processing**: Process payments through various methods
- **Forex Management**: Manage currency exchange rates
- **Wallet Transfers**: Handle payout and transfer operations
- **Payment Links**: Generate and manage payment links

## 🔐 Authentication

The dashboard uses JWT-based authentication. Users must log in with valid credentials to access the system.

## 🛠️ Development

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── contexts/      # React contexts (Auth, etc.)
├── config/        # Configuration files
└── utils/         # Utility functions
```

### API Configuration

The API is configured in `src/config/api.js` and automatically handles:
- Base URL configuration for development/production
- JWT token management
- Request/response interceptors
- Error handling and logging

### Proxy Middleware

The proxy configuration is handled by:
- **Development**: `src/setupProxy.js` (Create React App proxy)
- **Production**: `server.js` (Express server with proxy middleware)

## 🚀 Deployment

### Development
```bash
npm start
```

### Production
```bash
npm run build
npm run serve
```

### Using Docker (if available)
```bash
docker build -t merchants-dashboard .
docker run -p 3000:3000 merchants-dashboard
```

## 🔍 Troubleshooting

### Common Issues

1. **405 Method Not Allowed Error**
   - ✅ **Fixed**: Updated proxy configuration to handle all endpoints
   - ✅ **Fixed**: Set `secure: false` to avoid SSL issues

2. **CORS Errors**
   - ✅ **Fixed**: Comprehensive proxy configuration handles all routes
   - ✅ **Fixed**: Proper `changeOrigin: true` setting

3. **API Connection Issues**
   - Ensure the backend API is running on `https://merchants.globpay.ai`
   - Check network connectivity
   - Verify API endpoints are accessible

### Debug Mode

Enable debug logging by setting environment variables:
```bash
export DEBUG=proxy:*
npm start
```

## 📞 Support

For technical support or questions:
- Check the console logs for detailed error information
- Verify API endpoint accessibility
- Ensure proper authentication credentials

## 🔄 Updates

### Latest Changes
- **Fixed 405 errors** by implementing comprehensive proxy configuration
- **Added startup script** for easy deployment
- **Improved error handling** with detailed logging
- **Enhanced proxy middleware** to match kotani dashboard configuration

---

**Note**: This dashboard is configured to work with the `https://merchants.globpay.ai` API. Ensure the backend service is running and accessible before starting the dashboard. 