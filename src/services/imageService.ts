import { launchCamera, launchImageLibrary, type ImagePickerResponse, type CameraOptions, type ImageLibraryOptions } from 'react-native-image-picker';

const commonOptions = {
  mediaType: 'photo' as const,
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.8 as const,
  includeBase64: false,
};

function extractUri(response: ImagePickerResponse): string | null {
  if (response.didCancel || response.errorCode) {
    return null;
  }
  const asset = response.assets?.[0];
  return asset?.uri ?? null;
}

export async function pickImage(): Promise<string | null> {
  const options: ImageLibraryOptions = {
    ...commonOptions,
    selectionLimit: 1,
  };

  const response = await launchImageLibrary(options);
  return extractUri(response);
}

export async function takePhoto(): Promise<string | null> {
  const options: CameraOptions = {
    ...commonOptions,
    saveToPhotos: false,
  };

  const response = await launchCamera(options);
  return extractUri(response);
}

export async function pickMultipleImages(maxCount: number = 5): Promise<string[]> {
  const options: ImageLibraryOptions = {
    ...commonOptions,
    selectionLimit: maxCount,
  };

  const response = await launchImageLibrary(options);

  if (response.didCancel || response.errorCode) {
    return [];
  }

  return (response.assets ?? [])
    .map(asset => asset.uri)
    .filter((uri): uri is string => uri != null);
}
