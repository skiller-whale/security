import './App.css';
import { useEffect, useState } from 'react';

function AddTicketModal({visible, onAddNewTicket, onExit}) {
    const [ticketName, setTicketName] = useState('')
    const [addDisabled, setAddDisabled] = useState(false)

    // On visibility change, enable the button
    useEffect(() => setAddDisabled(false), [visible])

    function addTicket() {
        // Only call callback if the ticket length > 0
        if (ticketName.length > 0) {
            setAddDisabled(true)

            onAddNewTicket(ticketName).then((resp) => {
                setTicketName('')
            })
        }
    }

    if (visible) {
        return (
            <div className="modal">
                <h3>Add Ticket</h3>
                <input
                    value={ticketName}
                    onChange={e => setTicketName(e.target.value)}
                    autoComplete="off"
                    name="ticket-name" type="text"
                    placeholder="New Ticket Name"
                    />

                <div className="controls">
                    <button onClick={addTicket} disabled={addDisabled}>Add Ticket</button>
                    <button onClick={onExit}>Exit</button>
                </div>
            </div>
        )
    }
}

export default AddTicketModal
