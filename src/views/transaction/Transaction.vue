<template>
  <vx-card :title="'All '+pageTitle">
    <app-transaction :type="type"></app-transaction>
  </vx-card>
</template>
<script>
  import TransactionComponent from "../components/TransactionComponent"
  export default {
    data (){
      return {
        type:this.$route.meta.type,
      }
    },
    computed:{
      pageTitle (){
        return this.type == 'gexpense'? 'General Expense': this.type;
      }
    },
    watch:{
      '$route'(to, from){
        this.type = to.meta.type
      },
    },
    components:{
      'app-transaction': TransactionComponent
    }
  }
</script>
