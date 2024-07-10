<template>
    <div class="text-center">
        <v-overlay persistent :model-value="overlay" class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </div>
</template>
<script>
export default {
    data: () => ({
        overlay: false,
    }),
    methods: {
        setOverlay(val) {
            this.overlay = val;
        }
    }
}
</script>