# Frontend API Configuration

When your Render backend is deployed, create a `.env` file in the project root:

```
REACT_APP_API_URL=https://etusl-backend.onrender.com
```

## Files to Update

Replace `http://localhost:4000` with the environment variable in:

### 1. `src/pages/policies/Policies.js`

```javascript
// Add at top of component
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// In useEffect, change:
const response = await fetch('http://localhost:4000/api/policies/active');
// To:
const response = await fetch(`${API_URL}/api/policies/active`);
```

### 2. `src/pages/partners/Partners.js`

```javascript
// Add at top of component
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// In useEffect, change:
const response = await fetch('http://localhost:4000/api/affiliates/active');
// To:
const response = await fetch(`${API_URL}/api/affiliates/active`);
```

### 3. `src/pages/staff/StaffDashboard.js`

```javascript
// Add at top of component
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Replace all instances of:
fetch('http://localhost:4000/api/...')
// With:
fetch(`${API_URL}/api/...`)
```

## Helper Utility (Optional)

Create `src/utils/api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  return fetch(url, options);
};

export default API_URL;
```

Then use in components:
```javascript
import { apiCall } from '../utils/api';

const response = await apiCall('/api/policies/active');
const data = await response.json();
```

## Firebase Deployment

After updating frontend:

```bash
# Build React app
npm run build

# Deploy to Firebase
firebase deploy
```

The frontend will automatically read the `.env` file during build time and use your Render backend URL.
