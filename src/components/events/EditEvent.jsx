// src/components/events/EditEvent.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await api.get(`/api/events/${id}`);
      const event = response.data;
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        category: event.category,
        image: null
      });
    } catch (error) {
      setError('Error loading event');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await api.put(`/api/events/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating event');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Date and Time</label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-input"
            required
          >
            <option value="">Select Category</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">New Image (optional)</label>
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            className="form-input"
            accept="image/*"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="btn-primary"
          >
            Update Event
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;