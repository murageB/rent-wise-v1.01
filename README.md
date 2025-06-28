# RentWise v1.01 - Blockchain-Powered Property Management

A comprehensive property management system built with Ruby on Rails and integrated with Quorum blockchain for secure, transparent data management and privacy-enhanced operations.

## 🚀 Features

### Core Property Management
- **User Authentication** - Devise-based authentication with role-based access control
- **Property Management** - Complete CRUD operations for properties with modern UI
- **Role-Based Dashboards** - Separate dashboards for landlords, tenants, and caretakers
- **Water Billing System** - Automated water meter readings, billing, and disconnection management
- **Maintenance Requests** - Track and manage property maintenance with status updates
- **Rent Payment Tracking** - Monitor rent payments and financial data
- **Tenant Management** - Complete tenant lifecycle management
- **Unit Management** - Property unit tracking and assignment

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
- **Mobile-First Responsive Design** - Optimized for mobile and desktop
- **Touch-Friendly Interface** - Enhanced mobile experience with proper touch targets

### Technology Stack
- **Backend**: Ruby on Rails 7.1.5.1
- **Database**: PostgreSQL with Supabase
- **Authentication**: Devise with custom user fields
- **Blockchain**: Quorum (Hyperledger Besu) with IBFT 2.0
- **Privacy**: Tessera for private transactions
- **Frontend**: Rails ERB templates with Bootstrap 5
- **Styling**: Bootstrap 5, Font Awesome, Google Fonts
- **Testing**: Rails system tests and unit tests

## 📁 Project Structure

```
rent-wise-app/
├── app/
│   ├── controllers/          # Rails controllers
│   │   ├── dashboard_controller.rb    # Role-based dashboard logic
│   │   ├── properties_controller.rb   # Property management
│   │   ├── tenants_controller.rb      # Tenant management
│   │   ├── units_controller.rb        # Unit management
│   │   ├── water_bills_controller.rb  # Water billing system
│   │   ├── maintenance_requests_controller.rb # Maintenance tracking
│   │   ├── blockchain_controller.rb   # Blockchain integration
│   │   └── home_controller.rb         # Landing page
│   ├── models/              # ActiveRecord models
│   │   ├── user.rb          # User with role-based access
│   │   ├── property.rb      # Property management
│   │   ├── tenant.rb        # Tenant information
│   │   ├── unit.rb          # Property units
│   │   ├── water_bill.rb    # Water billing
│   │   └── maintenance_request.rb
│   ├── views/               # ERB templates
│   │   ├── dashboard/       # Role-specific dashboards
│   │   ├── properties/      # Property views
│   │   ├── tenants/         # Tenant management views
│   │   ├── units/           # Unit management views
│   │   ├── water_bills/     # Water billing views
│   │   ├── maintenance_requests/ # Maintenance views
│   │   ├── devise/          # Authentication views
│   │   └── layouts/         # Application layout
│   └── services/            # Blockchain service
├── contracts/               # Solidity smart contracts
├── medium/                  # Documentation articles
├── quorum-dev-quickstart/   # Blockchain network setup
├── test/                    # Comprehensive test suite
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
   bin/rails db:create
   bin/rails db:migrate
   bin/rails db:seed
   ```

4. **Start Rails server:**
   ```bash
   bin/rails server -p 3001 -b 0.0.0.0
   ```

5. **Access the application:**
   - **Desktop**: http://localhost:3001
   - **Mobile**: http://[YOUR_IP]:3001 (see Mobile Access section)
   - Sign up with a new account or use test credentials

### Test Users (from seed data)
- **Landlord**: landlord@test.com / password123
- **Tenant**: tenant@test.com / password123
- **Caretaker**: caretaker@test.com / password123

### Mobile Access Setup

1. **Find your computer's IP address:**
   ```bash
   hostname -I
   ```

2. **Ensure your mobile device is on the same WiFi network**

3. **Access the app on mobile:**
   ```
   http://[YOUR_IP]:3001
   ```
   Example: `http://192.168.0.106:3001`

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
- **Landlord Dashboard**: Property overview, rent payments, maintenance requests, tenant management
- **Tenant Dashboard**: Personal property info, rent history, maintenance requests, water bills
- **Caretaker Dashboard**: Property management, maintenance tracking, unit management

