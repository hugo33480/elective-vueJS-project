import axios, {AxiosError} from 'axios';
import {LocationQueryValue} from "vue-router";

export default class RiotApiService {
    static apiKey: string = "RGAPI-a6e09577-ad44-4fe9-b9ac-ff4f442ffd1c";

    static SOLOQ_TYPE: string = "RANKED_SOLO_5x5";
    static FELXQ_TYPE: string = "RANKED_FLEX_SR";
    static rankedQueue = [
        {type: this.SOLOQ_TYPE, id: 420, label: "Classé solo/duo"},
        {type: this.FELXQ_TYPE, id: 440, label: "Classé flexible"},
        {type: '', id: 400, label: "Normal draft"},
        {type: '', id: 430, label: "Normal aveugle"},
        {type: '', id: 450, label: "Normal ARAM"},
    ];

    public static async summoner(summonerName: string): Promise<any> {
        try {
            return await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${this.apiKey}`);
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status == 404) {
                    return {
                        data: undefined
                    }
                }
            }
        }
    }

    public static async spectator(summonerId: string): Promise<any> {
        try {
            return await axios.get(`https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}?api_key=${this.apiKey}`);
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status == 404) {
                    return {
                        data: undefined
                    }
                }
            }
        }
    }

    public static async champions(): Promise<any> {
        try {
            return await axios.get("https://ddragon.leagueoflegends.com/cdn/13.8.1/data/fr_FR/champion.json");
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error(e);
            }
        }
    }

    public static async champion(name: string): Promise<any> {
        try {
            return await axios.get(`https://ddragon.leagueoflegends.com/cdn/13.8.1/data/fr_FR/champion/${name}.json`);
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error(e);
            }
        }
    }

    public static async championMastery(summonerId: string, champKey: string): Promise<any> {
        try {
            return await axios.get(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/by-champion/${champKey}?api_key=${this.apiKey}`);
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status == 404) {
                    return {
                        data: undefined
                    }
                }
                console.error(e);
            }
        }
    }

    public static async rank(summonerId: string): Promise<any> {
        try {
            return await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${this.apiKey}`);
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error(e);
            }
        }
    }

    public static async summonerSpells(): Promise<any> {
        try {
            return await axios.get(`https://ddragon.leagueoflegends.com/cdn/13.8.1/data/fr_FR/summoner.json`);
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error(e);
            }
        }
    }

    public static async perks(): Promise<any> {
        try {
            return await axios.get(`https://ddragon.leagueoflegends.com/cdn/10.16.1/data/fr_FR/runesReforged.json`);
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error(e);
            }
        }
    }

    public static async topChampions(summonerId: string): Promise<any> {
        try {
            return await axios.get(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/top?api_key=${this.apiKey}`);
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error(e);
            }
        }
    }
}
