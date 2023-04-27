<template>
    <v-container class="home-container h-100 d-flex align-center justify-center" fluid>
        <v-form @submit.prevent="searchSummoner"
                class="w-33 d-flex flex-column align-center">
            <v-text-field :error="textFieldError" class="w-100 elevation-6" v-model="summonerName" append-inner-icon="fa-solid fa-magnifying-glass"
                          label="Nom d'invocateur" variant="solo" hide-details></v-text-field>
            <v-btn :loading="loading" elevation="6" type="submit" :disabled="!summonerName.length" class="mt-7 w-25">Rechercher</v-btn>
        </v-form>

        <v-snackbar
            timeout="3000"
            v-model="openSnackbar"
            color="white text-red"
        >
            Ce nom d'invocateur n'existe pas
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import RiotApiService from "../Services/RiotApiService";
import {useRouter} from "vue-router";

const loading = ref(false);
const textFieldError = ref(false);
const openSnackbar = ref(false);
const summonerName = ref('');
const summonerInfo = ref({});
const router = useRouter();

async function searchSummoner(): Promise<any> {
    loading.value = true;
    const {data} = await RiotApiService.summoner(summonerName.value);
    if (data) {
        summonerInfo.value = data;
        await router.push({name: "spectate", query: data});
    } else {
        openSnackbar.value = true;
        textFieldError.value = true;
    }
    loading.value = false;
}

</script>

<style scoped>
.home-container {
    background-image: url("@/assets/images/background-lol.webp");
    background-size: cover;
    background-repeat: no-repeat;
}
</style>
