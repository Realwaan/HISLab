# Clinikabayan HIS - Backend Setup

## MongoDB Atlas Setup (Free with GitHub Student Pack)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Sign Up" and select **"Sign up with GitHub"**
3. Your GitHub Student Pack benefits will be automatically applied

### Step 2: Create a Free Cluster
1. Click "Build a Database"
2. Select **"M0 FREE"** tier
3. Choose a cloud provider (AWS recommended)
4. Select a region closest to you
5. Click "Create Cluster"

### Step 3: Set Up Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### Step 6: Configure the Server
1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Edit `.env` and paste your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/clinikabayan?retryWrites=true&w=majority
   JWT_SECRET=your_random_secret_key_here
   PORT=3000
   ```

### Step 7: Install Dependencies & Run
```bash
cd server
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Transport
- `GET /api/transports` - Get all transport requests
- `POST /api/transports` - Create transport request
- `PUT /api/transports/:id` - Update transport request
- `DELETE /api/transports/:id` - Delete transport request

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Dashboard Stats
- `GET /api/stats` - Get dashboard statistics
