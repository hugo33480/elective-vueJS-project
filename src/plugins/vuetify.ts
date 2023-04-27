import '@fortawesome/fontawesome-free/css/all.css' // Ensure your project is capable of handling css files
import 'vuetify/styles';
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'fa',
        aliases,
        sets: {
            fa,
        },
    },
})
