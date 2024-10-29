import './App.css';
import Controls from './Controls';
import Whales from './Whales';
import { useState } from 'react';

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function App() {
  const [whales, setWhales] = useState([])
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const serverURL = `${window.location.protocol}//${window.location.host.replace(/(?<=[:-])[1-9][0-9][0-9][0-9]/,2001)}`

  function resetStatus() {
    setInfo('')
    setError('')
  }

  async function getAllWhales() {
    resetStatus()

    await fetch(`${serverURL}/whales`)
      .then((res => res.json()))
      .then(setWhales)
      .catch((err) => setError(`getAllWhales error: ${err.message}`))

    // rate-limit by waiting here
    await sleep(100)
  }

  async function getRandomWhale() {
    resetStatus()

    await fetch(`${serverURL}/whales/random`)
      .then((res) => res.text())
      .then((res) => setWhales([res]))
      .catch((err) => setError(`getRandomWhale error: ${err.message}`))

    // rate-limit by waiting here
    await sleep(100)
  }

  async function addWhale(whaleName) {
    if (whaleName.length === 0)
      return

    resetStatus()

    await fetch(`${serverURL}/whales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'whale_name': whaleName })
    })
      .then(getAllWhales)
      .then(() => setInfo(`Successfully added ${whaleName}`))
      .catch((err) => setError(`addWhale error: ${err.message}`))

    // rate-limit by waiting here
    await sleep(100)
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🐳 Skiller Whaler</h1>
        <h2>The Whale Editing Platform</h2>
      </header>

      <div className="app-body">
        <Controls
          getAllWhales={getAllWhales}
          getRandomWhale={getRandomWhale}
          addWhale={addWhale}
        />

        <Whales whales={whales} error={error} info={info}/>
      </div>
    </div>
  );
}

export default App
