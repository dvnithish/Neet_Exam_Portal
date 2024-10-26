<template>
	<!-- Breadcrumb Navigation -->
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a href="#">Home</a>
				</li>
				<li class="breadcrumb-item active" aria-current="page">User Management</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/user-management/create">
			<i class="fas fa-plus me-2"></i> Add User
		</router-link>
	</div>
	<div class="row">
		<!-- User List Table -->
		<div class="col-md-12">
			<div class="card h-100">
				<div class="card-header">
					<h6>Users</h6>
				</div>
				<div class="card-body">
					<table class="table table-bordered table-striped">
						<thead class="table-secondary">
							<tr>
								<th scope="col">#</th>
								<th scope="col">First Name</th>
								<th scope="col">Last Name</th>
								<th scope="col">Email</th>
								<th scope="col">Phone no</th>
								<th scope="col">Role</th>
								<th scope="col">Status</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(user, index) in users.data" :key="user.id">
								<th scope="row">{{ users.from + index }}</th>
								<td>{{ user.first_name }}</td>
								<td>{{ user.last_name }}</td>
								<td>{{ user.email }}</td>
								<td>{{ user.phone_no }}</td>
								<td>{{ user.role }}</td>
								<td>{{ user.status === 1 ? 'Active' : 'Inactive' }}</td>
								<td v-if="user.role == 'Super Admin'"></td>
								<td v-else>
									<router-link :to="{ name: 'UserManagementEdit', params: { id: user.id }}">
										<button type="button" class="btn btn-warning btn-sm me-2">
											<i class="fa fa-edit text-light"></i>
										</button>
									</router-link>
									<button type="button" class="btn btn-danger btn-sm" @click="confirmDelete(user.id)">
										<i class="fa fa-trash"></i>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
					<!-- Pagination Component -->
					<div class="d-flex justify-content-center">
						<Bootstrap5Pagination :data="users" :limit="limit" @pagination-change-page="fetchUsers" />
					</div>
				</div>
			</div>
		</div>
		<!-- Confirmation Dialog -->
		<div id="deleteUser" class="modal" ref="deleteModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Confirm Deletion</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>Are you sure you want to delete this master?</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-danger" @click="deleteUser(confirmDeleteId)">Delete</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Toast Component for Notifications -->
	<ToastComponent :message="notice_message" ref="notice_toast" />
</template>
  
<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';  
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import ToastComponent from '@/components/ToastComponent.vue';
import { Modal } from 'bootstrap';
import { BASE_URL } from '@/constants.js'
export default {
components: {
	Bootstrap5Pagination,
	ToastComponent,
},
setup() {
	const users = ref([]);
	const showDeleteConfirm = ref(false);
	const confirmDeleteId = ref(null);
	const router = useRouter();
	const notice_message = ref('');
	const notice_toast = ref(null);
	const deleteModal = ref(null);
	var deleteModalHandle = null;

	onMounted(() => {
		fetchUsers();
		deleteModalHandle = new Modal(deleteModal.value);
	});

	const fetchUsers = (page = 1) => {
		const token = localStorage.getItem('tapasya_admin_token');
		axios.get(BASE_URL+`admin/user-management?page=${page}`, {
				headers: {
					Authorization: `Bearer ${token}`
				},
			})
			.then(response => {
				users.value = response.data;
			})
			.catch(error => {
				console.error('Error fetching users:', error);
			});
	};

	const editUser = (user) => {
		router.push({
			name: 'UserEdit',
			params: {
				userData: JSON.stringify(user)
			}
		});
	};

	const confirmDelete = (id) => {
		confirmDeleteId.value = id;
		deleteModalHandle.show();
	};

	const deleteUser = (id) => {
		const token = localStorage.getItem('tapasya_admin_token');

		axios.delete(BASE_URL+`admin/user-management/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				},
			})
			.then(response => {
				fetchUsers();
				notice_message.value = response.data.message;
				notice_toast.value.show();
			})
			.catch((error) => {
				if (error.response.status == 403) {
					notice_message.value = error.response.data.message;
					notice_toast.value.show();
				} else if (error.response.status == 404) {
					notice_message.value = error.response.data.message;
					notice_toast.value.show();
				} else {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				}	
			})
			.finally(() => {
				deleteModalHandle.hide();
				confirmDeleteId.value = null;
			});
	};

	return {
		users,
		showDeleteConfirm,
		confirmDeleteId,
		fetchUsers,
		editUser,
		confirmDelete,
		deleteUser,
		notice_message,
		notice_toast,
		deleteModal,
		limit: 10,
	};
},
};
</script>  
  
<style scoped>
  .error-message {
    color: red;
    font-size: 0.875rem;
  }

  .table-header {
    background-color: #f8f9fa;
    text-align: center;
  }

</style> 
  