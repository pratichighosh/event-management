// src/App.jsx
import { 
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
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
import LandingPage from './components/pages/LandingPage';
import PrivateRoute from './components/auth/PrivateRoute';
import { Outlet } from 'react-router-dom';

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
    <Route element={<AppLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/create-event" element={
        <PrivateRoute>
          <EventForm />
        </PrivateRoute>
      } />
      <Route path="/edit-event/:id" element={
        <PrivateRoute>
          <EditEvent />
        </PrivateRoute>
      } />
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