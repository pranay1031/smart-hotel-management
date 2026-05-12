import { lazy, Suspense } from 'react';
import { useAuthStore } from '../store/authStore';
import { Loader } from 'lucide-react';

const CustomerDashboard = lazy(() => import('./dashboards/CustomerDashboard'));
const AdminDashboard = lazy(() => import('./dashboards/AdminDashboard'));
const StaffDashboard = lazy(() => import('./dashboards/StaffDashboard'));
const ReceptionistDashboard = lazy(() => import('./dashboards/ReceptionistDashboard'));
const ManagerDashboard = lazy(() => import('./dashboards/ManagerDashboard'));
const StaffManagement = lazy(() => import('./StaffManagement'));
const FoodAndDrinks = lazy(() => import('./FoodAndDrinks'));
const NearbyPlaces = lazy(() => import('./NearbyPlaces'));

const DashboardFallback = () => (
  <div className="flex justify-center items-center h-full">
    <Loader className="w-8 h-8 text-indigo-400 animate-spin" />
  </div>
);

export default function Dashboard() {
  const { role } = useAuthStore();

  const renderDashboard = () => {
    if (role !== 'Customer') {
      switch (role) {
        case 'Admin': return <AdminDashboard />;
        case 'Staff': return <StaffDashboard />;
        case 'Receptionist': return <ReceptionistDashboard />;
        case 'Manager': return <ManagerDashboard />;
        default: return <CustomerDashboard />;
      }
    }

    // Handle Admin sub-pages
    if (role === 'Admin' && window.location.pathname === '/staff-management') {
      return <StaffManagement />;
    }

    // Handle Customer sub-pages
    const location = window.location.pathname;
    if (location === '/food-drinks') return <FoodAndDrinks />;
    if (location === '/nearby') return <NearbyPlaces />;
    
    return <CustomerDashboard view={location} />;
  };

  return (
    <Suspense fallback={<DashboardFallback />}>
      {renderDashboard()}
    </Suspense>
  );
}

