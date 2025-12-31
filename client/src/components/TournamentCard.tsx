import { motion } from "framer-motion";
import { Trophy, Users, Swords, Calendar, Trash2 } from "lucide-react";
import type { Tournament } from "../types";
import { format } from "../utils/dateUtils";

interface TournamentCardProps {
  tournament: Tournament;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

/**
 * TournamentCard Component
 * Displays tournament overview with status badge and basic info
 */
const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onClick,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(tournament._id);
    }
  };
  const getStatusBadge = () => {
    switch (tournament.status) {
      case "live":
        return <span className="badge-live">🔴 LIVE</span>;
      case "ended":
        return <span className="badge-ended">ENDED</span>;
      case "upcoming":
        return <span className="badge-upcoming">UPCOMING</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="card cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-mk-yellow">{tournament.name}</h3>
        {getStatusBadge()}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-300">
          <Users size={18} className="text-mk-blue" />
          <span className="text-sm">
            {tournament.players?.length || 0} Players
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Swords size={18} className="text-neon-red" />
          <span className="text-sm">
            {tournament.matches?.length || 0} Matches
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
        <Calendar size={16} />
        <span>{format(tournament.startTime)}</span>
      </div>

      {/* Winner (if ended) */}
      {tournament.status === "ended" && tournament.winner && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
          <Trophy size={20} className="text-mk-yellow" />
          <span className="text-mk-yellow font-bold">
            Champion:{" "}
            {typeof tournament.winner === "object"
              ? tournament.winner.name
              : "Unknown"}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">Click to view details →</div>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-500 hover:text-red-400"
            title="Delete tournament"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TournamentCard;
