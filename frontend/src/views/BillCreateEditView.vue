<template>
  <div>
    <div class="bill" v-if="!loading && bill">
      <div class="row border-bottom pb-3 mb-3">
        <div class="col">
          <h1 v-if="isNewBill" class="h3">
            <i class="fa-solid fa-angle-down me-2" />Créer une facture
          </h1>
          <h1 v-else class="h3"><i class="fa-solid fa-angle-down me-2" />Editer une facture</h1>
        </div>
        <div v-if="!isNewBill" class="col text-end">
          <button @click="onDeleteBill(bill)" class="btn btn-outline-danger">
            <i class="fa-solid fa-trash me-2" />
            Supprimer la facture
          </button>
        </div>
      </div>

      <div class="alert alert-danger my-3" v-if="error">Un champ requière votre attention</div>

      <div class="row">
        <div class="col-md-4">
          <div class="form-floating mb-3">
            <input type="text" name="billnum" id="billnum" v-model="bill.billnum" class="form-control"
              placeholder="Facture N°" :class="{ 'is-invalid': !bill.billnum }" />
            <label for="billnum" class="form-label">Facture N°</label>
          </div>
          <div class="form-floating mb-3">
            <input type="date" name="date" id="date" class="form-control" placeholder="Date" format="yyyy-MM-dd"
              v-model="bill.date" :class="{ 'is-invalid': !bill.date }" />
            <label for="date" class="form-label">Émise le</label>
          </div>
          <div class="form-floating mb-3">
            <select name="client" id="client" class="form-control" placeholder="Client" v-model="selectedClient">
              <option value="">Veuillez choisir un client</option>
              <option v-for="client in clients" :value="client">
                {{ client.firstName }} {{ client.lastName }}
              </option>
            </select>
            <label for="client" class="form-label">Client</label>
          </div>
        </div>
        <div class="col-md-8">
          <div class="form-floating mb-3">
            <input type="text" name="description" id="description" class="form-control" placeholder="Description"
              v-model="bill.description" :class="{ 'is-invalid': !bill.description }" />
            <label for="description" class="form-label">Description</label>
          </div>
        </div>
      </div>

      <TableList>
        <template #thead>
          <th class="th-actions">Actions</th>
          <th class="th-prestation">Prestation</th>
          <th class="th-quantite">Quantité</th>
          <th class="th-montant-ht">Montant U. HT</th>
          <th class="th-montant-total">Montant Total</th>
        </template>

        <tr v-for="(prestation, index) in bill.prestations" :key="index">
          <td class="align-middle">
            <button @click="onAddPrestation(index)" class="btn text-body-tertiary">
              <i class="fa-solid fa-circle-plus" /><span class="visually-hidden">Ajouter une prestation</span>
            </button>
            <button :disabled="bill.prestations.length === 1" @click="onRemovePrestation(index)" class="btn text-danger">
              <i class="fa-solid fa-trash" /><span class="visually-hidden">Supprimer une prestation</span>
            </button>
          </td>
          <td>
            <div class="form-floating">
              <input type="text" :name="'prestation-' + index" :id="'prestation-' + index" class="form-control"
                placeholder="Prestation" v-model="prestation.description"
                :class="{ 'is-invalid': !prestation.description }" />
              <label :for="'prestation-' + index" class="form-label">Prestation</label>
            </div>
          </td>
          <td>
            <div class="form-floating">
              <input type="number" min="0" step="1" :name="'quantity-' + index" :id="'quantity-' + index"
                class="form-control" placeholder="quantity" v-model="prestation.qty"
                :class="{ 'is-invalid': !prestation.qty }" />
              <label :for="'quantity' + index" class="form-label">Quantité</label>
            </div>
          </td>
          <td>
            <div class="form-floating">
              <input type="number" min="0" :name="'amount-ht' + index" :id="'amount-ht' + index" class="form-control"
                placeholder="amount-ht" v-model="prestation.price" :class="{ 'is-invalid': !prestation.price }" />
              <label :for="'amount-ht' + index" class="form-label">Montant U.</label>
            </div>
          </td>
          <td>
            <div class="form-floating">
              <input type="number" min="0" step="1" name="total-row" :id="'total-row' + index" class="form-control"
                placeholder="total-row" disabled :value="totalRow(index)" />
              <label :for="'amount-ht' + index" class="form-label">Montant Total</label>
            </div>
          </td>
        </tr>
        <!-- fin prestations -->
        <tr>
          <th colspan="4" class="align-middle text-end">Remises</th>
          <td>
            <div class="form-floating">
              <input type="number" min="0" step="1" name="discount" id="discount" class="form-control"
                placeholder="discount" v-model="bill.discount" />
              <label for="discount" class="form-label">Remise</label>
            </div>
          </td>
        </tr>
        <tr>
          <th colspan="4" class="align-middle text-end">Déjà payé</th>
          <td>
            <div class="form-floating">
              <input type="number" min="0" step="1" name="paid" id="paid" class="form-control" placeholder="paid"
                v-model="bill.paid" />
              <label for="paid" class="form-label">Déjà payé</label>
            </div>
          </td>
        </tr>
        <tr>
          <th colspan="4" class="align-middle text-end">Total HT</th>
          <td>
            <div class="form-floating">
              <input type="number" min="0" step="1" disabled name="global-total-ht" id="global-total-ht"
                class="form-control" placeholder="global-total-ht" v-model="bill.totalHT" />
              <label for="global-total-ht" class="form-label">Total HT</label>
            </div>
          </td>
        </tr>
        <tr>
          <th colspan="4" class="align-middle text-end">TVA</th>
          <td>
            <div class="form-floating">
              <input type="number" min="0" step="1" name="tva" id="tva" disabled class="form-control" placeholder="tva"
                v-model="bill.tva" />
              <label for="tva" class="form-label">TVA (20%)</label>
            </div>
          </td>
        </tr>
        <tr>
          <th colspan="4" class="align-middle text-end">Total TTC</th>
          <td>
            <div class="form-floating">
              <input type="number" min="0" step="1" name="grand-total-ttc" id="grand-total-ttc" disabled
                class="form-control" v-model="bill.totalTTC" placeholder="grand-total-ttc" />
              <label for="grand-total-ttc" class="form-label">Total TTC</label>
            </div>
          </td>
        </tr>
      </TableList>

      <p class="text-end">
        <button @click="onSave()" :disabled="formInvalid" class="btn btn-outline-primary btn-lg px-5">
          <i class="fa-solid fa-save me-2" />Enregistrer
        </button>
      </p>

      <AppDebug :datas="bill" />
    </div>
    <div v-else>loading...</div>
  </div>
