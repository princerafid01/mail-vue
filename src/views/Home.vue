<template>
  <div class="vx-row">

      <div v-for="trip in currentTrip" v-if="$auth.check(['trip_view'])" class="vx-col w-full sm:w-1/2 lg:w-1/3 mb-base">
        <vx-card>
          <div slot="no-body">
            <img :src="require(`@/assets/images/pages/transport.jpg`)" alt="content-img" class="responsive card-img-top">
          </div>
          <div class="btn-group flex flex-wrap mb-2">
            <vs-button v-if="$auth.check(['income_add'])" @click="addIncome(trip.id)" style="width: 33.3333%">Add Income</vs-button>
            <vs-button v-if="$auth.check(['expense_add'])" @click="addExpense(trip.id)" style="width: 33.3333%">Add Expense</vs-button>
            <vs-button v-if="$auth.check(['trip_edit'])" style="width: 33.3333%"><router-link style="color: white;" :to="'trip/edit?id='+trip.id">Edit Trip</router-link></vs-button>
          </div>
          <div class="demo-alignment">

            <!--<vs-button @click="popupActive=true" color="primary" type="border">Open Default popup</vs-button>-->

            <vs-popup class="holamundo" :title="transactionForm.action" :active.sync="popupActive">
              <vx-input-group class="mb-base">
              <datepicker v-if="$auth.check(['date'])" class="text-center" v-model="transactionForm.date"> </datepicker>
              </vx-input-group>
              <vx-input-group class="mb-base">
                <vs-input  label="Details" v-validate="'required'"  name="detail" v-model="transactionForm.detail" placeholder="Detail" />
                <span class="text-danger text-sm" v-show="errors.has('detail')">{{ errors.first('detail') }}</span>
              </vx-input-group>
              <vx-input-group class="mb-base">
                <vs-input v-validate="'required|numeric'"  name="amount" label="Amount"v-model="transactionForm.amount"  placeholder="Amount" />
                <span class="text-danger text-sm" v-show="errors.has('amount')">{{ errors.first('amount') }}</span>
              </vx-input-group>
              <vs-button type="filled" @click.prevent="submitForm" class="mt-5 block">Save</vs-button>

            </vs-popup>
          </div>

          <h5 class="mb-2 text-center">{{trip.number}}</h5>
          <div class="vs-component vs-con-table stripe vs-table-primary">
              <div class="vs-con-tbody vs-table--tbody  ">
                <table class="vs-table vs-table--tbody-table" style="min-width: 100px !important;">
                  <tr class="tr-values vs-table--tr tr-table-state-null">
                    <td class="td vs-table--td">Ship</td>
                    <td class="td vs-table--td">{{trip.ship.name}}</td>
                  </tr>
                  <tr class="tr-values vs-table--tr tr-table-state-null">
                    <td class="td vs-table--td">Start date</td>
                    <td class="td vs-table--td">{{trip.start_date | formatDate}}</td>
                  </tr>
                  <tr class="tr-values vs-table--tr tr-table-state-null">
                    <td class="td vs-table--td">Sailing start</td>
                    <td class="td vs-table--td">{{trip.sailing_start | formatDate}}</td>
                  </tr>
                  <tr class="tr-values vs-table--tr tr-table-state-null">
                    <td class="td vs-table--td">Sailing end</td>
                    <td class="td vs-table--td">{{trip.sailing_end | formatDate}}</td>
                  </tr>
                  <tr class="tr-values vs-table--tr tr-table-state-null">
                    <td class="td vs-table--td">Discharging finish</td>
                    <td class="td vs-table--td">{{trip.end_date | formatDate}}</td>
                  </tr>
                  <tr class="tr-values vs-table--tr tr-table-state-null">
                    <td class="td vs-table--td">Income</td>
                    <td class="td vs-table--td">{{trip.income | currency}}</td>
                  </tr>
                  <tr class="tr-values vs-table--tr tr-table-state-null">
                    <td class="td vs-table--td">Expense</td>
                    <td class="td vs-table--td">{{trip.expense | currency}}</td>
                  </tr>
                  <tr class="tr-values vs-table--tr tr-table-state-null">
                    <td class="td vs-table--td">Profit</td>
                    <td class="td vs-table--td">{{trip.profit | currency}}</td>
                  </tr>
                </table>
              </div>
          </div>
        </vx-card>
      </div>
    <vs-divider v-if="currentTrip"></vs-divider>
    <div class="vx-row mb-3" style="width: 100%">
      <h3 class="vx-col md:w-full text-center">Date range filter</h3>
      <div class="vx-col md:w-1/4">
        <label class="vs-input--label">Start Date</label>
        <datepicker class="text-center" input-class="vs-inputx vs-input--input normal" wrapper-class="vs-component vs-con-input-label vs-input mt-5 w-full vs-input-primary"  v-model="startDate"> </datepicker>
      </div>
      <div class="vx-col md:w-1/4">
        <label class="vs-input--label">End date</label>
        <datepicker class="text-center" input-class="vs-inputx vs-input--input normal" wrapper-class="vs-component vs-con-input-label vs-input mt-5 w-full vs-input-primary"  v-model="endDate"> </datepicker>
      </div>
      <div class="vx-col md:w-1/4">
        <vs-button type="filled" @click.prevent="update"  style="margin-top: 37px !important;" class="mt-5 block">Filter</vs-button>
      </div>
    </div>

    <!-- Background Color -->
    <div class="vx-col w-full md:w-1/4 mb-base">
      <vx-card
        title="Total Trip"
        subtitle="Total trip till now"
        title-color="#fff"
        card-background="linear-gradient(45deg, #2962ff, #3949ab)"
        content-color="#fff">
        <h3 class="text-white text-center">{{totalTrip}}</h3>
      </vx-card>
    </div>
    <!-- Gradient Background Color -->
    <div class="vx-col w-full md:w-1/4 mb-base">
      <vx-card
        title="Total income"
        subtitle="Total income from all trip"
        title-color="#fff"
        content-color="#fff"
        card-background="linear-gradient(45deg, #43a047, #1de9b6)">
        <h2 class="text-white text-center">{{totalIncome|currency}}</h2>
      </vx-card>
    </div>
    <div class="vx-col w-full md:w-1/4 mb-base">
      <vx-card
        title="Total Expense"
        subtitle="Total expense for all trip"
        title-color="#fff"
        content-color="#fff"
        card-background="linear-gradient(45deg, #bf360c, #f57c00)">
        <h3 class="text-white text-center">{{totalExpense|currency}}</h3>
      </vx-card>
    </div>
    <div class="vx-col w-full md:w-1/4 mb-base">
      <vx-card
        title="Total Profit"
        subtitle="Total from all trip till now"
        title-color="#fff"
        card-background="success"
        content-color="#fff">
        <h3 class="text-white text-center">{{totalProfit|currency}}</h3>
      </vx-card>
    </div>
    <div class="vx-col w-full md:w-1/4 mb-base">
      <vx-card
        title="Total General Expense"
        subtitle="Total from all trip till now"
        title-color="#fff"
        card-background="success"
        content-color="#fff">
        <h3 class="text-white text-center">{{totalGExpense|currency}}</h3>
      </vx-card>
    </div>
    <div class="demo-alignment">
      <div id="section-to-print" class="only_print">
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <h2 class="text-center">Noble Navigation and Shipping Line</h2>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" class="mb-2" vs-align="center" vs-w="12">
            <h4 class="text-center">Summary ({{ startDate | formatDate}} - {{ endDate |formatDate}} )</h4>
          </vs-col>
          <vs-col class="mb-2" vs-w="12">
            <hr/>
          </vs-col>
          <vs-col vs-offset="3" vs-w="6">
            <table class="border-collapse" style="width: 100%" >
              <tr class="p-2 border border-solid  d-theme-border-grey-light">
                <td><b class="uppercase strong black-text">Total trip</b></td>
                <td>{{totalTrip}}</td>
              </tr>
              <tr class="p-2 border border-solid  d-theme-border-grey-light">
                <td><b class="uppercase strong black-text">Total Income</b></td>
                <td>{{totalIncome | currency}}</td>
              </tr>
              <tr class="p-2 border border-solid  d-theme-border-grey-light">
                <td><b class="uppercase strong black-text">Total Expense</b></td>
                <td>{{totalExpense | currency}}</td>
              </tr>
              <tr class="p-2 border border-solid  d-theme-border-grey-light">
                <td><b class="uppercase strong black-text">Total Profit</b></td>
                <td>{{totalProfit | currency}}</td>
              </tr>
              <tr class="p-2 border border-solid  d-theme-border-grey-light">
                <td><b class="uppercase strong black-text">Total General Expense</b></td>
                <td>{{totalGExpense| currency}}</td>
              </tr>
              <tr class="p-2 border border-solid  d-theme-border-grey-light">
                <td><b class="uppercase strong black-text">Total Net Profit</b></td>
                <td>{{totalProfit - totalGExpense | currency}}</td>
              </tr>
            </table>
          </vs-col>
        </vs-row>
      </div>
    </div>
  </div>
