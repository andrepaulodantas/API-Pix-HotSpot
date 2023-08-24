import cors from 'cors';
import express from 'express';

const blockedMACs = new Map<string, number>();
const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = 3001;

let blockedMACAddresses: string[] = []; // Lista para armazenar MACs bloqueados

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.body);
    next();
});


app.post('/login', (req, res) => {
    const { accessKey } = req.body;


    res.json({ success: true });
});

app.post('/add-key', (req, res) => {
    const { accessKey } = req.body;
    res.json({ success: true });
});


app.post('/remove-key', (req, res) => {
    const { accessKey } = req.body;
    res.json({ success: true });
});


app.post('/request-access', (req, res) => {
    const { time } = req.body;

    let amount: number;
    if (time === 10) {
        amount = 5;
    } else if (time === 30) {
        amount = 10;
    } else if (time === 60) {
        amount = 15;
    } else {
        return res.status(400).json({ error: 'Tempo inválido!' });
    }

    const accessKey = Math.random().toString(36).substr(2, 9);
    const qrCode = `https://fakeqrcode.com/img.php?text=${accessKey}&size=200`;
    const pixKey = accessKey;
    res.json({ qrCode, accessKey: pixKey });
});

app.post('/block-mac', (req, res) => {
    const { mac } = req.body;
    blockedMACs.set(mac, Date.now());
    res.json({ success: true });
});

app.get('/is-mac-blocked', (req, res) => {
    const mac = req.query.mac as string;
    const isBlocked = blockedMACAddresses.includes(mac);
    const blocked = blockedMACs.get(mac as string);
    if (blocked) {
        const currentTime = Date.now();
        const sixHours = 6 * 60 * 60 * 1000;
        if (currentTime - blocked < sixHours) {
            return res.json({ blocked: true });
        } else {
            blockedMACs.delete(mac as string);
        }
    }
    return res.json({ blocked: isBlocked });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    