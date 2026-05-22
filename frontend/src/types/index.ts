export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nickname: string;
    email: string;
  };
}

export interface PaintResponse {
  id: number;
  brand: string;
  brandOther?: string;
  colorName: string;
  colorCode?: string;
  r: number;
  g: number;
  b: number;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface PaintRequest {
  brand: string;
  brandOther?: string;
  colorName: string;
  colorCode?: string;
  r: number;
  g: number;
  b: number;
  notes?: string;
}

export interface MixRequest {
  targetR: number;
  targetG: number;
  targetB: number;
  maxPaints?: number;
}

export interface MixCandidate {
  components: {
    paintId: number;
    paintName: string;
    ratio: number;
    traceAmount: boolean;
  }[];
  mixedR: number;
  mixedG: number;
  mixedB: number;
  deltaE: number;
  previewHex: string;
}

export interface MixResponse {
  tricolor: {
    cyan: number;
    magenta: number;
    yellow: number;
    white: number;
  };
  candidates: MixCandidate[];
}

export interface RecipeRequest {
  name: string;
  description?: string;
  targetR?: number;
  targetG?: number;
  targetB?: number;
  components: {
    paintId: number;
    ratio: number;
  }[];
}

export interface RecipeResponse {
  id: number;
  name: string;
  description?: string;
  targetR?: number;
  targetG?: number;
  targetB?: number;
  components: {
    paintId: number;
    paintName?: string;
    ratio: number;
  }[];
  createdAt: string;
}
