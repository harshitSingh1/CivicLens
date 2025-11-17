export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'authority';
  profilePicture?: string;
  points: number;
  badges: string[];
  level: number;
  verified: boolean;
  location?: {
    state: string;
    district: string;
    pincode: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword?(candidatePassword: string): Promise<boolean>;
}

export interface IAuthTokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh?: {
    token: string;
    expires: Date;
  };
}

export interface ILoginResponse {
  user: Omit<IUser, 'password'>;
  tokens: IAuthTokens;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'authority';
}

export interface ILoginInput {
  email: string;
  password: string;
}