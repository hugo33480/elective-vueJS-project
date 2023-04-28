<template>
    <v-app>
        <router-view/>
    </v-app>
</template>

<style>
#app {
    font-family: bff-regular;
}

.bff-regular {
    font-family: bff-regular;
}

.bff-bold {
    font-family: bff-bold;
}

@font-face {
    font-family: bff-bold;
    src: url("@/assets/fonts/BeaufortforLOL-Bold.otf") format("opentype");
}

@font-face {
    font-family: bff-regular;
    src: url("@/assets/fonts/BeaufortforLOL-Regular.otf") format("opentype");
}

.fs-20 {
    font-size: 20px;
}

.fs-24 {
    font-size: 24px;
}

.fs-26 {
    font-size: 26px;
}

.fs-28 {
    font-size: 28px;
}

.fs-12 {
    font-size: 12px;
}

</style>
