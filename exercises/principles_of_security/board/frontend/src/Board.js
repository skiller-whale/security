import './App.css';
import AddTicketModal from './AddTicketModal';
import CopyTicketModal from './CopyTicketModal';
import { useEffect, useState } from 'react';
import { BoardContext } from './BoardContext';

const TOKEN = 'christian_whale_token'

function getTickets(onGetTickets) {
    fetch('http://localhost:2001/tickets', {
        headers: {
            "Authorization": "Bearer christian_whale_token"
        }
    })
    .then(res => res.json())
    .then((tickets) => onGetTickets(tickets))
}

function getBoard(onGetBoard, token) {
    return fetch('http://localhost:2001/boards', {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then((board) => onGetBoard(board))
}

function postTickets(tickets, token) {
    return fetch('http://localhost:2001/tickets', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json"
        },
        body: JSON.stringify({"tickets": tickets})
    })
}

function Board() {
    const [board, setBoard] = useState({})

    const [copyModalVisible, setCopyModalVisible] = useState(false)
    const [addModalVisible, setAddModalVisible] = useState(false)

    useEffect(() => { getBoard(setBoard, TOKEN) }, [])

    function renderTickets() {
        var tickets = board['tickets']

        if (!tickets || tickets.length === 0)
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
        // if (!hasBoard) return;

        return (
            <div className="board">
                <h4>{board['name']}</h4>
                {renderTickets()}
            </div>
        );
    }

    function addTickets(tickets, setVisiblity) {
        return postTickets(tickets, TOKEN)
            .then((r) => getBoard(setBoard, TOKEN))
            .then((r) => setVisiblity(false));
    }

    function modalVisible() {
        return copyModalVisible || addModalVisible;
    }

    return (
        <section className="board-wrap">
            <div className="board-header">
                <h3>Your Boards</h3>
            </div>

            <div className="boards">
                { renderBoard() }
            </div>

            <div className="board-controls">
                <button disabled={modalVisible()} onClick={(e) => setAddModalVisible(true)}>Add Ticket</button>
                <button disabled={modalVisible()} onClick={(e) => setCopyModalVisible(true)}>Copy Tickets</button>
            </div>

            {/* modals */}

            <BoardContext.Provider value={board}>
                <CopyTicketModal
                    visible={copyModalVisible}
                    onCopyTickets={(tickets) => addTickets(tickets, setCopyModalVisible)}
                    onExit={() => setCopyModalVisible(false)}
                    getAllTickets={(onGetTickets) => getTickets(onGetTickets, TOKEN)}
                />
            </BoardContext.Provider>

            <AddTicketModal
                visible={addModalVisible}
                onAddNewTicket={(ticket) => addTickets([ticket], setAddModalVisible)}
                onExit={() => setAddModalVisible(false)}
            />
        </section>
    );
}

export default Board
