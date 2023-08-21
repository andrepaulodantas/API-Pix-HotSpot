import axios from 'axios';

export const loginWithAccessKey = async (key: string): Promise<boolean> => {
    try {
        const response = await axios.post('http://localhost:3001/login', { accessKey: key });
        return response.data.success;
    } catch (error) {
        console.error('Erro ao conectar:', error);
        return false;
    }
};

export const requestNewAccess = async (time: number): Promise<{ qrCode: string, accessKey: string }> => {
    const response = await fetch('http://localhost:3001/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time })

    });
    return await response.json();
}



