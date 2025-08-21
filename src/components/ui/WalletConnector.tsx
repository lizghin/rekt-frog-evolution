'use client';

import { useState } from 'react';

interface WalletConnectorProps {
  onConnected: (address: string) => void;
}

export function WalletConnector({ onConnected }: WalletConnectorProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  const handleConnect = () => {
    // Симуляция подключения кошелька
    const mockAddress = '0x742d35Cc4Cf7Ca2B8A1d8e9A8f8b2E5F1234567';
    setAddress(mockAddress);
    setIsConnected(true);
    onConnected(mockAddress);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
  };

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-gray-500/30">
      <h3 className="text-white font-bold mb-4 text-center">💰 Web3 Wallet</h3>
      
      {!isConnected ? (
        <div className="space-y-4">
          <button
            onClick={handleConnect}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 
                     hover:from-blue-600 hover:to-purple-600 
                     text-white font-bold py-3 px-6 rounded-lg
                     transition-all duration-300 transform hover:scale-105"
          >
            🦊 Connect MetaMask
          </button>
          
          <p className="text-gray-400 text-sm text-center">
            Connect your wallet to earn $REKT tokens and buy power-ups!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-green-400">✅</span>
              <span className="text-white font-bold">Wallet Connected</span>
            </div>
            <p className="text-gray-300 text-sm font-mono text-center">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-yellow-400 font-bold text-lg">0 $REKT</div>
            <div className="text-gray-400 text-sm">Token Balance</div>
          </div>
          
          <button
            onClick={handleDisconnect}
            className="w-full bg-gray-600 hover:bg-gray-700 
                     text-white font-bold py-2 px-4 rounded-lg
                     transition-all duration-300"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
