<template>
  <vs-row>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
      <h2 class="text-center">Noble Navigation and Shipping Line</h2>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" class="mb-2" vs-align="center" vs-w="12">
      <h4 class="text-center">{{tripData.number}}</h4>
    </vs-col>
    <vs-col class="mb-2" vs-w="12">
      <hr/>
    </vs-col>

    <vs-col  vs-w="6">
      <table class="border-collapse" >
        <tr>
          <td><b class="uppercase strong black-text">Ship</b></td>
          <td>{{tripData.ship.name}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Trip Number</b></td>
          <td>{{tripData.number}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Cargo</b></td>
          <td>{{tripData.cargo?tripData.cargo:'NA'}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Cargo Quantity</b></td>
          <td>{{tripData.cargo_quantity?tripData.cargo_quantity:'NA'}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Total Fuel</b></td>
          <td>{{tripData.total_fuel?tripData.total_fuel:'NA'}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">From</b></td>
          <td>{{tripData.from?tripData.from:'NA'}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">To</b></td>
          <td>{{tripData.to?tripData.to:'NA'}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Status</b></td>
          <td>{{tripData.status}}</td>
        </tr>
      </table>
    </vs-col>
    <vs-col  vs-w="6">
      <table>
        <tr>
          <td><b class="uppercase strong black-text">Loading Date</b></td>
          <td>{{tripData.start_date | formatDate}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Sailing Date</b></td>
          <td>{{tripData.sailing_start | formatDate}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Sailing End Date</b></td>
          <td>{{tripData.sailing_end | formatDate}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Trip End Date</b></td>
          <td>{{tripData.end_date | formatDate}}</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Trip Duration</b></td>
          <td>{{tripData.duration}} days</td>
        </tr>
        <tr>
          <td><b class="uppercase strong black-text">Type</b></td>
          <td>{{tripData.type}}</td>
        </tr>
      </table>
    </vs-col>
    <vs-col  vs-w="6">
      <h3 style="border-bottom: 1px solid black" class="mt-2">Expenses</h3>
      <table v-if="tripData.expense !=0" class="border-collapse">
          <thead>
          <tr class="p-2 border border-solid bg-primary text-white d-theme-border-grey-light">
            <th>Date</th>
            <th>Detail</th>
            <th>Amount</th>
            <th class="no_print">Action</th>
          </tr>
          </thead>
        <tbody>
        <tr v-for="ex in tripData.expenses" class="p-2 border border-solid d-theme-border-grey-light">
          <td>{{ex.created_at | formatDate}}</td>
          <td>{{ex.detail}}</td>
          <td>{{ex.amount | currency}}</td>
          <td class="no_print"><vs-button size="small" @click="edit(ex.id)" style="padding: 5px"><vs-icon icon="edit"></vs-icon></vs-button></td>
        </tr>
        <tr class="p-2 border border-solid d-theme-border-grey-light">
          <td colspan="3" class="text-right">Total = {{tripData.expense | currency}}</td>
        </tr>
        </tbody>
      </table>
      <p v-else class="text-center">No Expense</p>
    </vs-col>
    <vs-col  vs-w="6">
      <h3 style="border-bottom: 1px solid black" class="mt-2">Incomes</h3>
      <table v-if="tripData.income != 0">
        <thead>
        <tr class="p-2 border border-solid bg-primary text-white d-theme-border-grey-light">
          <th>Date</th>
          <th>Detail</th>
          <th>Amount</th>
          <th class="no_print">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ex in tripData.incomes" class="p-2 border border-solid d-theme-border-grey-light">
          <td>{{ex.created_at | formatDate}}</td>
          <td>{{ex.detail}}</td>
          <td>{{ex.amount | currency}}</td>
          <td class="no_print"><vs-button size="small" @click="edit(ex.id)" style="padding: 5px"><vs-icon icon="edit"></vs-icon></vs-button></td>
        </tr>
        <tr class="p-2 border border-solid  d-theme-border-grey-light">
          <td colspan="3" class="text-right">Total = {{tripData.income | currency}}</td>
        </tr>
        </tbody>
      </table>
      <p v-else class="text-center">No Income</p>
    </vs-col>
    <vs-col vs-w="12">
      <hr>
    </vs-col>
    <vs-col vs-offset="6"  vs-w="6">

      <table >
        <tbody>
          <tr  class="p-2 border border-solid d-theme-border-grey-light">
            <td>Total Income</td>
            <td>{{tripData.income | currency}}</td>
          </tr>
          <tr  class="p-2 border border-solid d-theme-border-grey-light">
            <td>Total Expense</td>
            <td>{{tripData.expense | currency}}</td>
          </tr>
          <tr  class="p-2 border border-solid d-theme-border-grey-light">
            <td>Profit</td>
            <td>{{tripData.profit | currency}}</td>
          </tr>
        </tbody>
      </table>
    </vs-col>
      <vs-popup :title="action" style="z-index: 500000" :active.sync="popupActive2">
        <vx-input-group class="mb-base">
          <datepicker v-if="$auth.check(['date'])" class="text-center" v-model="transactionForm.date"> </datepicker>
        </vx-input-group>
        <vx-input-group class="mb-base">
          <vs-input  label="Details" v-validate="'required'"  name="detail" v-model="transactionForm.detail" placeholder="Detail" />
          <span class="text-danger text-sm" v-show="errors.has('detail')">{{ errors.first('detail') }}</span>
        </vx-input-group>
        <vx-input-group class="mb-base">
          <vs-input v-validate="'required|decimal'"  name="amount" label="Amount"v-model="transactionForm.amount"  placeholder="Amount" />
          <span class="text-danger text-sm" v-show="errors.has('amount')">{{ errors.first('amount') }}</span>
        </vx-input-group>
        <vs-button type="filled" @click.prevent="submitForm" class="mt-5 block">Save</vs-button>
      </vs-popup>
  </vs-row>
</template>
<script>
  import Datepicker from 'vuejs-datepicker';
  export default {
    props:['tripData'],
    data(){
      return {
        transactionForm:{
          id:'',
          date: '',
          detail:'',
          amount:'',
        },
        popupActive2: false,
        action:'Edit',
      }
    },
    methods:{
      submitForm() {
        this.$validator.validateAll().then(result => {
          if(result) {
            this.popupActive2 = false;
            this.transactionForm.date = this.$options.filters.dateToString(this.transactionForm.date);
            this.axios.post('transaction/'+this.transactionForm.id,this.transactionForm)
              .then(res => {
                if (res.data.notify){
                  this.$vs.notify({
                    title:res.data.notify.title,
                    text:res.data.notify.message,
                    color:res.data.notify.type
                  })
                }
                if (res.data.status == 'success') {
                  this.transactionForm = {
                    id:'',
                    date: '',
                    detail:'',
                    amount:'',
                  }
                }
                this.update();
              })
          }else{
          }
        })
      },
      edit(id){
        this.axios.get('transaction/'+id)
          .then(res => {
            this.transactionForm.id = id;
            this.transactionForm.date = new Date(res.data.created_at);
            this.transactionForm.detail = res.data.detail;
            this.transactionForm.amount = res.data.amount;
            this.action = res.data.type;
            this.popupActive2 = true;
          });
      },
      update(){
        this.axios.get('trip/'+this.tripData.id)
          .then(res => {
            this.tripData = res.data;
          })
      }
    },
    components: {
      Datepicker,
    },
  }
</script>
<style scoped>


  table {
  border-collapse: collapse;
  width: 100%;
    margin: 10px 0px 10px 0px;
  }

  th, td {
  /*text-align: center;*/
    padding: 2px;
  }
</style>
