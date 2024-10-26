<template>
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a href="#">Home</a>
				</li>
				<li class="breadcrumb-item">
					<router-link to="/user-management">User Management</router-link>
				</li>
				<li class="breadcrumb-item active" aria-current="page">Edit User</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/user-management">
			<i class="fas fa-book me-2"></i> User Management
		</router-link>
	</div>
	<div class="card">
		<div class="card-header">
			<h6>Edit User</h6>
		</div>
		<div class="card-body">
			<div class="row mb-3">
				<!-- First Name -->
				<div class="col-sm-6 mb-3">
					<label for="firstNameInput" class="form-label">First Name</label>
					<input id="firstNameInput" type="text" v-model="firstName" class="form-control" :class="{'is-invalid': errors.first_name}" placeholder="Enter First Name" aria-label="First Name" />
					<p v-if="errors.first_name" class="error-message">{{ errors.first_name[0] }}</p>
				</div>
				<!-- Last Name -->
				<div class="col-sm-6 mb-3">
					<label for="lastNameInput" class="form-label">Last Name</label>
					<input id="lastNameInput" type="text" v-model="lastName" class="form-control" :class="{'is-invalid': errors.last_name}" placeholder="Enter Last Name" aria-label="Last Name" />
					<p v-if="errors.last_name" class="error-message">{{ errors.last_name[0] }}</p>
				</div>
				<!-- Email -->
				<div class="col-sm-6 mb-3">
					<label for="emailInput" class="form-label">Email</label>
					<input id="emailInput" type="email" v-model="email" class="form-control" :class="{'is-invalid': errors.email}" placeholder="Enter Email" aria-label="Email" />
					<p v-if="errors.email" class="error-message">{{ errors.email[0] }}</p>
				</div>
				<!-- Password -->
				<div class="col-sm-6 mb-3">
					<label for="passwordInput" class="form-label">Password</label>
					<input id="passwordInput" type="password" v-model="password" class="form-control":class="{'is-invalid': errors.password}" placeholder="Enter Password" aria-label="Password" />
					<p v-if="errors.password" class="error-message">{{ errors.password[0] }}</p>
				</div>
				<!-- Phone Number -->
				<div class="col-sm-6 mb-3">
					<label for="phoneInput" class="form-label">Phone No</label>
					<input id="phoneInput" type="text" v-model="phone" class="form-control" :class="{'is-invalid': errors.phone_no}"placeholder="Enter Phone Number" aria-label="Phone Number" />
					<p v-if="errors.phone_no" class="error-message">{{ errors.phone_no[0] }}</p>
				</div>
				<!-- Role -->
				<div class="col-sm-6 mb-3">
					<label for="roleSelect" class="form-label">Role</label>
					<select id="roleSelect" class="form-select" :class="{'is-invalid': errors.role}" v-model="role" aria-label="Select Role">
						<option value="">Select Role</option>
						<option v-for="role in roles" :key="role.id" :value="role.master_value">
							{{ role.master_value }}
						</option>
					</select>
					<p v-if="errors.role" class="error-message">{{ errors.role[0] }}</p>
				</div>
				<!-- Status -->
				<div class="col-sm-6 mb-3">
					<label for="statusSelect" class="form-label">Status</label>
					<select id="statusSelect" class="form-select" :class="{'is-invalid': errors.status}" v-model="status" aria-label="Select Status">
						<option value="">Select Status</option>
						<option value="1">Active</option>
						<option value="0">Inactive</option>
					</select>
					<p v-if="errors.status" class="error-message">{{ errors.status[0] }}</p>
				</div>
				<!-- Form Actions -->
			</div>
		</div>
		<div class="card-footer text-center">
			<button class="btn btn-primary me-2" @click="submitUser">Update</button>
			<button class="btn btn-danger text-light" @click="resetForm">Discard</button>
	   </div>
	</div>
	<!-- Toast Component for Notifications -->
	<ToastComponent :message="notice_message" ref="notice_toast" />
	<LoadingComponent ref="loading_modal" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import ToastComponent from '@/components/ToastComponent.vue';
import LoadingComponent from '../../components/LoadingComponent.vue';
import { BASE_URL } from '@/constants.js'

 export default {
	components: {
		ToastComponent,
		LoadingComponent,
	},
	setup() {
		const route = useRoute();
		const router = useRouter();
		const createErrorMessage = ref('');
		const errors = ref({});
		const firstName = ref('');
		const lastName = ref('');
		const email = ref('');
		const phone = ref('');
		const role = ref('');
		const status = ref('1'); // Default status to "Active"
		const password = ref('');
		const roles = ref([]);
		const notice_message = ref('');
		const notice_toast = ref(null);
		const loading_modal = ref(null);

		onMounted(() => {
			fetchRoles(); // Load user data on component mount
		});

		const fetchUserData = () => {
			const userId = route.params.id;
			const token = localStorage.getItem('tapasya_admin_token');
			axios.get(BASE_URL+`admin/user-management/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`
					},
				})
				.then((response) => {
					const userData = response.data[0];
					firstName.value = userData.first_name;
					lastName.value = userData.last_name;
					email.value = userData.email;
					phone.value = userData.phone_no;
					role.value = userData.role;
					status.value = userData.status;
				})
				.catch((error) => {
					notice_message.value = error.response.data.message;
					notice_toast.value.show();
				})

		};

		// Function to fetch roles from API
		const fetchRoles = () => {
			const token = localStorage.getItem('tapasya_admin_token'); // Fetch token from localStorage
			axios.get(BASE_URL+'admin/configure/master/custom/get-all-roles', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					roles.value = response.data; // Assign response data to roles
					fetchUserData();
				})
				.catch((error) => {
					console.error('Error fetching roles:', error.response ? error.response.data : error.message);
					createErrorMessage.value = 'Failed to fetch roles';
				});
		};

		const submitUser = () => {
			const userId = route.params.id;
			const token = localStorage.getItem('tapasya_admin_token');
			const payload = {
				first_name: firstName.value,
				last_name: lastName.value,
				email: email.value,
				phone_no: phone.value,
				role: role.value,
				status: status.value,
				password: password.value,
			};
			loading_modal.value.show();
			axios.put(BASE_URL+`admin/user-management/${userId}`, payload, {
					headers: {
						Authorization: `Bearer ${token}`
					},
				})
				.then((response) => {
					notice_message.value = response.data.message;	
					notice_toast.value.show();				
					router.push('/user-management');
				})
				.catch((error) => {
					if (error.response.status == 422) {
						errors.value = error.response.data.errors;
					} else if (error.response.status == 404) {
						notice_message.value = error.response.data.message;
						notice_toast.value.show();
					} else if (error.response.status == 403) {
						notice_message.value = error.response.data.message;
						notice_toast.value.show();
					} else {
						notice_message.value = 'Something went wrong';
						notice_toast.value.show();
					}
				})
				.finally(() => {
					loading_modal.value.hide();
				});
		};

		const resetForm = () => {
			createErrorMessage.value = '';
            errors.value = {};
			fetchUserData(); // Reset the form to the original fetched values
			router.push('/user-management');
		};

		return {
			createErrorMessage,
			errors,
			firstName,
			lastName,
			email,
			phone,
			role,
			status,
			password,
			submitUser,
			resetForm,
			roles,
			notice_message,
			notice_toast,
			loading_modal,
		};
	},
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.875rem;
}
</style>

