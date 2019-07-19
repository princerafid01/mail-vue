<template>
  <vx-card title="Roles">
    <div style="overflow: auto">
      <table>
        <thead>
        <tr>
          <th>Module</th>
          <th>Function</th>
          <th>View</th>
          <th>Add</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Ship</td>
          <td>Report</td>
          <td><vs-checkbox v-model="perms" vs-value="19"></vs-checkbox></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Trip</td>
          <td>Trip</td>
          <td><vs-checkbox v-model="perms" vs-value="1"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="2"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="3"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="4"></vs-checkbox></td>
        </tr>
        <tr>
          <td rowspan="2">User</td>
          <td>User</td>
          <td><vs-checkbox v-model="perms" vs-value="5"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="6"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="7"></vs-checkbox></td>
          <td></td>
        </tr>
        <tr>
          <td>User Password</td>
          <td></td>
          <td></td>
          <td><vs-checkbox v-model="perms" vs-value="8"></vs-checkbox></td>
          <td></td>
        </tr>
        <tr>
          <td>Income</td>
          <td>Income</td>
          <td><vs-checkbox v-model="perms" vs-value="10"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="11"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="12"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="13"></vs-checkbox></td>
        </tr>
        <tr>
          <td>Expense</td>
          <td>Expense</td>
          <td><vs-checkbox v-model="perms" vs-value="14"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="15"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="16"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="17"></vs-checkbox></td>
        </tr>
        <tr>
          <td>General Expense</td>
          <td>General Expense</td>
          <td><vs-checkbox v-model="perms" vs-value="21"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="22"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="23"></vs-checkbox></td>
          <td><vs-checkbox v-model="perms" vs-value="24"></vs-checkbox></td>
        </tr>
        <tr>
          <td>Misc.</td>
          <td colspan="5"><div style="display: flex"><vs-checkbox v-model="perms" vs-value="9">View All Records</vs-checkbox> <vs-checkbox v-model="perms" vs-value="18">Date Manipulate</vs-checkbox> <vs-checkbox v-model="perms" vs-value="20">Notify all</vs-checkbox></div></td>
        </tr>
        </tbody>
      </table>
    </div>
    <vs-button type="filled" @click.prevent="submitForm" class="mt-5 block">Save</vs-button>
  </vx-card>
</template>
<script>
  export default {
      data(){
        return {
          perms:['2','3'],
          role_id: this.$route.params.id
        }
      },
    methods:{
        submitForm(){
            this.axios.post('role/perms/'+this.role_id,{'permissions': this.perms})
              .then(res => {
                if (res.data.notify){
                  this.$vs.notify({
                    title:res.data.notify.title,
                    text:res.data.notify.message,
                    color:res.data.notify.type
                  })
                }
                if (res.data.status == 'success') {
                }
              })
        },
        update(){
          this.axios.get('role/perms/'+this.role_id)
            .then(res=>{
              this.perms = res.data;
            })
        }
    },
    mounted(){
        this.update();
    }
  }
</script>
<style scoped>
  table, td, th {
    border: 1px solid #e5e0e0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    padding: 2px;
    text-align: center;
  }
</style>
