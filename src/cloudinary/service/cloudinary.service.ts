import { CLOUDINARY_CONFIG } from '@/core';
import { Cloundinary } from '@/entity';
import { CloundinaryReposiotry } from '@/repository';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
@Injectable()
export class CloundinaryService {
  constructor(private cloudinaryRepository: CloundinaryReposiotry) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CONFIG.NAME,
      api_key: CLOUDINARY_CONFIG.API_KEY,
      api_secret: CLOUDINARY_CONFIG.API_SECRET,
      secure: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    isBanner = false,
    order = 0,
  ): Promise<Cloundinary> {
    try {
      const path = `./${file.path}`;
      const result = await cloudinary.uploader.upload(path);
      fs.unlinkSync(`./${path}`);
      return this.cloudinaryRepository.save({ ...result, isBanner, order });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteFile(publicId: string) {
    return Promise.all([
      cloudinary.uploader.destroy(publicId),
      this.cloudinaryRepository.delete({ public_id: publicId }),
    ]);
  }

  async getIsBannerFiles(): Promise<Cloundinary[]> {
    return this.cloudinaryRepository.find({ isBanner: true });
  }

  async uploadMultiFiles(files: Array<Express.Multer.File>) {
    // get all old banners
    const oldBanners = await this.getIsBannerFiles();
    const promiseRemoveOldBanners = oldBanners.map(({ public_id }) =>
      this.deleteFile(public_id),
    );
    const promiseUploadFile = files.map((file, index) =>
      this.uploadFile(file, true, index + 1),
    );
    return Promise.all([...promiseRemoveOldBanners, ...promiseUploadFile]);
  }
}