</template>
<script>
  import Datepicker from 'vuejs-datepicker';
  export default {
    data(){
      return {
        endDate:'',
        startDate:'',
        totalExpense:'loading',
        totalTrip:'loading',
        totalIncome:'loading',
        totalProfit:'loading',
        totalGExpense:'loading',
        currentTrip:null,
        popupActive: false,
        date:new Date(),
        format: "yyyy-MM-dd",
        transactionForm:{
          action:'',
          type:'',
          trip_id:'',
          date: new Date(),
          detail:'',
          amount:'',
        }
      }
    },
    methods:{
      addExpense(tripId){
        this.transactionForm.action = 'Add Expense';
        this.transactionForm.type = 'expense';
        this.transactionForm.trip_id = tripId;
        this.popupActive = true;
      },
      addIncome(tripId){
        this.transactionForm.action = 'Add Income';
        this.transactionForm.type = 'income';
        this.transactionForm.trip_id = tripId;
        this.popupActive = true;
      },
      submitForm() {

        this.$validator.validateAll().then(result => {
          if(result) {
            this.popupActive = false;
            this.transactionForm.date = this.$options.filters.dateToString(this.transactionForm.date);
            console.log(this.transactionForm);
            this.axios.post('transaction/add',this.transactionForm)
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
                    action:'',
                    type:'',
                    trip_id:'',
                    date: new Date(),
                    detail:'',
                    amount:'',
                  }
                }
                this.update();

            })
          }else{
            // form have errors
          }
        })
      }
      ,
      update(){
        this.axios.get('/home', {params:{start_date:this.$options.filters.dateToString(this.startDate),end_date:this.$options.filters.dateToString(this.endDate)}})
          .then(res => {
            this.totalTrip = res.data.total_trip;
            this.totalIncome = res.data.total_income;
            this.totalExpense = res.data.total_expense;
            this.totalGExpense = res.data.total_gexpense;
            this.totalProfit = res.data.total_profit;
            this.currentTrip = res.data.current_trip;
            this.startDate = new Date(res.data.start_date);
            this.endDate = new Date(res.data.end_date);
          })
      }
    },
    mounted(){
      this.update();
    },
    components: {
      Datepicker
    }
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
