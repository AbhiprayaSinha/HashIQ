import * as env from 'dotenv';

class ConfigService {
  static instance: ConfigService;
  private dockerVersion: string | null = null;

  constructor() {
    if (ConfigService.instance) {
      return ConfigService.instance;
    }

    env.config({
      path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
    });
    
    ConfigService.instance = this;
  }

  public isDockerInstalled(): boolean {
    if(process.platform !== 'linux') {
      return false;
    }

    if(this.dockerVersion) return !!this.dockerVersion;

    const { execSync } = require('child_process');
    this.dockerVersion = execSync('docker -v').toString();

    return !!this.dockerVersion;
  }

  public getEnv(key: string): string | undefined {
    return process.env[key];
  }

  public isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  public getPort(): number {
    if (!process.env.PORT) return 3000;

    return parseInt(process.env.PORT, 10);
  }
}

export const configService = new ConfigService();
