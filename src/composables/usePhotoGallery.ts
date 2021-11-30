import { Storage } from '@capacitor/storage'
import { isPlatform } from '@ionic/vue';
import { ref, onMounted, watch } from 'vue';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { 
  Photo, 
  Camera, 
  CameraSource, 
  CameraResultType } from '@capacitor/camera';

export interface UserPhoto {
  path?: string;
  webPath?: string;
}

const photos = ref<UserPhoto[]>([])

export function usePhotoGallery() {  
  const PHOTO_STORAGE = "photos";

  const cachePhotos = () => {
    Storage.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value)
    });
    watch(photos, cachePhotos);
  }

  const loadSaved = async () => {
    const photoList = await Storage.get({ key: PHOTO_STORAGE });
    const photosInStorage = photoList.value ? JSON.parse(photoList.value) : [];

    if (!isPlatform('hybrid')) {
      for (const photo of photosInStorage) {
        const file = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
    }

    photos.value = photosInStorage;
  }

  onMounted(loadSaved);

  const convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  const savePicture = async (
    photo: Photo,
    fileName: string,
  ): Promise<Photo> => {
  
    // Fetch the photo, read as a blob, then convert to base64 format
    let base64Data: string;
    // "hybrid" will detect mobile - iOS or Android
    if (isPlatform('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });
      base64Data = file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = await convertBlobToBase64(blob) as string;
    }
  
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });
  
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return photo;
  };

const takePhoto = async () => {
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    quality: 100,
  });

  const fileName = new Date().getTime() + '.jpeg';
  const savedFileImage = await savePicture(photo, fileName);

  photos.value = [savedFileImage, ...photos.value];
};


  return {
    photos,
    takePhoto
  };
}