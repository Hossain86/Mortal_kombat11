import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trophy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TournamentCard from "../components/TournamentCard";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { tournamentAPI } from "../services/api";
import type { Tournament } from "../types";

/**
 * TournamentList Page
 * Displays all tournaments and allows creating new ones
 */
const TournamentList: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    status: "upcoming" as "upcoming" | "live" | "ended",
    startTime: "",
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentAPI.getAll();
      setTournaments(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch tournaments");
      toast.error("Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await tournamentAPI.create(formData);
      toast.success("Tournament created successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", status: "upcoming", startTime: "" });
      fetchTournaments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create tournament");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteTournament = async () => {
    if (!deleteConfirmId) return;

    try {
      await tournamentAPI.delete(deleteConfirmId);
      toast.success("Tournament deleted successfully!");
      setDeleteConfirmId(null);
      fetchTournaments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete tournament");
    }
  };

  if (loading) return <Loading message="Loading tournaments..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTournaments} />;

  return (
    <div className="page-container">
      <Toaster position="top-right" />

      <div className="content-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Trophy size={48} className="text-mk-yellow" />
              <h1 className="title-neon">Mortal Kombat Tournaments</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              New Tournament
            </button>
          </div>
          <p className="text-gray-400">
            Manage your Mortal Kombat 11 friend tournaments
          </p>
        </motion.div>

        {/* Tournament Grid */}
        {tournaments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Trophy size={64} className="text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              No Tournaments Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first tournament to get started
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              Create Tournament
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament, index) => (
              <motion.div
                key={tournament._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TournamentCard
                  tournament={tournament}
                  onClick={() => navigate(`/tournament/${tournament._id}`)}
                  onDelete={(id) => setDeleteConfirmId(id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Tournament Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Tournament"
      >
        <form onSubmit={handleCreateTournament} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter tournament name"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Time *
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Create Tournament
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Tournament"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this tournament? This will also
            delete all associated players and matches. This action cannot be
            undone.
          </p>
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTournament}
              className="flex-1 btn-danger"
            >
              Delete Tournament
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TournamentList;
