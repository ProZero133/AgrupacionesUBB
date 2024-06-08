<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer
            color="#5A2EA8"
            v-model="drawer"
            :rail="rail"
            permanent
            @click="rail = false"
            >
            <v-list-item
                prepend-avatar="@/assets/pfp.jpg"
                :title="rail ? '' : user_name"
                :subtitle="rail ? '' : user_RUT"
                nav
            >
                <template v-slot:append>
                    <v-btn
                        variant="text"
                        icon="mdi-chevron-left"
                        @click.stop="rail = !rail"
                    ></v-btn>
                </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item
                    v-for="item in items"
                    :key="item.name"
                    :prepend-icon="item.icon"
                    :title="item.name"
                    :to="item.path"
                    :disabled="rail"
                ></v-list-item>
            </v-list>

            </v-navigation-drawer>

            <v-main>
                <router-view></router-view>
            </v-main>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        drawer: true,
        rail: true,

        items: [],

        allItems: [
            { name: 'Home', icon: 'mdi-home', path: '/api', tier: 0 },
        ],

        user_RUT: '20.999.554-9',
        user_name: 'Marco Araneda',
    }),

}
</script>

<style scoped>


#app {
    background-image: url('https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>