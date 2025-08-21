export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Character {
  id: string;
  position: Vector3;
  velocity: Vector3;
  health: number;
  maxHealth: number;
  level: number;
  experience: number;
  evolutionStage: number;
  size: number;
  speed: number;
  jumpPower: number;
  isGrounded: boolean;
  isDead: boolean;
  lastDamageTime: number;
  invulnerabilityDuration: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Vector3;
  velocity: Vector3;
  health: number;
  damage: number;
  speed: number;
  size: number;
  isActive: boolean;
  behavior: EnemyBehavior;
  spawnTime: number;
  lastAttackTime: number;
}

export interface Coin {
  id: string;
  position: Vector3;
  value: number;
  type: CoinType;
  isCollected: boolean;
  spawnTime: number;
  floatOffset: number;
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Vector3;
  isActive: boolean;
  duration: number;
  effect: PowerUpEffect;
  spawnTime: number;
  isCollected: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  reward: number;
  isUnlocked: boolean;
  unlockedAt?: number;
  rarity: AchievementRarity;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  rektTokens: number;
  lives: number;
  level: number;
  gameTime: number;
  character: Character;
  enemies: Enemy[];
  coins: Coin[];
  powerUps: PowerUp[];
  activePowerUps: ActivePowerUp[];
  achievements: Achievement[];
  settings: GameSettings;
}

export interface ActivePowerUp {
  type: PowerUpType;
  timeRemaining: number;
  effect: PowerUpEffect;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  graphics: GraphicsQuality;
  controls: ControlSettings;
}

export interface ControlSettings {
  moveLeft: string;
  moveRight: string;
  jump: string;
  use: string;
}

export interface LeaderboardEntry {
  id: string;
  walletAddress: string;
  username: string;
  score: number;
  level: number;
  evolutionStage: number;
  timestamp: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ShopItemType;
  icon: string;
  effect: PowerUpEffect;
  isOwned: boolean;
  quantity?: number;
}

export interface EvolutionStage {
  stage: number;
  name: string;
  description: string;
  requiredLevel: number;
  healthBonus: number;
  speedBonus: number;
  sizeMultiplier: number;
  specialAbility?: string;
  modelPath: string;
}

export interface EnemyBehavior {
  patrolRadius: number;
  attackRange: number;
  aggroRange: number;
  movePattern: MovePattern;
  attackCooldown: number;
}

export interface PowerUpEffect {
  type: EffectType;
  value: number;
  duration?: number;
  isStackable: boolean;
}

export interface AchievementCondition {
  type: ConditionType;
  target: number;
  parameter?: string;
}

export interface GameEvent {
  type: GameEventType;
  timestamp: number;
  data: any;
}

export interface CollisionBox {
  min: Vector3;
  max: Vector3;
}

export interface Particle {
  id: string;
  position: Vector3;
  velocity: Vector3;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: ParticleType;
}

export interface SoundEffect {
  id: string;
  name: string;
  url: string;
  volume: number;
  loop: boolean;
}

// Enums
export enum EnemyType {
  RUG_PULL = 'rugpull',
  BEAR_BOT = 'bearbot',
  PUMP_DUMP = 'pumpdump',
  WHALE_CRUSHER = 'whalecrush',
  FUD_SPREADER = 'fudspreader'
}

export enum PowerUpType {
  UNREKT_BOMB = 'unrektbomb',
  LEDGER_SHIELD = 'ledgershield',
  MOON_LEAP = 'moonleap',
  PUMP_MAGNET = 'pumpmagnet',
  DIAMOND_HANDS = 'diamondhands',
  SPEED_BOOST = 'speedboost'
}

export enum CoinType {
  REKT_TOKEN = 'rekttoken',
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
  BONUS_COIN = 'bonuscoin'
}

export enum EffectType {
  HEALTH_BOOST = 'healthboost',
  SPEED_BOOST = 'speedboost',
  DAMAGE_BOOST = 'damageboost',
  SHIELD = 'shield',
  COIN_MAGNET = 'coinmagnet',
  INVULNERABILITY = 'invulnerability',
  JUMP_BOOST = 'jumpboost'
}

export enum MovePattern {
  PATROL = 'patrol',
  CHASE = 'chase',
  WANDER = 'wander',
  STATIONARY = 'stationary',
  ZIGZAG = 'zigzag'
}

export enum GraphicsQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra'
}

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum ConditionType {
  SCORE_REACHED = 'scorereached',
  ENEMIES_DEFEATED = 'enemiesdefeated',
  COINS_COLLECTED = 'coinscollected',
  EVOLUTION_REACHED = 'evolutionreached',
  TIME_SURVIVED = 'timesurvived',
  NO_DAMAGE_TAKEN = 'nodamagetaken'
}

export enum GameEventType {
  PLAYER_DEATH = 'playerdeath',
  ENEMY_DEFEATED = 'enemydefeated',
  COIN_COLLECTED = 'coincollected',
  POWERUP_COLLECTED = 'powerupcollected',
  EVOLUTION = 'evolution',
  ACHIEVEMENT_UNLOCKED = 'achievementunlocked',
  LEVEL_UP = 'levelup'
}

export enum ShopItemType {
  POWERUP = 'powerup',
  UPGRADE = 'upgrade',
  COSMETIC = 'cosmetic',
  ABILITY = 'ability'
}

export enum ParticleType {
  EXPLOSION = 'explosion',
  COIN_COLLECT = 'coincollect',
  DAMAGE = 'damage',
  HEAL = 'heal',
  EVOLUTION = 'evolution',
  DEATH = 'death'
}