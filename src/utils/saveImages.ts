import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ToastAndroid } from 'react-native';
import * as Sharing  from 'expo-sharing';
import { getSaveImgType } from '../Storage/generalSettings';

export const saveImage = async(uri:string, title:string) => {
    const fileType = await getSaveImgType();
    const isAllowed = await MediaLibrary.getPermissionsAsync();
    if (!isAllowed.granted) {
        await MediaLibrary.requestPermissionsAsync();
    }
    const fileUri = FileSystem.documentDirectory + title + '.' + fileType;
    const result = await FileSystem.downloadAsync(uri, fileUri);
    await MediaLibrary.saveToLibraryAsync(result.uri);
    ToastAndroid.show('Image Saved', ToastAndroid.SHORT);
}

export const shareImage = async(uri:string, title:string) => {
    const image_uri = await FileSystem.downloadAsync(uri, FileSystem.documentDirectory + title + '.jpg');
    const shared = await Sharing.shareAsync(image_uri.uri, {dialogTitle: 'Share Image'});
    await FileSystem.deleteAsync(image_uri.uri, {idempotent:false});
}