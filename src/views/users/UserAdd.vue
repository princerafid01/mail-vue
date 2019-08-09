<template>
  <vx-card :title="action">
    <form>
      <div class="vx-row">
        <div class="vx-col md:w-1/4">
          <vs-input  label="Full Name" v-validate="'required'" placeholder="Full Name" name="name" v-model="user.name" class="mt-5 w-full" />
          <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>
        </div>

        <div class="vx-col md:w-1/4">
          <vs-input label="Email" :disabled="disabled" v-validate="'required|email'" placeholder="Email" name="email" v-model="user.email" class="mt-5 w-full" />
          <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
        </div>
        <div class="vx-col md:w-1/4">
          <vs-input label="Phone"  placeholder="Phone" v-validate="'required|min:11|numeric'" name="phone" v-model="user.phone" class="mt-5 w-full" />
          <span class="text-danger text-sm" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
        </div>
        <div class="vx-col md:w-1/4">
          <vs-input type="password" label="Password" autocomplete="new-password"  v-validate="disabled?'':'required|min:6'" ref="password" placeholder="Your Password" name="password" v-model="user.password" class="mt-5 w-full" />
          <span class="text-danger text-sm" v-show="errors.has('password')">{{ errors.first('password') }}</span>
        </div>

        <div class="vx-col md:w-1/4">
          <vs-input type="password" label="Confirm Password"  v-validate="disabled?'confirmed:password':'required|min:6|max:10|confirmed:password'" data-vv-as="password" placeholder="Confirm Password" name="password_confirmation" v-model="user.password_confirmation" class="mt-5 w-full" />
          <span class="text-danger text-sm" v-show="errors.has('password_confirmation')">{{ errors.first('password_confirmation') }}</span>
        </div>
        <div class="vx-col md:w-1/4">
          <div class="select_input">
            <label class="vs-input--label">Role</label>
            <v-select class="select_input" v-validate="'required'" name="role" v-model="selectedRole" :clearable="false" :options="roles"></v-select>
            <span class="text-danger text-sm" v-show="errors.has('role')">{{ errors.first('role') }}</span>
          </div>
        </div>
        <div class="vx-col md:w-1/4">
          <div class="select_input">
            <label class="vs-input--label">Status</label>
            <v-select class="select_input" v-model="selectedStatus" :clearable="false" :options="['Active', 'Inactive']"></v-select>
          </div>
        </div>
        <div class="vx-col md:w-1/4">
        <vs-checkbox style="padding-top: 50px" v-model="user.notify">Notify by SMS</vs-checkbox>
        </div>
      </div>

      <vs-button type="filled" @click.prevent="submitForm" :disabled="loading" class="mt-5 block">Submit</vs-button>
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
        selectedRole:[],
        selectedStatus:'Active',
        roles:[],
        user:{
          user_id:'',
          name:'',
          email:'',
          phone:'',
          status:'',
          password:'',
          role_id:'',
          notify:'',
        },
        action:'Add User',
        loading:false,
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.referer = from;
      });
    },
    methods:{
      submitForm(){
        this.user.status = this.selectedStatus;
        this.user.role_id = this.selectedRole.id;
        this.user.status = this.selectedStatus;
        console.log(this.user);
        this.$validator.validateAll().then(result => {
          if(result) {
            this.axios.post('user',this.user)
              .then(res => {
                if (res.data.notify){
                  this.$vs.notify({
                    title:res.data.notify.title,
                    text:res.data.notify.message,
                    color:res.data.notify.type
                  })
                }
                if (res.data.status == 'success') {
                  this.$router.push('/users');
                }

              })
          }else{
            // form have errors
          }
        })
      },
      editUser(Id){
        this.disabled = true;
        this.loading = true;
        this.axios.get('user/'+Id)
          .then(res => {
            let d = res.data;
            this.action = 'Edit User';
            this.selectedRole = {id:d.role.id, label:d.role.display_name};
            this.selectedStatus = d.active == 1?'Active':'Inactive';
            this.user.user_id = d.id;
            this.user.name = d.name;
            this.user.email = d.email;
            this.user.phone = d.phone;
            this.loading = false;
          })
      },

    },
    mounted(){
      this.axios.get('roles')
        .then(res=>{
          this.roles = res.data;
        })
      if (this.$route.query.id) {
        this.editUser(this.$route.query.id);
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
