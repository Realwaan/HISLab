# 🧪 Dashboard Testing Guide

## Quick Test Procedure (5 minutes)

### Step 1: Login to System
1. Navigate to `http://localhost:8000`
2. Use credentials: `admin` / `admin123`
3. Should redirect to dashboard automatically

### Step 2: Test Patient Registration
1. Click **"New Patient"** button (blue button in Quick Actions)
2. Fill in the form:
   - First Name: "Juan"
   - Last Name: "Dela Cruz"
   - Age: 45
   - Gender: "Male"
   - Address: "Barangay Lahug, Cebu City"
   - Phone: "+639171234567"
   - Reason: "Annual checkup"
3. Click **"Register Patient"**
4. **Expected Results:**
   - ✅ Green notification appears: "Patient Juan Dela Cruz registered successfully! ID: CK-2025-XXX"
   - ✅ Modal closes automatically
   - ✅ "Total Patients" KPI card number increases by 1

### Step 3: Test Appointment Scheduling
1. Click **"Schedule Appointment"** button (green button)
2. Fill in the form:
   - Patient Name: "Juan Dela Cruz" (should autocomplete)
   - Date: Select tomorrow's date
   - Time: "10:00"
   - Type: "General Checkup"
   - Notes: "First visit - annual physical"
3. Click **"Schedule Appointment"**
4. **Expected Results:**
   - ✅ Green notification: "Appointment scheduled successfully!"
   - ✅ Modal closes
   - ✅ New appointment appears in "Today's Appointments" panel
   - ✅ Shows time, patient name, type, and "pending" status (yellow badge)

### Step 4: Test Task Management
1. Click **"Add Task"** button (purple/accent button)
2. Fill in the form:
   - Task: "Review patient records"
   - Priority: "High Priority"
   - Due Date: Select today's date
3. Click **"Add Task"**
4. **Expected Results:**
   - ✅ Green notification: "Task added successfully!"
   - ✅ Modal closes
   - ✅ Task appears in "My Tasks" panel
   - ✅ Shows red border (high priority)
   - ✅ Checkbox is unchecked

### Step 5: Test Task Completion
1. Find the task you just created in "My Tasks"
2. Click the checkbox next to the task
3. **Expected Results:**
   - ✅ Green notification: "Task completed!"
   - ✅ Task text gets strikethrough
   - ✅ Task becomes slightly transparent (opacity 0.6)
   - ✅ Task saved to localStorage

### Step 6: Test Data Persistence
1. Close the browser tab
2. Open a new tab to `http://localhost:8000/pages/dashboard.html`
3. **Expected Results:**
   - ✅ Patient count remains the same
   - ✅ Appointment is still shown
   - ✅ Task is still marked as complete
   - ✅ All data persisted in localStorage

### Step 7: Test Modal Interactions
1. Click "New Patient" button
2. Without filling anything, click outside the modal (on the dark overlay)
3. **Expected Result:** ✅ Modal closes with animation
4. Click "New Patient" again
5. Click the **X** button in top-right corner
6. **Expected Result:** ✅ Modal closes with animation

### Step 8: Test Real-Time Clock
1. Look at the topbar (top-right area)
2. **Expected Results:**
   - ✅ Clock shows current Philippine time (Asia/Manila timezone)
   - ✅ Format: "Tuesday, November 26, 2025 - 8:59:30 PM"
   - ✅ Clock updates every second

### Step 9: Test Quick Action Links
1. Click on "Primary Care Services" card
2. **Expected Result:** ✅ Navigates to Primary Care page
3. Click browser back button
4. Click on "Transport & Referral" card
5. **Expected Result:** ✅ Navigates to Transport & Referral page

### Step 10: Test Responsive Design
1. Open browser DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. **Expected Results:**
   - ✅ Sidebar collapses to icons only
   - ✅ KPI cards stack vertically
   - ✅ Quick action buttons stack
   - ✅ Appointments and Tasks panels stack
   - ✅ Everything remains functional

## 🐛 Troubleshooting

### Issue: "New Patient" button doesn't work
**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify `dashboard.js` is loaded: Look for "Dashboard initialized successfully" in console
4. Try hard refresh: Ctrl+F5

### Issue: Modal doesn't open
**Solution:**
1. Check browser console for errors
2. Verify `createModals()` function was called
3. Check if modal HTML was injected into page (Inspect element)
4. Try clicking button again after page fully loads

