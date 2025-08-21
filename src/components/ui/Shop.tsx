'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Shop({ isOpen, onClose }: ShopProps) {
  const { rektTokens, addTokens } = useGameStore();

  const powerUps = [
    {
      id: 'bomb',
      name: 'Unrekt Bomb',
      description: 'Clears all enemies on screen',
      price: 50,
      emoji: '💣'
    },
    {
      id: 'shield',
      name: 'Ledger Shield',
      description: '10 seconds of invincibility',
      price: 75,
      emoji: '🛡️'
    },
    {
      id: 'leap',
      name: 'Moon Leap',
      description: 'Triple jump power',
      price: 30,
      emoji: '🌙'
    },
    {
      id: 'magnet',
      name: 'Pump Magnet',
      description: 'Attracts all coins',
      price: 40,
      emoji: '🧲'
    }
  ];

  const handlePurchase = (powerUp: typeof powerUps[0]) => {
    if ((rektTokens || 0) >= powerUp.price) {
      addTokens(-powerUp.price);
      console.log(`Purchased ${powerUp.name}!`);
      // TODO: Add power-up to inventory
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">🛒 Power-Up Shop</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4 text-center">
          <div className="text-xl font-bold text-orange-400">
            {(rektTokens || 0).toLocaleString()} $REKT
          </div>
          <div className="text-gray-400 text-sm">Your Balance</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {powerUps.map((powerUp) => (
            <div 
              key={powerUp.id}
              className="bg-black/50 rounded-lg p-4 border border-gray-600"
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{powerUp.emoji}</div>
                <h3 className="font-bold text-white">{powerUp.name}</h3>
                <p className="text-gray-400 text-sm">{powerUp.description}</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400 mb-2">
                  {powerUp.price} $REKT
                </div>
                <button
                  onClick={() => handlePurchase(powerUp)}
                  disabled={(rektTokens || 0) < powerUp.price}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
                           hover:from-purple-600 hover:to-pink-600 
                           disabled:from-gray-600 disabled:to-gray-700
                           text-white font-bold py-2 px-4 rounded
                           transition-all duration-300 transform hover:scale-105
                           disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {(rektTokens || 0) >= powerUp.price ? 'BUY' : 'INSUFFICIENT FUNDS'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
