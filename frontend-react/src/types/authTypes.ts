import type { User } from "./users";


export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
