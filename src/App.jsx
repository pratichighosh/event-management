// src/App.jsx
import { 
  createBrowserRouter, 
  RouterProvider, 
  Route, 
  createRoutesFromElements,
  Outlet
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventList from './components/events/EventList';
import EventForm from './components/events/EventForm';
import EditEvent from './components/events/EditEvent';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import LandingPage from './components/pages/LandingPage';

const AppLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />} errorElement={<ErrorBoundary />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={<PrivateRoute><Dashboard /></PrivateRoute>} 
      />
      <Route 
        path="/create-event" 
        element={<PrivateRoute><EventForm /></PrivateRoute>} 
      />
      <Route 
        path="/edit-event/:id" 
        element={<PrivateRoute><EditEvent /></PrivateRoute>} 
      />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;