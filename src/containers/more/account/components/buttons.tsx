import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { List, Switch } from "react-native-paper";
import { UserOptionViewer } from "../../../../Api/types";
import { ThemeColors } from "../../../../Components/types";
import { ADULT_ALLOW } from "../../../../constants";
import { _openBrowserUrl } from "../../../../utils";

type LoginProps = {
    colors: ThemeColors;
    handleLogin: () => Promise<void>;
}

const LoginButton = ({colors, handleLogin}:LoginProps) => {
    return(
        <List.Item 
            rippleColor={colors.border} 
            title="Login"
            titleStyle={{color:colors.text}} 
            onPress={() => handleLogin()} 
            left={props => <List.Icon {...props} icon="login" color={colors.primary} />} 
        />
    );
}

type LogoutProps = {
    colors: ThemeColors;
    tokenExp: string;
    logout: () => Promise<void>;
}
const LogoutButton = ({colors, tokenExp, logout}:LogoutProps) => {
    return(
        <List.Item 
            rippleColor={colors.border} 
            title="Logout" 
            titleStyle={{color:colors.text}} 
            description={(tokenExp === null) && 'Token expired! Please re-login'} 
            descriptionStyle={{color:'red'}} 
            onPress={() => logout()} 
            left={props => <List.Icon {...props} icon="logout" color={colors.primary} />} 
        />
    );
}

type MLMenuProps = {
    userData: UserOptionViewer;
    navigation: any;
    colors: ThemeColors;
}
const MLMenuButton = ({userData, navigation, colors}:MLMenuProps) => {
    return(
        <List.Item 
            title="Media Language" 
            rippleColor={colors.border} 
            titleStyle={{color:colors.text}} 
            left={props => <List.Icon {...props} icon="earth" color={colors.primary} />} 
            onPress={() => navigation.push('Languages', {title: userData?.options.titleLanguage, staffName: userData?.options.staffNameLanguage})} 
        /> 
    );
}

type ProfileMenuProps = {
    userData: UserOptionViewer;
    colors:ThemeColors;
}
const ProfileMenuButton = ({userData, colors}:ProfileMenuProps) => {
    return(
        <List.Item
            rippleColor={colors.border}
            title="Edit Profile"
            titleStyle={{ color: colors.text }}
            onPress={() => _openBrowserUrl('https://anilist.co/settings', colors.primary, colors.text)}
            left={props => <List.Icon {...props} icon="account-edit-outline" color={colors.primary} />}
        />
    );
}

type NSFWswitchProps = {
    userData: UserOptionViewer;
    adultContentWarning: () => string;
    handleNSFW: () => Promise<void>;
    colors: ThemeColors;
}
const NSFWswitch = ({userData, adultContentWarning, handleNSFW, colors}:NSFWswitchProps) => {
    return(
        <List.Item
            title="NSFW Content"
            titleStyle={{ color: colors.text }}
            description={(userData?.options.displayAdultContent && !ADULT_ALLOW) ? adultContentWarning() : null}
            descriptionStyle={{ color: 'red' }}
            left={props => <List.Icon {...props} icon="alert-box-outline" color={colors.primary} />}
            right={() => <Switch value={(userData?.options.displayAdultContent) ? true : false} color={colors.primary} onValueChange={() => handleNSFW()} />}
        />
    );
}

export { LoginButton, LogoutButton, MLMenuButton, ProfileMenuButton, NSFWswitch };