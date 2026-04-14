const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Replace with your real keys if they are not in environment variables
const API_KEY = "T3dw468ukWMAXSD4M4drskbiQKbdUEs2A8Xofz+U0Sg=";
const API_SECRET = `308204bc020100300d06092a864886f70d0101010500048204a6308204a20201000282010100c3da9004d68ab4901310faf9fd27cf936900c4d4dc9409ce732ab98964712096184c945d2b29e7043b33e558c7d8e63bd0f31514681870036c1e0de03658be6e0fafba8b28164255ad6af874b5bf0594ba9b29f88ca580`;

app.post('/withdraw', async (req, res) => {
    const { amount, userWallet } = req.body;

    const message = {
        "jsonrpc": "2.0",
        "id": "morphy_" + Date.now(),
        "method": "createTransaction",
        "params": {
            "from": "qubic",
            "to": "usdt",
            "address": userWallet,
            "amountFrom": amount
        }
    };

    // Changelly HMAC Signature
    const signature = crypto.createHmac('sha512', API_SECRET)
        .update(JSON.stringify(message))
        .digest('hex');

    try {
        const response = await axios.post('https://api.changelly.com/v2', message, {
            headers: { 'api-key': API_KEY, 'sign': signature }
        });
        res.json({ success: true, data: response.data.result });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: "Handshake Failed" });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log("-----------------------------------------");
    console.log("🔥 MORPHY MASTER ENGINE ONLINE");
    console.log("-----------------------------------------");
});
