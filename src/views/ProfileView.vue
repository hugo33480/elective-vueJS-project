<template>
    <v-container class="profile-container h-100" fluid>
        <div v-if="isDataLoaded">
            <v-card elevation="6" width="100%">
                <v-img height="400" cover
                       :src="`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChamps[0].name}_0.jpg`">
                    <div class="d-flex flex-column justify-space-between text-white h-100">
                        <div class="d-flex">
                            <div class="d-flex">
                                <v-img width="100" height="100"
                                       :src="`http://ddragon.leagueoflegends.com/cdn/13.8.1/img/profileicon/${route.query.profileIconId}.png`"></v-img>
                            </div>
                            <div class="d-flex flex-column ml-2">
                                <span class="summoner-name bff-bold">{{ route.query.name }}</span>
                                <span class="summoner-level">niv. {{ route.query.summonerLevel }}</span>
                            </div>
                        </div>
                        <div class="d-flex justify-start mb-2">
                            <div v-for="champ in topChamps" class="d-flex mx-2 position-relative">
                                <v-avatar size="x-large">
                                    <v-img
                                        :src="`http://ddragon.leagueoflegends.com/cdn/13.8.1/img/champion/${champ.name}.png`"></v-img>
                                </v-avatar>
                                <v-img absolute class="img-mastery" width="35" height="35"
                                    :src="require(`../assets/images/masteries/mastery-${champ.championLevel}.png`)"></v-img>
                            </div>
                        </div>
                    </div>
                </v-img>
                <div class="d-flex">
                    <v-card elevation="6" v-for="rank in ranks" class="d-flex ma-5 pa-5" width="50%">
                        <div class="d-flex mr-5">
                            <v-img width="200" height="200"
                                   :src="require(`../assets/images/ranks/rank_${rank.tier.toLowerCase()}.png`)"></v-img>
                        </div>
                        <div class="d-flex flex-column align-center w-100">
                            <span class="bff-bold fs-28 mb-3">{{ getQueueLabel(rank.queueType) }}</span>
                            <div class="fs-24 d-flex flex-column align-start w-100">
                                <span>Partie joué: <span class="bff-bold">{{ rank.losses + rank.wins }}</span></span>
                                <span>Victoires: <span class="bff-bold">{{ rank.wins }}</span></span>
                                <span>Défaites: <span class="bff-bold">{{ rank.losses }}</span></span>
                            </div>
                        </div>
                        <div class="d-flex align-center flex-column justify-center fs-28">
                            <span class="fs-12">ratio de victoires</span>
                            <span
                                :class="['bff-bold', calculateWinrate(rank) >= 50 ? 'text-green-accent-3' : 'text-red-accent-3']">{{
                                    calculateWinrate(rank)
                                }}%</span>
                        </div>
                    </v-card>
                </div>
            </v-card>

            <MatchHistory class="mt-8" :player="route.query">
            </MatchHistory>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import RiotApiService from "@/Services/RiotApiService";
import MatchHistory from "@/components/MatchHistory.vue";

const route = useRoute();
const topChamps = ref(null);
const champions = ref(null);
const ranks = ref(null);

async function loadTopChampions() {
    if (route.query.id) {
        const {data} = await RiotApiService.topChampions(route.query.id.toString());
        if (champions.value) {
            for (const value of data) {
                value['name'] = getChampName(value.championId);
            }
        }
        topChamps.value = data;
    }
}

async function loadRank() {
    if (route.query.id) {
        const {data} = await RiotApiService.rank(route.query.id.toString());
        ranks.value = data;
    }
}

async function loadChampions() {
    const {data: {data}} = await RiotApiService.champions();
    champions.value = data;
}

function getChampName(champId: string) {
    if (champions.value) {
        for (const [key, value] of Object.entries(champions.value)) {
            if (value) {
                const val = value as { key: string; };
                if (val.key == champId) {
                    return key;
                }
            }
        }
    }
}

function getQueueLabel(queueType: string) {
    return RiotApiService.rankedQueue.find(it => it.type === queueType)?.label;
}

function calculateWinrate({wins, losses}: { wins: number, losses: number }): number {
    return Math.round(wins / (wins + losses) * 100);
}

onMounted(async () => {
    await loadChampions();
    await loadTopChampions();
    await loadRank();
});

const isDataLoaded = computed(() => {
    return topChamps.value && ranks.value && champions.value;
});
</script>

<style scoped>
.profile-container {
}

.summoner-name {
    font-size: 26px;
}

.img-mastery {
    top:-10px;
    right: 20px;
 }
</style>
