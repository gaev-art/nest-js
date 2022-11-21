import { Injectable, OnModuleInit } from '@nestjs/common';
import { App, initializeApp } from 'firebase-admin/app';
import { credential as Credential, ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

dotenv.config();

export interface Config {
  PORT?: string;
  PREFIX?: string;
  PRICE_API_ADDRESS: string;
  FIREBASE_CREDENTIAL_TYPE: 'file' | 'raw';
  FIREBASE_CREDENTIAL_PATH?: string;
  FIREBASE_CREDENTIAL_RAW?: string;
  SENTRY_DSN: string;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  public app!: App;
  public db!: Firestore;

  constructor(private configService: ConfigService<Config, true>) {}

  async onModuleInit(): Promise<void> {
    const credentialsType = this.configService.get<
      Config['FIREBASE_CREDENTIAL_TYPE']
    >('FIREBASE_CREDENTIAL_TYPE');
    let credential: ServiceAccount;
    if (credentialsType === 'file') {
      const credentialsPath = this.configService.get(
        'FIREBASE_CREDENTIAL_PATH'
      );
      console.log('credentialsPath');
      try {
        credential = JSON.parse(
          (await fs.promises.readFile(credentialsPath)).toString()
        );
      } catch (e) {
        if (e instanceof Error)
          throw new Error('Failed to read firebase config path: ' + e.message);
        throw e;
      }
    } else {
      const raw = process.env.FIREBASE_CREDENTIAL_RAW;
      credential = JSON.parse(raw);
    }
    this.app = initializeApp({
      credential: Credential.cert(credential)
    });
    this.db = getFirestore(this.app);
  }
}
