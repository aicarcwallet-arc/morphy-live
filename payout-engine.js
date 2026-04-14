const { Pool } = require('pg');
const { ethers } = require('ethers');

const pool = new Pool({ user: 'asifsayeed', host: 'localhost', database: 'morphy_ledger', port: 5432 });

const RPC_URL = "https://mainnet.base.org"; 
const PRIVATE_KEY = "YOUR_TREASURY_PRIVATE_KEY"; 
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
const usdcContract = new ethers.Contract(USDC_ADDRESS, abi, signer);

async function withdrawWithFeeDeduction(username, totalAmountRequested) {
    const client = await pool.connect();
    try {
        // 1. Get User Data
        const res = await client.query('SELECT usdc_balance, wallet_address FROM users WHERE username = $1', [username]);
        const user = res.rows[0];

        // 2. Estimate Gas Fee
        const feeData = await provider.getFeeData();
        const gasLimit = 60000n; // Standard ERC20 transfer gas
        const gasCostInEth = feeData.gasPrice * gasLimit;
        
        // Convert Gas Cost to Dollars (Approximate for safety, e.g., $0.05)
        const gasFeeInUsdc = 0.05; 
        const finalPayout = totalAmountRequested - gasFeeInUsdc;

        if (finalPayout <= 0) throw new Error("Amount too small to cover gas fees.");

        console.log(`🏧 Payout: ${totalAmountRequested} | Fee: ${gasFeeInUsdc} | Net: ${finalPayout}`);

        // 3. Send the Net Amount
        const amountUnits = ethers.parseUnits(finalPayout.toFixed(2).toString(), 6);
        const tx = await usdcContract.transfer(user.wallet_address, amountUnits);
        
        console.log(`🔗 Sent! Hash: ${tx.hash}`);
        await tx.wait();

        // 4. Deduct TOTAL amount (including fee) from their internal balance
        await client.query('UPDATE users SET usdc_balance = usdc_balance - $1 WHERE username = $2', [totalAmountRequested, username]);
        
        console.log(`✅ Success! User charged ${totalAmountRequested} USDC.`);

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        client.release();
    }
}

withdrawWithFeeDeduction('asifsayeed_test', 1.00);
