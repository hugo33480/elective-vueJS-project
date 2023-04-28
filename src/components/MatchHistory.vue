<template>
    <div class="d-flex justify-center align-center flex-column">
        <span class="fs-28 bff-bold">Historique</span>
        <v-timeline v-if="matchs">
            <v-timeline-item
                v-for="(match, i) in matchs"
                :key="i"
                :dot-color="getPlayer(match).win ? 'green-accent-3' : 'red-accent-3'"
                fill-dot
            >
                <v-card width="400">
                    <v-card-title :class="getPlayer(match).win ? 'bg-green-accent-3' : 'bg-red-accent-3'">
                        {{ new Date(match.info.gameCreation).toLocaleDateString('fr-FR') }} - <span
                        class="bff-bold">{{ match.info.gameMode }}</span>
                    </v-card-title>
                    <!--                    <v-card-text class="d-flex bg-white text&#45;&#45;primary">-->
                    <!--                        -->
                    <!--                    </v-card-text>-->
                    <div class="d-flex pa-3">
                        <div class="d-flex">
                            <v-img width="50" height="50"
                                   :src="`http://ddragon.leagueoflegends.com/cdn/13.8.1/img/champion/${getPlayer(match).championName}.png`"></v-img>
                        </div>
                        <div class="d-flex align-center ml-5">
                            <span class="bff-bold">{{ getPlayer(match).kills }}/{{
                                    getPlayer(match).deaths
                                }}/{{ getPlayer(match).assists }}</span>
                        </div>
                        <div class="d-flex ml-5 align-center">
                            <div v-for="key in 5">
                                <v-img v-if="getPlayer(match)['item' + key]" width="40" height="40" :src="`http://ddragon.leagueoflegends.com/cdn/13.8.1/img/item/${getPlayer(match)['item' + key]}.png`"></v-img>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </div>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import RiotApiService from "@/Services/RiotApiService";

const props = defineProps(['player']);
const matchs = ref<Array<any>>([]);

async function getTenLastMatchIds() {
    const {data} = await RiotApiService.tenLastMatchIds(props.player.puuid);
    return data;
}

async function loadTenLastMatchs() {
    const matchIds = await getTenLastMatchIds();
    for (const matchId of matchIds) {
        const {data} = await RiotApiService.match(matchId);
        matchs.value.push(data);
    }
}

function getPlayer(match: any) {
    return match.info.participants.find((it: { summonerId: string }) => it.summonerId === props.player.id);
}

onMounted(async () => {
    await loadTenLastMatchs();
});

</script>

<style scoped>

</style>
