<template>
  <vx-card :title="action">
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
  </vx-card>
</template>
<script>
  import vSelect from 'vue-select';
  import Datepicker from 'vuejs-datepicker';
  export default {
    data() {
      return {
        referer:null,
        disabled: false,
        selectedShip:{id:1, label:'Hasan Hamim 1'},
        selectedType:'Single',
        selectedStatus:"Loading",
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
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.referer = from;
      });
    },
    methods:{
      submitTripForm(){
        this.trip.start_date = this.$options.filters.dateToString(this.trip.start_date);
        this.trip.sailing_start = this.$options.filters.dateToString(this.trip.sailing_start);
        this.trip.sailing_end = this.$options.filters.dateToString(this.trip.sailing_end);
        this.trip.end_date = this.$options.filters.dateToString(this.trip.end_date);
        this.trip.type = this.selectedType;
        this.trip.status = this.selectedStatus;
        this.trip.ship_id = this.selectedShip.id;
        console.log(this.trip);
        this.$validator.validateAll().then(result => {
          if(result) {
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
                  this.$router.push(this.referer);
                }

              })
          }else{
            // form have errors
          }
        })
      },
      editTrip(tripId){
        this.disabled = true;
        this.axios.get('trip/'+tripId)
          .then(res => {
            let d = res.data;
            this.action = 'Edit trip ('+d.number+')';
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
          })
      },

    },
    mounted(){
      if (this.$route.query.id) {
        this.editTrip(this.$route.query.id);
      }
    },
    components: {
      Datepicker,
      'v-select': vSelect
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
