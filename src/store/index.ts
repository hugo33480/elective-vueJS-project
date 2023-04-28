import {createStore} from 'vuex'
import RiotApiService from "@/Services/RiotApiService";

export default createStore({
    state: {
        champions: null,
    },
    getters: {},
    mutations: {
        // async champions(state) {
        //     const {data: {data}} = await RiotApiService.champions()
        //     if (state.champions == null) {
        //         state.champions = data;
        //     }
        // }
    },
    actions: {},
    modules: {}
})
