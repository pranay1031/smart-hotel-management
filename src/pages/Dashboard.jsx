import { useAuthStore } from '../store/authStore';
import CustomerDashboard from './dashboards/CustomerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import ReceptionistDashboard from './dashboards/ReceptionistDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import StaffManagement from './StaffManagement';

export default function Dashboard() {
  const { role } = useAuthStore();

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
  return <CustomerDashboard view={location} />;
}
