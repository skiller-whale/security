import './App.css';
import { useState } from 'react';

function Board() {
  const [hasBoard, setHasBoard] = useState(false)
  const [board, setBoard] = useState({})
  const [tickets, setTickets] = useState(["An example ticket"])

  // TODO: extract modals to components
  const [copyAllowed, setCopyAllowed] = useState(true)
  const [selectedTickets, setSelectedTickets] = useState([])
  const [copyModalVisible, setCopyModalVisible] = useState(false)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [newTicketName, setNewTicketName] = useState('')

  function createBoard() {
    setHasBoard(true)
    setBoard({
      'name': 'Project Board 1'
    })
  }

  function renderTickets() {
    if (tickets.length == 0)
      return <span>No tickets</span>

    const lis = tickets.map(ticket =>
      <li>{ticket}</li>
    )

    return (
      <ul className="tickets">
        {lis}
      </ul>
    )
  }

  function renderBoard() {
    if (!hasBoard) return;

    return (
      <div className="board">
        <h4>{board['name']}</h4>
        {renderTickets()}
      </div>
    );
  }

  function onTicketSelect(e) {
    const values = [...e.target.selectedOptions].map(opt => opt.value);
    setSelectedTickets(values)
  }
  
  function copyTickets() {
    var allowed = true;

    selectedTickets.forEach((ticket) => {
      // TODO: breaks
      if (!tickets.includes(ticket))
        allowed = false;
    })

    if (!allowed) {
      setCopyAllowed(false)
    } else {
      setCopyAllowed(true)
      setTickets(tickets.concat(selectedTickets))
      setCopyModalVisible(false)
    }
  }

  function exitCopyModal() {
    setCopyModalVisible(false)
    setCopyAllowed(true)
  }

  function addTicket() {
    if (newTicketName.length > 0) {
      setTickets([...tickets, newTicketName])
      setNewTicketName('')
      setAddModalVisible(false)
    }
  }

  function modalVisible() {
    return copyModalVisible || addModalVisible;
  }

  return (
    <section className="board-wrap">
        <div className="board-header">
          <h3>Your Boards</h3>
          <em>Board limit: {hasBoard ? 1 : 0}/1</em>
        </div>

        <div className="boards">
          { renderBoard() }
        </div>

        <div className="board-controls">
          <button disabled={hasBoard || modalVisible()} onClick={createBoard}>Create New Board</button>
          <button disabled={!hasBoard || modalVisible()} onClick={(e) => setAddModalVisible(true)}>Add Ticket</button>
          <button disabled={!hasBoard || modalVisible()} onClick={(e) => setCopyModalVisible(true)}>Copy Tickets</button>
        </div>
        
        {/* modals */}
        {copyModalVisible &&
        <div className="modal">
          {!copyAllowed &&
            <div className="error">
              Permission denied: can't copy tickets from boards you don't own!
            </div>
          }

          <h3>Tickets from other boards:</h3>

          <select name="ticket" onChange={onTicketSelect} multiple>
            {
              tickets.map(ticket =>
                <option>{ticket}</option>
              )
            }
            <option>Super Secret ticket from 'Admin Board'</option>
            <option>A ticket from 'Dev Board'</option>
          </select>

          <div className="controls">
            <button onClick={copyTickets}>Copy Tickets to Board</button>
            <button onClick={exitCopyModal}>Exit</button>
          </div>
        </div>
        }

        {addModalVisible &&
        <div className="modal">
          <h3>Add Ticket</h3>
          <input
              value={newTicketName}
              onChange={e => setNewTicketName(e.target.value)}
              autoComplete="off"
              name="ticket-name" type="text"
              placeholder="New Ticket Name"
            />

          <div className="controls">
            <button onClick={addTicket}>Add Ticket</button>
            <button onClick={(e) => setAddModalVisible(false)}>Exit</button>
          </div>
        </div>
        }
    </section>
  );
}

export default Board
