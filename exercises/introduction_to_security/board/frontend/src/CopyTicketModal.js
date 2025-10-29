import './App.css';
import { useEffect, useState, useContext } from 'react';
import { BoardContext } from './BoardContext';

function CopyTicketModal({visible, onCopyTickets, onExit, getAllTickets}) {
    const [allTickets, setAllTickets] = useState([])
    const [copyDisabled, setCopyDisabled] = useState(false)
    const [copyAllowed, setCopyAllowed] = useState(true)
    const [selectedTickets, setSelectedTickets] = useState([])
    const board = useContext(BoardContext);

    // On visibility change, enable the button
    useEffect(() => setCopyDisabled(false), [visible])
    useEffect(() => {
        getAllTickets((tickets) => {
            // Filter unique entries only
            setAllTickets([...new Set(tickets)])
        })
    }, [getAllTickets])

    function onTicketSelect(e) {
        const values = [...e.target.selectedOptions].map(opt => opt.value);
        setSelectedTickets(values)
    }

    function copyTickets() {
        // Only call callback if selected > 0
        if (selectedTickets.length == 0)
            return

        var allowed = true;
        selectedTickets.forEach((ticket) => {
            // TODO: breaks
            if (!board['tickets'].includes(ticket))
                allowed = false;
        })

        if (!allowed) {
            setCopyAllowed(false)
            return;
        }

        setCopyDisabled(true)
        onCopyTickets(selectedTickets).then((resp) => {
            setSelectedTickets([])
        })
    }

    if (visible) {
        return (
            <div className="modal">
                {!copyAllowed &&
                    <div className="error">
                        Permission denied: can't copy tickets from boards you don't own!
                    </div>
                }

                <h3>Available tickets to copy:</h3>

                <select name="ticket" onChange={onTicketSelect} multiple>
                    {
                        allTickets.map(ticket =>
                            <option>{ticket}</option>
                        )
                    }
                </select>

                <div className="controls">
                    <button onClick={copyTickets} disabled={copyDisabled}>Copy Tickets to Board</button>
                    <button onClick={onExit}>Exit</button>
                </div>
            </div>
        )
    }
}

export default CopyTicketModal
