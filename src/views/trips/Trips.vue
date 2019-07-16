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
                <vs-dropdown-item v-if="$auth.check(['income_edit'])" @click="editTrip(data[indextr].id)">Edit</vs-dropdown-item>
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
    <div  class="demo-alignment">
      <vs-popup class="holamundo" v-if="showForm"  fullscreen :title="action" :active.sync="showForm">
        <form>
          <div class="vx-row">
            <div class="vx-col md:w-1/4">
              <div class="select_input">
              <label class="vs-input--label">Ship</label>
              <v-select class="select_input" :disabled="disabled" v-model="selectedShip" :clearable="false" :options="[{id: 1, label: 'Hasan Hamim 1'},{id: 2, label: 'Hasan Hamim 3'}]"></v-select>
              </div>
            </div>
            <div class="vx-col md:w-1/4">
              <vs-input  label="From" v-validate="'required'" placeholder="From" name="from" v-model="trip.from" class="mt-5 w-full" />
              <span class="text-danger text-sm"  v-show="errors.has('from')">{{ errors.first('from') }}</span>
            </div>

            <div class="vx-col md:w-1/4">
              <vs-input label="To" v-validate="'required'" placeholder="To" name="to" v-model="trip.to" class="mt-5 w-full" />
              <span class="text-danger text-sm" v-show="errors.has('to')">{{ errors.first('to') }}</span>
            </div>

            <div class="vx-col md:w-1/4">
              <label class="vs-input--label">Loading Start</label>
              <datepicker class="text-center" input-class="vs-inputx vs-input--input normal" wrapper-class="vs-component vs-con-input-label vs-input mt-5 w-full vs-input-primary"  v-model="trip.start_date"> </datepicker>
            </div>
            <div class="vx-col md:w-1/4">
              <label class="vs-input--label">Sailing Start</label>
              <datepicker class="text-center" input-class="vs-inputx vs-input--input normal" wrapper-class="vs-component vs-con-input-label vs-input mt-5 w-full vs-input-primary"  v-model="trip.sailing_start"> </datepicker>
            </div>
            <div class="vx-col md:w-1/4">
              <label class="vs-input--label">Sailing end</label>
              <datepicker class="text-center" input-class="vs-inputx vs-input--input normal" wrapper-class="vs-component vs-con-input-label vs-input mt-5 w-full vs-input-primary"  v-model="trip.sailing_end"> </datepicker>
            </div>
            <div class="vx-col md:w-1/4">
              <label class="vs-input--label">Discharging End</label>
              <datepicker class="text-center" input-class="vs-inputx vs-input--input normal" wrapper-class="vs-component vs-con-input-label vs-input mt-5 w-full vs-input-primary"  v-model="trip.end_date"> </datepicker>
            </div>
            <div class="vx-col md:w-1/4">
              <vs-input label="Cargo"  placeholder="To" name="cargo" v-model="trip.cargo" class="mt-5 w-full" />
              <span class="text-danger text-sm" v-show="errors.has('cargo')">{{ errors.first('cargo') }}</span>
            </div>
            <div class="vx-col md:w-1/4">
              <vs-input label="Cargo quantity"  placeholder="To" name="cargo" v-model="trip.cargo_quantity" class="mt-5 w-full" />
              <span class="text-danger text-sm" v-show="errors.has('cargo_quantity')">{{ errors.first('cargo_quantity') }}</span>
            </div>
            <div class="vx-col md:w-1/4">
              <vs-input label="Total Fuel"  placeholder="Total Fuel" name="cargo" v-model="trip.total_fuel" class="mt-5 w-full" />
              <span class="text-danger text-sm" v-show="errors.has('total_fuel')">{{ errors.first('total_fuel') }}</span>
            </div>
            <div class="vx-col md:w-1/4">
              <div class="select_input">
              <label class="vs-input--label">Type</label>
              <v-select class="select_input" v-model="selectedType" :clearable="false" :options="['Single', 'Double']"></v-select>
              </div>
            </div>
            <div class="vx-col md:w-1/4">
              <div class="select_input">
                <label class="vs-input--label">Ship</label>
                <v-select class="select_input" v-model="selectedStatus" :clearable="false" :options="['Loading', 'Sailing', 'Discharging', 'Completed']"></v-select>
              </div>
            </div>
          </div>

          <vs-button type="filled" @click.prevent="submitTripForm" class="mt-5 block">Submit</vs-button>
        </form>
      </vs-popup>
    </div>
    <vs-button @click="addTrip" class="floating-btn" color="success" type="gradient" icon-pack="feather" icon="icon-plus"></vs-button>
  </vx-card>
