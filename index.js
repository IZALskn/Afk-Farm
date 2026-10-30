const mineflayer = require('mineflayer');
const express = require('express');
const autoeat = require('mineflayer-auto-eat').plugin;
const app = express();

// Menjaga Render tidak tertidur
app.get('/', (req, res) => res.send('Mesin Bot Aktif!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server berjalan.'));

function createBot() {
    const bot = mineflayer.createBot({
        host: 'play.mikahsmp.my.id',
        username: 'FZALX', // Nickname diubah sesuai permintaan
        // version: '1.20.1' // Buka komentar dan isi versi jika bot gagal mendeteksi versi otomatis
    });

    // Memuat plugin auto-eat
    bot.loadPlugin(autoeat);

    bot.on('login', () => {
        console.log('Bot berhasil masuk ke server!');
    });

    bot.on('spawn', () => {
        console.log('Bot berhasil spawn!');
        
        // Jeda 2 detik sebelum mengirim password agar server siap menerima pesan
        setTimeout(() => {
            bot.chat('/login izalierty');
            console.log('Mengirim perintah login...');
        }, 2000);
    });

    // Konfigurasi sistem Auto-Eat
    bot.once('spawn', () => {
        bot.autoEat.options = {
            priority: 'foodPoints', // Memilih makanan dengan poin hunger tertinggi di inventory
            startAt: 14, // Bot mulai makan saat hunger bar turun menjadi 7 (14 poin)
            bannedFood: [] // Bisa diisi nama item jika ada makanan yang tidak boleh dimakan (misal: 'spider_eye', 'rotten_flesh')
        };
    });

    // Log ketika bot sedang makan untuk pantauan
    bot.on('autoeat_started', (item, offhand) => {
        console.log(`Makan ${item.name} agar tidak mati kelaparan...`);
    });

    // INFINITY RECONNECT: Jika koneksi putus/dikick, otomatis rakit ulang bot
    bot.on('end', (reason) => {
        console.log(`Koneksi terputus: ${reason}. Mencoba masuk kembali dalam 10 detik...`);
        setTimeout(createBot, 10000); 
    });

    bot.on('error', (err) => {
        console.log(`Terjadi Error: ${err.message}`);
    });
    
    // Fitur melompat setiap 5 menit (Anti-AFK)
    setInterval(() => {
        if (bot.entity) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 1000);
        }
    }, 300000); 
}

// Menjalankan bot untuk pertama kali
createBot();
