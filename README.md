# Merchant Dashboard

A comprehensive finance merchant dashboard for payment processing and management, built with React and Tailwind CSS.

## Features

### 🏠 Dashboard
- Real-time merchant account overview
- Transaction statistics and metrics
- Recent activity feed
- Quick action buttons for common tasks

### 💳 Transactions
- View all payment transactions
- Filter by type (Mobile, Bank, Card, Payouts)
- Search and date range filtering
- Transaction status tracking

### 💰 Bulk Payments
- Create bulk mobile money payments
- Create bulk bank transfers
- Manage payment batches
- Track payment status

### 💱 Forex Management
- Currency exchange rate management
- Add and edit currency rates
- Exchange rate calculator
- Currency support status

### 🔗 Payment Links
- Generate shareable payment links
- Support for multiple payment types
- Link status tracking
- Payment processing integration

### 🔄 Wallet Transfers
- Wallet-to-wallet transfers
- Withdrawal requests
- Transfer status management
- Approval workflow

### 👥 User Management
- Merchant user administration
- Role-based permissions
- Two-factor authentication status
- User activity tracking

### 📊 Analytics
- Transaction analytics
- Revenue reporting
- Performance metrics
- Data visualization

## Technology Stack

- **Frontend**: React 18, Tailwind CSS
- **Icons**: Heroicons
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Date Handling**: date-fns
- **JWT**: jwt-decode

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd merchant-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### API Configuration

The dashboard connects to the merchant API at `https://merchantapi.mam-laka.com`. Make sure the API is accessible and properly configured.

### Authentication

The dashboard uses JWT token-based authentication. Users can log in with their merchant credentials, and the token is automatically included in API requests.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.js       # Main layout component
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── Transactions.js # Transaction management
│   ├── BulkPayments.js # Bulk payment processing
│   ├── Forex.js        # Forex rate management
│   ├── PaymentLinks.js # Payment link generation
│   ├── WalletTransfers.js # Wallet transfer management
│   ├── UserManagement.js # User administration
│   ├── Analytics.js    # Analytics and reporting
│   └── Settings.js     # Application settings
├── App.js              # Main application component
└── index.js            # Application entry point
```

## API Endpoints

The dashboard integrates with the following API endpoints:

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/create` - Create user
- `GET /api/users/list` - List users
- `PUT /api/users/update/:id` - Update user

### Transactions
- `GET /api/v1/transaction/list` - List all transactions
- `GET /api/v1/transaction/read/balance` - Get account balance
- `GET /api/v1/transaction/filter` - Filter transactions by date/status

### Bulk Payments
- `POST /api/bulk/mobile/create` - Create bulk mobile payments
- `POST /api/bulk/bank/create` - Create bulk bank payments
- `GET /api/bulk/mobile/list` - List mobile bulk payments
- `GET /api/bulk/bank/list` - List bank bulk payments

### Forex
- `GET /api/forex/list` - List forex rates
- `POST /api/forex/create` - Create forex rate
- `PUT /api/forex/update/:id` - Update forex rate
- `DELETE /api/forex/delete/:id` - Delete forex rate

### Payment Links
- `POST /api/links/generate` - Generate payment link
- `POST /api/links/process` - Process payment via link

### Wallet Transfers
- `POST /api/v1/drawings/transfer/toPayout` - Create transfer request
- `GET /api/v1/drawings/list` - List transfer requests
- `PUT /api/drawings/update/:id` - Update transfer status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository. 