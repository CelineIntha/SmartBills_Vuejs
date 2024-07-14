import { clientInterface } from '@/interfaces/client'
import { defineStore } from 'pinia'

// si je veux interragir avec un autre store, il suffit de l'importer

export const useClientStore = defineStore('client', {
  state: () => ({
    items: null, //la liste des factures utilisées dans ClientsView
    item: null, //formulaire d'édition utilisé dans CreateEditClientView
    loading: false, // un simple boolean pour indiquer le chargement des données
    countries: []
  }),
  getters: {},
  actions: {
    // on charge la liste des factures depuis la route d'api GET http://127.0.0.1/clients
    async getItems() {
      this.loading = true
      try {
        const response = await this.$http.get('/clients')
        this.items = response.data
        this.fetchCountries()
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },
    fetchCountries() {
      const countrySet = new Set()
      this.items.forEach(client => {
        if (client.coordonnees && client.coordonnees.pays) {
          countrySet.add(client.coordonnees.pays)
        }
      })
      this.countries = Array.from(countrySet)
    },

    
    async setItem(id) {
      if (id === 'new') {
        this.item = { ...clientInterface }
      } else {
        this.loading = true
        try {
          const response = await this.$http.get('/clients/' + id)
          this.item = response.data
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },

    async updateItem(form) {
      this.loading = true
      try {
        const response = await this.$http.patch('/clients/' + form.id, form)
        console.log(response.data)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },
    async createItem(form) {
      this.loading = true
      try {
        const response = await this.$http.post('/clients', form)
        console.log(response.data)
        // this.item = { ...response.data }
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    },

    async deleteItem(id) {
      this.loading = true
      try {
        const response = await this.$http.delete('/clients/' + id)
        await this.getItems()
        console.log(response.data)
        this.loading = false
      } catch (error) {
        console.error(error)
        this.loading = false
      }
    }
  }
})
