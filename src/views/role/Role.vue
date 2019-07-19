<template>
  <vx-card title="All Users">
    <div class="grid-demo__layout-container">
      <vs-row vs-w="12">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="12" vs-xs="12">
          <form>
            <div class="vx-col">
              <vs-input  label="Role Name" v-validate="'required'" placeholder="Role Name" name="name" v-model="role.role_name" class="mt-5 w-full" />
              <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>
            </div>
            <vs-button type="filled" @click.prevent="submitForm" class="mt-5 block">{{action}}</vs-button>
          </form>
        </vs-col>
        <vs-col  vs-align="center" vs-lg="8" vs-sm="12" vs-xs="12">
          <h3>All Roles</h3>
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="role in roles">
              <td>{{role.label}}</td>
              <td>
                <vs-dropdown color="success" style="cursor: pointer" vs-trigger-click>
                <vs-button class="btn-drop" type="filled" icon="more_horiz"></vs-button>
                <vs-dropdown-menu >
                  <vs-dropdown-item v-if="$auth.check(['super_admin'])" @click="edit(role.id, role.label)">Edit</vs-dropdown-item>
                  <vs-dropdown-item divider v-if="$auth.check(['super_admin'])" @click="confirmDelete(role.id)">Delete</vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
              </td>
            </tr>
            </tbody>
          </table>
        </vs-col>
      </vs-row>
    </div>
    <div class="demo-alignment">
      <vs-popup class="holamundo" title="Are you sure?" :active.sync="deleteConfirmation">
        <p>This action can not undone! If this is mistake click cancel</p>
        <div class="flex justify-between flex-wrap">
          <vs-button class="mt-4 shadow-lg" type="gradient" @click="deleteR(deleteId)" color="danger">Delete</vs-button>
          <vs-button class="mt-4 shadow-lg" type="gradient" @click="deleteConfirmation=false" color="success">Cancel</vs-button>
        </div>

      </vs-popup>
    </div>
  </vx-card>
</template>
<script>
  export default {
    data(){
      return {
        deleteConfirmation:false,
        deleteId:'',
        action:'Create',
        role:{
          role_id:'',
          role_name:''
        },
        roles:[],
      }
    },
    methods:{
      confirmDelete(id){
        this.deleteConfirmation = true;
        this.deleteId = id;
      },
      edit(id, name){
        this.role.role_name = name;
        this.role.role_id = id;
        this.action = 'Update';
      },
      deleteR(id){
        this.deleteConfirmation = false;
        this.axios.delete('role/'+id)
          .then(res=>{
            if (res.data.notify){
              this.$vs.notify({
                title:res.data.notify.title,
                text:res.data.notify.message,
                color:res.data.notify.type
              })
            }
            if (res.data.status == 'success') {
              this.update();
            }
          })
      },
      submitForm(){
        this.$validator.validateAll().then(result => {
          if(result) {
            this.axios.post('role',this.role)
              .then(res => {
                if (res.data.notify){
                  this.$vs.notify({
                    title:res.data.notify.title,
                    text:res.data.notify.message,
                    color:res.data.notify.type
                  })
                }
                if (res.data.status == 'success') {
                  this.role = {
                    role_name:'',
                    role_id:'',
                  }
                  this.$validator.reset();
                  this.action = 'Create';
                  this.update();
                }

              })
          }else{
          }
        })
      },
      update(){
        this.axios.get('roles')
          .then( res => {
            this.roles = res.data;
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
    text-align: center;
  }
</style>
