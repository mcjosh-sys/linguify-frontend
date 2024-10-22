import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MediaBucketService } from './media-bucket.service';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private readonly _cloudName = environment.cloudinaryCloudName;
  private readonly _uploadPresets = {
    audio: 'linguify-audio',
    image: 'linguify-image',
  };
  private readonly _allowedFormats = {
    audio: ['aac', 'aiff', 'amr', 'flac', 'm4a', 'mp3', 'ogg', 'opus', 'wav'],
    image: ['jpg', 'png', 'gif', 'bmp', 'tiff', 'svg'],
  };

  public readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(private mediaBucket: MediaBucketService) {}

  openWidget(type: 'image' | 'audio') {
    this.loading$.next(true);
    (window as any).cloudinary.openUploadWidget(
      {
        cloudName: this._cloudName,
        uploadPreset: this._uploadPresets[type],
        sources: ['local'],
        resourceType: type === 'image' ? 'image' : 'raw',
        clientAllowedFormats: this._allowedFormats[type],
      },
      (error: any, result: any) => {
        this.loading$.next(false);
        if (!error && result && result.event === 'success') {
          const mediaType =
            type === 'image' ? ('IMAGE' as 'IMAGE') : ('AUDIO' as 'AUDIO');
          const payload = {
            name: result.info.original_filename,
            src: result.info.url,
            type: mediaType,
          };
          this.mediaBucket.uploadMedia(type, payload);
          // console.log('Done! Here is the image info: ', result.info);
          // console.log(result);
        }
      }
    );
  }
}
