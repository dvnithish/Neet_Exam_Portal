<template>
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a href="#">Home</a>
				</li>
				<li class="breadcrumb-item">
					<router-link to="/configuration">Configurations</router-link>
				</li>
				<li class="breadcrumb-item active" aria-current="page">Subject</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/configuration">
			<i class="fas fa-book me-2"></i> Configurations
		</router-link>
	</div>
	<div class="row">
		<div class="col-sm-4">
			<div class="card">
				<div class="card-header">
					<h6>{{ isEditing ? 'Edit' : 'New' }} Subject</h6>
				</div>
				<div class="card-body">
					<form @submit.prevent="isEditing ? updateSubject() : storeSubject()">
						<div class="mb-3">
							<label for="subject_name" class="form-label">Subject</label>
							<input type="text" id="subject_name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Subject Name" v-model="subject.name" />
							<div v-if="errors.name" class="invalid-feedback">
								{{ errors.name[0] }}
							</div>
						</div>
					</form>
				</div>
				<div class="card-footer text-end">
					<button class="btn btn-primary me-2" @click="isEditing ? updateSubject() : storeSubject()">
						{{ isEditing ? 'Update' : 'Submit' }}
					</button>
					<button class="btn btn-danger text-light" @click="resetForm()">Discard</button>
				</div>
			</div>
		</div>
		<div class="col-sm-8">
			<div class="card">
				<div class="card-header">
					<h6>Subjects</h6>
				</div>
				<div class="card-body">
					<table class="table table-bordered table-striped">
						<thead>
							<tr>
								<th>#</th>
								<th>Subject Name</th>
								<th class="text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(subjectItem, index) in subjects" :key="subjectItem.id">
								<td>{{ index + 1 }}</td>
								<td>{{ subjectItem.name }}</td>
								<td class="text-center">
									<button class="btn btn-warning text-light me-2" @click="editSubject(subjectItem)">
										<span class="fa fa-edit"></span>
									</button>
									<button class="btn btn-danger text-light" @click="confirmDelete(subjectItem.id)">
										<span class="fa fa-trash"></span>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<!-- Confirmation Dialog -->
		<div id="deleteSubject" class="modal" ref="deleteModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Confirm Deletion</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>Are you sure you want to delete this subject?</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-danger" @click="deleteSubject(confirmDeleteId)">Delete</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ToastComponent :message="notice_message" ref="notice_toast" />
	<LoadingComponent ref="loading_modal" />
</template>

<script>
import axios from 'axios';
import ToastComponent from '@/components/ToastComponent.vue';
import LoadingComponent from '../../../components/LoadingComponent.vue';
import { ref, onMounted } from 'vue';
import { BASE_URL } from '@/constants.js'
import { Modal } from 'bootstrap';

export default {
	components: {
		ToastComponent,
		LoadingComponent,
	},
	setup() {
		const isEditing = ref(false); // Track if in editing mode
		const subjects = ref([]);
		const subject = ref({
			id: '',
			name: '',
		});
		const confirmDeleteId = ref(null);
		const errors = ref({});
		const notice_message = ref('');
		const notice_toast = ref(null);
		const deleteModal = ref(null);
		var deleteModalHandle = null;
		const loading_modal = ref(null);

		// Load all subjects on component mount
		onMounted(() => {
			loadAllSubjects();
			deleteModalHandle = new Modal(deleteModal.value);
		});

		// Load all subjects from the API
		const loadAllSubjects = () => {
			const token = localStorage.getItem('tapasya_admin_token');
			axios.get(BASE_URL+'admin/configure/subject', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(response => {
				subjects.value = response.data;
			})
			.catch(() => {
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			});
		};

		// Store a new subject
		const storeSubject = () => {
			loading_modal.value.show();
			const token = localStorage.getItem('tapasya_admin_token');
			axios.post(BASE_URL+'admin/configure/subject', {
				name: subject.value.name
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				loadAllSubjects();
				resetForm();
				loading_modal.value.hide();
				notice_message.value = response.data.message;
				notice_toast.value.show();
			})
			.catch(error => {
				loading_modal.value.hide();
				errors.value = error.response.data.errors;
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			});
		};

		// Edit an existing subject
		const editSubject = (subjectItem) => {
			subject.value.id = subjectItem.id;
			subject.value.name = subjectItem.name;
			isEditing.value = true;
		};

		// Update an existing subject
		const updateSubject = () => {
			loading_modal.value.show();
			const token = localStorage.getItem('tapasya_admin_token');
			axios.put(BASE_URL+`admin/configure/subject/${subject.value.id}`, {
				name: subject.value.name
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(() => {
				loadAllSubjects();
				resetForm();
				notice_message.value = 'Subject was updated';
				loading_modal.value.hide();
				notice_toast.value.show();
			})
			.catch(error => {
				loading_modal.value.hide();
				console.error('Error deleting master:', error);
			})
			.finally(() => {
				deleteModalHandle.hide();
				confirmDeleteId.value = null;
			});
		};

		// show confirm delete modal
		const confirmDelete = (id) => {
			deleteModalHandle.show();
			confirmDeleteId.value = id;
		};

		// Delete a subject
		const deleteSubject = (id) => {
			const token = localStorage.getItem('tapasya_admin_token');
			axios.delete(BASE_URL+`admin/configure/subject/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				loadAllSubjects();
				resetForm();
				notice_message.value = response.data.message;
				notice_toast.value.show();
			})
			.catch(() => {
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			})
			.finally(() => {
				deleteModalHandle.hide();
				confirmDeleteId.value = null;
			});
		};

		// Reset the form and clear any errors
		const resetForm = () => {
			subject.value = {
				id: '',
				name: '',
			};
			errors.value = {};
			isEditing.value = false;
		};

		return {
			isEditing,
			subjects,
			subject,
			errors,
			storeSubject,
			editSubject,
			updateSubject,
			resetForm,
			notice_message,
			notice_toast,
			confirmDeleteId,
			deleteModal,
			confirmDelete,
			confirmDeleteId,
			deleteSubject,
			loading_modal,

		};
	},
};
</script>
