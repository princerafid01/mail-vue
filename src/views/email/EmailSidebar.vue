<!-- =========================================================================================
    File Name: EmailSidebar.vue
    Description: Email Application Sidebar(Filter) (Inbox)
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="email__email-sidebar h-full">
        <div class="m-6 clearfix">
            <vs-button size="large" class="bg-primary-gradient w-full" icon-pack="feather" icon="icon-edit" @click="show_form">Compose</vs-button>
        </div>

        <!-- compose email -->
      <vs-popup
            class="email-compose"
            title="New Message"
            accept-text= "Send"
            @cancel="clearFields"
            @accept="sendMail"
            @close="clearFields"
            :is-valid="validateForm"
            :active.sync="activePrompt">
                <VuePerfectScrollbar class="scroll-area p-4" :settings="settings">
                    <form @submit.prevent="sendMail">
                        <vs-input v-validate="'required|email'" name="mailTo" label-placeholder="To" v-model="mailTo" class="w-full mb-6" :danger="!validateForm && mailTo != ''" val-icon-danger="clear" :success="validateForm" val-icon-success="done" :color="validateForm ? 'success' : 'danger'" />
                        <vs-input name="mailSubject" label-placeholder="Subject" v-model="mailSubject" class="w-full mb-6" />
                        <vs-input name="mailCC" label-placeholder="CC" v-model="mailCC" class="w-full mb-6" />
                        <vs-input name="mailBCC" label-placeholder="BCC" v-model="mailBCC" class="w-full mb-6" />
                        <quill-editor v-model="mailMessage" :options="editorOption"></quill-editor>
                        <vs-upload action="/sendMail" :data="{image_files}" fileName="image_files"  multiple text="Attachments" :show-upload-button="false" />
                        <vs-button size="large" class="bg-primary-gradient w-full" icon-pack="feather" icon="icon-send">Send</vs-button>
                    </form>
                </VuePerfectScrollbar>
      </vs-popup>

      <VuePerfectScrollbar class="email-scroll-area" :settings="settings">
            <div class="px-6 pb-2 flex flex-col">

                <!-- inbox -->
                <div class="flex justify-between items-center cursor-pointer" :class="{'text-primary': mailFilter == 'inbox'}" @click="updateFilter('inbox')">
                    <div class="flex items-center mb-2">
                        <feather-icon icon="MailIcon" :svgClasses="[{'text-primary stroke-current': mailFilter == 'inbox'}, 'h-6 w-6']"></feather-icon>
                        <span class="text-lg ml-3">Inbox</span>
                    </div>
                    <vs-chip class="number" color="primary" v-if="unreadMails('inboxed') > 0">{{ unreadMails('inboxed') }}</vs-chip>
                </div>

                <!-- sent -->
                <div class="flex items-center mt-4 mb-2 cursor-pointer" :class="{'text-primary': mailFilter == 'sent'}" @click="updateFilter('sent')">
                    <feather-icon icon="SendIcon" :svgClasses="[{'text-primary stroke-current': mailFilter == 'sent'}, 'h-6 w-6']"></feather-icon>
                    <span class="text-lg ml-3">Sent</span>
                </div>

                <!-- draft -->
                <div class="flex justify-between items-center mt-4 cursor-pointer" :class="{'text-primary': mailFilter == 'draft'}" @click="updateFilter('draft')">
                    <div class="flex items-center mb-2">
                        <feather-icon icon="Edit2Icon" :svgClasses="[{'text-primary stroke-current': mailFilter == 'draft'}, 'h-6 w-6']"></feather-icon>
                        <span class="text-lg ml-3">Draft</span>
                    </div>
                    <vs-chip class="number" color="warning" v-if="draftMails > 0">{{ draftMails }}</vs-chip>
                </div>

                <!-- starred -->
                <div class="flex items-center mt-4 mb-2 cursor-pointer" :class="{'text-primary': mailFilter == 'starred'}" @click="updateFilter('starred')">
                    <feather-icon icon="StarIcon" :svgClasses="[{'text-primary stroke-current': mailFilter == 'starred'}, 'h-6 w-6']"></feather-icon>
                    <span class="text-lg ml-3">Starred</span>
                </div>

                <!-- spam -->
                <div class="flex items-center justify-between items-center mt-4 cursor-pointer" :class="{'text-primary': mailFilter == 'spam'}" @click="updateFilter('spam')">
                    <div class="flex items-center mb-2">
                        <feather-icon icon="InfoIcon" :svgClasses="[{'text-primary stroke-current': mailFilter == 'spam'}, 'h-6 w-6']"></feather-icon>
                        <span class="text-lg ml-3">Spam</span>
                    </div>
                    <vs-chip class="number" color="danger" v-if="unreadMails('spam') > 0">{{ unreadMails('spam') }}</vs-chip>
                </div>

                <!-- trash -->
                <div class="flex items-center mt-4 mb-2 cursor-pointer" :class="{'text-primary': mailFilter == 'trash'}" @click="updateFilter('trash')">
                    <feather-icon icon="TrashIcon" :svgClasses="[{'text-primary stroke-current': mailFilter == 'trash'}, 'h-6 w-6']"></feather-icon>
                    <span class="text-lg ml-3">Trash</span>
                </div>
            </div>
            <vs-divider></vs-divider>
            <div class="email__labels px-6 py-4">
                <h5 class="mb-8">Labels</h5>
                <div class="email__lables-list">
                    <div class="email__label flex items-center mb-4 cursor-pointer" v-for="(tag, index) in emailTags" :key="index" @click="updateFilter(tag.value)">
                        <div class="ml-1 h-3 w-3 rounded-full mr-4" :class="'border-2 border-solid border-' + tag.color"></div>
                        <span class="text-lg" :class="{'text-primary': mailFilter == tag.value}">{{ tag.text }}</span>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default{
    props: {
        emailTags: {
            type: Array,
            required: true,
        },
        mailFilter: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            activePrompt: false,
            mailTo: '',
            mailSubject: '',
            mailCC: '',
            mailBCC: '',
            mailMessage: '',
            sendButton:false,
            editorOption: {
                modules: {
                    toolbar: [['bold', 'italic', 'underline', 'strike', 'link', 'blockquote', 'code-block'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'font': [] }],],
                },
                placeholder: 'Message'
            },
            settings: {
                maxScrollbarLength: 60,
                wheelSpeed: 0.30,
            },
        }
    },
    computed: {
        validateForm() {
            this.sendButton =true;
            return !this.errors.any() && this.mailTo != '';
        },
        unreadMails() {
            return (mailType) => this.$store.getters['email/unreadMails'](mailType);
        },
        draftMails() {
            return this.$store.getters['email/NumdraftMails'];
        },
    },
    methods: {
      show_form(){
        this.activePrompt = true;
      },
        updateFilter(filterName) {
            this.$store.dispatch('email/updateMailFilter', filterName);
            this.$emit('closeSidebar', false);
        },
        // compose mail methods
        clearFields() {
            this.mailTo = '';
            this.mailSubject = '';
            this.mailCC = '';
            this.mailBCC = '';
            this.mailMessage = '';
        },
        sendMail() {
            console.log(image_files);
            if(!this.errors.any() && this.mailTo != ''){

                let mail = {
                    mailTo : this.mailTo,
                    mailSubject : this.mailSubject,
                    mailCc : this.mailCC,
                    mailBcc : this.mailBCC,
                    mailMessage : this.mailMessage,
                } 
                this.axios.post('/sendMail',mail)
                .then(({data}) => {
                    console.log(data);
                })
            }

        },
    },
    components: {
        quillEditor,
        VuePerfectScrollbar
    }
}
</script>
