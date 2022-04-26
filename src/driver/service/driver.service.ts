import { DRIVER_MESSAGE, DRIVE_CONFIG } from '@/core';
import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import { DriverRepository } from '@/repository';
@Injectable()
export class DriverService {
  private oauth2Client: OAuth2Client;
  private drive: drive_v3.Drive;
  constructor(private driverRepository: DriverRepository) {
    this.oauth2Client = new google.auth.OAuth2(
      DRIVE_CONFIG.CLIENT_ID,
      DRIVE_CONFIG.CLIENT_SECRET,
      DRIVE_CONFIG.REDIREC_URI,
    );
    this.oauth2Client.setCredentials({
      refresh_token: DRIVE_CONFIG.REFRESH_TOKEN,
    });
    this.drive = google.drive({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const { filename, path, mimetype } = file;
    const fileUpload = fs.createReadStream(`./${file.path}`);
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
    fs.unlinkSync(`./${file.path}`);
    const { data: linkData } = await this.generatePublicUrl(fileData.id);
    const { id: driverId, ...otherFileData } = fileData;
    const newDriverImage = this.driverRepository.create({
      driverId,
      filename,
      ...otherFileData,
      ...linkData,
    });
    return this.driverRepository.save(newDriverImage);
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
}
