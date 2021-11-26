//onMounted, watch 
// import { ref} from 'vue';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { Filesystem, Directory } from '@capacitor/filesystem'
// // import { Storage } from '@capacitor/storage'
// import { usePhotoGallery } from '@/composables/usePhotoGallery';


// export function usePhotoGallery() {
//     const takePhoto = async () => {
//         const cameraPhoto = await Camera.getPhoto({
//             resultType: CameraResultType.Uri,
//             source: CameraSource.Camera,
//             quality: 100
//         });

//         const fileName = new Date().getTime() + '.jpeg';
//         const savedFileImage = {
//             filepath: fileName,
//             webviewPath: cameraPhoto.webPath
//         };
    
//         photos.value = [savedFileImage, ...photos.value];
//     };

    
//     return {
//         photos,
//         takePhoto
//     };
// }


// export interface UserPhoto {
//     filepath: string;
//     webviewPath?: string;
//     takePhoto?: any;
// }
// const photos = ref<UserPhoto[]>([])

// const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onerror = reject;
//     reader.onload = () => {
//         resolve(reader.result);
//     };
//     reader.readAsDataURL(blob);
// });

//  const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
  
//     // Fetch the photo, read as a blob, then convert to base64 format
//     const response = await fetch(photo.webPath!);
//     const blob = await response.blob();
//     const base64Data = await convertBlobToBase64(blob) as string;
  
//     await Filesystem.writeFile({
//       path: fileName,
//       data: base64Data,
//       directory: Directory.Data
//     });
  
//     // Use webPath to display the new image instead of base64 since it's
//     // already loaded into memory
//     return {
//      path: fileName,
//      webPath: photo.webPhoto
//     };
//   }
  

import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Storage } from '@capacitor/storage'

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
  }

export function usePhotoGallery() {
    const photos = ref<UserPhoto[]>([]);

    const takePhoto = async () => {
        const cameraPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });

        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = {
            filepath: fileName,
            webviewPath: cameraPhoto.webPath
        };
        photos.value = [savedFileImage, ...photos.value];
    };

    const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
    
    return {
        photos,
        takePhoto
    };
}


  
