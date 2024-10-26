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
				<li class="breadcrumb-item active" aria-current="page">Grade</li>
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
					<h6>New Grade</h6>
				</div>
				<div class="card-body">
					<form action="">
						<div class="mb-3">
							<label for="grade_name" class="form-label">Grade Name</label>
							<input type="text" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Grade Name" v-model="grade.name">
							<div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
						</div>
					</form>
				</div>
				<div class="card-footer text-end">
					<div class="d-inline">
						<button class="btn btn-primary me-2" :class="{ 'd-none': mode.hideStore }" @click="storeGrade()">Submit</button>
						<button class="btn btn-primary me-2" :class="{ 'd-none': mode.hideEdit }" @click="updateGrade()">Update</button>
					</div>
					<button class="btn btn-danger text-light" @click="reset()">Discard</button>
				</div>
			</div>
		</div>
		<div class="col-sm-8">
			<div class="card">
				<div class="card-header">
					<h6>Grades</h6>
				</div>
				<div class="card-body">
					<table class="table table-bordered table-striped">
						<thead>
							<tr>
								<th>#</th>
								<th>Grade Name</th>
								<th class="text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(grade, index) in grades">
								<td>{{ index + 1 }}</td>
								<td>{{ grade.name }}</td>
								<td class="text-center">
									<button class="btn btn-warning text-light me-2" @click="editGrade(grade)">
										<span class="fa fa-edit"></span>
									</button>
									<button class="btn btn-danger text-light" @click="confirmDelete(grade.id)">
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
		<div id="deleteGrade" class="modal" ref="deleteModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Confirm Deletion</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>Are you sure you want to delete this grade?</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-danger" @click="deleteGrade(confirmDeleteId)">Delete</button>
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
import { Modal } from "bootstrap";

export default {
	components: {
		ToastComponent,
		LoadingComponent,
	},
	setup() {
		const mode = ref({
			hideStore: false,
			hideEdit: true
		});
		const grades = ref([

		]);
		const grade = ref({
			id: '',
			name: ''
		});
		const errors = ref({

		});
		const confirmDeleteId = ref(null);
		const notice_message = ref('');
		const notice_toast = ref(null);
		const deleteModal = ref(null);
		var deleteModalHandle = null;
		const loading_modal = ref(null);

		onMounted(() => {
			loadAllGrades();
			deleteModalHandle = new Modal(deleteModal.value);
		});

		const loadAllGrades = () => {
			grades.value = [];
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(BASE_URL+'admin/configure/grade', {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				}
			})
			.then(function(response) {
				grades.value = response.data;
			})
			.catch(function(error) {
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			});
		}

		const storeGrade = () => {
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			loading_modal.value.show();
			axios.post(BASE_URL+'admin/configure/grade', {
					name: grade.value.name
				}, {
					headers: {
						Authorization: 'Bearer ' + tapasyaAdminToken
					},
				})
				.then(function(response) {
					loadAllGrades();
					reset();
					notice_message.value = response.data.message;
					loading_modal.value.hide();
					notice_toast.value.show();
				})
				.catch(function(error) {
					loading_modal.value.hide();
					errors.value = error.response.data.errors;
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		}

		const editGrade = (gradeItem) => {
			grade.value.id = gradeItem.id;
			grade.value.name = gradeItem.name;
			mode.value.hideStore = true;
			mode.value.hideEdit = false;
		}

		const updateGrade = () => {
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			loading_modal.value.show();
			axios.post(BASE_URL+'admin/configure/grade/' + grade.value.id, {
					name: grade.value.name,
					_method: 'PUT',
				}, {
					headers: {
						Authorization: 'Bearer ' + tapasyaAdminToken
					},
				})
				.then(function(response) {
					loadAllGrades();
					reset();
					notice_message.value = response.data.message;
					loading_modal.value.hide();
					notice_toast.value.show();
				})
				.catch(error => {
					loading_modal.value.hide();
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				})
				.finally(() => {
					deleteModalHandle.hide();
					confirmDeleteId.value = null;
				});
		}

		const confirmDelete = (id) => {
			deleteModalHandle.show();
			confirmDeleteId.value = id;
		};

		const deleteGrade = (id) => {
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.delete(BASE_URL+'admin/configure/grade/' + id, {
					headers: {
						Authorization: 'Bearer ' + tapasyaAdminToken
					},
				})
				.then(function(response) {
					loadAllGrades();
					reset();
					notice_message.value = response.data.message;
					notice_toast.value.show();
				})
				.catch(function(error) {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				}).finally(() => {
					deleteModalHandle.hide();
					confirmDeleteId.value = null;
				});
		}

		const reset = () => {
			grade.value = {
				id: '',
				name: '',
			}
			errors.value = {};
			mode.value.hideStore = false;
			mode.value.hideEdit = true;
		}

		return {
			mode,
			grades,
			grade,
			errors,
			storeGrade,
			editGrade,
			updateGrade,
			reset,
			notice_message,
			notice_toast,
			deleteModal,
			confirmDelete,
			confirmDeleteId,
			deleteGrade,
			loading_modal,
		}
	}
}
</script>