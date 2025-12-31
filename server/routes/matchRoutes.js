import express from 'express';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  completeMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController.js';

const router = express.Router();

// Base match routes
router.route('/')
  .get(getAllMatches)
  .post(createMatch);

router.route('/:id')
  .get(getMatchById)
  .put(updateMatch)
  .delete(deleteMatch);

// Complete match and declare winner
router.put('/:id/complete', completeMatch);

export default router;
