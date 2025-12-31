import { motion } from "framer-motion";
import { Trophy, Swords, TrendingUp, User } from "lucide-react";
import type { Player } from "../types";

interface PlayerStatsProps {
  player: Player;
  detailed?: boolean;
}

/**
 * PlayerStats Component
 * Displays player statistics including wins, matches, and character usage
 */
const PlayerStats: React.FC<PlayerStatsProps> = ({
  player,
  detailed = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card"
    >
      {/* Player Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mk-yellow to-neon-red flex items-center justify-center">
          <User size={24} className="text-gray-950" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-mk-yellow">{player.name}</h3>
          <p className="text-sm text-gray-400">Fighter</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Matches Played */}
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <Swords size={24} className="mx-auto mb-2 text-neon-blue" />
          <div className="text-2xl font-bold text-white">
            {player.matchesPlayed}
          </div>
          <div className="text-xs text-gray-400 uppercase">Matches</div>
        </div>

        {/* Wins */}
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <Trophy size={24} className="mx-auto mb-2 text-mk-yellow" />
          <div className="text-2xl font-bold text-white">{player.wins}</div>
          <div className="text-xs text-gray-400 uppercase">Wins</div>
        </div>

        {/* Win Rate */}
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <TrendingUp size={24} className="mx-auto mb-2 text-mk-green" />
          <div className="text-2xl font-bold text-white">{player.winRate}%</div>
          <div className="text-xs text-gray-400 uppercase">Win Rate</div>
        </div>
      </div>

      {/* Character Usage (if detailed) */}
      {detailed &&
        player.charactersUsedArray &&
        player.charactersUsedArray.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-bold text-gray-300 mb-3">
              Character Usage
            </h4>
            <div className="space-y-2">
              {player.charactersUsedArray.slice(0, 5).map((char, index) => (
                <div
                  key={char.character}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-mk-yellow font-bold text-sm">
                      #{index + 1}
                    </span>
                    <span className="text-white font-medium">
                      {char.character}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {char.usage} times
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
    </motion.div>
  );
};

export default PlayerStats;
