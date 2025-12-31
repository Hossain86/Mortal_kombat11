import { motion } from "framer-motion";
import { Trophy, Swords, Trash2, Edit2 } from "lucide-react";
import type { Match } from "../types";
import { format } from "../utils/dateUtils";

interface MatchCardProps {
  match: Match;
  onComplete?: (matchId: string, winnerId: string) => void;
  onDelete?: (matchId: string) => void;
  onEdit?: (match: Match) => void;
  showActions?: boolean;
}

/**
 * MatchCard Component
 * Displays match details with player names, characters, and status badges
 */
const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onComplete,
  onDelete,
  onEdit,
  showActions = false,
}) => {
  const handleSelectWinner = (winnerId: string) => {
    if (onComplete && match.status === "live") {
      onComplete(match._id, winnerId);
    }
  };

  const getStatusBadge = () => {
    if (match.status === "live") {
      return (
        <motion.span
          className="badge-live relative"
          animate={{
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.span
            className="absolute inset-0 bg-red-500 rounded-full blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="relative z-10">🔴 LIVE</span>
        </motion.span>
      );
    }
    return <span className="badge-ended">ENDED</span>;
  };

  const getMatchTypeBadge = () => {
    if (match.matchType === "final") {
      return (
        <span className="badge-final flex items-center gap-1">
          <Trophy size={14} />
          FINAL
        </span>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card"
    >
      {/* Header with badges */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {getStatusBadge()}
          {getMatchTypeBadge()}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {format(match.createdAt)}
          </span>
          {onEdit && (
            <button
              onClick={() => onEdit(match)}
              className="p-1 hover:bg-blue-600/20 rounded transition-colors text-blue-500 hover:text-blue-400"
              title="Edit match"
            >
              <Edit2 size={14} />
            </button>
          )}
          {onDelete && match.status === "live" && (
            <button
              onClick={() => onDelete(match._id)}
              className="p-1 hover:bg-red-600/20 rounded transition-colors text-red-500 hover:text-red-400"
              title="Delete match"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Match Layout */}
      <div className="flex items-center justify-between">
        {/* Player 1 */}
        <div
          className={`flex-1 ${
            match.winner?._id === match.player1._id
              ? "opacity-100"
              : match.status === "completed"
              ? "opacity-50"
              : "opacity-100"
          }`}
        >
          <div className="text-center">
            <div className="text-xl font-bold text-mk-blue mb-2">
              {match.player1.name}
            </div>
            <div className="text-sm text-gray-400 mb-2">
              {match.player1Character}
            </div>
            {match.winner?._id === match.player1._id && (
              <div className="flex items-center justify-center gap-1 text-mk-yellow">
                <Trophy size={16} />
                <span className="text-xs font-bold">WINNER</span>
              </div>
            )}
            {showActions && match.status === "live" && (
              <button
                onClick={() => handleSelectWinner(match.player1._id)}
                className="mt-2 btn-secondary text-xs py-2"
              >
                Declare Winner
              </button>
            )}
          </div>
        </div>

        {/* VS Divider */}
        <div className="px-6">
          <div className="flex flex-col items-center">
            <Swords size={32} className="text-neon-red mb-2" />
            <span className="text-2xl font-black text-gray-600">VS</span>
          </div>
        </div>

        {/* Player 2 */}
        <div
          className={`flex-1 ${
            match.winner?._id === match.player2._id
              ? "opacity-100"
              : match.status === "completed"
              ? "opacity-50"
              : "opacity-100"
          }`}
        >
          <div className="text-center">
            <div className="text-xl font-bold text-neon-purple mb-2">
              {match.player2.name}
            </div>
            <div className="text-sm text-gray-400 mb-2">
              {match.player2Character}
            </div>
            {match.winner?._id === match.player2._id && (
              <div className="flex items-center justify-center gap-1 text-mk-yellow">
                <Trophy size={16} />
                <span className="text-xs font-bold">WINNER</span>
              </div>
            )}
            {showActions && match.status === "live" && (
              <button
                onClick={() => handleSelectWinner(match.player2._id)}
                className="mt-2 btn-secondary text-xs py-2"
              >
                Declare Winner
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
