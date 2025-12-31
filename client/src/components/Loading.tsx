import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

/**
 * Loading Component
 * Full-screen loading indicator
 */
const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="page-container flex items-center justify-center">
      <div className="text-center">
        <Loader2
          size={64}
          className="text-mk-yellow animate-spin mx-auto mb-4"
        />
        <p className="text-xl text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