### Key Pages
- **Home** (`/`) - Landing page with navigation
- **Dashboard** (`/dashboard`) - Role-based dashboard
- **Properties** (`/properties`) - Property management
- **Tenants** (`/tenants`) - Tenant management
- **Units** (`/units`) - Unit management
- **Water Bills** (`/water_bills`) - Water billing system
- **Maintenance Requests** (`/maintenance_requests`) - Maintenance tracking
- **Blockchain Status** (`/blockchain/status`) - Network health

### Authentication
- **Sign Up** (`/users/sign_up`) - User registration with role selection
- **Sign In** (`/users/sign_in`) - User login
- **Sign Out** (`/users/sign_out`) - User logout

## 📱 Mobile Responsiveness

### Mobile-First Design
- **Responsive Breakpoints**: Optimized for mobile, tablet, and desktop
- **Touch-Friendly Interface**: Minimum 44px touch targets
- **Mobile Navigation**: Collapsible navigation menu
- **Responsive Tables**: Horizontal scrolling for data tables
- **Mobile-Optimized Forms**: Touch-friendly form elements
- **Viewport Optimization**: Proper mobile viewport configuration

### Mobile Features
- **Responsive Dashboard**: Adapts to mobile screen sizes
- **Mobile-Friendly Tables**: Horizontal scrolling for data tables
- **Touch-Optimized Buttons**: Proper sizing for mobile interaction
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Responsive Typography**: Scales appropriately for mobile screens

## 🧪 Testing

### Run All Tests
```bash
bin/rails test
```

### Test Coverage
- **System Tests**: End-to-end user interaction tests
- **Controller Tests**: API and controller logic tests
- **Model Tests**: Business logic and validation tests
- **Integration Tests**: Cross-component functionality tests

### Test Users for Testing
- All test fixtures are included in the `test/fixtures/` directory
- Comprehensive test data for properties, tenants, units, and maintenance requests

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
- **Strong Parameters** - Secure form handling

## 🚀 Recent Updates (v1.01)

### Major Improvements
- **Full Rails Migration**: Removed React frontend, now fully Rails-based
- **Modern UI**: Implemented Bootstrap 5 with responsive design
- **Role-Based Dashboards**: Separate dashboards for different user types
- **Enhanced Authentication**: Improved Devise integration with custom fields
- **Database Optimization**: Cleaned up migrations and schema
- **Server Stability**: Fixed port conflicts and process management
- **Mobile Responsiveness**: Comprehensive mobile-first design implementation
- **Water Billing System**: Complete water billing with disconnection management
- **Comprehensive Testing**: Full test suite with fixtures and system tests

### Technical Fixes
- **Authentication Issues**: Resolved Devise password handling conflicts
- **Server Conflicts**: Fixed Rails server port conflicts and PID file issues
- **Dependency Management**: Cleaned up gem dependencies and bundle issues
- **Database Schema**: Aligned migrations with current schema
- **Node.js Cleanup**: Removed outdated Node.js artifacts and configurations
- **Mobile Responsiveness**: Fixed mobile layout and touch interface issues
- **SSL Configuration**: Added proper SSL configuration for mobile access

### Mobile Enhancements
- **Responsive CSS**: Comprehensive mobile-specific styles
- **Touch Optimization**: Proper touch targets and mobile navigation
- **Viewport Configuration**: Optimized viewport settings for mobile
- **Mobile Tables**: Horizontal scrolling for data tables on mobile
- **Responsive Typography**: Mobile-optimized font sizes and spacing

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

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   pkill -f "rails server" && pkill -f "puma"
   rm -f tmp/pids/server.pid
   ```

2. **Bundle Install Issues**
   ```bash
   bundle install
   ```

3. **Database Migration Issues**
   ```bash
   bin/rails db:migrate
   ```

4. **Mobile Access Issues**
   - Ensure using `http://` not `https://`
   - Check firewall settings
   - Verify same WiFi network

### Server Management
```bash
# Start server
bin/rails server -p 3001 -b 0.0.0.0

# Stop server
pkill -f "rails server"

# Check server status
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in the `medium/` directory
- Review the troubleshooting section
- Open an issue on GitHub

---

**RentWise v1.01** - Making property management smarter with blockchain technology.
