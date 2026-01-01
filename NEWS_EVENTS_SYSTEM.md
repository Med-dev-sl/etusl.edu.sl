# News & Events System Implementation

## Overview
A complete news and events management system has been integrated into the ETUSL staff dashboard with full CRUD functionality, image upload capability, active/inactive status management, and a Harvard-styled preview on the landing page.

## Database Schema

### news_events Table
- **id** (INT, Primary Key) - Auto-increment unique identifier
- **headline** (VARCHAR 255) - News/Event title (required)
- **description** (LONGTEXT) - Detailed description (required)
- **image_path** (VARCHAR 255) - Path to uploaded image
- **event_time** (DATETIME) - Date and time for events
- **location** (VARCHAR 255) - Location of event or related location
- **event_type** (ENUM: 'news', 'event') - Type of content (default: 'event')
- **author_id** (INT) - Foreign key to staff table
- **author_name** (VARCHAR 100) - Name of author
- **status** (ENUM: 'active', 'inactive', 'draft') - Publication status (default: 'active')
- **created_at** (TIMESTAMP) - Creation timestamp
- **updated_at** (TIMESTAMP) - Last update timestamp

## Backend API Endpoints

### REST API
All endpoints located in `backend/server.js`

#### Get All News & Events
```
GET /api/news-events
Response: { newsEvents: [...] }
```

#### Get Single News/Event
```
GET /api/news-events/:id
Response: { newsEvent: {...} }
```

#### Create News/Event (with Image Upload)
```
POST /api/news-events
Content-Type: multipart/form-data
Fields:
  - headline* (required)
  - description* (required)
  - image (file, optional - max 10MB)
  - event_time (datetime)
  - location (string)
  - event_type ('news' or 'event', default: 'event')
  - author_id* (required - staff ID)
  - author_name* (required - staff name)
  - status ('active', 'inactive', 'draft', default: 'active')

Response: { message: 'News/Event created', id: number, imagePath: string }
```

#### Update News/Event
```
PUT /api/news-events/:id
Content-Type: multipart/form-data
Fields: Same as POST (image optional for updates)
Response: { message: 'News/Event updated' }
```

#### Delete News/Event
```
DELETE /api/news-events/:id
Response: { message: 'News/Event deleted' }
```

## Frontend Components

### 1. NewsEvents.js
**Location:** `src/pages/newsevents/NewsEvents.js` (384 lines)

**Features:**
- Full CRUD management interface for staff
- Add form with all fields:
  - Headline (required)
  - Type selector (News/Event)
  - Event date & time (for events)
  - Location
  - Image upload with preview
  - Description textarea
  - Status selector (Active/Inactive/Draft)
- Edit existing news/events with pre-populated data
- Delete with confirmation dialog
- Toggle status button (Active ↔ Inactive)
- Filter by type (All/Events/News)
- Image preview in form
- Responsive card grid layout
- Full image support with preview

**State Management:**
- newsEvents (array)
- selectedType ('all', 'event', 'news')
- showAddForm (boolean)
- editingId (number/null)
- staff (staff data from localStorage)
- loading (boolean)
- imageFile (File object)
- imagePreview (base64 string)
- formData (form state object)

**Authentication:**
- Requires staff to be logged in (checks localStorage)
- All authenticated staff can access

### 2. NewsEvents.css
**Location:** `src/pages/newsevents/NewsEvents.css` (500+ lines)

**Styling Features:**
- Header with blue gradient background and icon animation
- Type filter buttons with active state
- Add/Edit form with proper input styling
- News/Event card grid (responsive 380px minimum)
- Status badges (active=green, inactive=red, draft=yellow)
- Image preview functionality
- Action buttons (toggle=yellow, edit=blue, delete=red)
- Responsive breakpoints: 1024px, 768px, 480px, 360px
- Animations: slideInDown, slideDown, slideInUp, fadeIn, float
- Hover effects on cards and buttons

### 3. NewsEventsPreview.js
**Location:** `src/components/NewsEventsPreview.js` (95 lines)

**Features:**
- Landing page preview component
- Displays only active news & events
- Shows latest 3 items
- Harvard-styled cards
- Event type badge overlay
- Date/time display with calendar icon
- Location display with map icon
- Author information
- "View All" button linking to `/news-events`
- Loading states
- Staggered animations

