import { DRIVE_CONFIG } from '@/core';
import { Driver } from '@/entity';
import { DriverRepository } from '@/repository';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { drive_v3, google } from 'googleapis';
import * as readline from 'node:readline';

@Injectable()
export class DriverService {
  private oauth2Client: OAuth2Client;
  private drive: drive_v3.Drive;
  constructor(private driverRepository: DriverRepository) {
    this.oauth2Client = new google.auth.OAuth2(
      DRIVE_CONFIG.CLIENT_ID,
      DRIVE_CONFIG.CLIENT_SECRET,
      DRIVE_CONFIG.REDIRECT_URI,
    );

    // this.getAccessToken(this.oauth2Client)
    // const authUrl = this.oauth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: DRIVE_CONFIG.SCOPES,
    //   include_granted_scopes: true

    // });
    //  this.oauth2Client.on('tokens', (tokens) => {
    //     if (tokens.refresh_token) {
    //       // store the refresh_token in your secure persistent database
    //       console.log(tokens.refresh_token);
    //     }
    //     console.log(tokens.access_token);
    //   });

    // this.oauth2Client.setCredentials({
    //   access_token:'ya29.A0ARrdaM-iuL3LeYllZVkt4rcPxaADNcobMD0g5fyewPUkBqJxPIFRJQvlB3zdMOYKL7o5OyqcjuR72nkLYs9-zs3x41Db9pwwj-tYKTQZ9f-tYI0FyJ76dGb8QCcAj6WxZw8AioFXUVxZ5AgyA2qsmro7y8OB'
    // });
    this.drive = google.drive({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    isBanner = false,
    order = 0,
  ): Promise<Driver> {
    await this.getAccessToken(this.oauth2Client);
    const { filename, path, mimetype } = file;
    const { token } = await this.oauth2Client.getAccessToken();
    if (token) {
      this.oauth2Client.setCredentials({
        access_token: token,
      });
    }
    const fileUpload = fs.createReadStream(`./${path}`);
    const { data: fileData } = await this.drive.files.create({
      requestBody: {
        name: filename,
        mimeType: mimetype,
      },
      media: {
        mimeType: mimetype,
        body: fileUpload,
      },
    });
    fs.unlinkSync(`./${path}`);
    const { data: linkData } = await this.generatePublicUrl(fileData.id);
    const { id: driverId, ...otherFileData } = fileData;
    const newDriverImage = this.driverRepository.create({
      driverId,
      filename,
      ...otherFileData,
      ...linkData,
      isBanner,
      order,
    });
    return this.driverRepository.save(newDriverImage);
  }

  async uploadMultiFiles(files: Array<Express.Multer.File>) {
    await this.getAccessToken(this.oauth2Client);
    const listOldBannerDrivers = await this.driverRepository.find({
      isBanner: true,
    });
    // Remove image in driver
    await Promise.all([
      this.driverRepository.remove(listOldBannerDrivers),
      listOldBannerDrivers.map((data) => this.deleteFile(data.driverId)),
    ]);
    const promiseUploadMultiFile = files.map((file, index) =>
      this.uploadFile(file, true, index + 1),
    );
    return Promise.all(promiseUploadMultiFile);
  }

  async getBannerDriver(): Promise<Driver[]> {
    return this.driverRepository.find({ isBanner: true });
  }

  async deleteFile(fileId: string) {
    return this.drive.files.delete({
      fileId,
    });
  }

  async generatePublicUrl(fileId: string) {
    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: DRIVE_CONFIG.ROLE.READER,
        type: DRIVE_CONFIG.TYPE.ANYONE,
      },
    });
    return this.drive.files.get({
      fileId,
      fields: DRIVE_CONFIG.FIELDS,
    });
  }

  async getAccessToken(oAuth2Client: OAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: DRIVE_CONFIG.SCOPES,
      include_granted_scopes: true,
    });
    // const {tokens} = await this.oauth2Client.getToken('4/0AX4XfWgLoAEgjFQ4whLPcLB6FWMb53qs3joOiPuPTgC8D6b023ELjPZTaqLJQ3IiiQT4VQ')
    const { token } = await this.oauth2Client.getAccessToken();
    if (token) {
      this.oauth2Client.setCredentials({
        refresh_token: token,
      });
    }
    // oAuth2Client.on('tokens', (tokens) => {
    //   if (tokens.refresh_token) {
    //     // store the refresh_token in your secure persistent database
    //     console.log(tokens.refresh_token);
    //   }
    //   console.log(tokens.access_token);
    // });
    // console.log('Authorize this app by visiting this url:', authUrl);
    // const rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout,
    // });
    // rl.question('Enter the code from that page here: ', (code) => {
    //   rl.close();
    //   oAuth2Client.getToken(code, (err, token) => {
    //     if (err) return console.error('Error retrieving access token', err);
    //     oAuth2Client.setCredentials(token);
    //     // Store the token to disk for later program executions
    //     fs.writeFile(DRIVE_CONFIG.TOKEN_PATH, JSON.stringify(token), (err) => {
    //       if (err) return console.error(err);
    //       console.log('Token stored to', DRIVE_CONFIG.TOKEN_PATH);
    //     });
    //   });
    // });
  }
}
