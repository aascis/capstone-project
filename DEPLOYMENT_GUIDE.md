# STAR Solutions - Deployment Guide

## Prerequisites

### Required Software
- Node.js 18+ and npm
- PostgreSQL 12+
- Zammad instance (running at http://zammad.star.ca:8080)

### Environment Setup

1. **Copy Environment Variables**
   ```bash
   cp .env.example .env
   ```

2. **Configure Environment Variables**
   Edit `.env` with your actual values:
   ```bash
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/star_solutions

   # Zammad Configuration
   ZAMMAD_URL=http://zammad.star.ca:8080
   ZAMMAD_TOKEN=your_zammad_api_token_here

   # Session Secret (generate a secure random string)
   SESSION_SECRET=your_secure_session_secret_here

   # Active Directory Configuration (for employee authentication)
   AD_SERVER=your_ad_server_here
   AD_BASE_DN=your_ad_base_dn_here
   ```

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Push database schema to PostgreSQL
npm run db:push
```

### 3. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## Testing the Features

### Customer Dashboard Testing

#### 1. **Login-Time Sync Authentication**
- **Test Case**: Login with existing Zammad customer
- **Steps**:
  1. Go to customer login page
  2. Enter email of existing Zammad customer
  3. Enter any password (will create local account automatically)
  4. Verify successful login and dashboard access

#### 2. **New Ticket Creation**
- **Test Case**: Create support ticket via dashboard
- **Steps**:
  1. Login as customer
  2. Click "New Ticket" button (centered above Ticket Overview)
  3. Fill out form: Subject, Description, Priority
  4. Submit ticket
  5. Verify ticket appears in Zammad system
  6. Check ticket appears in customer dashboard list

#### 3. **Ticket Statistics**
- **Test Case**: Verify ticket counts
- **Steps**:
  1. Create several tickets with different statuses in Zammad
  2. Refresh customer dashboard
  3. Verify statistics cards show correct counts:
     - Total tickets
     - Open tickets
     - Pending tickets  
     - Resolved tickets

#### 4. **Ticket List Display**
- **Test Case**: View customer tickets
- **Steps**:
  1. Login as customer with existing tickets
  2. Verify only their tickets are displayed
  3. Check ticket information shows:
     - Ticket number
     - Title
     - Priority badge
     - Status badge
     - Last updated time

### API Endpoints Testing

#### Customer API Routes
```bash
# Get customer tickets
curl -X GET http://localhost:5000/api/customer/tickets \
  -H "Cookie: your_session_cookie"

# Get ticket statistics
curl -X GET http://localhost:5000/api/customer/ticket-stats \
  -H "Cookie: your_session_cookie"

# Create new ticket
curl -X POST http://localhost:5000/api/customer/tickets \
  -H "Content-Type: application/json" \
  -H "Cookie: your_session_cookie" \
  -d '{
    "subject": "Test Ticket",
    "description": "This is a test ticket",
    "priority": "medium"
  }'
```

### Zammad Integration Testing

#### 1. **API Token Setup**
- Generate API token in Zammad admin interface
- Add token to `.env` file as `ZAMMAD_TOKEN`
- Restart application

#### 2. **Customer Creation**
- Login with new email address
- Verify customer automatically created in Zammad
- Check customer appears in Zammad admin panel

#### 3. **Ticket Sync**
- Create ticket via dashboard
- Verify ticket appears in Zammad with correct:
  - Customer assignment
  - Subject/title
  - Description in first article
  - Priority level
  - Status (should be "new")

## Demo Accounts

The system creates these demo accounts automatically:

### Admin Account
- **Email**: admin@starsolutions.ca
- **Password**: admin123
- **Access**: Full admin functionality

### Demo Customer
- **Email**: customer@example.com  
- **Password**: customer123
- **Access**: Customer dashboard and ticketing

### Test Employees (AD Authentication)
- **Usernames**: john.doe, jane.smith, admin
- **Password**: password123 (for all test accounts)
- **Access**: Employee dashboard and ticket management

## Troubleshooting

### Common Issues

#### 1. **Database Connection Errors**
```bash
# Check PostgreSQL is running
systemctl status postgresql

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

#### 2. **Zammad API Errors**
```bash
# Test Zammad connectivity
curl -H "Authorization: Bearer $ZAMMAD_TOKEN" \
  http://zammad.star.ca:8080/api/v1/users/me

# Check Zammad logs
docker logs zammad-web # if using Docker
```

#### 3. **Session Issues**
- Clear browser cookies
- Verify SESSION_SECRET is set
- Check session storage in PostgreSQL

#### 4. **Missing Environment Variables**
```bash
# Check required variables are set
echo $DATABASE_URL
echo $ZAMMAD_URL
echo $ZAMMAD_TOKEN
```

### Log Locations
- **Application logs**: Console output
- **Database logs**: PostgreSQL logs
- **Zammad logs**: Zammad instance logs

## Security Notes

### Production Deployment
1. **Change default passwords** for all demo accounts
2. **Generate secure SESSION_SECRET** (32+ random characters)
3. **Use HTTPS** for all connections
4. **Configure firewall** to restrict database access
5. **Enable Zammad authentication** instead of demo AD users
6. **Set up proper SSL certificates**

### Network Configuration
- Ensure Zammad server is accessible from application server
- Configure Active Directory connectivity for employee authentication
- Set up database connection pooling for production load

## Support

For issues specific to:
- **Database problems**: Check PostgreSQL documentation
- **Zammad integration**: Reference Zammad API documentation
- **Active Directory**: Verify AD server connectivity and credentials