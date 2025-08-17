import React, { useEffect } from 'react';
import TreemapVisualization from './components/TreemapVisualization';
import './styles/app.css';

function App() {
  useEffect(() => {
    // Add any global app initialization here
  }, []);

  return (
    <div className="app">
      <TreemapVisualization />
    </div>
  );
}

export default App;