import axios from 'axios';
import { ACTIVITY, AUTH_USER_QUERY, CHARACTERS, FILTER_QUERY, FOLLOWING_QUERY, HPQUERY, ITEMQUERY, LISTS, REVIEWS, USER_QUERY, VA_QUERY } from '../Queries/query';
import { cacheA, cacheM, cacheN, cacheS, cacheFilter } from '../Queries/query';
import { getNSFW } from '../Components/storagehooks';

const url = 'https://graphql.anilist.co';
const perPage = 8;

const date = new Date();
export const time = date.getTime();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let nextYear = year;
let season = '';
let nextSeason = '';

// Lots of if statements... :|

if (month <= 3 ) {
    season = 'WINTER';
    nextSeason = 'SPRING';
} else if (month > 3 && month <= 6 ) {
    season = 'SPRING';
    nextSeason = 'SUMMER';
} else if (month > 6 && month <= 9) {
    season = 'SUMMER';
    nextSeason = 'FALL';
} else if (month > 9 && month <= 12) {
    season = 'FALL';
    nextSeason = 'WINTER';
    nextYear +=1;
}

export const getDateDiff = (createdAt) => {
    let timeDifference = time - createdAt;
    const daysDif = Math.floor(timeDifference/1000/60/60/24);

    const hoursDif = Math.floor(timeDifference/1000/60/60);

    const minutesDif = Math.floor(timeDifference/1000/60);

    const secondsDif = Math.floor(timeDifference/1000);
    return{daysDif, hoursDif, minutesDif, secondsDif};
}

export const getSeason = async (page=1, isAdult=undefined, token=undefined) => {
    try {
        if (cacheA.Season.Page.currentPage < page || Object.keys(cacheA.Season.Page).length === 0 ) {
            const data = await axios.post(url, {query: HPQUERY, variables:{page:page, perPage:perPage, isAdult: isAdult, sort:'POPULARITY_DESC', type:"ANIME", season:season, seasonYear:year}}, 
                (typeof token !== 'string') ? {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}} : {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}} );
            const media = await data.data.data.Page.media;
            const pages = await data.data.data.Page.pageInfo;
            cacheA.Season.content = await [...cacheA.Season.content, ...media]; 
            cacheA.Season.Page = await pages;
            return cacheA.Season.content;
        }
    } catch (error) {
        console.error(error);
    }
}

