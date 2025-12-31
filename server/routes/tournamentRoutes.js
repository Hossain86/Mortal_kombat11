import express from 'express';
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentStats
} from '../controllers/tournamentController.js';

const router = express.Router();

// Base tournament routes
router.route('/')
  .get(getAllTournaments)
  .post(createTournament);

router.route('/:id')
  .get(getTournamentById)
  .put(updateTournament)
  .delete(deleteTournament);

// Tournament statistics
router.get('/:id/stats', getTournamentStats);

export default router;
