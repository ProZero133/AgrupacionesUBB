<template>
    <div class="text-center ma-2">

        <v-snackbar v-model="snackbar" multi-line :color="color" :location="'top right'" :timeout="timeout">
            <div class="text-subtitle-1 pb-2">{{ title }}</div>

            <p>{{ text }}</p>

            <p>{{ alternativeText }}</p>

            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar = false">
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
<script>
export default {
    data: () => ({
        snackbar: false,
        text: ``,
        color: '',
        title: '',
        timeout: 3000,
        alternativeText:'',
    }),
    methods: {
        show(color, title, text, alternativeText='') {
            this.color = color;
            this.title = title;
            this.text = text;
            this.alternativeText = alternativeText;
            this.snackbar = true;
        }
    }
}
</script>