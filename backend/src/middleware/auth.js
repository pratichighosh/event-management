import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }

      const user = await User.findById(decoded.userId)
        .select('-password')
        .lean();

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found or has been deleted'
        });
      }

      if (user.isActive === false) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    next();
  };
};

export const rateLimit = {
  windowMs: 15 * 60 * 1000,
  max: 100
};

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};