export const getNextSeason = async (page=1, isAdult=undefined, token=undefined) => {
    try {
        if (cacheA.NextSeason.Page.currentPage < page || Object.keys(cacheA.NextSeason.Page).length === 0) {
            const data = await axios.post(url, {query: HPQUERY, variables:{page:page, perPage:perPage, isAdult: isAdult, sort:'POPULARITY_DESC', type:"ANIME", season:nextSeason, seasonYear:nextYear}}, 
            (typeof token !== 'string') ? {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}} : {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
            const media = await data.data.data.Page.media;
            const pages = await data.data.data.Page.pageInfo;
            cacheA.NextSeason.content = await [...cacheA.NextSeason.content, ...media];
            cacheA.NextSeason.Page = await pages;
            return cacheA.NextSeason.content;
        }
    } catch (error) {
        console.error(error);
    }
}

export const getTrend = async (type, page=1, format=undefined, isAdult=undefined, token=undefined) => {
    try {
        if (((type === "ANIME" && cacheA.Trending.Page.currentPage < page) || Object.keys(cacheA.Trending.Page).length === 0 ) ||
         ((type === "MANGA" && cacheM.Trending.Page.currentPage < page) || Object.keys(cacheM.Trending.Page).length === 0) || 
         ((format === "NOVEL" && cacheN.Trending.Page.currentPage < page) || Object.keys(cacheN.Trending.Page).length === 0)) {
            const data = await axios.post(url, {query: HPQUERY, variables:{page:page, perPage:perPage, sort:'TRENDING_DESC', isAdult: isAdult, format:format, type:type}}, 
            (typeof token !== 'string') ? {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}} : {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
            const media = await data.data.data.Page.media;
            const pages = await data.data.data.Page.pageInfo;
            if (type === "ANIME") {cacheA.Trending.content = [...cacheA.Trending.content, ...media]; cacheA.Trending.Page = pages; return cacheA.Trending.content;}
            if (type === "MANGA" && format !== "NOVEL") {cacheM.Trending.content = [...cacheM.Trending.content, ...media]; cacheM.Trending.Page = pages; return cacheM.Trending.content;}
            if (format === "NOVEL") {cacheN.Trending.content = [...cacheN.Trending.content, ...media]; cacheN.Trending.Page = pages; return cacheN.Trending.content;}
        }
    } catch (error) {
        console.error(error);
    }
}

export const getPopular = async (type, page=1, format=undefined, isAdult=undefined, token=undefined) => {
    try {
        if ((type === "ANIME" && cacheA.Popular.Page.currentPage < page || Object.keys(cacheA.Popular.Page).length === 0) || 
        (type === "MANGA" && cacheM.Popular.Page.currentPage < page || Object.keys(cacheM.Popular.Page).length === 0) || 
        (format === "NOVEL" && cacheN.Popular.Page.currentPage < page || Object.keys(cacheN.Popular.Page).length === 0)) {
            const data = await axios.post(url, {query: HPQUERY, variables:{page:page, perPage:perPage, isAdult: isAdult, sort:'POPULARITY_DESC', format:format, type:type}}, 
            (typeof token !== 'string') ? {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}} : {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
            const media = await data.data.data.Page.media;
            const pages = await data.data.data.Page.pageInfo;
            if (type === "ANIME") {cacheA.Popular.content = [...cacheA.Popular.content, ...media]; cacheA.Popular.Page = pages; return cacheA.Popular.content;}
            if (type === "MANGA" && format !== "NOVEL") {cacheM.Popular.content = [...cacheM.Popular.content, ...media]; cacheM.Popular.Page = pages; return cacheM.Popular.content;}
            if (format === "NOVEL") {cacheN.Popular.content = [...cacheN.Popular.content, ...media]; cacheN.Popular.Page = pages; return cacheN.Popular.content;}
        }
    } catch (error) {
        console.error(error);
    }
}

export const getTop = async(type, page=1, format=undefined, isAdult=undefined, token=undefined) => {
    try {
        if ((type === "ANIME" && cacheA.Top.Page.currentPage < page || Object.keys(cacheA.Top.Page).length === 0) || 
        (type === "MANGA" && cacheM.Top.Page.currentPage < page || Object.keys(cacheM.Top.Page).length === 0) || 
        (format === "NOVEL" && cacheN.Top.Page.currentPage < page || Object.keys(cacheN.Top.Page).length === 0)) {
            const data = await axios.post(url, {query: HPQUERY, variables:{page:page, perPage:perPage, isAdult: isAdult, sort:'SCORE_DESC', format:format, type:type}}, 
            (typeof token !== 'string') ? {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}} : {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
            const media = await data.data.data.Page.media;
            const pages = await data.data.data.Page.pageInfo;
            if (type === "ANIME") {cacheA.Top.content = [...cacheA.Top.content, ...media]; cacheA.Top.Page = pages; return cacheA.Top.content;}
            if (type === "MANGA" && format !== "NOVEL") {cacheM.Top.content = [...cacheM.Top.content, ...media]; cacheM.Top.Page = pages; return cacheM.Top.content;}
            if (format === "NOVEL") {cacheN.Top.content = [...cacheN.Top.content, ...media]; cacheN.Top.Page = pages; return cacheN.Top.content;}
        }
    } catch (error) {
        console.error(error);
    }
}

export const getOverview = async(id, token, page=1) => {
    try {
        const data = await axios.post(url, {query: ITEMQUERY, variables:{id:id, page:page, perPage:perPage}},
            (typeof token !== 'string') ? {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}} : {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Media;
        //console.log(data.headers["x-ratelimit-remaining"]);
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getReviews = async(id) => {
    try {
        const data = await axios.post(url, {query: REVIEWS, variables:{id:id}},
            {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Media;
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getCharacter = async(id) => {
    try {
        const data = await axios.post(url, {query: CHARACTERS, variables:{id:id}},
            {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Character;
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getVA = async(id, page=1) => {
    try {
        const data = await axios.post(url, {query: VA_QUERY, variables:{id:id, page:page, perPage:perPage, sort:"ROLE"}},
            {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Staff;
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getSearch = async(token=undefined, search=undefined, origin=undefined, isAdult=undefined, page=1, type=undefined, sort='POPULARITY_DESC', format_in=undefined, format_not_in=undefined, genre_in=undefined, genre_not_in=undefined, tag_in=undefined, tag_not_in=undefined) => {
    try {
        const data = await axios.post(url, {query: HPQUERY, variables:{
            page: page, perPage:10, search: search, origin:origin, type:type, isAdult:isAdult, sort:sort, format_in:format_in, format_not_in:format_not_in, genre_in:genre_in, genre_not_in:genre_not_in, tag_in:tag_in, tag_not_in:tag_not_in
        }},
        (typeof token !== 'string') ? {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}} : {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Page;
        //console.log(data.headers["x-ratelimit-remaining"]);
        cacheS.Page = await media.pageInfo;
        cacheS.Content = await media.media;
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getUser = async(name) => {
    try {
        const data = await axios.post(url, {query: USER_QUERY, variables:{name:name}},
            {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.User;
        //console.log(data.headers["x-ratelimit-remaining"]);
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getActivity = async(userId, page=1, perPage=10 ) => {
    try {
        const data = await axios.post(url, {query: ACTIVITY, variables:{userId:userId, page:page, perPage:perPage }},
            {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Page;
        //console.log(data.headers["x-ratelimit-remaining"]);
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getLists = async(userId, page=1, status, type, sort='UPDATED_TIME_DESC', perPage=12) => {
    try {
        const data = await axios.post(url, {query: LISTS, variables:{userId:userId, page:page, perPage:perPage, status:status, type:type, sort:sort }},
            {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Page;
        //console.log(data.headers["x-ratelimit-remaining"]);
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getFilters = async() => {
    const nsfw = await getNSFW();
    try {
        let cat = [];
        cacheFilter.splice(1);
        cacheFilter[0].data.splice(0);
        const data = await axios.post(url, {query: FILTER_QUERY},
            {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data;
        media.MediaTagCollection.forEach((item, index) => {
                if (nsfw === false) {
                (item.isAdult === false) ? cat.push(item.category) : null;
                } else {
                cat.push(item.category);
                }
        });
        cat = [...new Set(cat)]
        cat.sort();

        media.GenreCollection.forEach((genre, index) => {
            (nsfw === false && genre === 'Hentai') ? null : cacheFilter[0].data = [...cacheFilter[0].data, { id: index+'g', tag: genre, description:'No description' }]
        })
        
        cat.forEach((categ, index) => {
            let tempobj = {title: categ, data: []};
            cacheFilter.push(tempobj);
            media.MediaTagCollection.forEach((item) => {
                let pos = cacheFilter.findIndex(elem => elem['title'] == categ);
                if (categ === item.category) cacheFilter[pos].data = [...cacheFilter[pos].data, {id: item.id, tag: item.name, description:item.description}];
            })
        });
        return cacheFilter;
    } catch (error) {
        console.error(error);
    }
}

export const getAuthUserData = async(token, page=1, perPage=10) => {
    try {
        const data = await axios.post(url, {query: AUTH_USER_QUERY, variables:{page:page, perPage:perPage}},
            {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Viewer;
        return media;
    } catch (error) {
        console.error(error);
    }
}

export const getFollowing = async(userId, page=1, perPage=10) => {
    try {
        const data = await axios.post(url, {query: FOLLOWING_QUERY, variables:{userId: userId, page:page, perPage:perPage}},
            {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}});
        const media = await data.data.data.Page;
        return media;
    } catch (error) {
        console.error(error);
    }
}