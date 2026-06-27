export type PlayerId = string;
export type RoleId = string;
export type SecretCaseId = string;
export type TeamId = string;

export type RoleCategory =
  | "information"
  | "protection"
  | "pression"
  | "desordre"
  | "tempo";

export type RoleTiming =
  | "lecture"
  | "rumeurs"
  | "questions"
  | "pouvoirs"
  | "conseil"
  | "resolution"
  | "defense";

export type RoleCard = {
  id: RoleId;
  name: string;
  category: RoleCategory;
  timing: RoleTiming;
  effect: string;
  limitation: string;
  masterInstruction: string;
  playerHint: string;
  image: string;
};

export type SecretElements = {
  lieu: string;
  objet: string;
  action: string;
  mobile: string;
};

export type SecretCase = {
  id: SecretCaseId;
  title: string;
  difficulty: "facile" | "moyen" | "retors";
  elements: SecretElements;
  fullReveal: string;
  fragments: [string, string];
  soloText?: string;
  image: string;
  tutorial: string;
};

export type Player = {
  id: PlayerId;
  name: string;
  roleId: RoleId;
  secretCaseId: SecretCaseId;
  fragmentIndex: 0 | 1 | "solo";
  teamId: TeamId;
  suspicion: number;
  revealed: boolean;
  roleUsed: boolean;
  claimed: boolean;
  cardSeen: boolean;
  lastSeenAt?: string;
};

export type GamePhase =
  | "setup"
  | "joining"
  | "deal"
  | "lecture"
  | "rumeurs"
  | "questions"
  | "pouvoirs"
  | "conseil"
  | "resolution"
  | "finished";

export type AccusationVerdict = "pending" | "correct" | "false" | "blocked";

export type Accusation = {
  id: string;
  round: number;
  accuserIds: PlayerId[];
  targetPlayerIds: PlayerId[];
  claimedSecretCaseId: SecretCaseId;
  claimedElements: Partial<SecretElements>;
  verdict: AccusationVerdict;
  appliedRoleIds: RoleId[];
  createdAt: string;
  narratorText: string;
};

export type Game = {
  schemaVersion: 1;
  id: string;
  joinCode: string;
  seed: string;
  players: Player[];
  phase: GamePhase;
  round: number;
  maxRounds: number;
  accusations: Accusation[];
  revealedSecretCaseIds: SecretCaseId[];
  startedAt: string;
  updatedAt: string;
};

export type PublicPlayer = Pick<
  Player,
  "id" | "name" | "suspicion" | "revealed" | "claimed" | "cardSeen"
>;

export type PublicAccusation = Pick<
  Accusation,
  "id" | "round" | "accuserIds" | "targetPlayerIds" | "verdict" | "narratorText"
>;

export type PublicSnapshot = {
  active: boolean;
  joinCode?: string;
  phase?: GamePhase;
  round?: number;
  maxRounds?: number;
  players: PublicPlayer[];
  publicAccusations: PublicAccusation[];
};

export type PlayerSnapshot = PublicSnapshot & {
  self: {
    playerId: PlayerId;
    name: string;
    role: RoleCard;
    secretTitle: string;
    fragmentText: string;
    isRevealed: boolean;
    roleUsed: boolean;
  };
};

export type MasterSnapshot = PublicSnapshot & {
  truth: {
    players: Player[];
    secrets: SecretCase[];
    roles: RoleCard[];
  };
};

export type AccusationInput = {
  accuserIds: PlayerId[];
  targetPlayerIds: PlayerId[];
  claimedSecretCaseId: SecretCaseId;
  claimedElements: Partial<SecretElements>;
  useGardeChampetre?: boolean;
};

export type ClaimablePlayer = Pick<Player, "id" | "name" | "claimed">;
