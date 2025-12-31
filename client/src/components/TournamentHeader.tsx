import { motion } from "framer-motion";
import { Trophy, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tournament } from "../types";
import { format } from "../utils/dateUtils";

interface TournamentHeaderProps {
  tournament: Tournament;
}

/**
 * TournamentHeader Component
 * Displays tournament title, status, and navigation
 */
const TournamentHeader: React.FC<TournamentHeaderProps> = ({ tournament }) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    switch (tournament.status) {
      case "live":
        return <span className="badge-live text-lg px-4 py-2">🔴 LIVE</span>;
      case "ended":
        return <span className="badge-ended text-lg px-4 py-2">ENDED</span>;
      case "upcoming":
        return (
          <span className="badge-upcoming text-lg px-4 py-2">UPCOMING</span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-400 hover:text-mk-yellow transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Tournaments</span>
      </button>

      {/* Tournament Title and Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="title-neon">{tournament.name}</h1>
        {getStatusBadge()}
      </div>

      {/* Tournament Info */}
      <div className="flex flex-wrap gap-6 text-gray-400">
        <div>
          <span className="text-gray-500 text-sm">Start: </span>
          <span className="text-white">{format(tournament.startTime)}</span>
        </div>
        {tournament.endTime && (
          <div>
            <span className="text-gray-500 text-sm">End: </span>
            <span className="text-white">{format(tournament.endTime)}</span>
          </div>
        )}
      </div>

      {/* Winner Banner (if tournament ended) */}
      {tournament.status === "ended" && tournament.winner && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 p-6 bg-gradient-to-r from-mk-yellow/20 to-transparent border-2 border-mk-yellow rounded-xl"
        >
          <div className="flex items-center gap-4">
            <Trophy size={40} className="text-mk-yellow" />
            <div>
              <div className="text-sm text-gray-400 uppercase">
                Tournament Champion
              </div>
              <div className="text-3xl font-black text-mk-yellow">
                {typeof tournament.winner === "object"
                  ? tournament.winner.name
                  : "Unknown"}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TournamentHeader;
