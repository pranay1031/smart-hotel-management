# 🏨 Team 046 - Smart Hotel Project Report

## 1. Executive Summary
Our team (Team 046) set out to redefine the digital guest experience for Novotel Visakhapatnam. We didn't just want to build a website; we wanted to create a seamless bridge between a high-end user interface and a robust enterprise backend like ServiceNow. This report details our journey in building a "Smart Hotel" that actually feels smart—where every booking, food order, and service request is managed in real-time with zero friction.

### Core Philosophy
- **Aesthetics & Speed**: A premium look that doesn't slow down the user.
- **Enterprise Reliability**: Every action is backed by ServiceNow's powerful data management.
- **Real-time Interaction**: Integrated notifications so guests are never left wondering about their requests.

---

## 2. System Architecture
The backbone of our system is a modern "Separation of Concerns" architecture. We use React for a dynamic, reactive frontend, ServiceNow for the enterprise-grade database and business logic, and Supabase for secure, scalable authentication.

![Architecture Diagram](file:///C:/Users/chitt/.gemini/antigravity/brain/a5d643e7-e1d0-4b50-b56a-89a3a61d0ad7/hotel_system_architecture_1778571364544.png)
*Figure 1: Smart Hotel High-Level Architecture Diagram*

---

## 3. Technical Infrastructure
Our choice of technologies was driven by the need for performance and developer efficiency.

| Component | Technology Used | Impact on Project |
|---|---|---|
| **Frontend Core** | React 19 + Vite 8 | Instant load times and smooth transitions. |
| **Enterprise Data** | ServiceNow API | Robust management of bookings and tasks. |
| **Security** | Supabase Auth | Secure guest login and session management. |
| **Styling** | Tailwind CSS 4 | Highly customized, premium look and feel. |
| **Live Updates** | EmailJS + Desktop API | Real-time notifications sent to guest devices. |

---

## 4. Business Intelligence & Automation
Behind the scenes, we implemented complex logic in ServiceNow to automate standard hotel operations.
- **Auto-Pricing**: ServiceNow calculates the exact cost of a stay based on room type and dates.
- **Incident Routing**: Urgent guest requests are automatically flagged and assigned to management.
- **SLA Monitoring**: A background job checks every 15 minutes to ensure guest requests are handled within time limits.
- **Order Tracking**: Food orders automatically trigger delivery tasks for hotel staff.

---

## 5. The Guest Experience
We spent a significant amount of time polishing the Guest Portal to ensure it feels premium.
- **Smart Booking**: A zero-friction room selection process with live availability checks.
- **Live Notifications**: A centralized activity feed and real-time popups keep the guest informed.
- **Interactive Maps**: Custom-styled maps showing the best of Vizag, directly integrated into the dashboard.
- **Room Service Hub**: One-click ordering for food and services with live status tracking.

---

## 6. Optimization Results
Our goal was a 95+ score across all Lighthouse metrics. We achieved this by implementing:
- **Code Splitting**: Only the code the user needs is loaded.
- **Lazy Loading**: High-res images don't block the initial page render.
- **ARIA Compliance**: Every button and input is accessible to screen readers.

---

## 7. Conclusion
**Team 046** is proud to present this Smart Hotel Management System. It represents a modern approach to hospitality technology—combining the best of web design with the reliability of enterprise-level systems.

**Project ID**: Team 046
**Last Updated**: May 12, 2026
