import { NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, Text, useWindowDimensions, ScrollView, Pressable, FlatList } from "react-native";
import FastImage from "react-native-fast-image";
import { Avatar, Button, IconButton } from "react-native-paper";
import RenderHtml from "react-native-render-html";
import { CharDetailShort, CharFullEdge, MalCharImagesShort } from "../../../Api/types";
import { SiteButton } from "../../../Components/buttons/siteButtons";
import { ThemeColors } from "../../../Components/types";
import { getDate, handleCopy, _openBrowserUrl } from "../../../utils";

type CharacterHeaderProps = {
    data:CharDetailShort;
    date:Date;
    colors:ThemeColors;
}
const CharacterHeaderImage = ({data, date, colors}:CharacterHeaderProps) => {
    const origin = data.media.edges[0].node.countryOfOrigin;
    const birthdayJP = ['Happy Birthday!', 'Tanjoubi Omedetou!', 'お誕生日おめでとう！']
    const birthdayKR = ['Happy Birthday!', 'Saengil Chukahae', '생일 축하해!']
    const birthdayCN = ['Happy Birthday!', 'Shēngrì Kuàilè', '生日快乐!']

    const getBirthday = () => {
        if (origin === 'JP') return birthdayJP;
        if (origin === 'KR') return birthdayKR;
        if (origin === 'CN' || origin === 'TW') return birthdayCN;
        if (!origin) return birthdayJP;
    }
    const birthdayLang = getBirthday();
    const emojis = ['🎉', '🥳', '🎈', '🎂', '🎁'];
    const [emoji, setEmoji] = useState(emojis[Math.floor(Math.random() * emojis.length)]);
    const [birthdayIndex, setBirthdayIndex] = useState(0);


    const switchLanguage = (count:number) => {
        if (count < 2) {
            count +=1;
            setBirthdayIndex(count);
        } else {
            count = 0;
            setBirthdayIndex(0);
        }
        return count;
    }

    useEffect(() => {
        if (date.getDate() + 1 === data.dateOfBirth.day && date.getMonth() + 1 === data.dateOfBirth.month) {
            let count = 0;
            const interval = setInterval(() => {
                const randomEmoji = Math.floor(Math.random() * emojis.length);
                setEmoji(emojis[randomEmoji]);
                count = switchLanguage(count);
            }, 2000);
            return () => {
                clearInterval(interval);
            };
        }
    },[])
    
    return (
        <Pressable style={{ height: 290, width: 180 }}>
                <FastImage source={{ uri: data?.image.large }} style={{ height: 290, width: 180, marginTop: 10, marginLeft: 10, borderRadius: 12, borderWidth: .5 }} />
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']} locations={[0.80, 1]} style={{ position: 'absolute', justifyContent: 'flex-end', marginLeft: 10, marginTop: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, height: '100%', width: '100%' }}>
                    {(date.getDate() + 1 === data.dateOfBirth.day && date.getMonth() + 1 === data.dateOfBirth.month) ? 
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom:5}}>
                        <Text style={{ fontSize:14, color:'#FFF'}}>{emoji}{birthdayLang[birthdayIndex]}{emoji}</Text>                    
                    </View> : null}
                </LinearGradient>
        </Pressable>
    );
}

const CharacterOverview = ({data, colors}:{data:CharDetailShort, colors:ThemeColors}) => {
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
            <Text onLongPress={() => handleCopy(data?.name?.userPreferred)} style={{ textAlign: 'left', fontSize: 22, fontWeight: 'bold', color: colors.text }}>{data?.name?.userPreferred}</Text>
            <Text onLongPress={() => handleCopy(data?.name?.native)} style={{ textAlign: 'left', fontSize: 18, color: colors.text }}>{data?.name?.native}</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Avatar.Icon icon='heart' size={24} color='red' style={{backgroundColor:'transparent'}} />
                <Text style={{color: colors.text}}>{data.favourites}</Text>
            </View>
            {(data?.dateOfBirth.day) ? <Text style={{ textAlign: 'left', fontSize: 15, color: colors.text }}>{'\n'}Birthday: {getDate(data.dateOfBirth)}</Text> : null}
        </View>
    );
}

type CharacterDescProps = {
    data:CharDetailShort;
    width:number;
    colors:ThemeColors;
}
const CharacterDescription = ({data, width, colors}:CharacterDescProps) => {
    return(
        <RenderHtml defaultTextProps={{ selectable: true }} tagsStyles={{ body: { color: colors.text } }} enableExperimentalBRCollapsing contentWidth={width} source={{ html: data.description }} />
    );
}

