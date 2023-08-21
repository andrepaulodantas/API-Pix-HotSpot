
import React, { useState } from 'react';
import * as api from './api';
import './styles.css';
import axios from 'axios';

function App() {
    const [accessKey, setAccessKey] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [selectedOption, setSelectedOption] = useState<string>(''); 
    const [pixKey, setPixKey] = useState<string | null>(null);
    const [newKey, setNewKey] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleLogin = async () => {
        const success = await api.loginWithAccessKey(accessKey);
        if (success) {
            alert("Conectado com sucesso!");
        } else {
            alert("Chave inválida ou expirada.");
        }
    };

    const handleRequestAccess = async () => {
        if (selectedOption) {
            const data = await api.requestNewAccess(Number(selectedOption));
            setQrCode(data.qrCode);
        } else {
            alert("Por favor, selecione uma opção primeiro.");
        }
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };


    const handleSubmit = async () => {
        console.log(selectedOption);
        if (selectedOption) {
            const response = await api.requestNewAccess(Number(selectedOption));
            setPixKey(response.accessKey);
            console.log(response);
            setIsModalOpen(true);
        } else {
            alert("Por favor, selecione uma opção primeiro.");
        }
    };

    const handleAddKey = async () => {
        try {
            const response = await axios.post('http://localhost:3001/add-key', { accessKey: newKey });
            if (response.data.success) {
                alert('Chave adicionada com sucesso!');
                setNewKey('');
            } else {
                alert('Erro ao adicionar chave.');
            }
        } catch (error) {
            console.error('Erro ao adicionar chave:', error);
        }
    };
    

    function PixModal({ isOpen, onClose, pixKey }: { isOpen: boolean; onClose: () => void; pixKey: string | null }) {
    if (!isOpen) {
        return null;
    }

        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-button" onClick={onClose}>&times;</span>
                    <h2>Pagamento via PIX</h2>
                    {pixKey && <div>Sua chave PIX é: {pixKey}</div>}
                    {/* Aqui você pode adicionar o código QR ou outras informações relevantes */}
                </div>
            </div>
        );
    }


    return (
        <>
        {/*Barra de login que sera acessada em outro endpoint*/}
        <div className="app-container">
                <h1>Adicionar Nova Chave PIX</h1>
                <input
                    type="text"
                    placeholder="Insira a chave PIX"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                />
                <button onClick={handleAddKey}>Adicionar</button>
        </div>

        <PixModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pixKey={pixKey} />


        <div className="app-container">
            <div>
                <h1>Escolha o tempo de acesso:</h1>
                <select value={selectedOption} onChange={handleOptionChange}>
                    <option value="">Selecione uma opção</option>
                    <option value={10}>10 minutos - R$5</option>
                    <option value={30}>30 minutos - R$10</option>
                    <option value={60}>1 hora - R$15</option>
                </select>
                <br />
                <br />
                <button onClick={handleSubmit}>Confirmar</button>
            </div>
        </div>
           

            <div className="app-container">
                <h1>Login Hotspot</h1>
                <input
                    type="text"
                    placeholder="Insira a chave de acesso"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                />
                <button onClick={handleLogin}>Conectar</button>
            </div>
        </>
    );
}

export default App;
    