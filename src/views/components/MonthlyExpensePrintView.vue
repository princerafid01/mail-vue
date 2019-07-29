<template>
  <div id="section-to-print">
    <vs-row>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
        <h2 class="text-center">Noble Navigation and Shipping Line</h2>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
        <p class="text-center">General Expense</p>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
        <p class="text-center">{{data.month}}</p>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" class="mt-3" vs-align="center" vs-w="12">
        <table>
          <tr  class="p-2 border border-solid bg-primary text-white d-theme-border-grey-light">
            <th>Date</th>
            <th>Detail</th>
            <th>Created By</th>
            <th>Amount</th>
          </tr>
          <tr v-for=" expense in reveresed"  class="p-2 border border-solid d-theme-border-grey-light">
            <td>{{expense.created_at| formatDate}}</td>
            <td>{{expense.detail}}</td>
            <td>{{expense.created_by}}</td>
            <td>{{expense.amount | currency}}</td>
          </tr>
          <tr  class="p-2 border border-solid d-theme-border-grey-light">
            <td colspan="3"></td>
            <td>Total: {{data.total | currency}}</td>
          </tr>
        </table>
      </vs-col>
    </vs-row>

  </div>

</template>
<script>
  export default {
    props:['data'],
    computed:{
      reveresed(){
        return this.data.expenses.reverse();
      }
    }
  }
</script>
<style scoped>
  /*table, td, th {*/
    /*border: 1px solid black;*/
  /*}*/

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    text-align: center;
  }
</style>
