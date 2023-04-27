<template>
    <div v-if="champions && summonerSpells" class="d-flex flex-column align-center">
        <div class="d-flex flex-wrap mb-4">
            <CardPlayerSpec class="mx-7" v-for="(player, key) in teamBlue" :player="player"
                            :champ-name="getChampName(player.championId)" :game-mode="gameMode"
                            :summoner-spells="getSummonerSpells(player.spell1Id, player.spell2Id)"
                            :perks="getPerks(player.perks.perkIds[0], player.perks.perkStyle, player.perks.perkSubStyle)"></CardPlayerSpec>
        </div>
        <div class="text-vs text-h5">
            VS
        </div>
        <div class="d-flex flex-wrap mt-4">
            <CardPlayerSpec class="mx-7" v-for="(player, key) in teamRed" :player="player"
                            :champ-name="getChampName(player.championId)" :game-mode="gameMode"
                            :summoner-spells="getSummonerSpells(player.spell1Id, player.spell2Id)"
                            :perks="getPerks(player.perks.perkIds[0], player.perks.perkStyle, player.perks.perkSubStyle)"></CardPlayerSpec>
        </div>
    </div>
</template>

<script setup lang="ts">
import CardPlayerSpec from "@/components/CardPlayerSpec.vue";
import {onMounted, computed, ref} from "vue";
import RiotApiService from "@/Services/RiotApiService";

const props = defineProps(['players', 'queueId']);

const champions = ref(null);
const summonerSpells = ref(null);
const perks = ref([]);
const emit = defineEmits(['gameMode']);

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

function getSummonerSpells(spellId1: string, spellId2: string) {
    if (summonerSpells.value) {
        const summs = {spell1: "", spell2: ""};
        for (const [key, value] of Object.entries(summonerSpells.value)) {
            if (value) {
                const val = value as { key: string; };
                if (val.key == spellId1) {
                    summs.spell1 = key;
                }
                if (val.key == spellId2) {
                    summs.spell2 = key;
                }
            }
        }

        return summs;
    }
}

function getPerks(mainRunes: number, perkStyle: number, perkSubStyle: number) {
    if (perks.value) {
        const perksStyles = {mainRunes: {}, perkSubStyle: {}};
        for (const value of perks.value) {
            if (value) {
                const val = value as { id: number, icon: string, slots: any, name: string };
                if (val.id == perkStyle) {
                    const runes = val.slots[0].runes.find((it: { id: number; }) => it.id === mainRunes);
                    perksStyles.mainRunes = {
                        id: runes.id,
                        icon: runes.icon,
                        name: runes.name
                    }
                }
                if (val.id == perkSubStyle) {
                    perksStyles.perkSubStyle = {id: val.id, icon: val.icon, name: val.name};
                }
            }
        }
        return perksStyles;
    }
}

async function loadPerks() {
    const {data} = await RiotApiService.perks();
    perks.value = data;
}

async function loadChampions() {
    const {data: {data}} = await RiotApiService.champions();
    champions.value = data;
}

async function loadSummonerSpells() {
    const {data: {data}} = await RiotApiService.summonerSpells();
    summonerSpells.value = data;
}

onMounted(async () => {
    await loadChampions();
    await loadSummonerSpells();
    await loadPerks();
    getPerks(8010, 8000, 8200);
});

const teamBlue = computed(() => {
    return props.players.filter((el: { teamId: number; }) => el.teamId === 100);
});

const teamRed = computed(() => {
    return props.players.filter((el: { teamId: number; }) => el.teamId === 200);
});

const gameMode = computed(() => {
    const result = RiotApiService.rankedQueue.find((it) => it.id === props.queueId);
    emit('gameMode', result);
    return result || {type: '', id: 0, label: ''};
});

</script>

<style scoped>
.text-vs {
    color: #C89B3C;
}
</style>
