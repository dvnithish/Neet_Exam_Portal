<template>
    <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/">Home</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Profile</li>
            </ol>
        </nav>
    </div>
    <div class="card">
        <div class="card-header">
            <h6>Profile</h6>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-sm-6 mb-3">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" :class="{'is-invalid': errors.first_name}" placeholder="First Name" v-model="profile.first_name">
                    <div v-if="errors.first_name" class="invalid-feedback">{{ errors.first_name[0] }}</div>
                </div>
                <div class="col-sm-6 mb-3">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" :class="{'is-invalid': errors.last_name}" placeholder="Last Name" v-model="profile.last_name">
                    <div v-if="errors.last_name" class="invalid-feedback">{{ errors.last_name[0] }}</div>
                </div>
                <div class="col-sm-6 mb-3">
                    <label class="form-label">Password</label> <small>(optional)</small>
                    <input type="password" class="form-control" :class="{'is-invalid': errors.password}" placeholder="Password" v-model="profile.password">
                    <div v-if="errors.password" class="invalid-feedback">{{ errors.password[0] }}</div>
                </div>
            </div>
        </div>
        <div class="card-footer text-center">
            <button class="btn btn-primary" @click="update()">Update</button>
        </div>
    </div>
    <ToastComponent :message="notice_message" ref="notice_toast" />
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '@/constants.js'
import { ref, onMounted } from 'vue';
import ToastComponent from '@/components/ToastComponent.vue';
export default {
    components: {
        ToastComponent,
    },
    setup() {
        const profile = ref({
            first_name: '',
            last_name: '',
            password: '',
        });
        const errors = ref({});
        const notice_message = ref('');
		const notice_toast = ref(null);

        onMounted(() => {
            loadProfile();
        });

        const loadProfile = () => {
            var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
            axios.get(BASE_URL+`admin/profile/${tapasyaAdminToken}`, {
                headers: {
                    Authorization: 'Bearer ' + tapasyaAdminToken
                }
            })
            .then((response) => {
                profile.value.first_name = response.data.profile.first_name;
                profile.value.last_name = response.data.profile.last_name;
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    notice_message.value = error.response.data.message;
                    notice_toast.value.show();
                } else {
                    notice_message.value = 'Something went wrong';
                    notice_toast.value.show();
                }
            })
        }

        const update = () => {
            errors.value = {};
            var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
            axios.post(BASE_URL+`admin/profile/${tapasyaAdminToken}`, {
                _method: 'PUT',
                first_name: profile.value.first_name,
                last_name: profile.value.last_name,
                password: profile.value.password,
            },{
                headers: {
                    Authorization: 'Bearer ' + tapasyaAdminToken
                }
            })
            .then((response) => {
                notice_message.value = response.data.message;
                notice_toast.value.show();
            })
            .catch((error) => {
                if(error.response.status == 422) {
                    errors.value = error.response.data.errors;
                } else if(error.response.status == 403) {
                    notice_message.value = error.response.data.message;
                    notice_toast.value.show();
                } else {
                    notice_message.value = 'Something went wrong';
                    notice_toast.value.show();
                }
            })
        }

        return {
            profile,
            errors,
            update,
            notice_message,
            notice_toast,
        }
    }
}
</script>

<style>

</style>