### Issue: Data doesn't save
**Solution:**
1. Check if localStorage is enabled in browser
2. Open DevTools > Application > Local Storage > http://localhost:8000
3. Verify keys exist: `clinikabayan_patients`, `dashboard_appointments`, `dashboard_tasks`
4. Try incognito/private browsing mode

### Issue: Notification doesn't appear
**Solution:**
1. Check browser console for errors
2. Look for notification element in DOM (might be hidden off-screen)
3. Verify CSS animations are enabled
4. Try a different browser

### Issue: Clock shows wrong time
**Solution:**
1. System clock might be incorrect
2. Timezone detection might fail
3. Check browser console for date/time errors
4. Verify Asia/Manila timezone is available

## ✅ Success Criteria

Your dashboard is working correctly if:
- [x] All 3 quick action buttons open their respective modals
- [x] Patient registration creates new patient with auto-generated ID
- [x] Appointments are scheduled and displayed in panel
- [x] Tasks can be created and marked complete
- [x] All data persists after page refresh
- [x] Notifications appear for all actions
- [x] KPI cards update when data changes
- [x] Clock displays and updates every second
- [x] Modals can be closed by clicking X or outside
- [x] Page is responsive on mobile devices

## 📊 Sample Test Data

If you want to test with multiple entries, here are some sample patients:

### Patient 1
- Name: Maria Santos
- Age: 28
- Gender: Female
- Address: Barangay Mabolo, Cebu City
- Phone: +639171111111
- Reason: Prenatal checkup

### Patient 2
- Name: Pedro Garcia
- Age: 52
- Gender: Male
- Address: Barangay Lahug, Cebu City
- Phone: +639172222222
- Reason: Follow-up consultation

### Patient 3
- Name: Ana Reyes
- Age: 7
- Gender: Female
- Address: Barangay Capitol Site, Cebu City
- Phone: +639173333333
- Reason: Vaccination

### Sample Appointments
- 09:00 AM - Maria Santos - Prenatal Care
- 10:30 AM - Pedro Garcia - Follow-up
- 02:00 PM - Ana Reyes - Vaccination
- 03:30 PM - Juan Dela Cruz - General Checkup

### Sample Tasks
- "Prepare vaccination supplies for tomorrow" - High Priority - Tomorrow
- "Review medical inventory" - Medium Priority - Next week
- "Update patient database" - Low Priority - End of month

## 🎯 What to Look For

### Good Signs ✅
- Smooth animations when opening/closing modals
- Instant UI updates after saving data
- Green notifications that auto-dismiss
- Responsive layout that adapts to screen size
- No console errors in browser DevTools
- Fast page load times
- Intuitive user flow

### Warning Signs ⚠️
- Console errors in red
- Modals not appearing
- Data not saving
- Buttons not responsive
- Layout broken on mobile
- Slow page performance

## 📸 Expected Visual Results

### After Testing, You Should See:
1. **Dashboard Header**: Logo, title, search bar, notification bell, user profile, clock
2. **KPI Cards**: 4 cards with updated numbers
3. **Quick Action Buttons**: 3 prominent buttons (blue, green, purple)
4. **Quick Links**: 3 large cards for Primary Care, Transport, Campaigns
5. **Appointments Panel**: List of scheduled appointments with time and status
6. **Tasks Panel**: List of tasks with checkboxes and priority colors
7. **Activity Feed**: Recent activities with colored icons
8. **Right Sidebar**: Tasks widget, weather, and quick stats

## 🚀 Performance Expectations

- **Page Load**: < 2 seconds
- **Modal Open**: < 300ms
- **Data Save**: < 100ms
- **UI Update**: Instant (< 50ms)
- **Animation Duration**: 300ms
- **Notification Display**: 3 seconds

## 📝 Notes for Academic Submission

When demonstrating to your professor:
1. Start fresh with no data (clear localStorage)
2. Show patient registration workflow
3. Schedule 2-3 appointments
4. Create and complete a task
5. Refresh page to show data persistence
6. Toggle to mobile view to show responsiveness
7. Navigate to other pages (Primary Care, Transport)
8. Logout and login again

This demonstrates:
- ✅ Complete CRUD operations
- ✅ Data persistence
- ✅ User interface design
- ✅ Form validation
- ✅ Responsive design
- ✅ Navigation flow
- ✅ Authentication system

---
**Total Test Time**: ~5 minutes
**Status**: Ready for demonstration ✅
