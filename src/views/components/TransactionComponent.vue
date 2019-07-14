<template>
  <div>
    <h6>Number of rows</h6>
    <v-select style="margin-bottom: -12px !important;" class="md:w-1/6 mb-base" @input="setMax"  v-model="maxItem" :options="options"></v-select>
    <vs-table  pagination :max-items="maxItem" search :data="trans">
      <template slot="thead">
        <vs-th sort-key="created_at">Date</vs-th>
        <vs-th sort-key="trip">Trip</vs-th>
        <vs-th sort-key="detail">Detail</vs-th>
        <vs-th sort-key="amount">Amount</vs-th>
        <vs-th sort-key="created_by">Created_by</vs-th>
        <vs-th >Action</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

          <vs-td :data="data[indextr].created_at">
            {{data[indextr].created_at | formatDate}}
          </vs-td>

          <vs-td :data="data[indextr].trip">
            {{data[indextr].trip}}
          </vs-td>

          <vs-td :data="data[indextr].detail">
            {{data[indextr].detail}}
          </vs-td>

          <vs-td :data="data[indextr].amount">
            {{data[indextr].amount | currency}}
          </vs-td>
          <vs-td :data="data[indextr].created_by">
            {{data[indextr].created_by}}
          </vs-td>
          <vs-td :data="data[indextr].id">
            <vs-dropdown color="success">
              <vs-button class="btn-drop" type="filled" icon="more_horiz"></vs-button>
              <vs-dropdown-menu >
                <vs-dropdown-item v-if="$auth.check([type+'_edit'])" @click="edit(data[indextr].id)">Edit</vs-dropdown-item>
                <vs-dropdown-item v-if="$auth.check([type+'_delete'])" @click="delete(data[indextr].id)">Delete</vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
            <!--{{data[indextr].profit|currency}}-->
          </vs-td>

        </vs-tr>
      </template>
    </vs-table>
    <div class="demo-alignment">
      <vs-popup class="holamundo" :title="'Edit '+ type" :active.sync="popupActive">
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
    </div>
  </div>
</template>
<script>
  import vSelect from 'vue-select';
  import Datepicker from 'vuejs-datepicker';
  export default {
    props: {
      type:{
        type:String,
        required
          :
          true
      }
    },
    data () {
      return {
        popupActive: false,
        transactionForm:{
          id:'',
          date: '',
          detail:'',
          amount:'',
        },
        trans: [

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
    methods: {
      submitForm() {
        this.$validator.validateAll().then(result => {
          if(result) {
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
                  this.popupActive = false;
                  this.transactionForm = {
                    id:'',
                    date: '',
                    detail:'',
                    amount:'',
                  }
                }
                this.update();

              })
              .catch(error => {
                if (error.response.status == 422){
                  console.log(error.response.data.errors);
                  this.$vs.notify({
                    title:'Validation error',
                    text:'Error in your data.Please check your input',
                    color:'warning'})
                }
              });
          }else{
            // form have errors
          }
        })
      }
      ,
      edit(id){
        this.axios.get('transaction/'+id)
          .then(res => {
            this.transactionForm.id = id;
            this.transactionForm.date = new Date(res.data.created_at);
            this.transactionForm.detail = res.data.detail;
            this.transactionForm.amount = res.data.amount;
            this.popupActive = true;
          });
      },
      delete(id){

      },
      setMax(){
        if (this.maxItem < 10)
          this.maxItem = 10;
        localStorage.setItem('maxItem',this.maxItem);
      },
      update(){
        this.axios.get('/transaction/list', {
          params: {
            'type':this.type
          }
        })
          .then(res => {
            this.trans = res.data;
          })
      }
    },
    watch: {
      '$route'(to, from){
        this.type = to.meta.type
        this.update();
      },
    },
    mounted(){
      this.update();
    },
    components: {
      Datepicker,
      'v-select': vSelect,
    }
  }
</script>
