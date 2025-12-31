import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Users, Swords } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TournamentHeader from "../components/TournamentHeader";
import MatchCard from "../components/MatchCard";
import PlayerStats from "../components/PlayerStats";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { tournamentAPI, playerAPI, matchAPI } from "../services/api";
import type { Tournament, Player, Match } from "../types";
import { MK11_CHARACTERS } from "../types";

/**
 * TournamentDetails Page
 * Shows tournament details, players, and matches
 * Allows adding players and matches
 */
const TournamentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isEditTournamentOpen, setIsEditTournamentOpen] = useState(false);
  const [isEditMatchOpen, setIsEditMatchOpen] = useState(false);

  // Form states
  const [playerName, setPlayerName] = useState("");
  const [editTournamentForm, setEditTournamentForm] = useState({
    name: "",
    status: "upcoming" as "upcoming" | "live" | "ended",
  });
  const [matchForm, setMatchForm] = useState({
    player1: "",
    player2: "",
    player1Character: "",
    player2Character: "",
    matchType: "normal" as "normal" | "final",
    status: "live" as "live" | "completed",
    winner: "",
  });
  const [editMatchForm, setEditMatchForm] = useState({
    matchId: "",
    player1: "",
    player2: "",
    player1Character: "",
    player2Character: "",
    matchType: "normal" as "normal" | "final",
    status: "live" as "live" | "completed",
    winner: "",
  });

  useEffect(() => {
    if (id) {
      fetchTournament();
    }
  }, [id]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentAPI.getById(id!);
      setTournament(response.data!);
      // Update edit form with current tournament data
      setEditTournamentForm({
        name: response.data!.name,
        status: response.data!.status,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch tournament");
      toast.error("Failed to load tournament");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await playerAPI.create({ name: playerName, tournament: id! });
      toast.success(`${playerName} added to tournament!`);
      setPlayerName("");
      setIsPlayerModalOpen(false);
      fetchTournament();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add player");
    }
  };

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (matchForm.player1 === matchForm.player2) {
      toast.error("Players must be different");
      return;
    }

    if (matchForm.status === "completed" && !matchForm.winner) {
      toast.error("Please select a winner for completed match");
      return;
    }

    try {
      const matchData: any = {
        tournament: id!,
        player1: matchForm.player1,
        player2: matchForm.player2,
        player1Character: matchForm.player1Character,
        player2Character: matchForm.player2Character,
        matchType: matchForm.matchType,
        status: matchForm.status,
      };

      // Only include winner if status is completed
      if (matchForm.status === "completed") {
        matchData.winner = matchForm.winner;
      }

      await matchAPI.create(matchData);
      toast.success("Match created successfully!");
      setMatchForm({
        player1: "",
        player2: "",
        player1Character: "",
        player2Character: "",
        matchType: "normal",
        status: "live",
        winner: "",
      });
      setIsMatchModalOpen(false);
      fetchTournament();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create match");
    }
  };

  const handleCompleteMatch = async (matchId: string, winnerId: string) => {
    try {
      const response = await matchAPI.complete(matchId, winnerId);
      toast.success(response.message || "Match completed!");
      fetchTournament();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete match");
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
      await matchAPI.delete(matchId);
      toast.success("Match deleted successfully!");
      fetchTournament();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete match");
    }
  };

  const handleEditTournament = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await tournamentAPI.update(id!, editTournamentForm);
      toast.success("Tournament updated successfully!");
      setIsEditTournamentOpen(false);
      fetchTournament();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update tournament");
    }
  };

  const handleOpenEditMatch = (match: Match) => {
    setEditMatchForm({
      matchId: match._id,
      player1: match.player1._id,
      player2: match.player2._id,
      player1Character: match.player1Character,
      player2Character: match.player2Character,
      matchType: match.matchType,
      status: match.status,
      winner: match.winner?._id || "",
    });
    setIsEditMatchOpen(true);
  };

  const handleEditMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { matchId, ...updateData } = editMatchForm;
      // Type assertion needed because API accepts string IDs that get converted to Player references
      await matchAPI.update(matchId, updateData as any);
      toast.success("Match updated successfully!");
      setIsEditMatchOpen(false);
      fetchTournament();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update match");
    }
  };

  const handleMatchFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setMatchForm({
      ...matchForm,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <Loading message="Loading tournament..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTournament} />;
  if (!tournament) return <ErrorMessage message="Tournament not found" />;

  const players = tournament.players || [];
  const matches = tournament.matches || [];

  return (
    <div className="page-container">
      <Toaster position="top-right" />

      <div className="content-wrapper">
        {/* Tournament Header */}
        <TournamentHeader tournament={tournament} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setIsEditTournamentOpen(true)}
            className="btn-secondary flex items-center gap-2"
          >
            Edit Tournament
          </button>
          <button
            onClick={() => setIsPlayerModalOpen(true)}
            className="btn-primary flex items-center gap-2"
            disabled={tournament.status === "ended"}
          >
            <Plus size={20} />
            Add Player
          </button>
          <button
            onClick={() => setIsMatchModalOpen(true)}
            className="btn-secondary flex items-center gap-2"
            disabled={tournament.status === "ended" || players.length < 2}
          >
            <Plus size={20} />
            Add Match
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Matches Section (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Swords size={28} className="text-neon-red" />
              <h2 className="text-3xl font-bold text-white">Matches</h2>
              <span className="badge bg-gray-700 text-gray-300">
                {matches.length}
              </span>
            </div>

            {matches.length === 0 ? (
              <div className="card text-center py-12">
                <Swords size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No matches yet</p>
                <p className="text-gray-600 text-sm mt-2">
                  Add players first, then create matches
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match: Match) => (
                  <MatchCard
                    key={match._id}
                    match={match}
                    onComplete={handleCompleteMatch}
                    onDelete={handleDeleteMatch}
                    onEdit={handleOpenEditMatch}
                    showActions={tournament.status !== "ended"}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Players Section (1/3 width) */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Users size={28} className="text-mk-blue" />
              <h2 className="text-3xl font-bold text-white">Players</h2>
              <span className="badge bg-gray-700 text-gray-300">
                {players.length}
              </span>
            </div>

            {players.length === 0 ? (
              <div className="card text-center py-12">
                <Users size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No players yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...players]
                  .sort((a: Player, b: Player) => b.wins - a.wins)
                  .map((player: Player, index: number) => (
                    <motion.div
                      key={player._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="relative">
                        {index === 0 &&
                          players.length > 1 &&
                          player.wins > 0 && (
                            <div className="absolute -top-2 -left-2 z-10 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              👑 #1
                            </div>
                          )}
                        <PlayerStats player={player} />
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Player Modal */}
      <Modal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        title="Add New Player"
      >
        <form onSubmit={handleAddPlayer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Player Name *
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input-field"
              placeholder="Enter player name"
              required
              minLength={2}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsPlayerModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Add Player
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Tournament Modal */}
      <Modal
        isOpen={isEditTournamentOpen}
        onClose={() => setIsEditTournamentOpen(false)}
        title="Edit Tournament"
      >
        <form onSubmit={handleEditTournament} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Name *
            </label>
            <input
              type="text"
              value={editTournamentForm.name}
              onChange={(e) =>
                setEditTournamentForm({
                  ...editTournamentForm,
                  name: e.target.value,
                })
              }
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={editTournamentForm.status}
              onChange={(e) =>
                setEditTournamentForm({
                  ...editTournamentForm,
                  status: e.target.value as "upcoming" | "live" | "ended",
                })
              }
              className="input-field"
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsEditTournamentOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Update Tournament
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Match Modal */}
      <Modal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        title="Create New Match"
      >
        <form onSubmit={handleAddMatch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Player 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 1 *
              </label>
              <select
                name="player1"
                value={matchForm.player1}
                onChange={handleMatchFormChange}
                className="input-field"
                required
              >
                <option value="">Select Player 1</option>
                {players.map((player: Player) => (
                  <option key={player._id} value={player._id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Player 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 2 *
              </label>
              <select
                name="player2"
                value={matchForm.player2}
                onChange={handleMatchFormChange}
                className="input-field"
                required
              >
                <option value="">Select Player 2</option>
                {players.map((player: Player) => (
                  <option key={player._id} value={player._id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Player 1 Character */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 1 Character *
              </label>
              <select
                name="player1Character"
                value={matchForm.player1Character}
                onChange={handleMatchFormChange}
                className="input-field"
                required
              >
                <option value="">Select Character</option>
                {MK11_CHARACTERS.map((character) => (
                  <option key={character} value={character}>
                    {character}
                  </option>
                ))}
              </select>
            </div>

            {/* Player 2 Character */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 2 Character *
              </label>
              <select
                name="player2Character"
                value={matchForm.player2Character}
                onChange={handleMatchFormChange}
                className="input-field"
                required
              >
                <option value="">Select Character</option>
                {MK11_CHARACTERS.map((character) => (
                  <option key={character} value={character}>
                    {character}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Match Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Match Type *
              </label>
              <select
                name="matchType"
                value={matchForm.matchType}
                onChange={handleMatchFormChange}
                className="input-field"
                required
              >
                <option value="normal">Normal</option>
                <option value="final">Final</option>
              </select>
            </div>

            {/* Match Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={matchForm.status}
                onChange={handleMatchFormChange}
                className="input-field"
                required
              >
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Winner Selection (only show if status is completed) */}
          {matchForm.status === "completed" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Winner *
              </label>
              <select
                name="winner"
                value={matchForm.winner}
                onChange={handleMatchFormChange}
                className="input-field"
                required
              >
                <option value="">Select Winner</option>
                {matchForm.player1 && (
                  <option value={matchForm.player1}>
                    {players.find((p: Player) => p._id === matchForm.player1)
                      ?.name || "Player 1"}
                  </option>
                )}
                {matchForm.player2 && (
                  <option value={matchForm.player2}>
                    {players.find((p: Player) => p._id === matchForm.player2)
                      ?.name || "Player 2"}
                  </option>
                )}
              </select>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 text-sm text-yellow-200">
            <strong>Note:</strong> If match type is "Final", completing the
            match will automatically end the tournament and declare the winner
            as champion.
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsMatchModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Create Match
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Match Modal */}
      <Modal
        isOpen={isEditMatchOpen}
        onClose={() => setIsEditMatchOpen(false)}
        title="Edit Match"
      >
        <form onSubmit={handleEditMatch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Player 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 1 *
              </label>
              <select
                value={editMatchForm.player1}
                onChange={(e) =>
                  setEditMatchForm({
                    ...editMatchForm,
                    player1: e.target.value,
                  })
                }
                className="input-field"
                required
              >
                <option value="">Select Player 1</option>
                {players.map((player: Player) => (
                  <option key={player._id} value={player._id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Player 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 2 *
              </label>
              <select
                value={editMatchForm.player2}
                onChange={(e) =>
                  setEditMatchForm({
                    ...editMatchForm,
                    player2: e.target.value,
                  })
                }
                className="input-field"
                required
              >
                <option value="">Select Player 2</option>
                {players.map((player: Player) => (
                  <option key={player._id} value={player._id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Player 1 Character */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 1 Character *
              </label>
              <select
                value={editMatchForm.player1Character}
                onChange={(e) =>
                  setEditMatchForm({
                    ...editMatchForm,
                    player1Character: e.target.value,
                  })
                }
                className="input-field"
                required
              >
                <option value="">Select Character</option>
                {MK11_CHARACTERS.map((character) => (
                  <option key={character} value={character}>
                    {character}
                  </option>
                ))}
              </select>
            </div>

            {/* Player 2 Character */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 2 Character *
              </label>
              <select
                value={editMatchForm.player2Character}
                onChange={(e) =>
                  setEditMatchForm({
                    ...editMatchForm,
                    player2Character: e.target.value,
                  })
                }
                className="input-field"
                required
              >
                <option value="">Select Character</option>
                {MK11_CHARACTERS.map((character) => (
                  <option key={character} value={character}>
                    {character}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Match Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Match Type *
              </label>
              <select
                value={editMatchForm.matchType}
                onChange={(e) =>
                  setEditMatchForm({
                    ...editMatchForm,
                    matchType: e.target.value as "normal" | "final",
                  })
                }
                className="input-field"
                required
              >
                <option value="normal">Normal</option>
                <option value="final">Final</option>
              </select>
            </div>

            {/* Match Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={editMatchForm.status}
                onChange={(e) =>
                  setEditMatchForm({
                    ...editMatchForm,
                    status: e.target.value as "live" | "completed",
                  })
                }
                className="input-field"
                required
              >
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Winner Selection (only show if status is completed) */}
          {editMatchForm.status === "completed" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Winner *
              </label>
              <select
                value={editMatchForm.winner}
                onChange={(e) =>
                  setEditMatchForm({ ...editMatchForm, winner: e.target.value })
                }
                className="input-field"
                required
              >
                <option value="">Select Winner</option>
                {editMatchForm.player1 && (
                  <option value={editMatchForm.player1}>
                    {players.find(
                      (p: Player) => p._id === editMatchForm.player1
                    )?.name || "Player 1"}
                  </option>
                )}
                {editMatchForm.player2 && (
                  <option value={editMatchForm.player2}>
                    {players.find(
                      (p: Player) => p._id === editMatchForm.player2
                    )?.name || "Player 2"}
                  </option>
                )}
              </select>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 text-sm text-blue-200">
            <strong>Note:</strong> Editing a completed match will recalculate
            player stats automatically.
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsEditMatchOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Update Match
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TournamentDetails;
