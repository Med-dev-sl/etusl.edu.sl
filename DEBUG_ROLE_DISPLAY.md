# Verify Role Data in Database

## Check if role column exists and has data:

```sql
-- 1. Check table structure
DESCRIBE staff;

-- 2. Select all staff with their roles
SELECT id, staffId, name, role FROM staff;

-- 3. If roles are NULL, update them
UPDATE staff SET role = 'SUPERADMIN' WHERE staffId = 'ETUSL0000';
UPDATE staff SET role = 'FACULTY' WHERE staffId = 'ETUSL0001';
UPDATE staff SET role = 'FACULTY' WHERE staffId = 'ETUSL0002';
UPDATE staff SET role = 'ADMIN' WHERE staffId = 'ETUSL0003';

-- 4. Verify update
SELECT id, staffId, name, role FROM staff;

-- 5. Full staff data for login test
SELECT id, staffId, name, email, department, password, phone, role, profile_photo, bio, office_location FROM staff WHERE staffId = 'ETUSL0000';
```

## Steps to Fix:

### 1. Open MySQL
```bash
mysql -u root -p etusl_db
```

### 2. Check if role data exists
```sql
SELECT id, staffId, name, role FROM staff;
```

### 3. If roles are NULL or missing, run updates
```sql
UPDATE staff SET role = 'SUPERADMIN' WHERE staffId = 'ETUSL0000';
UPDATE staff SET role = 'FACULTY' WHERE staffId = 'ETUSL0001';
UPDATE staff SET role = 'FACULTY' WHERE staffId = 'ETUSL0002';
UPDATE staff SET role = 'ADMIN' WHERE staffId = 'ETUSL0003';
```

### 4. Verify
```sql
SELECT * FROM staff;
```

### 5. Exit MySQL
```sql
EXIT;
```

## Debug Steps in Application:

1. **Check Backend Console**: When you login, backend logs should show:
   ```
   Staff data received: { id, staffId, name, email, ..., role: 'SUPERADMIN' }
   ```

2. **Check Frontend Console** (F12 in browser):
   - Open DevTools → Console tab
   - You should see:
     ```
     Staff data from localStorage: { id, staffId, name, ..., role: 'SUPERADMIN' }
     ```

3. **Check Network** (F12 → Network tab):
   - Login and capture the response from `/api/auth/staff-login`
   - Verify the response includes `role` field

## If Still Not Showing:

1. Restart backend: `npm start`
2. Clear browser cache (Ctrl+Shift+Delete)
3. Clear localStorage in DevTools Console:
   ```javascript
   localStorage.clear()
   ```
4. Login again and check console logs

## Expected Result:

After login, role badge should display:
- **ETUSL0000**: 🔐 SUPERADMIN (Red badge)
- **ETUSL0001**: FACULTY (Blue badge)
- **ETUSL0002**: FACULTY (Blue badge)
- **ETUSL0003**: ADMIN (Orange badge)
