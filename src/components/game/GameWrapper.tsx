'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameScene } from '@/components/game/GameScene';
import { GameHUD } from '@/components/ui/GameHUD';
import { WalletConnector } from '@/components/ui/WalletConnector';
import { Shop } from '@/components/ui/Shop';
import { useGameStore } from '@/store/gameStore';

export default function GameWrapper() {
  const [showShop, setShowShop] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    isPlaying,
    isGameOver,
    score,
    highScore,
    rektTokens,
    startGame,
    restartGame,
    character
  } = useGameStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Обработка клавиш
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'Escape':
        if (isPlaying && !showMenu) {
          setShowMenu(true); // Показываем меню при ESC
        } else if (showMenu) {
          setShowMenu(false); // Скрываем меню при ESC
        }
        break;
      case 'KeyA':
      case 'ArrowLeft':
        console.log('Move Left');
        // TODO: Move frog left
        break;
      case 'KeyD':
      case 'ArrowRight':
        console.log('Move Right');
        // TODO: Move frog right
        break;
      case 'Space':
        event.preventDefault();
        console.log('Jump!');
        // TODO: Make frog jump
        break;
      case 'KeyE':
        console.log('Special Ability!');
        // TODO: Use special ability
        break;
    }
  }, [isPlaying, showMenu]);

  // Добавляем слушатель клавиш
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (!mounted) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🐸</div>
          <div className="text-2xl font-bold mb-2">REKT FROG EVOLUTION</div>
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const handleStartGame = () => {
    console.log('Starting game...');
    startGame();
    setShowMenu(false);
  };

  const handleBackToMenu = () => {
    setShowMenu(true);
  };

  const handleWalletConnected = (address: string) => {
    setWalletConnected(true);
    console.log('Wallet connected:', address);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D Game Scene */}
      <GameScene className="absolute inset-0" />

      {/* Game HUD */}
      {isPlaying && !showMenu && (
        <>
          <GameHUD />
          {/* Кнопка возврата в меню */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
            <button
              onClick={handleBackToMenu}
              className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg border border-gray-500/30 backdrop-blur-sm"
            >
              🏠 Menu (ESC)
            </button>
          </div>
        </>
      )}

      {/* Main Menu */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="max-w-4xl w-full mx-4">
            <div className="text-center mb-8">
              <div className="mb-6">
                <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  REKT FROG
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  EVOLUTION
                </h2>
                <p className="text-gray-400 text-lg">
                  The Ultimate Web3 Survival Game
                </p>
              </div>

              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{highScore?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-400">High Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{rektTokens?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-400">$REKT Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{character?.evolutionStage || 1}</div>
                  <div className="text-sm text-gray-400">Evolution Stage</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {!isGameOver ? (
                  <button
                    onClick={handleStartGame}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 
                             hover:from-green-600 hover:to-blue-600 
                             text-white font-bold py-4 px-8 rounded-lg text-xl
                             transition-all duration-300 transform hover:scale-105"
                  >
                    🎮 START GAME
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
                      <h3 className="text-red-400 font-bold text-xl mb-2">GAME OVER</h3>
                      <p className="text-white text-lg">Final Score: {score?.toLocaleString() || 0}</p>
                    </div>
                    <button
                      onClick={() => {
                        restartGame();
                        setShowMenu(false);
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 
                               hover:from-red-600 hover:to-orange-600 
                               text-white font-bold py-4 px-8 rounded-lg text-xl
                               transition-all duration-300 transform hover:scale-105"
                    >
                      🔄 RESTART GAME
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowShop(true)}
                  disabled={!walletConnected}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
                           hover:from-purple-600 hover:to-pink-600 
                           disabled:from-gray-600 disabled:to-gray-700
                           text-white font-bold py-3 px-6 rounded-lg
                           transition-all duration-300 transform hover:scale-105
                           disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  🛒 POWER-UP SHOP
                </button>

                {/* Инструкции */}
                <div className="bg-black/60 rounded-lg p-4 text-left">
                  <h3 className="text-white font-bold mb-2">🎮 Controls</h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>• A/D or ←/→ - Move left/right</div>
                    <div>• SPACE - Jump</div>
                    <div>• E - Special ability</div>
                    <div>• ESC - Pause/Menu toggle</div>
                  </div>
                </div>

                {/* Статус игры */}
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-center">
                  <div className="text-blue-400 font-bold">
                    {isPlaying ? '🎮 Game Running' : '⏸️ Game Paused'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Press ESC to {showMenu ? 'resume' : 'pause'}
                  </div>
                </div>
              </div>

              <div>
                <WalletConnector onConnected={handleWalletConnected} />
              </div>
            </div>
          </div>
        </div>
      )}

      <Shop isOpen={showShop} onClose={() => setShowShop(false)} />
    </div>
  );
}