</template>

<script>
import TableList from '@/components/tables/TableList.vue'
import { billPrestationInterface } from '@/interfaces/bill'
import { useBillStore } from '@/stores/bill'
import { mapActions, mapState, mapWritableState } from 'pinia'
export default {
  components: {
    TableList
  },
  props: {
    id: {
      type: String,
      default: 'new'
    }
  },
  data() {
    return {
      selectedClient: null,
    }
  },
  mounted() {
    this.setBill(this.id); // Charge la facture
    this.getItems(); // Charge la liste des factures (items)
    this.selectedClient = this.bill.client; // Initialise selectedClient avec le client de la facture
  },
  computed: {
    ...mapState(useBillStore, {
      loading: 'loading',
      clients: 'clients'
    }),
    // le formulaire local 'bill' est mappé sur la donnée du store 'item'
    // attention, pour pouvoir modifier les données d'un état du store (stae), il faut utiliser mpaWritableState plutôt que mapState (qui est pour la lecture seule)
    ...mapWritableState(useBillStore, {
      bill: 'item'
    }),
    // ici on a une computed classique
    isNewBill() {
      return this.id === 'new'
    },

    formInvalid() {
      return (
        !this.bill ||
        !this.bill.billnum ||
        !this.bill.date ||
        !this.bill.description ||
        !this.bill.prestations.length
      )
    },
    totalRow() {
      return (index) => {
        if (this.bill) {
          const prestation = this.bill.prestations[index]
          return prestation.qty * prestation.price
        }
      }
    }
  },
  methods: {
    // pour pouvoir appeler une action du store, il faut l'importer et ici on lui donne un nom local différent 'setBill'
    ...mapActions(useBillStore, {
      setBill: 'setItem',
      updateBill: 'updateItem',
      createBill: 'createItem',
      deleteBill: 'deleteItem',
      getItems: 'getItems'
    }),


    onAddPrestation(index) {
      // ajout d'une prestation sous l'élément courant dans le tableau
      this.bill.prestations.splice(index + 1, 0, { ...billPrestationInterface })
    },

    onRemovePrestation(index) {
      // suppression d'une prestation
      this.bill.prestations.splice(index, 1)
    },

    updateTotal() {
      if (this.bill) {
        this.bill.totalHT = 0
        for (const prestation of this.bill.prestations) {
          this.bill.totalHT += prestation.qty * prestation.price
        }
        this.bill.totalTTC =
          this.bill.totalHT +
          (this.bill.totalHT * this.bill.tva) / 100 -
          this.bill.discount -
          this.bill.paid
      }
    },

    onDeleteBill() {
      this.deleteBill(this.id)
      this.$router.push({ name: 'bills' })
    },
    onSave() {
  if (this.formInvalid) {
    this.error = true;
    console.error('Formulaire invalide');
  } else {
    this.error = false;
    this.bill.client = this.selectedClient;

    if (this.isNewBill) {
      console.log('Création de la facture :', this.bill);
      this.createBill(this.bill);
    } else {
      console.log('Mise à jour de la facture :', this.bill);
      this.updateBill(this.bill);
    }
    this.$router.push({ name: 'bills' });
  }
},
    watch: {
      // à chaque mise à jour des prestations, je mets à jour le total
      'bill.prestations': {
        handler() {
          this.updateTotal()
        },
        deep: true
      },
      // de même sur la remise client
      'bill.discount'() {
        this.updateTotal()
      },
      // de même sur le déjà payé
      'bill.paid'() {
        this.updateTotal()
      }
    }
  }
}
</script>