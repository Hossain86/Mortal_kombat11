import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Swords } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PlayerStats from "../components/PlayerStats";
import MatchCard from "../components/MatchCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { playerAPI } from "../services/api";
import type { Player, Match } from "../types";

/**
 * PlayerProfile Page
 * Shows detailed player statistics and match history
 */
const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPlayerData();
    }
  }, [id]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch player details and matches in parallel
      const [playerResponse, matchesResponse] = await Promise.all([
        playerAPI.getById(id!),
        playerAPI.getMatches(id!),
      ]);

      setPlayer(playerResponse.data!);
      setMatches(matchesResponse.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch player data");
      toast.error("Failed to load player profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading player profile..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPlayerData} />;
  if (!player) return <ErrorMessage message="Player not found" />;

  return (
    <div className="page-container">
      <Toaster position="top-right" />

      <div className="content-wrapper">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-mk-yellow transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Player Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="title-neon mb-2">{player.name}</h1>
          <p className="text-gray-400">
            Tournament:{" "}
            {typeof player.tournament === "object"
              ? player.tournament.name
              : "Unknown"}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statistics Section */}
          <div>
            <PlayerStats player={player} detailed={true} />

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card mt-6"
            >
              <h3 className="text-xl font-bold text-gray-300 mb-4">
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Matches Played</span>
                  <span className="text-white font-bold text-lg">
                    {player.matchesPlayed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Wins</span>
                  <span className="text-mk-green font-bold text-lg">
                    {player.wins}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Losses</span>
                  <span className="text-red-400 font-bold text-lg">
                    {player.matchesPlayed - player.wins}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                  <span className="text-gray-400">Win Rate</span>
                  <span
                    className={`font-bold text-lg ${
                      player.winRate >= 60
                        ? "text-mk-green"
                        : player.winRate >= 40
                        ? "text-mk-yellow"
                        : "text-red-400"
                    }`}
                  >
                    {player.winRate}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Match History Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Swords size={28} className="text-neon-red" />
              <h2 className="text-3xl font-bold text-white">Match History</h2>
              <span className="badge bg-gray-700 text-gray-300">
                {matches.length}
              </span>
            </div>

            {matches.length === 0 ? (
              <div className="card text-center py-12">
                <Swords size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No matches played yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <motion.div
                    key={match._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MatchCard match={match} showActions={false} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
