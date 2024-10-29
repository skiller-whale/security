import { useState } from 'react';

function Controls({
    getAllWhales, getRandomWhale, addWhale
}) {
    const [controlsDisabled, setControlsDisabled] = useState(false)
    const [whaleName, setWhaleName] = useState('')

    async function submitForm(e) {
      e.preventDefault();
      setControlsDisabled(true)
      
      await addWhale(whaleName)

      // reset form
      setWhaleName('')
      setControlsDisabled(false)
    }

    async function awaitHandler(func) {
      setControlsDisabled(true)
      await func()
      setControlsDisabled(false)
    }

    return (
        <div className="controls">
          <button 
            onClick={awaitHandler.bind(this, getRandomWhale)}
            disabled={controlsDisabled}>
              Get Random Whale
          </button>
          <button
            onClick={awaitHandler.bind(this, getAllWhales)}
            disabled={controlsDisabled}>
              Get All Whales
          </button>

          {/* <div className="add-whale"> */}
          <form className="add-whale" method="post" onSubmit={submitForm}>
            <input
              value={whaleName}
              onChange={e => setWhaleName(e.target.value)}
              autoComplete="off"
              name="whaleName" type="text"
              className="whale-input" placeholder="Whale Name"
            />
            <button type="submit" disabled={controlsDisabled}>Add Whale</button>
          </form>
        </div>
    )
}

export default Controls
