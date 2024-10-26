<template>
	<div class="row">
		<!-- Breadcrumb Navigation -->
		<div class="d-flex justify-content-between mb-3">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Home</a>
					</li>
					<li class="breadcrumb-item">
						<router-link to="/configuration">Configurations</router-link>
					</li>
					<li class="breadcrumb-item active" aria-current="page">Master</li>
				</ol>
			</nav>
			<router-link class="btn btn-primary" to="/configuration">
				<i class="fas fa-book me-2"></i> Configurations
			</router-link>
		</div>
		<div class="row">
			<!-- Form for Chapter Management -->
			<div class="col-sm-4">
				<div class="card">
					<div class="card-header">
						<h6>{{ isEditing ? 'Edit' : 'New' }} Master</h6>
					</div>
					<div class="card-body">
						<form @submit.prevent="submitMaster">
							<div class="mb-3">
								<label for="masterSelect" class="form-label">Select Master</label>
								<select id="masterSelect" class="form-select" :class="{'is-invalid': errors.master_name}"  v-model="selectedMaster"  @change="onMasterChange" aria-label="Select Master">
									<option value="">Select Master Name</option>
									<option value="Difficulty Level">Difficulty Level</option>
									<option value="User Role">User Role</option>
								</select>
								<p v-if="errors.master_name" class="invalid-feedback">{{ errors.master_name[0] }}</p>
							</div>
							<div class="mb-3">
								<label for="masterValueInput" class="form-label">Master Value</label>
								<input id="masterValueInput" type="text" v-model="masterValue" :class="{'is-invalid': errors.master_value}" class="form-control" placeholder="Enter Master Value" aria-label="Master Value" />
								<p v-if="errors.master_value" class="invalid-feedback">{{ errors.master_value[0] }}</p>
							</div>
						</form>
					</div>
					<div class="card-footer text-end">
						<button class="btn btn-primary me-2" @click="submitMaster">
							{{ isEditing ? 'Update' : 'Submit' }}
						</button>
						<button class="btn btn-danger text-light" @click="resetForm">Discard</button>
					</div>
				</div>
			</div>
			<!-- Master List Table -->
			<div class="col-sm-8">
				<div class="card">
					<div class="card-header">
						<h6>Master</h6>
					</div>
					<div class="card-body">
						<div class="table-responsive">
							<table class="table table-bordered table-striped">
								<thead class="table-header">
									<tr>
										<th>#</th>
										<th>Master Name</th>
										<th>Master Value</th>
										<th class="text-center">Action</th>
									</tr>
								</thead>
								<tbody>																	
									<tr v-for="(master, index) in masters.data" :key="master.id">
										<td>{{ masters.from + index }}</td>
										<td>{{ master.master_name }}</td>
										<td>{{ master.master_value }}</td>
										<td class="text-center">
											<button type="button" class="btn btn-warning me-2" @click="editMaster(master)">
												<i class="fa fa-edit text-light"></i>
											</button>
											<button type="button" class="btn btn-danger" @click="confirmDelete(master.id)">
												<i class="fa fa-trash"></i>
											</button>
										</td>
									</tr>
								</tbody>
							</table>
							<!-- Pagination Component -->
							<div class="d-flex justify-content-center">
								<Bootstrap5Pagination :data="masters" @pagination-change-page="fetchMasters" :limit="limit" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Confirmation Dialog -->
		<div id="deleteMaster" class="modal"  ref="deleteModal">
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
						<button type="button" class="btn btn-danger" @click="deleteMaster(confirmDeleteId)">Delete</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<LoadingComponent ref="loading_modal" />
	<ToastComponent :message="notice_message" ref="notice_toast" />
</template>

<script>
import axios from 'axios';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ToastComponent from '@/components/ToastComponent.vue';
import { ref, onMounted } from 'vue';
import { BASE_URL } from '@/constants.js'
import { Modal } from "bootstrap";
import { Bootstrap5Pagination } from 'laravel-vue-pagination';

export default {
	components: {
		LoadingComponent,
		Bootstrap5Pagination,
		ToastComponent,
	},
  	setup() {
  		const masters = ref([]);
  		const selectedMaster = ref('');
  		const masterValue = ref('');
  		const errors = ref({});
  		const confirmDeleteId = ref(null);
  		const isEditing = ref(false);
  		const currentMasterId = ref(null);
		const deleteModal = ref(null);
		const loading_modal = ref(null);
		const notice_message = ref('');
		const notice_toast = ref(null);
		var deleteModalHandle = null;

        onMounted(() => {
			fetchMasters();
            deleteModalHandle = new Modal(deleteModal.value);
        });

  		const fetchMasters = (page = 1) => {
			const token = localStorage.getItem('tapasya_admin_token');
  			axios.get(BASE_URL + `admin/configure/master?page=${page}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(response => {
				masters.value = response.data;
			})
			.catch(error => {
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			});
  		};

  		const submitMaster = () => {
  			clearErrorMessages();

  			const masterData = {
  				master_name: selectedMaster.value,
  				master_value: masterValue.value,
  			};
			loading_modal.value.show();

			const token = localStorage.getItem('tapasya_admin_token');
  			const request = isEditing.value ?
  				axios.put(BASE_URL + `admin/configure/master/${currentMasterId.value}`, masterData, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}) :
  				axios.post(BASE_URL + 'admin/configure/master', masterData, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

  			request
  				.then((response) => {
  					fetchMasters();
  					resetForm();
					notice_message.value = response.data.message;
					notice_toast.value.show();
  				})
  				.catch(error => {
  					if (error.response.data && error.response.data.errors) {
  						errors.value = error.response.data.errors;
  					}
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
  				})
				.finally(() => {
					loading_modal.value.hide();
				})
  		};

  		const clearErrorMessages = () => {
  			errors.value = {};
  		};

  		const resetForm = () => {
  			selectedMaster.value = '';
  			masterValue.value = '';
  			isEditing.value = false;
  			currentMasterId.value = null;
  		};

  		const editMaster = (master) => {
  			isEditing.value = true;
  			currentMasterId.value = master.id;
  			selectedMaster.value = master.master_name;
  			masterValue.value = master.master_value;
  		};

  		const confirmDelete = (masterId) => {
            deleteModalHandle.show();
  			confirmDeleteId.value = masterId;
  		};

  		const deleteMaster = (masterId) => {
			const token = localStorage.getItem('tapasya_admin_token');
  			axios.delete(BASE_URL + `admin/configure/master/${masterId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {                    
				fetchMasters();
				notice_message.value = response.data.message;
				notice_toast.value.show();
			})
			.catch(error => {
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			})
			.finally(()=> {
				deleteModalHandle.hide();
				confirmDeleteId.value = null;
			});
  		};

  		return {            
  			masters,
			fetchMasters,
  			selectedMaster,
  			masterValue,
  			errors,  			
  			isEditing,
  			submitMaster,
  			resetForm,
  			editMaster,
			deleteModal,
  			confirmDelete,  			
			confirmDeleteId,
			deleteMaster,
			loading_modal,
			notice_toast,
			notice_message,
			limit:5,
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
}
</style>