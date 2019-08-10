<template>
  <div>
    <vx-card title="Income vs Expense vs Profit" >
      <div class="vx-row m-2">
        <div class="vx-col w-full">
          <iframe class="hidden lg:inline-flex" width="100%" height="400px" :src="axios.defaults.baseURL + '/animation'" frameborder="no" allowtransparency="true" allowfullscreen="true">
          </iframe>
        </div>
      </div>
      <div class="vx-row m-2 ">
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
      <div class="vx-row">
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
      </div>
    </vx-card>
    <div class="demo-alignment">
    <div id="section-to-print" class="only_print">
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <h2 class="text-center">Noble Navigation and Shipping Line</h2>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" class="mb-2" vs-align="center" vs-w="12">
          <h4 class="text-center">{{$route.meta.pageTitle}}</h4>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" class="mb-2" vs-align="center" vs-w="12">
          <h4 class="text-center">Trip Summary ({{ startDate | formatDate}} - {{ endDate |formatDate}} )</h4>
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
              <td>{{totalProfit}}</td>
            </tr>
          </table>
        </vs-col>
      </vs-row>
    </div>
    </div>
  </div>
</template>
<script>
  import VueApexCharts from 'vue-apexcharts'
  import Datepicker from 'vuejs-datepicker';
  export default {
    watch: {
      '$route'(to, from){
        this.ship_id = to.meta.ship_id;
        this.update();
      },
    },
    data() {
      return {
        endDate:'',
        startDate:'',
        totalTrip:'',
        totalIncome:'',
        totalExpense:'',
        totalProfit:'',
        printt:false,
        themeColors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
        lineAreaChartSpline: {
          series: [],
          chartOptions: {
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },
            colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
            xaxis: {
              type: 'datetime',
              categories: [],
            },
            tooltip: {
              x: {
                format: 'dd/MM/yy HH:mm'
              },

            }
          }
        },
        ship_id:''
      }
    },
    methods:{

      update(){
        this.axios.get('ship/getData/'+this.ship_id, {params:{start_date:this.$options.filters.dateToString(this.startDate),end_date:this.$options.filters.dateToString(this.endDate)}})
  .then( res => {
            this.lineAreaChartSpline.series = res.data.chart_data;
            this.lineAreaChartSpline.chartOptions = {
              xaxis: {
                categories: res.data.dates
              }
            }
            this.totalIncome = res.data.totalIncome;
            this.totalExpense = res.data.totalExpense;
            this.totalTrip = res.data.totalTrip;
            this.totalProfit = res.data.totalProfit;
            this.startDate = new Date(res.data.start_date);
            this.endDate = new Date(res.data.end_date);

          })
      }
    },
    mounted(){
      this.ship_id =  this.$route.meta.ship_id;
      this.update();
    },
    components: {
      VueApexCharts, Datepicker,
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
