const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- In-memory database (replaces SQL Server LocalDB) ---
let houseLedger = 1000000;
const memberRewards = {}; // { memberNumber: rewardPoints }

// --- Slot generation logic (ported from slotHub.cs) ---
function slotgen(slot) {
    const num = Math.floor(Math.random() * 900) + 100; // 100-999
    const str = num.toString();
    switch (slot) {
        case 1: return str.substring(0, 1);
        case 2: return str.substring(1, 2);
        case 3: return str.substring(2, 3);
        default: return str.substring(0, 1);
    }
}

function genSlots() {
    return slotgen(1) + slotgen(2) + slotgen(3);
}

// --- Slot result logic (ported from slotHub.cs Slotresult method) ---
function processSlotResult(number, member) {
    let win = false;
    let wincredits = 0;
    let announceWin = false;

    switch (number) {
        case '777':
            win = true;
            wincredits = 5;
            announceWin = true;
            break;
        case '333':
            win = true;
            wincredits = 2;
            announceWin = true;
            break;
        default:
            // Check if first digit is '0' followed by rest — matches original C# logic:
            // number == "0" + number.Remove(0, 1)
            if (number === '0' + number.substring(1)) {
                win = true;
                wincredits = 5;
                announceWin = true;
            }
            break;
    }

    // Track play (replaces SQL stored proc [dbo].[trackplay])
    if (!memberRewards[member]) {
        memberRewards[member] = 0;
    }
    memberRewards[member] += 1; // reward = 1 per play

    // Update house ledger
    houseLedger -= 1; // cost per play
    if (win) {
        houseLedger -= wincredits;
    }

    return { win, wincredits, announceWin };
}

// --- Image result endpoint (replaces slotresult.aspx) ---
// Returns the base slot machine result image; text overlay done client-side
app.get('/casino/handlers/slotresult.aspx', (req, res) => {
    const result = req.query.result;
    if (!result) {
        return res.status(400).send('Missing result parameter');
    }
    // Just serve the base image — the client will overlay text via canvas
    res.sendFile(path.join(__dirname, 'Assets', 'slotmachine_result.jpg'));
});

// --- Serve static files ---
// Handle /casino/ prefix paths (the original app was deployed under /casino/)
app.use('/casino', express.static(__dirname));
app.use(express.static(__dirname));

// --- Socket.IO (replaces SignalR hub) ---
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // genslots - returns random slot numbers
    socket.on('genslots', () => {
        socket.emit('numberreturn', genSlots());
    });

    // getledger - returns current house ledger
    socket.on('getledger', () => {
        socket.emit('returnledger', houseLedger.toString());
    });

    // genrewards - returns reward points for a member
    socket.on('genrewards', (member) => {
        if (member && typeof member === 'string') {
            const sanitizedMember = member.substring(0, 50);
            const rewards = memberRewards[sanitizedMember] || 0;
            socket.emit('rewardsreturn', rewards.toString());
        }
    });

    // slotresult - process a slot play
    socket.on('slotresult', (number, member) => {
        if (!number || !member || typeof number !== 'string' || typeof member !== 'string') {
            socket.emit('errorrtn', 'ERROR: Invalid parameters');
            return;
        }

        const sanitizedNumber = number.replace(/[^0-9]/g, '').substring(0, 3);
        const sanitizedMember = member.substring(0, 50);

        const result = processSlotResult(sanitizedNumber, sanitizedMember);

        if (result.announceWin) {
            socket.broadcast.emit('annoucewinner', sanitizedMember);
        }

        socket.emit('resultreturn', sanitizedNumber, result.win, result.wincredits);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Casino Rewards Engine running at http://localhost:${PORT}`);
    console.log(`House Ledger initialized at $${houseLedger.toLocaleString()}`);
});
