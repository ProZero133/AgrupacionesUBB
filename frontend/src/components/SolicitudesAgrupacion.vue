<template>
    <v-container>
        <v-card class="card-solicitudes">
            <v-card-title>
                Solicitudes de ingreso
            </v-card-title>
            <v-card-text>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Rut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="solicitud in solicitudes" :key="solicitud.rut">
                                <td>{{ solicitud.rut }}</td>
                                <td class="text-right"> <!-- Alinea el botón a la derecha -->
                                    <v-btn color="primary" small @click="aceptarSolicitud(solicitud.rut)">Admitir</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style scoped>
.card-solicitudes {
    margin-top: 5vh;
    height: 50vh;
    width: 60vw;
    margin-left: 20vh;
}
.text-right {
    width: 50vw;
    text-align: right;
}
</style>

<script>
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const groupId = route.params.id_agr;
        return {
            groupId,
        };
    },


    name: 'SolicitudesAgrupacion',
    data: () => ({
        solicitudes: [],
        rol: '',
        rut: '',
    }),
    methods: {
        getRut() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[2] = tokenParts[2].replace('rut=', '');
              console.log('Token:', tokenParts[2]);
              return tokenParts[2] ;
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return null;
        },
    getRol() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[0] = tokenParts[0].replace('rol=', '');
              return tokenParts[0] ;
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return null;
        },
        async VerSolicitudes() {
            try {
                const url = `http://localhost:3000/versolicitudes/${this.groupId}`;
                const response = await fetch(url, {
                    method: 'GET',
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    this.solicitudes = data;
                } else {
                    console.log('Error al obtener las solicitudes');
                }
            } catch (error) {
                console.log('Error al obtener las solicitudes');
            }
        },
        async aceptarSolicitud(rut) {
            try {
                const url = `http://localhost:3000/aceptarsolicitud/${rut}/${this.groupId}`;
                const response = await fetch(url, {
                    method: 'POST',
                });
                if (response.ok) {
                    console.log('Solicitud aceptada');
                    this.VerSolicitudes();
                } else {
                    console.log('Error al aceptar la solicitud');
                }
            } catch (error) {
                console.log('Error al aceptar la solicitud');
            }
        }
    },
    mounted() {
        this.rol = this.getRol();
        this.rut = this.getRut();
        this.VerSolicitudes();
    }

}


</script>