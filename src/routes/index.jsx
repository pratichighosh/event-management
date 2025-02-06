import { Routes, Route } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../components/dashboard/Dashboard';
import EventForm from '../components/events/EventForm';
import EventList from '../components/events/EventList';
import PrivateRoute from '../components/auth/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EventList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route 
        path="/create-event" 
        element={
          <PrivateRoute>
            <EventForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;