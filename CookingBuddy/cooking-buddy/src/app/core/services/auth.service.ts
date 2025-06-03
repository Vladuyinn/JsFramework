import { computed, Injectable, signal } from '@angular/core';
import {
  User,
  CreateUserDto,
  LoginResponse,
  ReadOnlyUser,
} from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERS_KEY = 'app_users';
  private readonly CURRENT_USER_KEY = 'current_user';
  private readonly TOKEN_KEY = 'auth_token';

  private _currentUser = signal<User | null>(this._getCurrentUserFromStorage());
  // Crée une version readonly du currentUser et enlève le password.
  public currentUser = computed<ReadOnlyUser | null>(() => {
    const currentUser = this._currentUser();

    if (currentUser) {
      const readOnlyUser = { ...currentUser, password: undefined };

      delete readOnlyUser.password;
      return readOnlyUser;
    }
    return null;
  });

  constructor() {
    // Initialiser avec l'utilisateur stocké s'il existe
    const storedUser = this._getCurrentUserFromStorage();

    if (storedUser) {
      this._currentUser.set(storedUser);
    }
  }

  get isAuthenticated(): boolean {
    return !!this._currentUser && !!this._getToken();
  }

  // Créer un nouvel utilisateur
  register(userData: CreateUserDto): LoginResponse {
    // Vérifier si l'email existe déjà
    const existingUsers = this._getAllUsers();
    const emailExists = existingUsers.some(
      (user) => user.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: this._generateId(),
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date(),
    };

    // Stocker l'utilisateur
    this._saveUser(newUser);

    // Connecter automatiquement l'utilisateur
    const token = this._generateToken();

    this._setCurrentUser(newUser, token);

    return {
      user: newUser,
      token,
    };
  }

  // Connexion utilisateur
  login(email: string, password: string): LoginResponse {
    const users = this._getAllUsers();
    const userData = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!userData) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe (dans un vrai app, c'est côté serveur)
    if (userData.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = this._generateToken();

    this._setCurrentUser(userData, token);

    return {
      user: userData,
      token,
    };
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this._currentUser.set(null);
  }

  // Vérifier si un email existe
  checkEmailExists(email: string): boolean {
    return this._getAllUsers().some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Méthodes privées
  private _getAllUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);

    return users ? JSON.parse(users) : [];
  }

  private _saveUser(user: User): void {
    const users = this._getAllUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private _setCurrentUser(user: User, token: string): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
    this._currentUser.set(user);
  }

  private _getCurrentUserFromStorage(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);

    return user ? JSON.parse(user) : null;
  }

  private _getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private _generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private _generateToken(): string {
    return (
      'token_' + Date.now().toString() + Math.random().toString(36).substr(2, 9)
    );
  }
}
