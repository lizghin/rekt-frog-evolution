import { useCallback } from 'react';
import * as THREE from 'three';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

export const useCollisions = () => {
  // Check if player is on ground
  const checkGroundCollision = useCallback((position: THREE.Vector3): boolean => {
    return position.y <= GAME_CONFIG.GROUND_Y + GAME_CONFIG.PLAYER.SIZE / 2;
  }, []);

  // Check world boundaries
  const checkBoundaryCollision = useCallback((position: THREE.Vector3): THREE.Vector3 => {
    const clampedPosition = position.clone();
    
    // Clamp X position
    clampedPosition.x = Math.max(
      GAME_CONFIG.BOUNDS.MIN_X + GAME_CONFIG.PLAYER.SIZE / 2,
      Math.min(GAME_CONFIG.BOUNDS.MAX_X - GAME_CONFIG.PLAYER.SIZE / 2, clampedPosition.x)
    );
    
    // Clamp Z position
    clampedPosition.z = Math.max(
      GAME_CONFIG.BOUNDS.MIN_Z + GAME_CONFIG.PLAYER.SIZE / 2,
      Math.min(GAME_CONFIG.BOUNDS.MAX_Z - GAME_CONFIG.PLAYER.SIZE / 2, clampedPosition.z)
    );
    
    return clampedPosition;
  }, []);

  // Check proximity to coins
  const checkCoinCollision = useCallback((
    playerPosition: THREE.Vector3, 
    coinPosition: THREE.Vector3
  ): boolean => {
    const distance = playerPosition.distanceTo(coinPosition);
    return distance < GAME_CONFIG.COIN.COLLECTION_DISTANCE;
  }, []);

  // Apply ground collision and return corrected position and velocity
  const applyGroundCollision = useCallback((
    position: THREE.Vector3, 
    velocity: THREE.Vector3
  ): { position: THREE.Vector3; velocity: THREE.Vector3; isGrounded: boolean } => {
    const newPosition = position.clone();
    const newVelocity = velocity.clone();
    let isGrounded = false;

    if (checkGroundCollision(newPosition)) {
      newPosition.y = GAME_CONFIG.GROUND_Y + GAME_CONFIG.PLAYER.SIZE / 2;
      if (newVelocity.y <= 0) {
        newVelocity.y = 0;
        isGrounded = true;
      }
    }

    return {
      position: newPosition,
      velocity: newVelocity,
      isGrounded
    };
  }, [checkGroundCollision]);

  return {
    checkGroundCollision,
    checkBoundaryCollision,
    checkCoinCollision,
    applyGroundCollision,
  };
};