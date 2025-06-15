
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/be8c6d49-03f9-44d6-b89a-52ae60417dfc

## 🧪 Test Credentials & Dataset

### Test User Accounts

**Landlords:**
- **Email:** landlord1@example.com | **Password:** password123
  - **Name:** Robert Smith
  - **Properties:** Sunset Apartments, Downtown Plaza
  - **Features to test:** Property management, water pricing settings, tenant management, bill generation

- **Email:** testlandlord@example.com | **Password:** password123  
  - **Name:** Test Landlord
  - **Properties:** Green Valley Complex
  - **Features to test:** Property management, water pricing settings, tenant management

**Caretakers:**
- **Email:** testcaretaker@example.com | **Password:** password123
  - **Name:** Test Caretaker
  - **Features to test:** Water meter readings, maintenance requests, tenant communication

**Tenants:**
- **Email:** testtenant@example.com | **Password:** password123
  - **Name:** John Doe
  - **Property:** Sunset Apartments
  - **Features to test:** View water bills, payment history, maintenance requests

- **Email:** testtenant@gmail.com | **Password:** password123
  - **Name:** Jane Smith  
  - **Property:** Sunset Apartments
  - **Features to test:** View water bills, payment history

- **Email:** testlandlady@gmail.com | **Password:** password123
  - **Name:** Mike Johnson (tenant role)
  - **Property:** Green Valley Complex
  - **Features to test:** Tenant dashboard, water bill viewing

- **Email:** testcaretaker@gmail.com | **Password:** password123
  - **Name:** Sarah Wilson (tenant role)
  - **Property:** Green Valley Complex
  - **Features to test:** Tenant dashboard, water bill viewing

### Test Dataset Overview

**Properties (3 total):**
1. **Sunset Apartments** - 123 Sunset Boulevard, Nairobi
   - Type: Apartment | Rent: KES 25,000 | Status: Occupied
   - Water Rate: KES 15.00 per unit
   - Tenants: John Doe, Jane Smith

2. **Green Valley Complex** - 456 Valley Road, Nairobi  
   - Type: Apartment | Rent: KES 30,000 | Status: Occupied
   - Water Rate: KES 12.00 per unit
   - Tenants: Mike Johnson, Sarah Wilson

3. **Downtown Plaza** - 789 City Center, Nairobi
   - Type: Commercial | Rent: KES 45,000 | Status: Partially Occupied
   - Water Rate: KES 18.00 per unit
   - Tenants: David Brown (active), Lisa Chen (inactive)

**Test Data Includes:**
- **6 Tenant records** with realistic lease information
- **3 months of water readings** (March-May 2024)
- **15 water bills** with various payment statuses (paid, pending, overdue)
- **5 rent payment records** for May 2024
- **5 maintenance requests** with different priorities and statuses
- **Water pricing settings** for each property

### Testing Scenarios by Role

#### 🏠 **Landlord Testing** 
Login as: `testlandlord@example.com` or `landlord1@example.com`

**Water Management:**
- Set water pricing per property (Settings tab)
- View generated water bills (Bills & Invoices tab)
- Generate reports on water consumption (Reports tab)
- Manage tenant water accounts

**Property Management:**
- View property dashboard and statistics
- Manage tenant information and leases
- Track rent payments and generate receipts
- Handle maintenance requests

#### 🔧 **Caretaker Testing**
Login as: `testcaretaker@example.com`

**Water Readings:**
- Record new meter readings for tenants
- View historical reading data
- Filter readings by property
- Automatic bill generation upon reading entry

**Maintenance:**
- View and manage maintenance requests
- Update request status and priority
- Communicate with tenants and landlords

#### 🏡 **Tenant Testing**
Login as any tenant account (e.g., `testtenant@example.com`)

**Water Bills:**
- View current and historical water bills
- Check payment status and due dates
- Track water consumption patterns
- View bill details and rates

**General Features:**
- Update profile information
- Submit maintenance requests
- View lease and property information

### Sample Test Workflows

#### 🚰 **Water Management Workflow:**
1. **Landlord** sets water pricing (KES 15/unit for Sunset Apartments)
2. **Caretaker** records monthly meter reading (e.g., 180 units for John Doe)
3. **System** automatically generates bill (180 × KES 15 = KES 2,700)
4. **Tenant** logs in to view new water bill and payment status

#### 🔧 **Maintenance Workflow:**
1. **Tenant** submits maintenance request (e.g., "Leaky faucet")
2. **Landlord** reviews request and assigns to caretaker
3. **Caretaker** updates status and completes work
4. **System** tracks request lifecycle and notifications

### Bill Status Examples in Test Data:
- **Paid Bills:** March water bills for most tenants
- **Pending Bills:** Recent May 2024 bills awaiting payment
- **Overdue Bills:** Some April bills for Downtown Plaza tenants

### Water Consumption Patterns:
- **Residential units:** 25-35 units per month average
- **Commercial units:** 40-45 units per month average
- **Seasonal variation:** Slightly higher consumption in recent months

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/be8c6d49-03f9-44d6-b89a-52ae60417dfc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/be8c6d49-03f9-44d6-b89a-52ae60417dfc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
