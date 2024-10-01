import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Invoice.css';

const downloadInvoice = async (invoiceId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(`api/invoice/${invoiceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `facture_${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Erreur au telechargement de la facture', error);
    }
};

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        
        axios.get('api/invoice/list', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => setInvoices(response.data))
        .catch(error => console.error('Error fetching invoices:', error));
    }, []);

    return (
        <div className="invoice-container">
            <h1 className="invoice-title">Vos factures</h1>
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Stockage</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th>Date</th>
                        <th>Télécharger</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(invoice => {
                        const date = new Date(invoice.date);
                        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                        return (
                            <tr key={invoice.id}>
                                <td>20Go</td>
                                <td>20€</td>
                                <td>1</td>
                                <td>{formattedDate}</td>
                                <td>
                                    <button className='download-button' onClick={() => downloadInvoice(invoice.id)}>Télécharger</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Invoice;