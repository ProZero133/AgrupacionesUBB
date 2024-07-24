<template>
    <v-container cols="12">
        <v-card class="mx-auto px-6 py-8" max-width="500">
            <v-img
                src="https://lh6.googleusercontent.com/proxy/awFLWSiv_0NPmfWaQO0Bxb2An-tP_V32MGUah6yfzPA-CaYuhU2wKIg-hypSq6DBp9t3EA4R-CEKLaR322sWqhplNodS_nSXNiSOwrrF0dN4O6Dixktme9I"></v-img>

            <v-card-text>
                <h2 class="align-center justify-center"></h2>
            </v-card-text>

            <v-overlay :model-value="isHovering" class="align-center justify-center" scrim="#036358" contained>
                <v-btn variant="flat">Solicitar Acreditacion</v-btn>
            </v-overlay>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'SolAcr',
    data: () => ({
    }),
}

</script>

<style>
</style>