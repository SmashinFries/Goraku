import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { WatchProps } from "../../types";
import { MediaHeader } from "../../../Components/header/mediaHeader";
import { StreamingEpType } from "../../../Api/types";
import { useHeaderHeight } from "@react-navigation/elements";
import FastImage from "react-native-fast-image";
import AwesomeButton from "react-native-really-awesome-button-fixed";
import { LinearGradient } from "expo-linear-gradient";
import { handleLink } from "../../../utils";
import { CrunchyRollSVG } from "../../../Components/svg/svgs";
import { HeaderBackButton, HeaderRightButtons } from "../../../Components/header/headers";

type renderProps = {
    item: StreamingEpType;
}
const WatchTab = ({navigation, route}:WatchProps) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const { data } = route.params;
    const { colors, dark } = useTheme();

    useEffect(() => {
        navigation.setOptions({
            headerBackgroundContainerStyle: {backgroundColor:colors.card},
            headerRight: () =>
                <HeaderRightButtons colors={colors} navigation={navigation} drawer />,
            headerLeft: () => <HeaderBackButton navigation={navigation} style={{ marginLeft: 15 }} colors={colors} />,
        });
    }, [navigation, dark]);

    const RenderItem = ({item}:renderProps) => {
        return(
          <View style={{ alignItems: 'center', alignSelf: 'center', width: '90%' }}>
            <AwesomeButton onPress={() => handleLink(item.url)} height={220} backgroundDarker='#000'>
              <FastImage source={{ uri: item.thumbnail }} style={{ height: 220, width: '100%' }} resizeMode='cover' />
              <LinearGradient colors={['transparent', '#000']} locations={[0.35, .9]} style={{ position: 'absolute', width: '100%', justifyContent: 'flex-end', height: 220 }}>
                <View style={{ width: '100%', padding: 5 }}>
                  <Text style={{ color: '#FFF', textAlign: 'center' }}>{item.title}</Text>
                </View>
                {(item.site === 'Crunchyroll') ? <CrunchyRollSVG style={{ position: 'absolute', top: 5, left: 0 }} /> : null}
              </LinearGradient>
            </AwesomeButton>
          </View>
        );
    }

    return (
        <View style={{flex:1}}>
            <MediaHeader coverImage={data.anilist.coverImage.extraLarge} />
            <Animated.FlatList
                data={data.anilist.streamingEpisodes}
                renderItem={({item, index}) => <RenderItem item={item} key={index} />}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {
                                y: scrollY,
                            }
                        }
                    }
                ], { useNativeDriver: true })}
                scrollEventThrottle={16}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingTop:10}}
                ItemSeparatorComponent={() => <View style={{height:10}} />}
            />
        </View>
    )
}

export default WatchTab;