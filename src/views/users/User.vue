<template>
  <vx-card title="All Users">
    <vs-table  pagination :max-items="maxItem" search :data="users">
      <template slot="thead">
        <vs-th sort-key="name">Name</vs-th>
        <vs-th sort-key="email">Email</vs-th>
        <vs-th sort-key="role.display_name">Role</vs-th>
        <vs-th sort-key="status">Status</vs-th>
        <vs-th sort-key="created_by">Created by</vs-th>
        <vs-th >Action</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

          <vs-td :data="data[indextr].name">
            {{data[indextr].name}}
          </vs-td>

          <vs-td :data="data[indextr].email">
            {{data[indextr].email}}
          </vs-td>

          <vs-td :data="data[indextr].role.display_name">
            {{data[indextr].role.display_name}}
          </vs-td>
          <vs-td :data="data[indextr].active">
            {{data[indextr].active == 1? 'Active':'Inactive'}}
          </vs-td>
          <vs-td :data="data[indextr].created_by.name">
            {{data[indextr].created_by.name}}
          </vs-td>
          <vs-td :data="data[indextr].id">
            <vs-dropdown color="success" style="cursor: pointer" vs-trigger-click>
              <vs-button class="btn-drop" type="filled" icon="more_horiz"></vs-button>
              <vs-dropdown-menu >
                <vs-dropdown-item v-if="$auth.check(['user_edit'])"><router-link :to="'user/edit?id='+data[indextr].id">Edit</router-link></vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-td>

        </vs-tr>
      </template>
    </vs-table>
    <router-link to="user/add"><vs-button  class="floating-btn" color="success" type="gradient" icon-pack="feather" icon="icon-plus"></vs-button></router-link>
  </vx-card>
</template>
<script>
  export default {
    data(){
      return {
        maxItem: localStorage.getItem('maxItem')? localStorage.getItem('maxItem'): 10,
        users:[],
      }
    },
    methods:{
      update(){
        this.axios.get('users')
          .then(res => {
            this.users = res.data;
          })
      }
    },
    mounted(){
      this.update();
    }
  }
</script>
