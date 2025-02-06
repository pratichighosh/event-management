// src/App.jsx
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventList from './components/events/EventList';
import EventForm from './components/events/EventForm';
import EditEvent from './components/events/EditEvent';
import Dashboard from './components/dashboard/Dashboard';
import LandingPage from './components/pages/LandingPage';
import { Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="/events" element={<EventList />} />
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
      <Route
        path="/edit-event/:id"
        element={
          <PrivateRoute>
            <EditEvent />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;