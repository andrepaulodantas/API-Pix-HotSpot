
import React, { useEffect, useState } from 'react';
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
    const [tempMinutes, setTempMinutes] = useState<number | null>(null);
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        if (tempMinutes === 0) {
            setAttempts((prev) => prev + 1);
            setTempMinutes(null);
        }
        if (tempMinutes !== null) {
            const interval = setInterval(() => {
                setTempMinutes((prev) => prev !== null ? prev - 1 : null);
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [tempMinutes]);
   
    
    
    const handleLogin = async () => {
        const success = await api.loginWithAccessKey(accessKey);
        if (success) {
            alert("Conectado com sucesso!");
        } else {
            alert("Chave inválida ou expirada.");
        }
    };

    const handleRequestAccess = async () => {
      try {
        const macAddress = "MAC_ADDRESS"; // Replace with actual method to get MAC address
        const isBlockedResponse = await axios.get(`http://localhost:3001/is-mac-blocked?mac=${macAddress}`);
        if (isBlockedResponse.data.isBlocked) {
            alert('Your device is temporarily blocked from accessing!');
            return;
        } 
        if (selectedOption && attempts < 2) {
            setTempMinutes(2);
            const data = await api.requestNewAccess(Number(selectedOption));
            setQrCode(data.qrCode);
        } else if (attempts >= 2) {
            alert("Você já usou o acesso temporário duas vezes!");
        } else {
            alert("Por favor, selecione uma opção de compra primeiro.");
        }
        } catch (error) {
             console.error("Erro ao verificar bloqueio do MAC:", error);
             alert("Ocorreu um erro ao verificar o bloqueio do MAC. Por favor, tente novamente.");
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
    

    function PixModal({ isOpen, onClose, pixKey }: { isOpen: boolean, onClose: () => void, pixKey: string | null }) {
    if (!isOpen) {
        return null;
    }

        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-button" onClick={onClose}>&times;</span>
                    <h2>Pagamento via PIX</h2>
                    {pixKey && <div>Sua chave PIX é: {pixKey}</div>}
                    <div>Por favor, realize o pagamento para ter acesso à internet.</div>
                    <div className="qr-code">
                        <img src={qrCode} alt="QR Code" />
                    </div> 
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
                <h1>Acesso Temporário</h1>
                <button onClick={handleRequestAccess}>Solicitar Acesso</button>
                <div className="qr-code">
                        <img src={qrCode} alt="QR Code" />
                        {tempMinutes ? (
                            <div className="access-granted">Acesso concedido! Tempo restante: {tempMinutes} minutos</div>
                        ) : (
                            <div className="access-denied">Acesso negado! Tentativas: {attempts}/2</div>
                        )}
        </div>
        </div>
        
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
        
           

            <div className="app-container">
                <h1>Login</h1>
                <h2>Insira o usuário</h2>
                <input
                    type="text"
                    placeholder="Insira o usuário"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                />
                <h2>Senha</h2>
                <input
                    type="password"
                    placeholder="Insira a senha"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                />
                <button onClick={handleLogin}>Entrar</button>
            </div>
        </>
    );
}

export default App;
    