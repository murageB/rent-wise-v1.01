# RentWise v1.01 - Blockchain-Powered Property Management

A comprehensive property management system built with Ruby on Rails and integrated with Quorum blockchain for secure, transparent data management and privacy-enhanced operations.

## 🚀 Features

### Core Property Management
- **User Authentication** - Devise-based authentication with role-based access control
- **Property Management** - Complete CRUD operations for properties with modern UI
- **Role-Based Dashboards** - Separate dashboards for landlords, tenants, and caretakers
- **Water Billing System** - Automated water meter readings and billing
- **Maintenance Requests** - Track and manage property maintenance
- **Rent Payment Tracking** - Monitor rent payments and financial data

### Blockchain Integration
- **Quorum Private Blockchain** - IBFT 2.0 consensus with Tessera privacy
- **Smart Contracts** - Solidity contracts for property registry
- **Encrypted Data Storage** - Privacy-enhanced data management
- **Blockchain Service** - HTTP-based interaction with Quorum RPC
- **Property Registry Contract** - On-chain property ownership verification

### Modern UI/UX
- **Bootstrap 5** - Responsive, modern design framework
- **Font Awesome Icons** - Professional iconography
- **Google Fonts** - Typography optimization
- **Role-Based Navigation** - Contextual navigation based on user role
- **Responsive Design** - Mobile-friendly interface

### Technology Stack
- **Backend**: Ruby on Rails 7.1.5.1
- **Database**: PostgreSQL with Supabase
- **Authentication**: Devise with custom user fields
- **Blockchain**: Quorum (Hyperledger Besu) with IBFT 2.0
- **Privacy**: Tessera for private transactions
- **Frontend**: Rails ERB templates with Bootstrap 5
- **Styling**: Bootstrap 5, Font Awesome, Google Fonts

## 📁 Project Structure

```
rent-wise-app/
├── app/
│   ├── controllers/          # Rails controllers
│   │   ├── dashboard_controller.rb    # Role-based dashboard logic
│   │   ├── properties_controller.rb   # Property management
│   │   ├── blockchain_controller.rb   # Blockchain integration
│   │   └── home_controller.rb         # Landing page
│   ├── models/              # ActiveRecord models
│   │   ├── user.rb          # User with role-based access
│   │   ├── property.rb      # Property management
│   │   └── maintenance_request.rb
│   ├── views/               # ERB templates
│   │   ├── dashboard/       # Role-specific dashboards
│   │   ├── properties/      # Property views
│   │   ├── devise/          # Authentication views
│   │   └── layouts/         # Application layout
│   └── services/            # Blockchain service
├── contracts/               # Solidity smart contracts
├── medium/                  # Documentation articles
├── quorum-dev-quickstart/   # Blockchain network setup
└── config/                  # Rails configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Ruby 3.0.2+
- Rails 7.1.5.1
- PostgreSQL
- Docker (for Quorum blockchain)

### Rails Application Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/murageB/rent-wise-v1.01.git
   cd rent-wise-app
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   ```

3. **Setup database:**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Start Rails server:**
   ```bash
   rails server -p 3001
   ```

5. **Access the application:**
   - Open http://localhost:3001
   - Sign up with a new account or use test credentials

### Test Users (from seed data)
- **Landlord**: landlord@test.com / password123
- **Tenant**: tenant@test.com / password123
- **Caretaker**: caretaker@test.com / password123

### Blockchain Network Setup

1. **Navigate to Quorum directory:**
   ```bash
   cd quorum-dev-quickstart
   ```

2. **Start the network:**
   ```bash
   npm install
   npm run network:start
   ```

3. **Verify network health:**
   ```bash
   npm run network:status
   ```

## 🔗 Application Features

### Role-Based Access
- **Landlord Dashboard**: Property overview, rent payments, maintenance requests
- **Tenant Dashboard**: Personal property info, rent history, maintenance requests
- **Caretaker Dashboard**: Property management, maintenance tracking

### Key Pages
- **Home** (`/`) - Landing page with navigation
- **Dashboard** (`/dashboard`) - Role-based dashboard
- **Properties** (`/properties`) - Property management
- **Blockchain Status** (`/blockchain/status`) - Network health

### Authentication
- **Sign Up** (`/users/sign_up`) - User registration with role selection
- **Sign In** (`/users/sign_in`) - User login
- **Sign Out** (`/users/sign_out`) - User logout

## 📚 Documentation

### Medium Articles
The `medium/` directory contains comprehensive documentation:

1. **From React to Rails: The Great Migration** - Migration journey and technical decisions
2. **Blockchain Integration: Quorum Revolution** - Blockchain setup and integration
3. **Production Deployment & Scaling Success** - Deployment strategies and optimization
4. **Future Vision: AI & DeFi Integration** - Roadmap and future enhancements

### Technical Documentation
- `BLOCKCHAIN_INTEGRATION_STATUS.md` - Current blockchain integration status
- `DEVELOPMENT_SUMMARY.md` - Development progress and milestones

## 🔐 Security Features

- **Devise Authentication** - Secure user authentication with encrypted passwords
- **Private Blockchain** - Data privacy through Quorum
- **Encrypted Storage** - Sensitive data encryption
- **Role-based Access** - User permission management
- **CSRF Protection** - Cross-site request forgery protection

## 🚀 Recent Updates (v1.01)

### Major Improvements
- **Full Rails Migration**: Removed React frontend, now fully Rails-based
- **Modern UI**: Implemented Bootstrap 5 with responsive design
- **Role-Based Dashboards**: Separate dashboards for different user types
- **Enhanced Authentication**: Improved Devise integration with custom fields
- **Database Optimization**: Cleaned up migrations and schema
- **Server Stability**: Fixed port conflicts and process management

### Technical Fixes
- **Authentication Issues**: Resolved Devise password handling conflicts
- **Server Conflicts**: Fixed Rails server port conflicts and PID file issues
- **Dependency Management**: Cleaned up gem dependencies and bundle issues
- **Database Schema**: Aligned migrations with current schema
- **Node.js Cleanup**: Removed outdated Node.js artifacts and configurations

## 🚀 Deployment

### Production Setup
1. Configure environment variables
2. Setup PostgreSQL database
3. Deploy Quorum network
4. Configure web server (Nginx/Apache)
5. Setup SSL certificates

### Environment Variables
```bash
DATABASE_URL=postgresql://user:password@localhost/rentwise_production
QUORUM_RPC_URL=http://localhost:8545
QUORUM_PRIVATE_KEY=your_private_key
RAILS_MASTER_KEY=your_master_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

**Copyright © 2024 Desire AI - Property of MurageB**

All rights reserved. This software and associated documentation files (the "Software") are the exclusive property of Desire AI, owned by MurageB. 

The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.

## 📞 Support

For support and inquiries:
- **Developer**: MurageB
- **Organization**: Desire AI
- **Repository**: https://github.com/murageB/rent-wise-v1.01

---

**Built with ❤️ by Desire AI - Property of MurageB**
