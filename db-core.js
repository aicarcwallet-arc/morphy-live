const { Pool } = require('pg');

// Setup the connection to your Mac Mini's local database
const pool = new Pool({
    user: 'asifsayeed',
    host: 'localhost',
    database: 'morphy_ledger',
    port: 5432,
});

/**
 * INTERNAL SWAP LOGIC
 * This moves numbers from QUBIC to USDC in the database instantly.
 */
async function performInternalSwap(username, qubicAmount) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // 1. Check if user has enough QUBIC
        const userRes = await client.query('SELECT id, qubic_balance FROM users WHERE username = $1', [username]);
        const user = userRes.rows[0];

        if (!user) {
            throw new Error("User not found.");
        }
        
        if (parseFloat(user.qubic_balance) < qubicAmount) {
            throw new Error(`Insufficient QUBIC balance. Current: ${user.qubic_balance}`);
        }

        // 2. Set your internal rate (Temporary fixed rate for testing)
        const rate = 0.000001; 
        const usdcValue = (qubicAmount * rate).toFixed(2);

        // 3. Update balances
        await client.query(
            'UPDATE users SET qubic_balance = qubic_balance - $1, usdc_balance = usdc_balance + $2 WHERE id = $3',
            [qubicAmount, usdcValue, user.id]
        );

        // 4. Log the action in the ledger_log
        await client.query(
            'INSERT INTO ledger_log (user_id, action_type, amount) VALUES ($1, $2, $3)',
            [user.id, 'SWAP', qubicAmount]
        );

        await client.query('COMMIT');
        console.log(`\n🚀 --- INTERNAL SWAP SUCCESS ---`);
        console.log(`User: ${username}`);
        console.log(`Deducted: ${qubicAmount} QUBIC`);
        console.log(`Credited: ${usdcValue} USDC`);
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("\n❌ SWAP FAILED:", e.message);
    } finally {
        client.release();
        // Close the pool after the test so the script exits
        await pool.end();
    }
}

// Run a test swap for your test user
// (Make sure you ran the INSERT command in the previous step!)
performInternalSwap('asifsayeed_test', 1000000);

