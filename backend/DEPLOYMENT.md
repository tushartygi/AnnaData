# AnnaData Backend - Deployment Guide

## Issues Fixed
1. ✅ Added environment variable validation
2. ✅ Improved MongoDB connection with proper error handling
3. ✅ Created .env.example file as template
4. ✅ Added proper connection options for Mongoose

## Critical Setup Steps for Deployment

### 1. Create Environment Variables
Create a `.env` file in the backend directory with these variables:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://annnadata.netlify.app
```

### 2. On Render.com (or your hosting platform):
Set the following **Environment Variables** in your dashboard:

- `MONGODB_URI` = Your MongoDB Atlas connection string
- `JWT_SECRET` = A strong random string (at least 32 characters)
- `NODE_ENV` = production
- `PORT` = 5000 (or let Render assign it automatically)

### 3. MongoDB Atlas Setup:
1. Go to MongoDB Atlas (cloud.mongodb.com)
2. Create a cluster if you haven't
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., "annadata")
7. **Important:** Add your hosting platform's IP to the Network Access whitelist (or use 0.0.0.0/0 to allow all - less secure but works for deployment)

### 4. JWT_SECRET Generation:
Generate a secure random string:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 5. Build Commands for Render:
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 6. Common Deployment Errors:

**Error: "MONGODB_URI is not defined"**
- Solution: Add MONGODB_URI to environment variables in your hosting dashboard

**Error: "Cannot read property 'sign' of undefined"**
- Solution: Add JWT_SECRET to environment variables

**Error: "MongooseServerSelectionError"**
- Solution: Whitelist your hosting platform's IP in MongoDB Atlas Network Access

**Error: CORS issues**
- Solution: Verify FRONTEND_URL matches your actual frontend deployment URL

### 7. Testing Deployment:
After deployment, test these endpoints:

```bash
# Health check
curl https://your-backend-url.com/

# Should return:
{"success":true,"message":"AnnaData API Server is running","version":"1.0.0"}

# Test auth endpoint
curl https://your-backend-url.com/api/auth/test

# Test crops endpoint
curl https://your-backend-url.com/api/crops
```

### 8. Frontend Configuration:
Make sure your frontend's `api.js` file points to the correct backend URL:
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## Checklist Before Deployment
- [ ] .env file created with all required variables
- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] MongoDB Network Access configured to allow connections
- [ ] JWT_SECRET generated and set
- [ ] Environment variables set in hosting platform
- [ ] Frontend URL updated in CORS configuration
- [ ] Backend URL updated in frontend api.js
- [ ] All dependencies installed (`npm install`)
- [ ] Code pushed to Git repository

## Support
If you encounter issues:
1. Check the logs in your hosting platform dashboard
2. Verify all environment variables are set correctly
3. Test MongoDB connection separately
4. Check CORS configuration matches frontend URL
