'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

interface GraphicsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function GraphicsPanel({ isOpen, onToggle }: GraphicsPanelProps) {
  const {
    graphicsQuality,
    focusDistance,
    focalLength,
    cinematicMode,
    setGraphicsQuality,
    setFocusDistance,
    setFocalLength,
    setCinematicMode,
  } = useGameStore();

  const [isExpanded, setIsExpanded] = useState(false);

  const resetToDefaults = () => {
    setGraphicsQuality('high');
    setFocusDistance(10);
    setFocalLength(50);
    setCinematicMode(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-4 right-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="graphics-title"
      aria-describedby="graphics-description"
    >
      <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 min-w-64">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 id="graphics-title" className="text-white font-bold text-sm">🎮 Graphics</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
              aria-label={isExpanded ? "Collapse graphics settings" : "Expand graphics settings"}
            >
              {isExpanded ? '−' : '+'}
            </button>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
              aria-label="Close graphics panel"
            >
              ×
            </button>
          </div>
        </div>

        {/* Quality Selector */}
        <div className="mb-3">
          <label className="text-gray-300 text-xs block mb-1">Quality:</label>
          <select
            value={graphicsQuality}
            onChange={(e) => setGraphicsQuality(e.target.value as any)}
            className="w-full bg-black/50 border border-gray-600 rounded px-2 py-1 text-white text-xs"
            aria-describedby="graphics-description"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="ultra">Ultra</option>
          </select>
        </div>

        {/* Cinematic Mode Toggle */}
        {(graphicsQuality === 'high' || graphicsQuality === 'ultra') && (
          <div className="mb-3">
            <label className="flex items-center text-gray-300 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={cinematicMode}
                onChange={(e) => setCinematicMode(e.target.checked)}
                className="mr-2 accent-purple-500"
              />
              🎬 Cinematic Mode
            </label>
            <p id="graphics-description" className="text-gray-500 text-xs mt-1">
              Enhanced bloom + film grain
            </p>
          </div>
        )}

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="space-y-3 border-t border-gray-600 pt-3">
            {/* Focus Distance */}
            <div>
              <label className="text-gray-300 text-xs block mb-1">
                Focus Distance: {focusDistance}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={focusDistance}
                onChange={(e) => setFocusDistance(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Focal Length */}
            <div>
              <label className="text-gray-300 text-xs block mb-1">
                Focal Length: {focalLength}
              </label>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={focalLength}
                onChange={(e) => setFocalLength(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={resetToDefaults}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
