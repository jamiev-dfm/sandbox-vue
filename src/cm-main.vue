<template>
<div>{{message}} test</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CmAutocomplete extends Vue {
    @Prop(String) message!: string;
};
</script>
