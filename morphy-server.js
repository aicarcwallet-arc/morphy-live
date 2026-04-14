const express = require('express');
const { ethers } = require('ethers');
const app = express();
app.use(express.json());
app.use(require('cors')());

// 1. YOUR BLOCKCHAIN GATEWAY
const provider = new ethers.JsonRpcProvider("https://base-mainnet.infura.io/v3/ea15442df2d94a83b38195ec819e96d0");

// 2. YOUR TREASURY KEY (The one that pays the user)
const TREASURY_KEY = "f5ec7e495c776d970eed4590a289b06a077a0eb8bcf48eb4205d6c4802c206ee"; 
const wallet = new ethers.Wallet(TREASURY_KEY, provider);

app.post('/withdraw', async (req, res) => {
    const { userWallet, amount } = req.body;
    try {
        console.log(`🚀 DEX Transfer: Sending ${amount} to ${userWallet}`);
        
        // This moves the funds on Base Mainnet
        const tx = await wallet.sendTransaction({
            to: userWallet,
            value: ethers.parseUnits("0.0001", "ether") // Small test amount of Base ETH
        });

        res.json({ success: true, hash: tx.hash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("🔥 DEX ENGINE ACTIVE ON PORT 3000"));

