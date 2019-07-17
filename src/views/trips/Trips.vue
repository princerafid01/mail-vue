<template>
  <vx-card title="All trips">
    <h6>Number of rows</h6>
    <v-select style="margin-bottom: -12px !important;" class="md:w-1/6 mb-base" @input="setMax"  v-model="maxItem" :options="options"></v-select>
    <vs-table  pagination :max-items="maxItem" search :data="users">

      <template slot="thead">
        <vs-th sort-key="number">Trip #</vs-th>
        <vs-th sort-key="ship">Ship</vs-th>
        <vs-th sort-key="type">Type</vs-th>
        <vs-th sort-key="start_date">Start Date</vs-th>
        <vs-th sort-key="status">Status</vs-th>
        <vs-th sort-key="created_by">Created by</vs-th>
        <vs-th sort-key="income">Income</vs-th>
        <vs-th sort-key="expense">Expense</vs-th>
        <vs-th sort-key="profit">Profit</vs-th>
        <vs-th >Action</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

          <vs-td :data="data[indextr].number">
            {{data[indextr].number}}
          </vs-td>

          <vs-td :data="data[indextr].ship">
            {{data[indextr].ship}}
          </vs-td>

          <vs-td :data="data[indextr].type">
            {{data[indextr].type}}
          </vs-td>

          <vs-td :data="data[indextr].start_date">
            {{data[indextr].start_date | formatDate}}
          </vs-td>
          <vs-td :data="data[indextr].status">
            {{data[indextr].status}}
          </vs-td>
          <vs-td :data="data[indextr].created_by">
            {{data[indextr].created_by}}
          </vs-td>
          <vs-td :data="data[indextr].income">
            {{data[indextr].income|currency}}
          </vs-td>
          <vs-td :data="data[indextr].expense">
            {{data[indextr].expense|currency}}
          </vs-td>
          <vs-td :data="data[indextr].profit">
            {{data[indextr].profit|currency}}
          </vs-td>
          <vs-td :data="data[indextr].id">
            <vs-dropdown color="success" style="cursor: pointer" vs-trigger-click>
              <vs-button class="btn-drop" type="filled" icon="more_horiz"></vs-button>
              <vs-dropdown-menu >
                <vs-dropdown-item v-if="$auth.check(['income_add'])" @click="showTripFn(data[indextr].id)">View</vs-dropdown-item>
                <vs-dropdown-item v-if="$auth.check(['income_add'])" @click="addIncome(data[indextr].id)">Add Income</vs-dropdown-item>
                <vs-dropdown-item v-if="$auth.check(['expense_add'])" @click="addExpense(data[indextr].id)">Add Expense</vs-dropdown-item>
                <vs-dropdown-item v-if="$auth.check(['income_edit'])"><router-link :to="'trip/edit?id='+data[indextr].id">Edit</router-link></vs-dropdown-item>
                <vs-dropdown-item divider v-if="$auth.check(['income_delete'])" @click="deleteTrip(data[indextr].id)">Delete</vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-td>

        </vs-tr>
      </template>
    </vs-table>
    <div class="demo-alignment">
      <vs-popup class="holamundo" v-if="popupActive" :title="transactionForm.action" :active.sync="popupActive">
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
    <div class="demo-alignment">
      <vs-popup class="holamundo" fullscreen title="View Trip" :active.sync="showTrip">
        <div id="section-to-print">
          <trip-view :tripData="tripData" v-if="tripData"></trip-view>
        </div>
      </vs-popup>
    </div>
    <router-link to="/trip/add"><vs-button class="floating-btn" color="success" type="gradient" icon-pack="feather" icon="icon-plus"></vs-button></router-link>
  </vx-card>
</template>

<script>
  import vSelect from 'vue-select';
  import Datepicker from 'vuejs-datepicker';
  import TripView from '../components/TripView';
  export default {
    data() {
      return {

        showTrip:false,
        tripData:null,
        popupActive: false,
        transactionForm:{
          action:'',
          type:'',
          trip_id:'',
          date: new Date(),
          detail:'',
          amount:'',
        },
        users: [

        ],
        options: [
          10,
          20,
          50,
          100
        ],
        maxItem: localStorage.getItem('maxItem')? localStorage.getItem('maxItem'): 10,
      }
    },
    methods:{

      deleteTrip(){

      },
      showTripFn(tripId){
          this.axios.get('trip/'+tripId)
            .then(res => {
              this.tripData = res.data;
              this.showTrip = true;
            })
      },
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
        this.popupActive = false;
        this.$validator.validateAll().then(result => {
          if(result) {
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
                this.$validator.reset();
                this.update();

              })
          }else{
            // form have errors
          }
        })
      }
      ,
      setMax(){
        if (this.maxItem < 10)
          this.maxItem = 10;
        localStorage.setItem('maxItem',this.maxItem);
      },
      update(){
        this.axios.get('/trips')
          .then(res => {
            this.users = res.data;
          })
      }
    },
    mounted(){
      this.update();
    },
    components: {
      Datepicker,
      'v-select': vSelect,
      'trip-view':TripView
    }
  }
</script>
<style scoped>
  .vdp-datepicker input {
    width: 100%;
  }
  /*.select_input{*/
    /*padding-top: 10px;*/
  /*}*/
  /*::v-deep .vs-popup--content {*/
    /*overflow: inherit;*/
  /*}*/
</style>
