<template>
    <div>
        <div class="client" v-if="!loading && client">
            <div class="row border-bottom pb-3 mb-3">
                <div class="col">
                    <h1 v-if="isNewClient" class="h3">
                        <i class="fa-solid fa-angle-down me-2" />Créer un nouveau client
                    </h1>
                    <h1 v-else class="h3"><i class="fa-solid fa-angle-down me-2" />Modifier un client</h1>
                </div>
                <div v-if="!isNewClient" class="col text-end mb-4">
                    <button @click="onDeleteClient(client)" class="btn btn-outline-danger">
                        <i class="fa-solid fa-trash me-2" />
                        Supprimer le client
                    </button>
                </div>
                <div class="row">
                    <div class="col premier">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-floating mb-3">
                                    <input type="text" name="firstname" id="firstName" v-model="client.firstName"
                                        class="form-control" placeholder="Prénom client :"
                                        :class="{ 'is-invalid': !client.firstName }" />
                                    <label for="firstName" class="form-label">Prénom client</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" name="fonction" id="fonction" v-model="client.fonction"
                                        class="form-control" placeholder="Fonction"
                                        :class="{ 'is-invalid': !client.fonction }" />
                                    <label for="fonction" class="form-label">Fonction</label>
                                </div>
                                
                                <div class="form-floating mb-3">
                                    <input type="text" name="email" id="email" v-model="client.email" class="form-control"
                                        placeholder="email" :class="{ 'is-invalid': !client.email }" />
                                    <label for="email" class="form-label">Email</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" name="companyName" id="companyName" v-model="client.companyName"
                                        class="form-control" placeholder="Entreprise :"
                                        :class="{ 'is-invalid': !client.companyName }" />
                                    <label for="companyName" class="form-label">Entreprise</label>
                                </div>
                            </div>
                            <div class="col deuxieme">
                                <div class="form-floating mb-3">
                                    <input type="text" name="lastName" id="lastName" v-model="client.lastName"
                                        class="form-control" placeholder="Nom client :"
                                        :class="{ 'is-invalid': !client.lastName }" />
                                    <label for="firstName" class="form-label">Nom client</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" name="telephone" id="telephone" v-model="client.telephone"
                                        class="form-control" placeholder="Telephone"
                                        :class="{ 'is-invalid': !client.telephone }" />
                                    <label for="telephone" class="form-label">N° de téléphone</label>
                                </div>
                            </div>
                            <div class="col troisieme">
                                <div class="form-floating mb-3">
                                    <input type="date" name="date" id="date" class="form-control" placeholder="Date"
                                        format="yyyy-MM-dd" v-model="client.date" :class="{ 'is-invalid': !client.date }" />
                                    <label for="date" class="form-label">Émise le</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-danger my-3" v-if="error">Un champ requière votre attention</div>


                </div>
                <div>
                    <div class="form-floating mb-3">
                        <h3>Coordonnées</h3>
                        <div class="form-floating mb-3">
                            <input type="text" name="firstAddress" id="firstAddress"
                                v-model="client.coordonnees.firstAddress" class="form-control" placeholder="firstAddress"
                                :class="{ 'is-invalid': !client.coordonnees.firstAddress }" />
                            <label for="firstAddress" class="form-label">Adresse 1</label>
                        </div>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" name="secondAddress" id="secondAddress"
                            v-model="client.coordonnees.secondAddress" class="form-control" placeholder="secondAddress" />
                        <label for="secondAddress" class="form-label">Adresse 2</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" name="codePostal" id="codePostal" v-model="client.coordonnees.codePostal"
                            class="form-control" placeholder="codePostal"
                            :class="{ 'is-invalid': !client.coordonnees.codePostal }" />
                        <label for="codePostal" class="form-label">Code Postal</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="text" name="ville" id="ville" v-model="client.coordonnees.ville" class="form-control"
                            placeholder="ville" :class="{ 'is-invalid': !client.coordonnees.ville }" />
                        <label for="ville" class="form-label">Ville</label>
                    </div>
                    <div class="form-floating mb-3">
                        <select name="pays" id="pays" class="form-control" v-model="client.coordonnees.pays"
                            :class="{ 'is-invalid': !client.coordonnees.pays }">
                            <option value="">Veuillez choisir un pays</option>
                            <option v-for="pays in countries" :value="pays" :key="pays">
                                {{ pays }}
                            </option>
                        </select>
                        <label for="pays" class="form-label">Pays</label>
                    </div>
                </div>
            </div>

            <p class="text-end">
                <button @click="onSave()" :disabled="formInvalid" class="btn btn-outline-primary btn-lg px-5">
                    <i class="fa-solid fa-save me-2" />Enregistrer
                </button>
            </p>

            <!-- <AppDebug :datas="client" /> -->
        </div>
        <div v-else>loading...</div>
    </div>
</template>

<script>
import { useClientStore } from '@/stores/client'
import { mapActions, mapState, mapWritableState } from 'pinia'
export default {
    components: {

    },
    props: {
        id: {
            type: String,
            default: 'new'
        }
    },
    data() {
        return {
        }
    },
    mounted() {
        // avant de monter le composant de la vue, on charge les données de la facture à éditer
        this.setClient(this.id),
            this.getItems()
    },
    computed: {
        ...mapState(useClientStore, {
            loading: 'loading',
            countries: 'countries'
        }),
        ...mapWritableState(useClientStore, {
            client: 'item'
        }),
        // ici on a une computed classique
        isNewClient() {
            return this.id === 'new'
        },

        formInvalid() {
            return (
                !this.client ||
                !this.client.firstName ||
                !this.client.lastName ||
                !this.client.companyName ||
                !this.client.date
            )
        },
    },
    methods: {
        ...mapActions(useClientStore, {
            setClient: 'setItem',
            updateClient: 'updateItem',
            createClient: 'createItem',
            deleteClient: 'deleteItem',
            getItems: 'getItems'
        }),
        onDeleteClient() {
            this.deleteClient(this.id)
            this.$router.push({ name: 'clients' })
        },
        onSave() {
            // si j'ai une erreur dans le formulaire
            if (this.formInvalid) {
                // gestion des erreurs ici
                this.error = true
            } else {
                this.error = false
                // on appelle la méthode de sauvegarde de la donnée du store
                if (this.isNewClient) {
                    console.log('create', this.client)
                    this.createClient(this.client)
                } else {
                    console.log('update', this.client)
                    this.updateClient(this.client)
                }
                // on revient sur la page précédente
                this.$router.push({ name: 'clients' })
            }
        },
    },
    watch: {

    }
}
</script>
