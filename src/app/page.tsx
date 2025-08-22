// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CinematicGameScene } from '@/components/game/CinematicGameScene';
import { GameHUD } from '@/components/ui/GameHUD';
import { WalletConnector } from '@/components/ui/WalletConnector';
import { Shop } from '@/components/ui/Shop';
import { GraphicsPanel } from '@/components/ui/GraphicsPanel';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useGameStore } from '@/store/gameStore';

export default function HomePage() {
  const [showShop, setShowShop] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [showGraphicsPanel, setShowGraphicsPanel] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const {
    isPlaying,
    isGameOver,
    isPaused,
    score,
    highScore,
    rektTokens,
    graphicsQuality,
    focusDistance,
    focalLength,
    startGame,
    restartGame,
    pauseGame,
    resumeGame,
    setGraphicsQuality,
    setFocusDistance,
    setFocalLength,
    character,
  } = useGameStore();

  // Скрываем меню, когда игра началась
  useEffect(() => {
    if (isPlaying) setShowMenu(false);
  }, [isPlaying]);

  // Горячие клавиши
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
              if (e.key === 'Escape') {
          if (isPlaying) {
            if (isPaused) {
              resumeGame();
            } else {
              pauseGame();
            }
          } else {
            startGame();
            setShowMenu(false);
          }
        } else if (e.key === 'p' || e.key === 'P') {
        if (isPlaying) {
          if (isPaused) {
            resumeGame();
          } else {
            pauseGame();
          }
        }
      } else if (e.key === 'm' || e.key === 'M') {
        if (walletConnected) {
          setShowShop(!showShop);
        }
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGraphicsPanel(!showGraphicsPanel);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying, isPaused, pauseGame, resumeGame, startGame, walletConnected, showShop, showGraphicsPanel]);

  const handleStartGame = () => {
    startGame();
    setShowMenu(false);
  };

  const handleWalletConnected = (address: string) => {
    setWalletConnected(true);
    console.log('Wallet connected:', address);
  };

  const maxEvolution = character?.evolutionStage ?? 0;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D сцена */}
      <ErrorBoundary>
        <CinematicGameScene className="absolute inset-0" />
      </ErrorBoundary>

      {/* HUD — показываем в игре (и на паузе тоже полезно видеть статы) */}
      {isPlaying && <GameHUD />}

      {/* Pause Overlay */}
      {isPlaying && isPaused && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="text-center">
            <div className="text-6xl mb-4">⏸️</div>
            <div className="text-3xl font-bold text-white mb-2">GAME PAUSED</div>
            <div className="text-gray-300 text-lg">Press ESC or P to resume</div>
          </div>
        </div>
      )}

      {/* Главное меню */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="max-w-4xl w-full mx-4">
            <div className="text-center mb-8">
              {/* Лого */}
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

              {/* Статистика */}
              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {highScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">High Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {rektTokens.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">$REKT Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {maxEvolution}
                  </div>
                  <div className="text-sm text-gray-400">Max Evolution</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Кнопки/инфо */}
              <div className="space-y-4">
                {!isGameOver ? (
                  <button
                    onClick={handleStartGame}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 
                               hover:from-green-600 hover:to-blue-600 
                               text-white font-bold py-4 px-8 rounded-lg text-xl
                               transition-all duration-300 transform hover:scale-105"
                  >
                    {isPlaying ? (isPaused ? 'RESUME GAME (Esc)' : 'RESUME GAME') : 'START GAME'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
                      <h3 className="text-red-400 font-bold text-xl mb-2">GAME OVER</h3>
                      <p className="text-white text-lg">Final Score: {score.toLocaleString()}</p>
                      {score > highScore && (
                        <p className="text-yellow-400 font-bold">NEW HIGH SCORE!</p>
                      )}
                    </div>
                    <button
                      onClick={restartGame}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 
                                 hover:from-red-600 hover:to-orange-600 
                                 text-white font-bold py-4 px-8 rounded-lg text-xl
                                 transition-all duration-300 transform hover:scale-105"
                    >
                      RESTART GAME
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

                {/* Как играть */}
                <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-gray-500/30">
                  <h3 className="text-white font-bold mb-2">🎮 How to Play</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Use A/D keys to move left/right</li>
                    <li>• Press SPACE to jump</li>
                    <li>• Avoid enemies and collect coins</li>
                    <li>• Evolve your frog by gaining levels</li>
                    <li>• Use power-ups to survive longer</li>
                    <li>• Earn $REKT tokens to buy upgrades</li>
                    <li>• Press ESC to pause/resume</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 
                                border border-yellow-500/50 rounded-lg p-4">
                  <h3 className="text-yellow-400 font-bold mb-2">💰 Web3 Features</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Earn real $REKT tokens while playing</li>
                    <li>• Purchase power-ups with crypto</li>
                    <li>• Compete in leaderboards</li>
                    <li>• Trade achievements as NFTs</li>
                  </ul>
                </div>

                {/* Graphics Settings */}
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 
                                border border-purple-500/50 rounded-lg p-4">
                  <h3 className="text-purple-400 font-bold mb-2">🎮 Graphics Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-300 text-sm block mb-1">Quality:</label>
                      <select
                        value={graphicsQuality}
                        onChange={(e) => setGraphicsQuality(e.target.value as any)}
                        className="w-full bg-black/50 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="ultra">Ultra</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm block mb-1">Focus Distance: {focusDistance}</label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={focusDistance}
                        onChange={(e) => setFocusDistance(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm block mb-1">Focal Length: {focalLength}</label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="5"
                        value={focalLength}
                        onChange={(e) => setFocalLength(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Подключение кошелька */}
              <div>
                <WalletConnector onConnected={handleWalletConnected} />
              </div>
            </div>

            {/* Футер */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Built with Next.js, Three.js, and Web3 • Press ESC to pause during gameplay</p>
              <p className="mt-2">
                🐸 Survive the crypto chaos and evolve into the ultimate diamond-handed frog! 💎
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Магазин */}
      <Shop isOpen={showShop} onClose={() => setShowShop(false)} />

      {/* Graphics Panel */}
      <GraphicsPanel 
        isOpen={showGraphicsPanel} 
        onToggle={() => setShowGraphicsPanel(!showGraphicsPanel)} 
      />

      {/* Лоадер спавна персонажа */}
      {isPlaying && !character && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="text-4xl mb-4">🐸</div>
            <div className="text-xl font-bold">Spawning your frog...</div>
          </div>
        </div>
      )}

      {/* Фоновая анимация меню */}
      {!isPlaying && showMenu && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              {Math.random() > 0.5 ? '💰' : '🚀'}
            </div>
          ))}
        </div>
      )}

      {/* Пасхалки */}
      {rektTokens > 10000 && (
        <div className="absolute bottom-4 left-4 text-yellow-400 text-sm animate-bounce">
          🐋 Whale Alert! You're crushing it!
        </div>
      )}

      {maxEvolution >= 4 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        text-6xl animate-spin pointer-events-none opacity-20">
          🌙
        </div>
      )}
    </div>
  );
}