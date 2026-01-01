# Photo Upload Fix - January 2026

## Issues Fixed

1. **Missing urlencoded middleware** - Added express.urlencoded() to handle form data properly
2. **FormData handling** - Removed unnecessary staffId from FormData (not needed since we use staff.id in URL)
3. **Error handling** - Improved error messages and logging on both frontend and backend
4. **Content-Type header** - Let browser automatically set multipart/form-data header

## Changes Made

### Backend: `server.js`
✅ Added `express.urlencoded()` middleware for form data parsing
✅ Added console logging for debugging upload process
✅ Improved error messages in upload endpoint

### Frontend: `StaffDashboard.js`
✅ Improved error handling in handlePhotoUpload
✅ Better error messages displayed to user
✅ Removed unnecessary staffId from FormData
✅ Added status code checking before parsing response

## How to Test the Fix

### 1. Restart Backend
```bash
cd backend
npm start
```

### 2. Start Frontend (New Terminal)
```bash
npm start
```

### 3. Login as SUPERADMIN
```
Staff ID: ETUSL0000
Password: P@$$W0RD
```

### 4. Test Photo Upload
1. Dashboard appears
2. Click on profile photo placeholder (camera icon or default circle)
3. Select an image file (JPG, PNG, GIF)
4. Click "Upload" button
5. Wait for success message

## Expected Flow

```
User selects image
    ↓
File preview shows
    ↓
Click Upload
    ↓
FormData created with image
    ↓
POST to /api/staff/{id}/upload-photo
    ↓
Backend receives multipart/form-data
    ↓
Multer parses file
    ↓
File saved to uploads/ directory
    ↓
Database updated with photo path
    ↓
Response sent with photoPath
    ↓
Frontend updates profile photo
    ↓
Success message shown
```

## Common Issues & Solutions

**Issue**: "Error uploading photo: No file uploaded"
- **Solution**: Make sure you selected a file before clicking Upload

**Issue**: "Error uploading photo: Only image files are allowed"
- **Solution**: Only JPG, PNG, and GIF files are supported

**Issue**: "Error uploading photo: Cannot read property 'filename' of undefined"
- **Solution**: Backend didn't receive file properly. Restart backend and try again.

**Issue**: File uploads but photo doesn't display
- **Solution**: 
  1. Check browser console (F12) for errors
  2. Check backend console for logs
  3. Verify `backend/uploads/` directory exists and has permissions
  4. Clear browser cache and refresh

## File Upload Configuration

- **Max File Size**: 5MB
- **Allowed Formats**: JPG/JPEG, PNG, GIF
- **Storage Location**: `backend/uploads/`
- **File Naming**: `profile_STAFFID_TIMESTAMP.ext`
- **Display Size**: 150x150px (circular)

## Debugging

### Enable Backend Logging
Check terminal running backend for messages like:
```
File uploaded: profile_ETUSL0000_1704110400000.jpg
Database updated with photo path: /uploads/profile_ETUSL0000_1704110400000.jpg
```

### Check Browser Console
Open DevTools (F12) → Console tab to see:
- FormData being sent
- Response from server
- Any JavaScript errors

### Verify File Storage
Check if file exists:
```bash
# List uploaded files
ls -la backend/uploads/

# Or on Windows
dir backend\uploads\
```

## Files Modified

```
✅ backend/server.js
   - Added express.urlencoded() middleware (line 10)
   - Added console.log() for debugging (lines 271, 274)
   - Improved error messages

✅ src/pages/staff/StaffDashboard.js
   - Improved error handling in handlePhotoUpload function
   - Removed staffId from FormData
   - Better error messages displayed to user
```

## Next Steps

1. ✅ Restart backend server
2. ✅ Login and test photo upload
3. ✅ Check backend console for logs
4. ✅ Verify photo displays in circular frame
5. ✅ Verify photo persists after page refresh

---

**Fix Status**: ✅ Complete
**Test Date**: January 1, 2026
