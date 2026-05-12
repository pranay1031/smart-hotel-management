# 🏨 Novotel Smart Hotel — AI-Powered Management System (PS-046)

An end-to-end, enterprise-grade hospitality platform that integrates a premium React frontend with a robust ServiceNow backend to deliver a seamless "Smart Hotel" experience.

---

## 📖 Table of Contents
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Feature Modules](#feature-modules)
- [ServiceNow Infrastructure](#servicenow-infrastructure)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Lighthouse Scores](#lighthouse-scores)

---

## Problem Statement
Traditional hotel management often suffers from fragmented communication. Guests face delays in service requests, while staff operate on disconnected task lists. Most hospitality platforms lack a unified, real-time bridge between a high-end user interface and the core enterprise database, leading to inefficiencies and a poor guest experience.

**Qlue-v2 inspired solutions** often overlook the hospitality sector. The Smart Hotel Management System solves this by providing:
- **Guest Friction**: Zero-touch room selection, digital dining, and instant service requests.
- **Operational Silos**: Real-time task synchronization between guests and staff.
- **Data Blindness**: Live, automated analytics for management via the ServiceNow ecosystem.

---

## Proposed Solution
Our platform (Team 046) is a full-stack, AI-enhanced ecosystem consisting of:

1.  **A Premium React Web Application**: A high-performance, 3D-animated (Three.js/R3F) interface with weather-aware logic, dark/light mode synchronization, and interactive mapping.
2.  **ServiceNow Enterprise Backend**: A custom scoped application (`x_1939650_smart_0`) that orchestrates all business logic, including automated pricing, SLA monitoring, and task routing.
3.  **Notifications Service**: A multi-layer delivery system using `react-hot-toast` for in-app feedback, a persistent Activity Timeline, and the Browser Notification API for desktop popups.

---

## System Architecture

![Architecture Diagram](/C:/Users/chitt/.gemini/antigravity/brain/a5d643e7-e1d0-4b50-b56a-89a3a61d0ad7/hotel_web_architecture_v2_1778576742656.png)
*Figure 1: Smart Hotel High-Level Architecture Diagram*

The system follows a modern "Separation of Concerns" architecture:
- **React Web Application**: Manages state via Zustand and communicates via the Table API.
- **ServiceNow**: Acts as the single source of truth for all transactional data.
- **Supabase**: Handles scalable user authentication and session management.
- **Notifications Service**: Centralized handling for emails, toasts, and desktop alerts.

---

## Technologies Used

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 19.x | UI Framework |
| **Vite** | 8.x | Build Tool & Dev Server |
| **Tailwind CSS** | 4.x | Modern Utility-First Styling |
| **Three.js / R3F** | 0.184 | 3D Visuals & Animations |
| **Zustand** | 5.x | Lightweight State Management |
| **Framer Motion** | 12.x | Micro-interactions & Transitions |
| **Axios** | 1.x | REST API Communication |

### Backend (ServiceNow)
| Component | Purpose |
| :--- | :--- |
| **Table API** | Primary data interface for all modules |
| **Business Rules** | Automated pricing, ID generation, and assignment |
| **Flow Designer** | Asynchronous confirmation and notification logic |
| **Scheduled Jobs** | SLA monitoring and resolution tracking |

---

## Feature Modules

### 1. Guest Portal
- **Smart Booking**: Real-time room availability with automated pricing logic.
- **AI-Powered Dining**: Weather-aware food recommendations and digital ordering.
- **Service Hub**: Instant service requests (incidents) with live status tracking.
- **Nearby Places**: Interactive Google Maps integration with curated local attractions.

### 2. Staff & Management
- **Task Management**: Real-time Kanban-style task lists for housekeeping and delivery.
- **Manager Dashboard**: Live analytics on occupancy, revenue, and SLA performance.
- **Receptionist Portal**: Streamlined check-in/out and guest management.

---

## ServiceNow Infrastructure

### Core Tables
| Table | Purpose |
| :--- | :--- |
| `bookings` | Room reservations and payment status |
| `room` | Inventory management and real-time occupancy |
| `food_orders` | Restaurant and room service transactions |
| `guest_incidents`| Service requests and SLA tracking |
| `sla_metrics` | Performance auditing and response time logs |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- ServiceNow Instance (Developer/Enterprise)
- Supabase Project for Auth

### Installation
```bash
# Clone and install dependencies
git clone <your-repo-url>
cd smart-hotel-system
npm install

# Set up environment variables (.env)
VITE_SN_INSTANCE=https://your-instance.service-now.com
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Running Locally
```bash
npm run dev      # Development mode
npm run build    # Production bundle
npm run preview  # Test production build
```

---

## Lighthouse Scores
The project is optimized for performance and accessibility, targeting **95+** in all areas:
- **Performance**: Code-splitting, asset optimization, and lazy loading.
- **Accessibility**: Full ARIA support, keyboard navigation, and semantic HTML.
- **SEO**: Dynamic meta tags, robots.txt, and pre-connect hints.

---

## Project Structure
```
smart-hotel-system/
├── src/
│   ├── lib/            # ServiceNow & Notification clients
│   ├── store/          # Zustand auth & state
│   ├── pages/          # All portal views
│   └── components/     # Reusable UI components
├── public/             # Optimized assets
└── .env.example        # Configuration template
```

---
**Team 046** | Novotel Smart Hotel Management System | May 2026

