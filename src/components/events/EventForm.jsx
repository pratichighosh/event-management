// src/components/events/EventForm.jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import Toast from '../common/Toast';

const EventForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please login to create an event', 'error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      // Add creator ID if available
      if (user?._id) {
        data.append('creator', user._id);
      }

      const response = await api.post('/api/events', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        showToast('Event created successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Create event error:', error);
      
      if (error.response?.status === 401) {
        const errorMsg = 'Authentication expired. Please login again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorMsg = error.response?.data?.message || 'Error creating event. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative py-8"
      style={{
        backgroundImage: "url('/assets/e1back.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gray-50 bg-opacity-60"></div>

      <div className="max-w-3xl mx-auto p-8 relative z-10">
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h2 className="text-3xl text-purple-700 font-bold mb-2">Create New Event</h2>
          <p className="text-gray-500 mb-6">Fill in the details to create your event</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-purple-700 font-medium mb-2 block">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 transition-colors"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="text-purple-700 font-medium mb-2 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 transition-colors"
                rows="4"
                placeholder="Describe your event"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-purple-700 font-medium mb-2 block">Date and Time</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-purple-700 font-medium mb-2 block">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 transition-colors"
                  placeholder="Event location"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-purple-700 font-medium mb-2 block">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 transition-colors"
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
              <label className="text-purple-700 font-medium mb-2 block">Event Image</label>
              <div className="mt-2">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 transition-colors"
                  accept="image/*"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg text-white transition-colors ${
                  loading 
                    ? 'bg-purple-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-teal-500'
                }`}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;