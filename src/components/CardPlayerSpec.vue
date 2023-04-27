<template>
    <div style="position: relative">
        <v-card :loading="loading" class="text--bff-bold card-player" v-if="champ" elevation="6" width="275"
                height="400">
            <v-img height="175" :src="`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`"
                   cover>
                <div class="d-flex h-100 flex-column justify-space-between">
                    <div class="d-inline-flex align-center">
                        <span class="ml-2 text-white">{{ props.champName }}</span>
                    </div>
                    <div class="d-flex justify-start">
                        <div class="d-flex">
                            <v-img height="40" width="40"
                                   :src="`http://ddragon.leagueoflegends.com/cdn/13.8.1/img/profileicon/${props.player.profileIconId}.png`"></v-img>
                        </div>
                        <div class="d-flex flex-column">
                            <v-img height="20" width="20"
                                   :src="`http://ddragon.leagueoflegends.com/cdn/13.8.1/img/spell/${props.summonerSpells.spell1}.png`"></v-img>
                            <v-img height="20" width="20"
                                   :src="`http://ddragon.leagueoflegends.com/cdn/13.8.1/img/spell/${props.summonerSpells.spell2}.png`"></v-img>
                        </div>
                        <div class="d-flex flex-column">
                            <v-img height="20" width="20"
                                   :src="`https://ddragon.canisback.com/img/${perks.mainRunes.icon}`"></v-img>
                            <v-img height="20" width="20"
                                   :src="`https://ddragon.canisback.com/img/${perks.perkSubStyle.icon}`"></v-img>
                        </div>
                    </div>
                </div>
            </v-img>
            <div class="summoner-name d-flex justify-center mx-2 mt-2 bg-white">
                {{ props.player.summonerName }}
            </div>
            <div class="summoner-rank d-flex flex-column justify-center text-center mx-2 mt-2 bg-white"
                 v-if="rankDataForCurrentMode">
                <span>{{ props.gameMode.label || "Classé solo/duo" }}</span>
                <template v-if="typeof rankDataForCurrentMode !== 'string'">
                    <div class="d-flex justify-space-around">
                        <v-img max-width="100" max-heigth="100"
                               :src="require(`../assets/images/ranks/rank_${rankDataForCurrentMode.tier.toLowerCase()}.png`)"></v-img>
                        <div class="rank-info d-flex justify-center flex-column">
                        <span class="rank-text">{{ rankDataForCurrentMode.tier }} {{
                                rankDataForCurrentMode.rank || ''
                            }} {{ rankDataForCurrentMode.leaguePoints + ' PL' }}</span>
                            <span class="wins text-start">
                        Victoires: <span class="text-green-accent-4">{{ rankDataForCurrentMode.wins }}</span>
                    </span>
                            <span class="losses text-start">
                        Défaites: <span class="text-red-accent-4">{{ rankDataForCurrentMode.losses }}</span>
                    </span>
                            <span class="winrate text-start">
                        Ratio: <span>{{ calculateWinrate(rankDataForCurrentMode) }}%</span>
                    </span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div>{{ rankDataForCurrentMode }}</div>
                </template>
            </div>
            <div class="d-flex justify-center align-center text-white">
                <v-btn size="small" variant="text" icon>
                    <v-icon>fa-solid fa-eye</v-icon>
                </v-btn>
            </div>
        </v-card>

        <v-img v-if="champData" class="img-mastery" height="70" width="60"
               :src="require(`../assets/images/masteries/mastery-${champData.championLevel}.png`)"></v-img>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import RiotApiService from "@/Services/RiotApiService";

const props = defineProps(['player', 'champName', 'gameMode', 'summonerSpells', 'perks']);
const champ = ref(null);
const champData = ref(null);
const rankData = ref([]);
const loading = ref(false);

function calculateWinrate({wins, losses}: { wins: number, losses: number }): number {
    return Math.round(wins / (wins + losses) * 100);
}

async function loadChampion() {
    const {data: {data}} = await RiotApiService.champion(props.champName);
    champ.value = data[props.champName];
}

async function loadChampionData() {
    if (champ.value) {
        const {data} = await RiotApiService.championMastery(props.player.summonerId, (champ.value as { key: string; }).key);
        champData.value = data || null;
    }
}

async function loadPlayerRankData() {
    const {data} = await RiotApiService.rank(props.player.summonerId);
    rankData.value = data;
}

function goToProfile() {

}

onMounted(async () => {
    loading.value = true;
    await loadChampion();
    await loadChampionData();
    // timeout car limité à 20 requêtes par sec
    setTimeout(async () => {
        await loadPlayerRankData();
    }, 1000);
    loading.value = false;
});

function findRankDataForCurrentMode(type: string) {
    return rankData.value.find((it: { queueType: string; }) => it.queueType === type)
}

const rankDataForCurrentMode = computed(() => {
    return findRankDataForCurrentMode(props.gameMode.type) ||
        findRankDataForCurrentMode(RiotApiService.SOLOQ_TYPE) ||
        "Non classé";
});

</script>

<style scoped>
.card-player {
    background: linear-gradient(180deg, #091428 35%, #0A323C 100%);
}

.text--bff-bold {
    font-family: bff-bold;
    font-size: 20px;
}

.summoner-name {
    border: 3px solid #C89B3C;
}

.summoner-rank {
    border: 3px solid #C89B3C;
    height: 33%;
}

.rank-text {
    font-size: 14px;
}

.wins {
    font-size: 12px;
}

.losses {
    font-size: 12px;
}

.winrate {
    font-size: 12px;
}

.img-mastery {
    position: absolute;
    top: -25px;
    right: -20px;
}

</style>
