<template>
  <div class="vx-row">

      <div v-for="trip in currentTrip" class="vx-col w-full sm:w-1/2 lg:w-1/3 mb-base">
        <vx-card>
          <div slot="no-body">
            <img :src="require(`@/assets/images/pages/transport.jpg`)" alt="content-img" class="responsive card-img-top">
          </div>
          <h5 class="mb-2">{{trip.number}}</h5>
          <div class="vs-component vs-con-table stripe vs-table-primary">
            <!--<div class="con-tablex vs-table&#45;&#45;content">-->
              <div class="vs-con-tbody vs-table--tbody  ">
                <table class="vs-table vs-table--tbody-table" style="min-width: 100px !important;">
                  <!--<colgroup>-->
                    <!--<col width="20">-->
                    <!--<col name="col-0">-->
                  <!--</colgroup>-->
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

          <div class="flex justify-between flex-wrap">
            <vs-button class="mt-4 shadow-lg" type="gradient" color="#7367F0" gradient-color-secondary="#CE9FFC">Download</vs-button>
            <vs-button class="mt-4" type="border" color="#b9b9b9">View All</vs-button>
          </div>
        </vx-card>
      </div>
    <vs-divider v-if="currentTrip"></vs-divider>
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
        <h2 class="text-white text-center">{{totalIncome}}</h2>
      </vx-card>
    </div>
    <div class="vx-col w-full md:w-1/4 mb-base">
      <vx-card
        title="Total Expense"
        subtitle="Total expense for all trip"
        title-color="#fff"
        content-color="#fff"
        card-background="linear-gradient(45deg, #bf360c, #f57c00)">
        <h3 class="text-white text-center">{{totalExpense}}</h3>
      </vx-card>
    </div>
    <div class="vx-col w-full md:w-1/4 mb-base">
      <vx-card
        title="Total Profit"
        subtitle="Total from all trip till now"
        title-color="#fff"
        card-background="success"
        content-color="#fff">
        <h3 class="text-white text-center">{{totalProfit}}</h3>
      </vx-card>
    </div>

  </div>
</template>
<script>
  export default {
    data(){
      return {
        totalExpense:'loading',
        totalTrip:'loading',
        totalIncome:'loading',
        totalProfit:'loading',
        totalGExpense:'loading',
        currentTrip:null,
      }
    },
    mounted(){
      this.axios.get('/home')
        .then(res => {
          this.totalTrip = res.data.total_trip;
          this.totalIncome = res.data.total_income;
          this.totalExpense = res.data.total_expense;
          this.totalProfit = res.data.total_profit;
          this.currentTrip = res.data.current_trip;
        });
    }
  }
</script>
