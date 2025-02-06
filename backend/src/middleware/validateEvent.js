export const validateEvent = (req, res, next) => {
    const { title, description, date, location, category } = req.body;
  
    if (!title || !description || !date || !location || !category) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }
  
    const eventDate = new Date(date);
    if (eventDate < new Date()) {
      return res.status(400).json({
        message: 'Event date must be in the future'
      });
    }
  
    next();
  };