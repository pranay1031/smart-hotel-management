# 🏨 Smart Hotel Management System (PS-046)

![Architecture Diagram](file:///C:/Users/chitt/.gemini/antigravity/brain/a5d643e7-e1d0-4b50-b56a-89a3a61d0ad7/hotel_system_architecture_1778571364544.png)
*Figure 1: High-Level Architecture Diagram*

---

> **Project ID**: PS-046  
> **Project Name**: Smart AI Hotel Management System  
> **Status**: ✅ Active Development  
> **Last Updated**: May 12, 2026

---

## 1. Project Overview
The **Smart Hotel Management System** is a full-stack, AI-powered hotel management platform built for **Novotel Visakhapatnam Varun Beach**. It integrates a premium React front-end with a ServiceNow backend to deliver a complete digital hospitality experience for guests, staff, receptionists, managers, and admins.

### Key Objectives
- Provide guests with a self-service portal for bookings, food orders, and service requests
- Enable staff with a real-time task management interface
- Give managers live analytics and occupancy dashboards
- Synchronize all data bi-directionally with ServiceNow REST APIs
- Achieve 95+ Lighthouse scores across Performance, Accessibility, SEO, and Best Practices

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| Styling | Tailwind CSS | 4.x |
| Routing | React Router DOM | 7.x |
| State Management | Zustand | 5.x |
| Animations | Framer Motion | 12.x |
| Charts | Recharts | 3.x |
| Icons | Lucide React | 1.x |
| 3D Graphics | Three.js / R3F | 0.184 |
| HTTP Client | Axios | 1.x |
| Auth Backend | Supabase | 2.x |
| Notifications | EmailJS Browser | 4.x |
| Data Backend | ServiceNow REST API | — |
| Testing | Vitest + Testing Library | 4.x |

---

## 3. Architecture
The system follows a modern "Separation of Concerns" architecture:
- **Frontend**: React (Vite) for a fast, responsive user interface.
- **Enterprise Backend**: ServiceNow for data storage, business rules, and workflows.
- **Authentication**: Supabase for secure guest registration and session management.
- **Notifications**: Centralized utility for In-app toasts, Browser popups, and Email notifications.

---

## 4. User Roles & Access

| Role | Login Method | Portal Features |
|---|---|---|
| **Customer** | Supabase Email Auth | Book rooms, food orders, service requests, notifications, payments, nearby places, feedback |
| **Staff** | Supabase Email Auth | Task management, assigned incidents |
| **Receptionist** | Supabase Email Auth | Check-in/out, guest list |
| **Manager** | Supabase Email Auth | Analytics, occupancy, revenue charts |
| **Admin** | `.env` credentials | All portals + Staff Directory (sys_user table) |

---

## 5. Notification System
Three-layer architecture (most reliable first):
1. **Layer 1: react-hot-toast**: Always works (in-app).
2. **Layer 2: Notification Timeline**: Live activity feed in the dashboard.
3. **Layer 3: Browser Notification API**: Desktop popups (requires OS permission).

---

## 6. ServiceNow Tables

| Table | Purpose |
|---|---|
| `x_1939650_smart_0_bookings` | Room reservations |
| `x_1939650_smart_0_room` | Room inventory & availability |
| `x_1939650_smart_0_food_orders` | Restaurant / room service orders |
| `x_1939650_smart_0_guest_incidents` | Service requests & complaints |
| `x_1939650_smart_0_notifications` | Email/push notification queue |
| `x_1939650_smart_0_payments` | Billing & payment records |
| `x_1939650_smart_0_feedback` | Guest reviews and ratings |
| `x_1939650_smart_0_staff_tasks` | Housekeeping/delivery tasks |
| `x_1939650_smart_0_sla_metrics` | Response time tracking |
| `sys_user` | Staff Directory (Admin view) |

---

## 7. Run Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server → localhost:5173
npm run build        # Production build → dist/
npm run preview      # Preview build → localhost:4173 (use for Lighthouse)
npm run test         # Run Vitest unit tests
```

---

## 8. Lighthouse Scores
Optimized for:
- ✅ **Performance**: Code splitting, lazy loading, optimized assets.
- ✅ **Accessibility**: ARIA labels, semantic HTML, keyboard focus management.
- ✅ **SEO**: Meta tags, robots.txt, descriptive titles.

---

## 9. Developer Info
- **Team**: PS-046
- **Lead Developer**: chittemreddypranay
- **Email**: chittemreddypranay@gmail.com
- **ServiceNow Instance**: dev189725.service-now.com
