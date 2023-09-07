import { OAuth2Client } from 'google-auth-library';
import { Injectable, Inject } from '@nestjs/common';
import { NODEMAILER_TOKEN_OPTS } from './nodemailer.constant';
import { MailOptions, NodemailerOptions } from './nodemailer.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  private oAuth2Client: OAuth2Client = null;
  constructor(
    @Inject(NODEMAILER_TOKEN_OPTS) private readonly options: NodemailerOptions,
  ) {
    this.oAuth2Client = new OAuth2Client({
      clientId: this.options.clientId,
      clientSecret: this.options.clientSecret,
    });
    this.oAuth2Client.setCredentials({
      refresh_token: this.options.refresh_token,
    });
  }

  async getAccessToken() {
    if (!this.oAuth2Client) {
      throw new Error('OAuth2Client not initialized');
    }
    const myAccessTokenObj = await this.oAuth2Client.getAccessToken();
    return myAccessTokenObj.token;
  }

  async getTransport() {
    const accessToken = await this.getAccessToken();
    console.log('ACCESS_TOKEN: ', accessToken);
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.options.user,
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
        refreshToken: this.options.refresh_token,
        accessToken,
      },
    });
  }

  async sendEmail(mailOptions: MailOptions) {
    try {
      const transport = await this.getTransport();
      await transport.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
