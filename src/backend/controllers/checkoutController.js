const dotenv = require('dotenv');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Stockage supplémentaire',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/checkout?canceled=true`,
        });

        if (session && session.url) {
            console.log("session", session);
            res.status(200).json({ url: session.url });
        } else {
            res.status(500).json({ error: 'Failed to create checkout session' });
        }
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
};

