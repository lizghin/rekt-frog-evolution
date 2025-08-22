import { Contract, ethers } from 'ethers';
import { WEB3_CONFIG } from '@/lib/constants/gameConfig';

// REKT Token ABI (simplified)
export const REKT_TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  
  // Game-specific functions
  'function mint(address to, uint256 amount) returns (bool)',
  'function burn(uint256 amount) returns (bool)',
  'function gameReward(address player, uint256 score) returns (uint256)',
  'function powerUpPurchase(address player, uint256 powerUpId, uint256 cost) returns (bool)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event GameReward(address indexed player, uint256 score, uint256 reward)',
  'event PowerUpPurchase(address indexed player, uint256 powerUpId, uint256 cost)'
] as const;

export class RektTokenContract {
  private contract: Contract | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async connect() {
    if (!this.provider) {
      throw new Error('No web3 provider found');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.signer = await this.provider.getSigner();
      this.contract = new Contract(WEB3_CONFIG.REKT_TOKEN_ADDRESS, REKT_TOKEN_ABI, this.signer);
      return true;
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<bigint> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      return await this.contract.balanceOf(address);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  async transfer(to: string, amount: bigint): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.transfer(to, amount);
      return tx.hash;
    } catch (error) {
      console.error('Failed to transfer tokens:', error);
      throw error;
    }
  }

  async claimGameReward(score: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Only claim rewards for significant scores to prevent spam
      if (score < WEB3_CONFIG.SCORE_VERIFICATION_THRESHOLD) {
        throw new Error('Score too low for reward claim');
      }

      const tx = await this.contract.gameReward(
        await this.signer!.getAddress(),
        score,
        {
          gasLimit: WEB3_CONFIG.GAS_LIMIT
        }
      );
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to claim game reward:', error);
      throw error;
    }
  }

  async purchasePowerUp(powerUpId: number, cost: bigint): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.powerUpPurchase(
        await this.signer!.getAddress(),
        powerUpId,
        cost,
        {
          gasLimit: WEB3_CONFIG.GAS_LIMIT
        }
      );
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to purchase power-up:', error);
      throw error;
    }
  }

  async getTokenInfo() {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.decimals(),
        this.contract.totalSupply()
      ]);

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply
      };
    } catch (error) {
      console.error('Failed to get token info:', error);
      throw error;
    }
  }

  // Event listeners
  onGameReward(callback: (player: string, score: number, reward: bigint) => void) {
    if (!this.contract) return;

    this.contract.on('GameReward', callback);
  }

  onPowerUpPurchase(callback: (player: string, powerUpId: number, cost: bigint) => void) {
    if (!this.contract) return;

    this.contract.on('PowerUpPurchase', callback);
  }

  removeAllListeners() {
    if (!this.contract) return;
    this.contract.removeAllListeners();
  }

  // Utility functions
  formatTokenAmount(amount: bigint, decimals: number = 18): string {
    return ethers.formatUnits(amount, decimals);
  }

  parseTokenAmount(amount: string, decimals: number = 18): bigint {
    return ethers.parseUnits(amount, decimals);
  }

  async isConnected(): Promise<boolean> {
    return this.contract !== null && this.signer !== null;
  }

  async getNetwork() {
    if (!this.provider) return null;
    return await this.provider.getNetwork();
  }

  async switchToCorrectNetwork() {
    if (!window.ethereum) {
      throw new Error('No web3 provider found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${WEB3_CONFIG.CHAIN_ID.toString(16)}` }]
      });
    } catch (error: any) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${WEB3_CONFIG.CHAIN_ID.toString(16)}`,
            chainName: WEB3_CONFIG.REQUIRED_NETWORK,
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
            blockExplorerUrls: ['https://etherscan.io']
          }]
        });
      } else {
        throw error;
      }
    }
  }
}

// Singleton instance
export const rektTokenContract = new RektTokenContract();

// Game integration helpers
export const GameTokenIntegration = {
  async calculateReward(score: number, level: number, evolutionStage: number): Promise<number> {
    // Base reward calculation
    const baseReward = Math.floor(score / 1000);
    
    // Level multiplier
    const levelMultiplier = 1 + (level * 0.1);
    
    // Evolution stage bonus
    const evolutionBonus = evolutionStage * 50;
    
    // Apply multipliers
    const totalReward = Math.floor((baseReward * levelMultiplier) + evolutionBonus);
    
    return Math.max(totalReward, 0);
  },

  async validateScoreForReward(score: number, gameTime: number): Promise<boolean> {
    // Basic anti-cheat validation
    const maxPossibleScore = gameTime * 100; // Assuming max 100 points per second
    
    if (score > maxPossibleScore * 2) {
      return false; // Likely cheated
    }
    
    return score >= WEB3_CONFIG.SCORE_VERIFICATION_THRESHOLD;
  },

  getPowerUpTokenCost(powerUpId: number): bigint {
    // Convert game token costs to blockchain token amounts
    const costs = {
      1: ethers.parseUnits('100', 18), // Unrekt Bomb
      2: ethers.parseUnits('150', 18), // Ledger Shield
      3: ethers.parseUnits('75', 18),  // Moon Leap
      4: ethers.parseUnits('125', 18), // Pump Magnet
      5: ethers.parseUnits('200', 18), // Diamond Hands
      6: ethers.parseUnits('50', 18),  // Speed Boost
    };
    
    return costs[powerUpId as keyof typeof costs] || ethers.parseUnits('100', 18);
  }
};

// React hook for easy integration
export function useRektToken() {
  return {
    contract: rektTokenContract,
    integration: GameTokenIntegration
  };
}