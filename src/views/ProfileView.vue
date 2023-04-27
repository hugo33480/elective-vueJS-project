<template>

</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

onMounted(() =>{
    console.log(route.query)
})
</script>

<style scoped>

</style>