### 4. NewsEventsPreview.css
**Location:** `src/styles/NewsEventsPreview.css` (400+ lines)

**Harvard Styling:**
- Main title: 56px Crimson Text, deep blue
- Headline: 32px Crimson Text, deep blue
- Description: 18px Lora, justified alignment
- Category: 13px uppercase, blue
- Metadata: 15px, 14px, 13px varying sizes
- Card styling: white background, 5px left blue border
- Hover: lift 8px, shadow enhancement
- Responsive design for all devices

**Responsive Breakpoints:**
- Desktop (1024px+): Full styling
- Tablet (768px): Adjusted layout, 26px titles
- Mobile (480px): 22px titles, full-width buttons
- Extra-small (360px): Further optimizations

## File Structure

```
src/
├── pages/
│   └── newsevents/
│       ├── NewsEvents.js          (Staff management interface)
│       └── NewsEvents.css         (Management styling)
├── components/
│   └── NewsEventsPreview.js       (Landing page preview)
├── styles/
│   └── NewsEventsPreview.css      (Landing page styling)
└── App.js                         (Updated with imports & routes)

backend/
├── server.js                      (API endpoints added)
└── setup-news-events.js           (Database setup script)
```

## Integration Points

### StaffDashboard.js
- Imported NewsEvents component
- Added "News & Events" button in Web Portal dropdown menu
- Added news-events tab to render full management interface
- All staff members can access (no role restrictions)

### App.js
- Imported NewsEventsPreview component
- Imported NewsEvents component
- Added `/news-events` route for full page view
- Added NewsEventsPreview to HomePage (displays between Announcements and footer)

## Database Setup

**Script:** `backend/setup-news-events.js`

**Actions:**
1. Creates news_events table with full schema
2. Inserts 3 sample entries:
   - "New Faculty Recruitment Drive" (news)
   - "Annual Technology Innovation Summit" (event with date/location)
   - "Student Research Showcase 2026" (event with date/location)

**Execution:**
```bash
cd backend
node setup-news-events.js
```

**Output:** Table created with sample data, status='active' for all samples

## Features Summary

✅ **Complete CRUD Operations**
- Create news/events with image upload
- Read all and individual items
- Update existing content
- Delete with confirmation

✅ **Image Upload**
- Support for JPG, PNG, GIF, WebP
- Max 10MB file size
- Stored in `backend/uploads/news-events/`
- Preview in form and display

✅ **Status Management**
- Active/Inactive/Draft status
- Toggle status button
- Filter landing preview by active status only

✅ **Type Classification**
- News vs Events distinction
- Event-specific fields (date/time)
- Type-based filtering

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Adaptive grid layout
- Touch-friendly buttons

✅ **User Authentication**
- Staff login required
- Staff name captured as author
- Automatic author attribution

✅ **Landing Page Integration**
- Preview component shows latest 3 active items
- Harvard styling throughout
- Large, readable fonts
- Mobile responsive

## How to Use

### Staff Dashboard Access
1. Login as staff member
2. Go to Web Portal dropdown
3. Click "News & Events"
4. Click "Add News/Event" button
5. Fill in form:
   - Headline (required)
   - Type (News or Event)
   - Date & Time (for events)
   - Location (optional)
   - Upload image
   - Description
   - Status
6. Submit to create
7. Edit/Delete/Toggle Status available on cards

### Public View
- Navigate to landing page
- "News & Events" section displays latest 3 active items
- Click "View All" to see full management page
- Only active items visible to public

## Sample Data
Three sample entries created automatically:
1. **Faculty Recruitment** - News item
2. **Technology Summit** - Event on upcoming date with location
3. **Research Showcase** - Event on future date with location

All set to status='active' and ready to display.

## Technologies Used
- React 19.2.3 (Frontend)
- Node.js/Express (Backend)
- MySQL (Database)
- Multer (File upload)
- Ant Design Icons (UI Icons)
- CSS3 (Styling with animations)

## Future Enhancement Possibilities
- Search functionality for news/events
- Comments/discussions on items
- Event registration/RSVP system
- Calendar view of events
- Email notifications for new items
- Event reminders
- Rich text editor for descriptions
- Video attachments
- Analytics (view counts, engagement)
- Category/tags system
