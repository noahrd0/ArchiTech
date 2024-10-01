import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
    const [success, setSuccess] = useState(false);
    const [canceled, setCanceled] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'true') {
            setSuccess(true);
            addStorage();
        }
        if (params.get('canceled') === 'true') {
            setCanceled(true);
        }
    }, []);

    const addStorage = async () => {
        try {
            const session_id = new URLSearchParams(window.location.search).get('session_id');
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            if (!session_id) {
                throw new Error('No session_id found');
            }

            await axios.post(`/api/user/add_storage`, { session_id }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error adding storage:', error);
        }
    };

    const handleClick = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.post('/api/checkout/checkout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h1>20Go de stokage</h1>
                    <p>20Go de stockage supplémentaire</p>
                    <p>20€</p>
                </div>
                <div className="card-body">
                    {success && <div id="success-message" className="alert alert-success" style={{ display: 'block' }}>Payment successful! Storage added.</div>}
                    {canceled && <div id="canceled-message" className="alert alert-danger" style={{ display: 'block' }}>Payment canceled. Please try again.</div>}
                    <div className="text-center">
                        <button className="btn btn-primary" onClick={handleClick}>Acheter</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;