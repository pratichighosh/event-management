import express from 'express';
import multer from 'multer';
import { createEvent, getEvents, joinEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';
import { validateEvent } from '../middleware/validateEvent.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.route('/')
  .post(protect, upload.single('image'), validateEvent, createEvent)
  .get(getEvents);

router.post('/:id/join', protect, joinEvent);

export default router;