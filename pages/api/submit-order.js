export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    try {
        const { name, phone, address, amount } = req.body;

        const apiKey = process.env.STEADFAST_API_KEY;
        const secretKey = process.env.STEADFAST_SECRET_KEY;
        const apiUrl = process.env.STEADFAST_API_URL;
        const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

        const invoiceNumber = 'INV' + Math.floor(100000 + Math.random() * 900000);

        const payload = {
            invoice: invoiceNumber,
            recipient_name: name,
            recipient_phone: phone,
            recipient_address: address,
            cod_amount: parseInt(amount) || 0,
            note: 'দয়া করে চেক করে প্রোডাক্ট রিসিভ করবেন।',
        };

        let trackingCode = 'Failed to Book';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Api-Key': apiKey,
                    'Secret-Key': secretKey,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            if (responseData.status === 200 || responseData.status === 'success') {
                trackingCode = responseData.consignment?.tracking_code || 'Unknown';
            } else {
                trackingCode = 'Error: ' + (responseData.message || JSON.stringify(responseData));
            }
        } catch (err) {
            trackingCode = 'Error: ' + err.message;
        }

        // Send data to Google Apps Script
        try {
            await fetch(googleScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    name,
                    phone,
                    address,
                    amount,
                    tracking: trackingCode,
                    timestamp: new Date().toISOString(),
                }),
            });
        } catch (err) {
            console.error('Google Sheet error:', err);
        }

        return res.status(200).json({
            status: 'success',
            tracking: trackingCode,
            invoice: invoiceNumber,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}
