import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TournamentList from "./pages/TournamentList";
import TournamentDetails from "./pages/TournamentDetails";
import PlayerProfile from "./pages/PlayerProfile";

/**
 * Main App Component
 * Sets up routing for the application
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TournamentList />} />
        <Route path="/tournament/:id" element={<TournamentDetails />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
