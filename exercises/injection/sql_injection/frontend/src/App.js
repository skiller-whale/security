import './App.css';
import Order from './order'
function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Order Summary</h1>
      </header>

      <div className="app-body">
        <Order />
      </div>
    </div>
  );
}

export default App
