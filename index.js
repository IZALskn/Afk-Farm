const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// Menjaga Render tidak tertidur
app.get('/', (req, res) => res.send('Mesin Bot Aktif!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server berjalan.'));

function createBot() {
    const bot = mineflayer.createBot({
        host: 'play.mikahsmp.my.id',
        username: 'Bot_Tebu_01' // Ganti dengan nickname untuk bot Anda
    });

    bot.on('login', () => console.log('Bot berhasil masuk ke server!'));
    bot.on('end', () => {
        console.log('Terputus. Mencoba masuk lagi dalam 10 detik...');
        setTimeout(createBot, 10000);
    });
    
    // Fitur melompat setiap 5 menit agar tidak di-kick Admin
    setInterval(() => {
        if (bot.entity) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 1000);
        }
    }, 300000); 
}
createBot();