</template>

<script>
  import vSelect from 'vue-select';
  import Datepicker from 'vuejs-datepicker';
  import TripView from '../components/TripView';
  export default {
    data() {
      return {
        disabled:false,
        selectedShip:{id:1, label:'Hasan Hamim 1'},
        selectedType:'Single',
        selectedStatus:"Loading",
        showTrip:false,
        showForm:false,
        tripData:null,
        trip:{
          trip_id:'',
          ship_id:'',
          from:'',
          to:'',
          start_date:'',
          sailing_start:'',
          sailing_end:'',
          end_date:'',
          cargo:'',
          cargo_quantity:'',
          total_fuel:'',
          type:'',
          status:''
        },
        action:'Add Trip',
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
      editTrip(tripId){
        this.action = 'Edit trip';
        this.disabled = true;
        this.axios.get('trip/'+tripId)
          .then(res => {
            let d = res.data;
            this.selectedShip = d.ship_id == 1?{id:1, label:'Hasan Hamim 1'}:{id:2, label:'Hasan Hamim 3'};
            this.selectedStatus = d.status;
            this.selectedType = d.type;
            this.trip.trip_id = d.id;
            this.trip.ship_id = d.ship_id;
            this.trip.from = d.from;
            this.trip.to = d.to;
            this.trip.start_date = d.start_date? new Date(d.start_date):'';
            this.trip.sailing_start = d.sailing_start? new Date(d.sailing_start):'';
            this.trip.sailing_end= d.sailing_end? new Date(d.sailing_end):'';
            this.trip.end_date = d.end_date? new Date(d.end_date):'';
            this.trip.cargo = d.cargo;
            this.trip.cargo_quantity = d.cargo_quantity;
            this.trip.total_fuel = d.total_fuel;
            this.showForm = true;
          })
      },

      deleteTrip(){

      },
      addTrip(){
          this.action = 'Add trip';
          this.disabled = false;
          this.trip = {
            trip_id:'',
            ship_id:'',
            from:'',
            to:'',
            start_date:'',
            sailing_start:'',
            sailing_end:'',
            end_date:'',
            cargo:'',
            cargo_quantity:'',
            total_fuel:'',
            type:'',
            status:''
          }
          this.selectedShip={id:1, label:'Hasan Hamim 1'};
          this.selectedType='Single';
          this.selectedStatus="Loading";
          this.showForm = true;
      },
      submitTripForm(){
        this.showForm = false;
        this.trip.start_date = this.$options.filters.dateToString(this.trip.start_date);
        this.trip.sailing_start = this.$options.filters.dateToString(this.trip.sailing_start);
        this.trip.sailing_end = this.$options.filters.dateToString(this.trip.sailing_end);
        this.trip.end_date = this.$options.filters.dateToString(this.trip.end_date);
        this.trip.type = this.selectedType;
        this.trip.status = this.selectedStatus;
        this.$validator.validateAll().then(result => {
          if(result) {
            this.transactionForm.date = this.$options.filters.dateToString(this.transactionForm.date);
            this.axios.post('trip/add',this.trip)
              .then(res => {
                if (res.data.notify){
                  this.$vs.notify({
                    title:res.data.notify.title,
                    text:res.data.notify.message,
                    color:res.data.notify.type
                  })
                }
                if (res.data.status == 'success') {
                  this.trip = {
                    ship_id:'',
                    from:'',
                    to:'',
                    start_date:'',
                    sailing_start:'',
                    sailing_end:'',
                    end_date:'',
                    cargo:'',
                    cargo_quantity:'',
                    total_fuel:'',
                    type:'',
                    status:''
                  }
                  this.$validator.reset();
                }
                this.update();

              })
          }else{
            // form have errors
          }
        })
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
  .select_input{
    padding-top: 10px;
  }
  ::v-deep .vs-popup--content {
    overflow: inherit;
  }
</style>
