import React from 'react';

function CounterPanel({ counter, onCallNext, onComplete, loading }) {
    return (
        <div className="card">
            {/* Counter header */}
            <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#1a1a2e' }}>{counter.name}</h3>
                <span className={`badge badge-${counter.status.toLowerCase()}`}>
                    {counter.status}
                </span>
            </div>

            {/* Service type */}
            {counter.currentServiceType && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem',
                    background: '#f0f2f5', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                        Serving: </span>
                    <strong>{counter.currentServiceType.name}</strong>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => onCallNext(counter.id)}
                    disabled={loading || counter.status === 'OFFLINE'}
                    style={{ flex: 1 }}
                >
                    Next Token
                </button>

                <button
                    className="btn btn-success"
                    onClick={() => {
                        // Find current serving token ID
                        // We'll need to add this to the counter response
                        alert('Complete token — coming soon');
                    }}
                    disabled={loading}
                    style={{ flex: 1 }}
                >
                    Complete ✓
                </button>
            </div>
        </div>
    );
}

export default CounterPanel;