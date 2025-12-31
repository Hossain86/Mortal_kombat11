import express from 'express';
import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayerMatches
} from '../controllers/playerController.js';

const router = express.Router();

// Base player routes
router.route('/')
  .get(getAllPlayers)
  .post(createPlayer);

router.route('/:id')
  .get(getPlayerById)
  .put(updatePlayer)
  .delete(deletePlayer);

// Player match history
router.get('/:id/matches', getPlayerMatches);

export default router;
