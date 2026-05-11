# 🏨 Smart Hotel Management System

A high-end, full-stack hotel management platform featuring a 3D-animated user interface and a robust enterprise backend powered completely by **ServiceNow**. 

This application demonstrates complex role-based access control, real-time data synchronization, and automated incident management workflows.

---

## ✨ Key Features

### 🔐 3D Role-Based Authentication
* Stunning 3D interactive login screen built with `@react-three/fiber` and `Three.js`.
* **5 Distinct User Roles**: Customer, Staff, Receptionist, Manager, and Admin.
* Role selection automatically synchronizes with the ServiceNow `sys_user` table.

### 👥 Role-Specific Dashboards
* **Customer Dashboard**: Browse available rooms, make live bookings, and submit housekeeping/maintenance requests.
* **Receptionist Dashboard**: Manage daily check-ins and check-outs. Features a live visual grid of real-time room availability.
* **Staff Dashboard**: Track assigned maintenance and cleaning tasks. Manage guest incidents and push live status updates to ServiceNow.
* **Manager Dashboard**: Features interactive data visualization using `Recharts`. Track live revenue timelines, real-time room occupancy rates, and SLA metrics for open incidents.

### 🤖 Automated Workflows
* **Deep ServiceNow Integration**: Checking out a guest automatically sets the room status to "Maintenance" and instantly auto-generates a High Priority "Cleaning" task for the Staff team.

### 🌍 Smart Live Environment
* Persistent real-time New Delhi Clock configured to the `Asia/Kolkata` timezone.
* Live global weather widget powered by the Open-Meteo API.

---

## 🛠️ Technology Stack

**Frontend Application:**
* **Framework**: React 19 + Vite
* **Styling**: Tailwind CSS, Framer Motion (for fluid micro-animations)
* **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
* **State Management**: Zustand
* **Data Visualization**: Recharts
* **Icons**: Lucide React

**Backend & Database:**
* **ServiceNow Scoped Application**: Custom tables (`x_1939650_smart_0_*`) handling Rooms, Bookings, Food Orders, Staff Tasks, Guest Incidents, and Chat Logs.
* **API Layer**: Axios interceptors configured for the ServiceNow Table API with CORS rules.
* **Authentication Fallback**: Supabase (Used for session mocking and demo overriding).

---

## 🚀 Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranay1031/smart-hotel-management.git
   cd smart-hotel-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add your ServiceNow and Supabase credentials:
   ```env
   VITE_SN_INSTANCE=https://devXXXXX.service-now.com
   VITE_SN_USERNAME=admin
   VITE_SN_PASSWORD=your_password
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *(Note: The system features an intelligent fallback. If Supabase is unconfigured, the auth system will mock the session so you can still test all Dashboard UI states!)*

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

---

## 🏗️ System Architecture

* **UI Shell**: Dynamic rendering based on `authStore` state.
* **API Handlers**: Centralized `servicenow.js` file managing basic authentication and URL resolution for the ServiceNow REST API.
* **Routing**: React Router DOM ensures protected routes based on active sessions.

---
*Built as a portfolio demonstration of React & ServiceNow Integration capabilities.*
