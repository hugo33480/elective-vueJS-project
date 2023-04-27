<template>
    <v-container class="spectator-container h-100" fluid>
        <div v-if="notInGame" class="h-100 d-flex flex-column align-center justify-center">
            <span class="mb-5 text-white">Ce joueur n'est pas en partie</span>
            <v-btn @click="goToPlayerProfile" elevation="6">Voir le profile</v-btn>
        </div>
        <div v-else>
            <div v-if="gameMode" class="d-flex align-center justify-center mb-4 text-h3 text-white">{{ gameMode.label }}</div>
            <card-player-spec-list @game-mode="loadGameMode($event)" v-if="gameData" :players="gameData.participants" :queue-id="gameData.gameQueueConfigId"/>
        </div>
    </v-container>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import RiotApiService from "@/Services/RiotApiService";
import CardPlayerSpecList from "@/components/CardPlayerSpecList.vue";

const route = useRoute();
const router = useRouter();
const notInGame = ref(false);
const gameData = ref(null);
const gameMode = ref(null);

async function goToPlayerProfile(): Promise<any> {
    await router.push({name: "profile", query: route.query})
}

function loadGameMode(event: any) {
    gameMode.value = event;
}

onMounted(async () => {
    if (route.query.id) {
        const {data} = await RiotApiService.spectator(route.query.id.toString());
        if (data) {
            gameData.value = data;
        } else {
            notInGame.value = true;
        }
    }
});
</script>

<style scoped>
.spectator-container {
    background-size: cover;
    background: linear-gradient(180deg, rgba(0,90,130,1) 35%, rgba(10,200,185,1) 100%);
}
</style>
