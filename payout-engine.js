const crypto = require('crypto');
const axios = require('axios');

// This handles the REAL swap from Qubic to USDC via Changelly
async function executeProductionSwap(qubicAmount, userAddress) {
    const apiKey = process.env.CHANGELLY_PUBLIC_KEY;
    const apiSecret = process.env.CHANGELLY_SECRET_KEY;

    const message = {
        "jsonrpc": "2.0",
        "id": "morphy_" + Date.now(),
        "method": "createTransaction",
        "params": {
            "from": "qubic",
            "to": "usdc",
            "address": userAddress,
            "amountFrom": qubicAmount
        }
    };

    // Changelly Signature Logic
    const signature = crypto
        .createHmac('sha512', apiSecret)
        .update(JSON.stringify(message))
        .digest('hex');

    try {
        const response = await axios.post('https://api.changelly.com/v2', message, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
                'sign': signature
            }
        });

        // This 'payinAddress' is where YOUR bank sends the Qubic
        return response.data.result;
    } catch (error) {
        console.error("Changelly API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { executeProductionSwap };
