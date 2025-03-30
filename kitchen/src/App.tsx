import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KitchenDashboard from './pages/KitchenDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KitchenDashboard />} />
      </Routes>
    </Router>
  );
}

export default App; 