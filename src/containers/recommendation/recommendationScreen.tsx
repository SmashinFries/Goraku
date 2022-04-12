import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useContext } from "react";
import { View, Text, ActivityIndicator, FlatList, Animated, useWindowDimensions, Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import AwesomeButton from "react-native-really-awesome-button-fixed";
import { AntDesign } from '@expo/vector-icons';
import { Avatar, IconButton } from 'react-native-paper';
import { getRecommendations, saveRecommendation } from "../../Api/anilist/anilist";
import { RecommendationInfoType, RecommendationMediaType, RecommendationsFullType } from "../../Api/types";
import { LinearGradient } from "expo-linear-gradient";
import { RecommendationProps } from "../types";
import { LoadingView, PressableAnim } from "../../Components";
import { getIsAuth } from "../../Storage/authToken";
import SelectDropdown from "react-native-select-dropdown";
import { openURL } from "expo-linking";
import { useAnilistAuth } from "../../auth/auth";
import { AccountContext } from "../../contexts/context";

const RecSort = {
    'Recent': 'ID_DESC',
    'Highest Rated': 'RATING_DESC',
    'Lowest Rated': 'RATING',
}

type RenderItem = {
    item: RecommendationInfoType;
    index: number;
}

type PageState = {
    currentPage: number;
    hasNextPage: boolean;
}
export const RecommendationScreen = ({navigation, route}:RecommendationProps) => {
    const [data, setData] = useState<RecommendationInfoType[]>();
    const [pageInfo, setPageInfo] = useState<PageState>();
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [sort, setSort] = useState<string>('ID_DESC');
    const { isAuth, setIsAuth } = useContext(AccountContext);

    const {colors, dark} = useTheme();
    const { width, height } = useWindowDimensions();

    const handleFetch = async(page:number, perPage:number):Promise<RecommendationsFullType> => {
        const resp = await getRecommendations(page, perPage, [sort]);
        return resp.data;
    }

    const handlePress = async(index:number, baseId:number, recId:number, rating:'NO_RATING'|'RATE_UP'|'RATE_DOWN') => {
        const res = await saveRecommendation(baseId, recId, rating);
        const newArray = [...data];
        newArray[index].userRating = rating;
        newArray[index].rating = res.data.SaveRecommendation.rating;
        setData(newArray);
    }

    const fetchMore = async() => {
        if (pageInfo.hasNextPage) {
            const newData = await handleFetch(pageInfo.currentPage + 1, 8);
            setData([...data, ...newData.data.Page.recommendations]);
            setPageInfo(newData.data.Page.pageInfo);
        }
    }

    const DropDown = () => {
        return(
            <SelectDropdown 
                data={Object.keys(RecSort)} 
                defaultValue={'ID_DESC'}
                defaultButtonText={Object.keys(RecSort).find(k=>RecSort[k]===sort)}
                dropdownStyle={{backgroundColor:colors.card, borderRadius:12}}
                rowStyle={{backgroundColor:colors.card, borderBottomWidth:0}}
                buttonStyle={{backgroundColor:colors.background, borderRadius:12, height:40, width:150}}
                renderDropdownIcon={() => <AntDesign name="down" size={16} color={colors.primary} style={{ marginRight: 10 }} />}
                rowTextStyle={{textTransform:'capitalize', color:colors.text}}
                buttonTextStyle={{textTransform:'capitalize', color:colors.text}}
                onSelect={(selected, index) => setSort(RecSort[selected])} 
                buttonTextAfterSelection={(selected, index) => {return selected}}
                rowTextForSelection={(item, index) => {return item}}
            />
        );
    }

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {backgroundColor: colors.card},
            headerRight: () => 
            <DropDown />
        });
    },[navigation, sort, dark]);

    useEffect(() => {
        if (data === undefined) {
            handleFetch(1, 8).then(resp => {
                setData(resp.data.Page.recommendations);
                setPageInfo(resp.data.Page.pageInfo);
            }).then(() => setLoading(false));
        }
    },[]);

    useEffect(() => {
        handleFetch(1, 8).then(resp => {
            setData(resp.data.Page.recommendations);
            setPageInfo(resp.data.Page.pageInfo);
        }).then(() => setLoading(false));
    },[sort]);

    const refreshList = async() => {
        setRefreshing(true);
        const resp = await handleFetch(1, 10);
        setData(resp.data.Page.recommendations);
        setPageInfo(resp.data.Page.pageInfo);
        setRefreshing(false);
    }

    const pressNav = (media:RecommendationMediaType) => {
        // @ts-ignore
        navigation.navigate('RecInfo', { screen:'DrawerInfo', params: {
            id: media.id, 
            coverImage: media.coverImage.extraLarge, 
            type: media.type
        }
        });
    }

    type MediaButtonProps = {onPress:()=>void; title:string; cover:string; mode:'Bottom'|'Top';}
    const MediaButton = ({onPress, title, cover, mode}:MediaButtonProps) => {
        const borderRadius = (mode === 'Bottom') ?
            {borderTopRightRadius:0, borderTopLeftRadius:0, borderRadius:12} :
            {borderBottomRightRadius:0, borderBottomLeftRadius:0, borderRadius:12};

        return (
            <View style={[borderRadius, { overflow:'hidden' }]}>
                <Pressable onPress={onPress} android_ripple={{color:colors.primary}} style={[borderRadius, { height: 120, width: (width * 90) / 100}]}>
                    <View style={[borderRadius, {overflow:'hidden', margin:2}]}>
                        <FastImage fallback source={{ uri: cover }} style={[borderRadius, { height: '100%', width: '99%' }]} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,.6)']} locations={[.5, .9]} style={[borderRadius, { position: 'absolute', width: '99%', height: '100%', justifyContent: 'flex-end' }]} >
                            <Text numberOfLines={2} style={{ color: '#FFF', textAlign: 'center', paddingHorizontal: 5, fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
                        </LinearGradient>
                    </View>
                </Pressable>
            </View>
        );
    }

    if (loading) return <LoadingView colors={{colors, dark}} />
    
    const RenderItem = ({item, index}:RenderItem) => {
        return(
                <View style={{flex:1, borderWidth:2, borderColor:colors.border, marginVertical:20, backgroundColor:colors.card, marginHorizontal:10, borderRadius:12}}>
                    <MediaButton mode='Top' onPress={() => pressNav(item.media)} title={item.media.title.userPreferred} cover={(item.media.bannerImage !== null) ? item.media.bannerImage : item.media.coverImage.extraLarge} />
                    <View style={{alignItems:'center', marginVertical:10, justifyContent:'center'}}>
                        {isAuth ? <View style={{flexDirection:'row', alignItems:'center'}}> 
                            <IconButton 
                                icon={(item.userRating === 'RATE_UP') ? 'thumb-up' : 'thumb-up-outline'} 
                                color={(item.userRating === 'RATE_UP') ? colors.primary : colors.text} 
                                style={{alignSelf:'center'}}
                                size={28}
                                onPress={() => handlePress(index, item.media.id, item.mediaRecommendation.id, (item.userRating !== 'RATE_UP') ? 'RATE_UP' : 'NO_RATING')}
                            />
                            <Text style={{textAlign:'center', paddingHorizontal:10, textAlignVertical:'center', color:colors.text}}>{(Math.sign(item.rating) !== -1) ? '+' : ''}{item.rating}</Text>
                            <IconButton 
                                icon={(item.userRating === 'RATE_DOWN') ? 'thumb-down' : 'thumb-down-outline'} 
                                color={(item.userRating === 'RATE_DOWN') ? colors.primary : colors.text} 
                                style={{alignSelf:'center'}}
                                size={28}
                                onPress={() => handlePress(index, item.media.id, item.mediaRecommendation.id, (item.userRating !== 'RATE_DOWN') ? 'RATE_DOWN' : 'NO_RATING')}
                            />
                        </View> : <Text style={{textAlign:'center', color:colors.text}}>{(Math.sign(item.rating) !== -1) ? '+' : ''}{item.rating}</Text>}
                        <View style={{borderRadius:12, overflow:'hidden'}}>
                            <Pressable onPress={() => openURL(item.user.siteUrl)} android_ripple={{color:colors.primary}} style={{padding:3, borderRadius:12}}>
                                <View style={{flexDirection:'row', alignItems:'center', backgroundColor:colors.card, borderRadius:12,}}>
                                    <Avatar.Image source={{uri:item.user.avatar.large}} size={40} />
                                    <Text style={{paddingLeft:5, color:colors.text}}>{`${item.user.name}`}</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                    <MediaButton mode='Bottom' onPress={() => pressNav(item.mediaRecommendation)} title={item.mediaRecommendation.title.userPreferred} cover={(item.mediaRecommendation.bannerImage !== null) ? item.mediaRecommendation.bannerImage : item.mediaRecommendation.coverImage.extraLarge} />
                </View>
        );
    }

    return (
        <View style={{flex:1}}>
            <FlatList 
                data={data}
                renderItem={({item, index}) => <RenderItem item={item} index={index} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{marginHorizontal:10}}
                onRefresh={refreshList}
                refreshing={refreshing}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
}