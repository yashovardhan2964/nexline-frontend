import React, { useState, useEffect } from 'react';
import { getServiceTypes, createToken } from '../api/api';
import TokenCard from '../components/TokenCard';
import QueueStatus from '../components/QueueStatus';

function CustomerPage() {
    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [serviceTypes, setServiceTypes] = useState([]);

    // Result state
    const [token, setToken] = useState(null);
    const [predictedWait, setPredictedWait] = useState(null);
    const [queuePosition, setQueuePosition] = useState(null);

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load service types when page first loads
    useEffect(() => {
        getServiceTypes()
            .then(res => setServiceTypes(res.data))
            .catch(() => setError('Failed to load service types'));
    }, []);

    const handleGetToken = async () => {
        // Basic validation
        if (!customerName || !customerPhone || !selectedServiceType) {
            setError('Please fill all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await createToken(
                customerName,
                customerPhone,
                parseInt(selectedServiceType)
            );

            setToken(res.data.token);
            setPredictedWait(res.data.predictedWaitMinutes);
            setQueuePosition(res.data.queuePosition);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            {/* Navbar */}
            <nav className="navbar">
                <h1>⚡ NexLine</h1>
                <span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>
                    Smart Queue Application
                </span>
            </nav>

            <div className="page-container" style={{ maxWidth: '600px' }}>

                {/* Token generation form */}
                {!token ? (
                    <div className="card">
                        <h2 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>
                            Get Your Queue Token
                        </h2>

                        {error && <div className="alert alert-error">{error}</div>}

                        <div className="form-group">
                            <label>Select Service</label>
                            <select
                                value={selectedServiceType}
                                onChange={e => setSelectedServiceType(e.target.value)}
                            >
                                <option value="">-- Choose a service --</option>
                                {serviceTypes.map(st => (
                                    <option key={st.id} value={st.id}>
                                        {st.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Your Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={customerPhone}
                                onChange={e => setCustomerPhone(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                            onClick={handleGetToken}
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Get My Token →'}
                        </button>
                    </div>
                ) : (
                    /* Token result — shown after successful token generation */
                    <div>
                        <TokenCard
                            token={token}
                            predictedWait={predictedWait}
                            queuePosition={queuePosition}
                        />
                        <QueueStatus
                            tokenId={token.id}
                            serviceTypePrefix={
                                token.displayToken.split('-')[0]
                            }
                        />
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1rem' }}
                            onClick={() => {
                                setToken(null);
                                setCustomerName('');
                                setCustomerPhone('');
                                setSelectedServiceType('');
                            }}
                        >
                            Get Another Token
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerPage;