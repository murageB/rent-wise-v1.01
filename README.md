# RentWise v1.01 - Blockchain-Powered Property Management

A comprehensive property management system built with Ruby on Rails and integrated with Quorum blockchain for secure, transparent data management and privacy-enhanced operations.

## 🚀 Features

### Core Property Management
- **User Authentication** - Devise-based authentication with role-based access
- **Property Management** - Complete CRUD operations for properties
- **Tenant Management** - Tenant registration, profiles, and lease management
- **Water Billing System** - Automated water meter readings and billing
- **Maintenance Requests** - Track and manage property maintenance

### Blockchain Integration
- **Quorum Private Blockchain** - IBFT 2.0 consensus with Tessera privacy
- **Smart Contracts** - Solidity contracts for property registry
- **Encrypted Data Storage** - Privacy-enhanced data management
- **Blockchain Service** - HTTP-based interaction with Quorum RPC
- **Property Registry Contract** - On-chain property ownership verification

### Technology Stack
- **Backend**: Ruby on Rails 7.1.5.1
- **Database**: PostgreSQL with Supabase
- **Authentication**: Devise
- **Blockchain**: Quorum (Hyperledger Besu) with IBFT 2.0
- **Privacy**: Tessera for private transactions
- **Frontend**: React with TypeScript (separate app)

## 📁 Project Structure

```
rent-wise-app/
├── v1.01/rent_wise/          # Rails application
│   ├── app/
│   │   ├── controllers/      # Rails controllers
│   │   ├── models/          # ActiveRecord models
│   │   ├── views/           # ERB templates
│   │   └── services/        # Blockchain service
│   ├── contracts/           # Solidity smart contracts
│   ├── medium/              # Documentation articles
│   └── config/              # Rails configuration
├── src/                     # React frontend (separate app)
└── quorum-dev-quickstart/   # Blockchain network setup
```

## 🛠️ Installation & Setup

### Prerequisites
- Ruby 3.0.2+
- Rails 7.1.5.1
- PostgreSQL
- Node.js (for React frontend)
- Docker (for Quorum blockchain)

### Rails Application Setup

1. **Navigate to Rails app directory:**
   ```bash
   cd v1.01/rent_wise
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

### React Frontend Setup

1. **Navigate to React app:**
   ```bash
   cd src
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

## 🔗 API Endpoints

### Authentication
- `POST /users/sign_up` - User registration
- `POST /users/sign_in` - User login
- `DELETE /users/sign_out` - User logout

### Properties
- `GET /properties` - List all properties
- `POST /properties` - Create new property
- `GET /properties/:id` - Get property details
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

### Blockchain
- `GET /blockchain/status` - Blockchain network status
- `POST /blockchain/contracts/deploy` - Deploy smart contract
- `POST /blockchain/transactions` - Submit transaction

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

- **Devise Authentication** - Secure user authentication
- **Private Blockchain** - Data privacy through Quorum
- **Encrypted Storage** - Sensitive data encryption
- **Role-based Access** - User permission management

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
