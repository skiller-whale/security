import './App.css';
import Board from './Board';
import Profile from './Profile';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Project Manager</h1>
        <h2>The Insecure Project Management Service</h2>
      </header>

      <div className="app-body">
        <Board/>
        <Profile/>
      </div>
    </div>
  );
}

export default App
