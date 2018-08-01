import Vue from "vue/dist/vue.common";
import CmMain from "./cm-main.vue";

new Vue({
    el: '#app',
    components: {
        CmMain
    },
    data: {},
    template: "<cm-main message=\"example\"/>"
});
