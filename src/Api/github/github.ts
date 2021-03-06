import axios from "axios";
import { useEffect, useState } from "react";
import { VERSION } from "../../constants";
import { Current, Release } from "./types";

const RELEASE_URL = 'https://api.github.com/repos/smashinfries/goraku/releases/latest';
const CURRENT_URL = 'https://api.github.com/repos/smashinfries/goraku/releases/tags/';

export const fetchRelease = async () => {
    try {
        const res = await axios.get<Release>(RELEASE_URL);
        return res.data;
    } catch (e) {
        console.warn('Release:', e);
        return null;
    }
}

export const fetchCurrent = async (version:string) => {
    try {
        const res = await axios.get<Current>(CURRENT_URL+version);
        return res.data;
    } catch (e) {
        console.warn('Current:', e);
        return null;
    }
}

export const useRelease = () => {
    const [newVersion, setNewVersion] = useState({isNew:false, release:null});

    useEffect(() => {
        fetchRelease().then(release => {
            if (release.tag_name !== VERSION) {
                setNewVersion({isNew:true, release:release});
            }
        })
    },[]);

    return {newVersion};
}