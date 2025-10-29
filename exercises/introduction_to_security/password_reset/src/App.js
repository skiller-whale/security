import './App.css';
import Controls from './Controls';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Password Reset</h1>
        <h2>The Insecure Password Reset Service</h2>
      </header>

      <div className="app-body">
        <Controls/>
      </div>
    </div>
  );
}

export default App
