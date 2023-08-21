import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = 3001;

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.body);
    next();
});


app.post('/login', (req, res) => {
    const { accessKey } = req.body;

    // Verifique a chave de acesso no banco de dados ou em algum armazenamento
    // Se estiver correto, envie uma requisição para o MikroTik para liberar o acesso
    // Por enquanto, vamos apenas retornar um sucesso aleatório

    res.json({ success: true });
});

app.post('/add-key', (req, res) => {
    const { accessKey } = req.body;
    // Aqui você salva essa chave no banco de dados ou em uma estrutura temporária
    res.json({ success: true });
});


app.post('/remove-key', (req, res) => {
    const { accessKey } = req.body;
    // Aqui você remove essa chave do banco de dados ou da estrutura temporária
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

    // Aqui você gera uma chave aleatória e salva no banco de dados ou em uma estrutura temporária
    const accessKey = Math.random().toString(36).substr(2, 9);

    // Aqui você gera um QR Code com a chave de acesso e retorna para o frontend
    const qrCode = `9456${amount}000${accessKey}6304`;
    const pixKey = accessKey;

    res.json({ qrCode, accessKey: pixKey });
    

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    