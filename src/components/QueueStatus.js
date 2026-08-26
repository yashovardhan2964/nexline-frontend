import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { getQueueStatus } from '../api/api';

function QueueStatus({ tokenId, serviceTypePrefix }) {
    const [position, setPosition] = useState(null);
    const [totalWaiting, setTotalWaiting] = useState(null);
    const [connected, setConnected] = useState(false);
    const [lastEvent, setLastEvent] = useState(null);

    // Fetch initial queue status
    useEffect(() => {
        getQueueStatus(serviceTypePrefix, tokenId)
            .then(res => {
                setPosition(res.data.position);
                setTotalWaiting(res.data.totalWaiting);
            })
            .catch(console.error);
    }, [tokenId, serviceTypePrefix]);

    // Connect to WebSocket for live updates
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () =>
                new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                setConnected(true);

                // Subscribe to this service type's queue events
                client.subscribe(
                    `/topic/queue/${serviceTypePrefix}`,
                    (message) => {
                        const event = JSON.parse(message.body);
                        setLastEvent(event.event);

                        // Refresh queue status on any event
                        getQueueStatus(serviceTypePrefix, tokenId)
                            .then(res => {
                                setPosition(res.data.position);
                                setTotalWaiting(res.data.totalWaiting);
                            })
                            .catch(console.error);
                    }
                );
            },
            onDisconnect: () => setConnected(false)
        });

        client.activate();

        // Cleanup — disconnect when component unmounts
        return () => client.deactivate();
    }, [tokenId, serviceTypePrefix]);

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#1a1a2e' }}>Live Queue Status</h3>
                <div className="live-indicator">
                    <div className="live-dot"></div>
                    {connected ? 'LIVE' : 'Connecting...'}
                </div>
            </div>

            <div className="grid-2">
                <div style={{ textAlign: 'center', padding: '1rem',
                    background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold',
                        color: '#1a1a2e' }}>
                        {position === 'Not in queue' ? '✓' : position || '—'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {position === 'Not in queue'
                            ? 'Being Served!'
                            : 'Your Position'}
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '1rem',
                    background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold',
                        color: '#666' }}>
                        {totalWaiting || '0'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Total Waiting
                    </div>
                </div>
            </div>

            {lastEvent && (
                <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                    🔔 Queue updated: {lastEvent.replace('_', ' ')}
                </div>
            )}
        </div>
    );
}

export default QueueStatus;