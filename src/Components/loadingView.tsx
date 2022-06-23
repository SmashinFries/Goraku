import { Theme } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View, Text, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { IconButton } from 'react-native-paper';
import { ThemeColors } from './types';

type Props = {
    title: string;
    loading:boolean;
    textColor:string;
    loadingColor:string
};

type LoadingViewProps = {
    colors: ThemeColors;
    titleData?: {
        title: string;
        loading:boolean;
    }[];
    mode?: 'Gif' | 'Circle';
};

const LoadingView = ({titleData, colors, mode='Gif'}:LoadingViewProps) => {
    const gifSize = {width:90, height:90}
    const LoadingDescription = ({title, loading, loadingColor, textColor}:Props) => {
        const getTitle = () => {
            switch (title) {
                case 'Anilist Data':
                    if (loading === null) return 'Nothing from Anilist'; 
                    return title;
                case 'MAL Data':
                    if (loading === null) return 'Nothing from MyAnimeList';
                    return title;
                case 'MAL Images':
                    if (loading === null) return 'No images found';
                    return title;
                case 'Tracks':
                    if (loading === null) return 'No tracks found';
                    return title;
                case 'MAL News':
                    if (loading === null) return 'No news found';
                    return title;
                default:
                    return title;
            }
        }
    
        return(
            <View style={{ flexDirection: 'row', alignItems:'center', alignSelf:'center', width:'100%', justifyContent:'flex-start' }}>
                {(!loading) ? 
                    <IconButton icon={(loading === false) ? 'check-bold' : 'close-thick'} color={(!loading && loading !== null) ? 'green' : 'red'} />
                    : <ActivityIndicator size={24} style={{padding:10}} color={loadingColor} />
                }
                <Text style={{ textAlign: 'center', color: textColor }}>{getTitle()}</Text>
            </View>
        );
    }
    
    if (!titleData) return((mode === 'Gif') ?
        <View style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}}>
            <Image source={require('../assets/loading.gif')} style={ gifSize } resizeMode='contain' />
        </View>
        :
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
    );

    return(
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
            {(mode === 'Gif') ? <View style={{ alignItems:'flex-start'}}>
                <FastImage fallback source={{ uri: 'https://giffiles.alphacoders.com/698/69845.gif' }} style={{ width: gifSize.width, height: gifSize.height, alignSelf:'center' }} resizeMode='contain' />
                {titleData.map((data, index) =>
                    <LoadingDescription key={index} title={data.title} loading={data.loading} loadingColor={colors.primary} textColor={colors.text} />
                )}
            </View>
                : <ActivityIndicator size={'large'} color={colors.primary} />
            }
        </View>
    );

}

export default LoadingView;