type CharButtonsProps = {
    data:CharDetailShort;
    links: { aniLink:string; malLink:string; };
    favorite:boolean;
    toggleLike: () => void;
    colors:ThemeColors;
}
const CharacterBody = ({data, links, favorite, toggleLike, colors}:CharButtonsProps) => {
    const {width, height} = useWindowDimensions();
    return(
        <View style={{ flex: 1, marginTop: 30, paddingHorizontal: 10 }}>
            <Button mode={(favorite) ? 'contained' : 'outlined'} onPress={toggleLike} icon={(!favorite) ? 'heart-outline' : 'heart'} color={'red'} style={{ borderColor: 'red', borderWidth: (favorite) ? 0 : 1 }}>
                {(favorite) ? 'Favorited' : 'Favorite'}
            </Button>
            <CharacterDescription data={data} width={width} colors={colors} />
            <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%', paddingVertical:10}}>
                <View style={{minWidth:'45%'}}>
                    <SiteButton type='anilist' link={links?.aniLink} colors={colors} width='100%' height={40} />
                </View>
                {(links?.malLink) && <View style={{minWidth:'45%'}}><SiteButton type="mal" link={links.malLink} colors={colors} width='100%' height={40} /></View>}
            </View>
        </View>
    );
}

type CharFeaturedProps = {
    data:CharDetailShort;
    parNav:NavigationProp<any>;
    colors:ThemeColors;
}
const CharacterFeatured = ({data, parNav, colors}:CharFeaturedProps) => {
    const FeaturedItem = ({ relation }:{relation:CharFullEdge}) => {
        const mediaNav = () => {
            (parNav.getState().type === 'stack') ? 
            // @ts-ignore
            parNav.push('DrawerInfo', {id: relation.node.id}) :
            parNav.navigate('Info', { id: relation.node.id});
        }
        
        const searchNav = 
        parNav.getState().type
        return (
            <Pressable onPress={mediaNav} style={{ marginHorizontal: 10, borderRadius:8, width:140, height:200 }} >
                <LinearGradient locations={[0, 1]} colors={['rgba(0,0,0,.3)', 'rgba(0,0,0,.9)']} style={{ position: 'absolute', width: 140, height: 200, borderRadius:8, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <View style={{position:'absolute', alignSelf:'center', top:0}}>
                        <Text style={{ color: '#FFF', fontWeight:'bold', textTransform: 'capitalize' }}>{relation.node.format?.replace('_', ' ') ?? null}</Text>
                    </View>
                    <Text numberOfLines={3} style={{ fontWeight:'bold', color: '#FFF', textAlign:'center', textTransform: 'capitalize' }}>{relation.node.title.userPreferred ?? null}</Text>
                </LinearGradient>
                <FastImage source={{ uri: relation.node.coverImage.extraLarge }} style={{ width: 140, zIndex: -1, height: 200, borderRadius:8, position: 'absolute' }} />
            </Pressable>
        );
    }

    return(
        <>
            <Text style={{ fontSize: 34, fontWeight: 'bold', paddingHorizontal: 10, color: colors.text }}>Featured In</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {data.media?.edges.map((relation, index) => <FeaturedItem key={index} relation={relation} />)}
            </ScrollView>
        </>
    );
}

type CharacterImagesProps = {
    images: MalCharImagesShort[];
    setSelectedImg: Dispatch<SetStateAction<number>>;
    setVisible: Dispatch<SetStateAction<boolean>>;
    colors: ThemeColors;
}
const CharacterImages = ({images, setSelectedImg, setVisible, colors}:CharacterImagesProps) => {
    const imageSize = [120, 180];

    type imageProp = {
        image: MalCharImagesShort;
        index: number;
    }
    const ImageItem = ({ image, index }: imageProp) => {
        return (
            <Pressable onPress={() => { setSelectedImg(index); setVisible(true) }} style={{ flexDirection: 'row', height: imageSize[1], width: imageSize[0], marginHorizontal: 10, marginTop: 10, }}>
                <FastImage fallback source={{ uri: image.jpg.image_url }} style={{ height: imageSize[1], width: imageSize[0] }} resizeMode={'contain'} />
            </Pressable>
        );
    }

    if (images === undefined && images?.length < 0) return null;
    return(
        <View style={{ flex: 1, marginTop: 30, marginBottom: 20 }}>
            <Text style={{ fontSize: 34, fontWeight: 'bold', paddingHorizontal: 10, color: colors.text }}>Images</Text>
            <FlatList
                data={images}
                renderItem={({ item, index }) => <ImageItem image={item} index={index} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}

export { CharacterHeaderImage, CharacterOverview, CharacterBody, CharacterFeatured, CharacterImages };