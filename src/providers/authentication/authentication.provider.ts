import { Injectable } from '@angular/core';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { ENV } from '../../environment/environment';
import { Loading } from 'ionic-angular';

export enum Token {
  ID = 'idToken',
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
  AUTH_RESPONSE = 'authResponse'
}

@Injectable()
export class AuthenticationProvider {

  ionicAuth: IonicAuth;
  token: any;
  loading: Loading;

  constructor() {
  }

  public async initialiseAuthentication(): Promise<void> {
    this.ionicAuth = new IonicAuth(this.desktopAuthOptions);
  }

  private get desktopAuthOptions(): IonicAuthOptions {
    const authSettings = { ...ENV };

    // return this.getPopupImplicitFlow(authSettings);
    return this.getCurrentImplicitFlow(authSettings);
  }

  private getPopupImplicitFlow(authSettings: any): IonicAuthOptions {
    return {
      logLevel: 'DEBUG',
      authConfig: 'azure',
      platform: 'web',
      clientID: authSettings.clientId,
      discoveryUrl: `${authSettings.context}/v2.0/.well-known/openid-configuration?appid=${authSettings.clientId}`,
      redirectUri: `http://localhost:8100/`,
      scope: 'openid offline_access profile email',
      logoutUrl: authSettings.logoutUrl,
      webAuthFlow: 'implicit',
      implicitLogin: 'POPUP',
      tokenStorageProvider: {
        getAccessToken: async () => localStorage.getItem(Token.ACCESS),
        setAccessToken: async (token: string) => localStorage.setItem(Token.ACCESS, token),
        getIdToken: async () => localStorage.getItem(Token.ID),
        setIdToken: async (token: string) => localStorage.setItem(Token.ID, token),
        getRefreshToken: async () => localStorage.getItem(Token.REFRESH),
        setRefreshToken: async (token: string) => localStorage.setItem(Token.REFRESH, token),
        getAuthResponse: async () => localStorage.getItem(Token.AUTH_RESPONSE),
        setAuthResponse: async (token: string) => localStorage.setItem(Token.AUTH_RESPONSE, token),
      },
    };
  }

  private getCurrentImplicitFlow(authSettings: any): IonicAuthOptions {
    return {
      logLevel: 'DEBUG',
      authConfig: 'azure',
      platform: 'web',
      clientID: authSettings.clientId,
      discoveryUrl: `${authSettings.context}/v2.0/.well-known/openid-configuration?appid=${authSettings.clientId}`,
      redirectUri: `http://localhost:8100/`,
      scope: 'openid offline_access profile email',
      logoutUrl: `http://localhost:8100/`,
      webAuthFlow: 'implicit',
      iosWebView: 'private',
      implicitLogin: 'CURRENT',
      tokenStorageProvider: {
        getAccessToken: async () => localStorage.getItem(Token.ACCESS),
        setAccessToken: async (token: string) => localStorage.setItem(Token.ACCESS, token),
        getIdToken: async () => localStorage.getItem(Token.ID),
        setIdToken: async (token: string) => localStorage.setItem(Token.ID, token),
        getRefreshToken: async () => localStorage.getItem(Token.REFRESH),
        setRefreshToken: async (token: string) => localStorage.setItem(Token.REFRESH, token),
        getAuthResponse: async () => JSON.parse(localStorage.getItem(Token.AUTH_RESPONSE)),
        setAuthResponse: async (token: string) => localStorage.setItem(Token.AUTH_RESPONSE, JSON.stringify(token)),
      },
    };
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.ionicAuth.isAuthenticated();
  }

  async login(loading: Loading = null): Promise<void> {
    if (loading) {
      this.loading = loading;
    }
    return await this.ionicAuth.login();
  }

  public async logout(): Promise<void> {
    localStorage.clear();
    await this.ionicAuth.clearStorage();
    await this.ionicAuth.logout();
  }

  async getIdToken(): Promise<any> {
    return await this.ionicAuth.getIdToken();
  }

  getUsername = async (): Promise<string> => {
    this.token = await this.getIdToken();
    if (!this.token) {
      return '';
    }
    return this.token.name;
  }

  public getAuthenticationToken = async () => {
    await this.isAuthenticated();
    return localStorage.getItem(Token.ID);
  }

  manualRefresh = async (): Promise<void> => {
    await this.ionicAuth.refreshSession();
  }

  async getTokenExpiry(): Promise<number> {
    try {
      return await this.ionicAuth.getAccessTokenExpiration();
    } catch {
      return null;
    }
  }

  async handleLoginCallback(url: string, loading: Loading): Promise<void> {
    await loading.dismiss();
    await this.ionicAuth.handleLoginCallback(url);
  }
}
