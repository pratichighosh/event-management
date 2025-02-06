// src/components/events/EventCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/dateFormat';
import api from '../../services/api';

const EventCard = ({ event, onRefresh }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isCreator = user && event.creator && 
    (user._id === event.creator._id || user._id === event.creator);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    return `${import.meta.env.VITE_API_URL}/${imageUrl}`;
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/api/events/${event._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {event.imageUrl && (
        <img 
          src={getImageUrl(event.imageUrl)} 
          alt={event.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
          }}
        />
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <p>📅 {formatDate(event.date)}</p>
          <p>📍 {event.location}</p>
          <p>👥 {event.attendees?.length || 0} attending</p>
          <p>🏷️ {event.category}</p>
          <p>👤 Created by: {event.creator?.name || 'Unknown'}</p>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2 mb-2">
            {error}
          </div>
        )}

        {user && (
          <div className="mt-4 flex gap-2">
            {isCreator ? (
              <>
                <button
                  onClick={() => navigate(`/edit-event/${event._id}`)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;