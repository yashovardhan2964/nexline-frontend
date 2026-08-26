import React from 'react';

function TokenCard({ token, predictedWait, queuePosition }) {
    return (
        <div className="card">
            {/* Token number display */}
            <div className="token-display">
                <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                    YOUR TOKEN NUMBER
                </div>
                <div className="token-number">{token.displayToken}</div>
                <div className="token-info">
                    <span className={`badge badge-${token.priority.toLowerCase()}`}>
                        {token.priority}
                    </span>
                </div>
            </div>

            {/* Queue info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1rem'
            }}>
                <div style={{ textAlign: 'center', padding: '1rem',
                    background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold',
                        color: '#1a1a2e' }}>
                        {queuePosition || '—'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Position in Queue
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '1rem',
                    background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold',
                        color: '#00d4ff' }}>
                        {predictedWait ? `${predictedWait}m` : '—'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Est. Wait Time
                    </div>
                </div>
            </div>

            {/* Status */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <span className={`badge badge-${token.status.toLowerCase()}`}>
                    {token.status}
                </span>
            </div>
        </div>
    );
}

export default TokenCard;