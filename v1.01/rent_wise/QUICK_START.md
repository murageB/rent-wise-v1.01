# RentWise Blockchain - Quick Start Guide

## 🚀 **Get Started in 3 Steps**

### **Step 1: Access the Application**
Open your browser and go to: **http://localhost:3001**

### **Step 2: Create an Account**
1. Click "Sign up" in the top-right corner
2. Fill in your email and password
3. Confirm your account

### **Step 3: Explore Blockchain Features**
Once logged in, you'll see navigation links:
- **Properties** - Manage your properties
- **Blockchain Status** - View network health
- **Latest Blocks** - See recent blockchain activity

---

## 🔗 **Quick Links**

| Service | URL | Description |
|---------|-----|-------------|
| **RentWise App** | http://localhost:3001 | Main application |
| **Block Explorer** | http://localhost:25000 | View blockchain transactions |
| **Grafana Monitoring** | http://localhost:3000 | Network metrics & dashboards |
| **Prometheus** | http://localhost:9090 | Raw metrics data |

---

## 📱 **Key Features**

### **Property Management**
- Register properties on blockchain
- Update property information
- Verify data integrity
- View ownership history

### **Blockchain Integration**
- Real-time network status
- Transaction monitoring
- Data verification
- Audit trail

### **Monitoring**
- Network health dashboard
- Block production metrics
- Node status monitoring
- Performance analytics

---

## 🔧 **API Endpoints**

### **Blockchain Status**
```bash
GET http://localhost:3001/blockchain/status
```

### **Property Data**
```bash
GET http://localhost:3001/blockchain/property_data/PROPERTY_ID
POST http://localhost:3001/blockchain/property_data/PROPERTY_ID
```

### **Latest Blocks**
```bash
GET http://localhost:3001/blockchain/latest_blocks
```

---

## 🎯 **What's Running**

### **Rails Application** ✅
- Port: 3001
- Authentication: Devise
- Database: PostgreSQL
- Blockchain: HTTP RPC client

### **Quorum Network** ✅
- Validators: 4 nodes
- Members: 3 nodes
- RPC: Port 8545
- Consensus: IBFT 2.0

### **Monitoring Stack** ✅
- Grafana: Port 3000
- Prometheus: Port 9090
- Loki: Port 3100
- Block Explorer: Port 25000

---

## 🚨 **Troubleshooting**

### **Can't access the app?**
- Check if Rails is running: `ps aux | grep rails`
- Verify port 3001 is free: `ss -tlnp | grep :3001`

### **Blockchain not responding?**
- Check Quorum containers: `docker ps`
- Verify RPC endpoint: `curl http://localhost:8545`

### **Authentication issues?**
- Clear browser cookies
- Try signing up with a new email
- Check Rails logs: `tail -f log/development.log`

---

## 📞 **Support**

The system is fully automated and operational. All components are running and integrated.

**Status**: ✅ **OPERATIONAL**
**Last Updated**: $(date)
**Version**: RentWise v1.01 with Blockchain Integration 