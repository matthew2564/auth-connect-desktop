import { Injectable } from '@angular/core';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { ENV } from '../../environment/environment';

export enum Token {
  ID = 'idToken',
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

@Injectable()
export class AuthenticationProvider {

  ionicAuth: IonicAuth;
  token: any;

  constructor() {
  }

  public async initialiseAuthentication(): Promise<void> {
    this.ionicAuth = new IonicAuth(this.desktopAuthOptions);
  }

  private get desktopAuthOptions(): IonicAuthOptions {
    const authSettings = { ...ENV };
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
      },
    };
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.ionicAuth.isAuthenticated();
  }

  async login(): Promise<void> {
    return await this.ionicAuth.login();
  }

  public async logout(): Promise<void> {
    localStorage.clear();
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
}
