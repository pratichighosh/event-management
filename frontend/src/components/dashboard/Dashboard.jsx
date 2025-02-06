// src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { formatDate } from '../../utils/dateFormat';
import ConfirmModal from '../common/ConfirmModal';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const { user } = useAuth();

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events');
      // Filter events where the user is the creator
      const userEvents = response.data.filter(event => 
        event.creator._id === user?._id || event.creator === user?._id
      );
      setEvents(userEvents);
      setError(null);
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEventId) return;

    try {
      await api.delete(`/api/events/${deleteEventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setEvents(events.filter(event => event._id !== deleteEventId));
      setDeleteEventId(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(error.response?.data?.message || 'Failed to delete event');
    }
  };

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/assets/e1back.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gray-50 bg-opacity-60"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 relative z-10"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative py-8"
      style={{
        backgroundImage: "url('/assets/e1back.jpg')",
      }}
    >
      {/* Gray transparent overlay */}
      <div className="absolute inset-0 bg-gray-50 bg-opacity-60"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold-italic text-purple-800">My Events</h1>
            <p className="text-gray-600 mt-2">Manage your created events</p>
          </div>
          <Link 
            to="/create-event" 
            className="px-6 py-3 bg-teal-400 text-white rounded-lg hover:bg-purple-600 
                     transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>➕</span>
            Create Event
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
            <button 
              onClick={loadEvents}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">No Events Yet</h3>
            <p className="text-gray-600 mb-8">Create your first event to get started!</p>
            <Link 
              to="/create-event" 
              className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-purple-600 
                       transition-colors inline-flex items-center gap-2"
            >
              <span>➕</span>
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div 
                key={event._id} 
                className="bg-white/80 shadow-lg rounded-xl overflow-hidden hover:shadow-xl 
                          transition-shadow duration-300"
              >
                {event.imageUrl && (
                  <div className="relative h-48">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${event.imageUrl}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <p className="flex items-center gap-2">
                      <span>📅</span> {formatDate(event.date)}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📍</span> {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>👥</span> {event.attendees?.length || 0} attendees
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/edit-event/${event._id}`}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                               hover:bg-gray-200 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteEventId(event._id)}
                      className="flex-1 px-4 py-2 bg-purple-700 hover:bg-red-600 
                               text-white rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
};

export default Dashboard;