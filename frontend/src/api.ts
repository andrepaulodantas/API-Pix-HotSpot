import axios from 'axios';

const API_URL = 'http://localhost:3001';


export const loginWithAccessKey = async (accessKey: string) => {
    try {
        const response = await axios.post('http://localhost:3001/login', { accessKey });
        if (response.data && response.data.success) {
            return true;
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
    return false;
};

export const requestNewAccess = async (time: number) => {
    try {
        const response = await axios.post('http://localhost:3001/request-access', { time });
        if (response.data) {
            return response.data;
        }
    } catch (error) {
        console.error('Error requesting new access:', error);
    }
    return { qrCode: '', accessKey: '' };
};

/* export async function blockMac(mac: string): Promise<boolean> {
    try {
        const response = await axios.post(`${API_URL}/block-mac`, { mac });
        return response.data.success;
    } catch (error) {
        console.error('Error blocking mac:', error);
        return false;
    }
}

export async function isMacBlocked(mac: string): Promise<boolean> {
    try {
        const response = await axios.get(`${API_URL}/is-mac-blocked`, { params: { mac } });
        return response.data.isBlocked;
    } catch (error) {
        console.error('Error checking if mac is blocked:', error);
        return false;
    }
} */

export const checkAccessGranted = async (accessKey: string): Promise<boolean> => {
    const response = await fetch('http://localhost:3001/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey })
    });
    return await response.json();
}

export const addAccessKey = async (accessKey: string): Promise<boolean> => {
    const response = await fetch('http://localhost:3001/add-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey })
    });
    return await response.json();
}

export const removeAccessKey = async (accessKey: string): Promise<boolean> => {
    const response = await fetch('http://localhost:3001/remove-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey })
    });
    return await response.json();
}

export const getAccessKeys = async (): Promise<string[]> => {
    const response = await fetch('http://localhost:3001/get-keys');
    return await response.json();
}

