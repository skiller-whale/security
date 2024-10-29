function Whales({ whales, info, error }) {
    return (
        <div className="results">
            { info.length === 0 ? null : (
                <div className="info">{info}</div>
            )}

            { error.length === 0 ? null : (
                <div className="error">{error}</div>
            )}


            { whales.length === 0 ? (
                <div className="results-label">Load whales to show results here.</div>
            ) : (
                <div className="results-label">Whale results:</div>
            )}

            <ul>
                {
                    whales.map((whale_name, index) =>
                        <li key={index} dangerouslySetInnerHTML={{__html: whale_name}}></li>
                    )
                }
            </ul>
        </div>
    )
}

export default Whales
