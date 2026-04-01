# HRMS System

Human Resource Management System (HRMS) is a web-based application developed using **React.js** and **Tailwind CSS**.  
This system helps organizations manage employees, attendance, payroll, and leave management in an efficient way.

---

## Features

- Admin Dashboard
- Employee Dashboard
- Employee Management
- Attendance Tracking
- Leave Management
- Payroll System
- Reports & Analytics
- Responsive Design (Mobile Friendly)

---

## Technologies Used

- React.js
- Tailwind CSS
- React Router
- Vite
- JavaScript
- HTML5
- CSS3

---

## Project Structure

### Environment Variables

This app uses Vite environment variables, but local development should rely on the Vite proxy:

```env
# Optional in dev. Set only for production or remote APIs.
# VITE_API_BASE_URL=https://your-api.example.com
```

For Netlify or any production deployment, set `VITE_API_BASE_URL` to your deployed backend URL.

When running locally, start the frontend with Vite and keep the backend on `http://localhost:8000`.
The frontend will call same-origin paths such as `/employees/`, and Vite will proxy them to the backend.
