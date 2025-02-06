// src/components/events/EventList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events');
      console.log('Events response:', response.data); // Debug log
      setEvents(response.data);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err.response?.data?.message || 'Error loading events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadEvents}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        {user && (
          <button
            onClick={() => navigate('/create-event')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Event
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No events found</p>
          {user && (
            <button
              onClick={() => navigate('/create-event')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Your First Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} onRefresh={loadEvents} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;