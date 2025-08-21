// REKT Token stub for future Web3 implementation
export const REKT_TOKEN_ABI = [] as const;

export class RektTokenService {
  static async connect(): Promise<void> {
    throw new Error('Web3 not implemented in MVP');
  }

  static async getBalance(): Promise<number> {
    return 0;
  }

  static async claimTokens(): Promise<void> {
    throw new Error('Web3 not implemented in MVP');
  }
}

export default RektTokenService;