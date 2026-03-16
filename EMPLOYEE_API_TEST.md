# Employee API Integration - Testing Guide

## 🚀 **Setup Instructions**

### **1. Start Backend Server**
```bash
cd backend-system
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **2. Start Frontend Server**
```bash
cd hrms-system
npm run dev
```

### **3. Test API Connection**
Open browser and navigate to: `http://localhost:8000/docs`
You should see the FastAPI documentation with available endpoints.

## 📋 **API Endpoints**

### **Employee Management**
```
GET    /api/employees/          # List all employees
POST   /api/employees/          # Create new employee
GET    /api/employees/{id}     # Get specific employee
PUT    /api/employees/{id}     # Update employee
DELETE /api/employees/{id}     # Delete employee
```

## 🧪 **Testing the Integration**

### **1. Test Frontend Connection**
1. Navigate to `http://localhost:5173/admin/employees`
2. The page should load with a loading spinner
3. If backend is running, you'll see employee data or empty table
4. If backend is not running, you'll see an error message

### **2. Test Adding Employee**
1. Click "+ Add Employee" button
2. Fill in the form:
   - Employee ID: EMP001
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@company.com
   - Phone: +1234567890
   - Department: IT
   - Position: Software Developer
   - Salary: 75000
   - Hire Date: Today's date
   - Status: active
3. Click "Add Employee"
4. Success message should appear
5. New employee should appear in the table

### **3. Test Deleting Employee**
1. Click "Delete" button next to any employee
2. Confirm deletion in the popup
3. Success message should appear
4. Employee should be removed from the table

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. CORS Error**
If you see CORS errors in browser console:
```bash
# In backend, install CORS
pip install fastapi-cors

# Add to main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### **2. Database Connection Error**
If database is not connected:
```bash
# Check database connection
cd backend-system
python -c "from app.database import engine; print(engine.url)"
```

#### **3. Authentication Error**
If you get 401/403 errors:
- Make sure user is logged in with admin role
- Check JWT token in localStorage
- Verify user permissions in database

#### **4. API Not Responding**
If frontend shows loading forever:
- Check if backend server is running on port 8000
- Verify API_BASE_URL in src/services/api.js
- Check browser network tab for failed requests

## 📊 **Expected Data Flow**

### **Frontend → Backend → Database**
```
User fills form → API POST /api/employees/ → Database INSERT → Response → Frontend update
```

### **Backend → Frontend**
```
Database SELECT → API GET /api/employees/ → Frontend display → Table render
```

## 🎯 **Success Indicators**

### **✅ Working Correctly**
- Loading spinner appears briefly
- Employee data displays in table
- Add employee form works
- Delete employee works
- Search and filter work
- No error messages in console

### **❌ Issues to Fix**
- Continuous loading spinner
- Error messages displayed
- Console errors in browser
- Form submission fails
- Data not updating

## 🔄 **Real-time Updates**

The system now provides:
- **Dynamic Data Loading**: Fetches from database on page load
- **Real-time Updates**: Table refreshes after add/delete operations
- **Error Handling**: Shows user-friendly error messages
- **Loading States**: Visual feedback during API calls
- **Data Validation**: Form validation before submission

## 📱 **User Experience**

The integration provides:
- **Professional Forms**: Complete employee data entry
- **Instant Feedback**: Success/error messages
- **Data Persistence**: Data saved to database
- **Search & Filter**: Dynamic filtering of employee list
- **Responsive Design**: Works on all device sizes

Your HRMS now has full CRUD functionality for employee management! 🎉
