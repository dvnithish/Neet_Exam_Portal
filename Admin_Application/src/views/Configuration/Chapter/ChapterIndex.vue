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
					<li class="breadcrumb-item active" aria-current="page">Chapter</li>
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
						<h6>{{ isEditing ? 'Edit' : 'New' }} Chapter</h6>
					</div>
					<div class="card-body">
						<form @submit.prevent="submitChapter">
							<div class="mb-3">
								<label for="gradeSelect" class="form-label">Grade</label>
								<select id="gradeSelect" class="form-select" :class="{'is-invalid': errors.grade_id}" v-model="selectedGrade" aria-label="Select Grade">
									<option value="">Select Grade</option>
									<option v-for="grade in grades" :key="grade.id" :value="grade.id">{{ grade.name }}</option>
								</select>
								<!-- Error message for grade -->
								<p v-if="errors.grade_id" class="invalid-feedback">{{ errors.grade_id[0] }}</p>
							</div>
							<div class="mb-3">
								<label for="subjectSelect" class="form-label">Subject</label>
								<select id="subjectSelect" class="form-select" :class="{'is-invalid': errors.subject_id}" v-model="selectedSubject" aria-label="Select Subject">
									<option value="">Select Subject</option>
									<option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
								</select>
								<!-- Error message for subject -->
								<p v-if="errors.subject_id" class="invalid-feedback">{{ errors.subject_id[0] }}</p>
							</div>
							<!-- Chapter Name -->
							<div class="mb-3">
								<label for="chapterNameInput" class="form-label">Chapter Name</label>
								<input id="chapterNameInput" type="text" v-model="chapterValue" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Enter Chapter Name" aria-label="Chapter Name" />
								<!-- Error message for chapter_name -->
								<p v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</p>
							</div>
						</form>
					</div>
					<div class="card-footer text-end">
						<button class="btn btn-primary me-2" @click="submitChapter">
							{{ isEditing ? 'Update' : 'Submit' }}
						</button>
						<button class="btn btn-danger text-light" @click="resetForm">Discard</button>
					</div>
				</div>
			</div>
			<!-- Chapter List Table -->
			<div class="col-sm-8">
				<div class="card">
					<div class="card-header">
						<h6>Chapters</h6>
					</div>
					<div class="card-body">
						<div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
							<table class="table table-bordered table-striped">
								<thead class="table-header">
									<tr>
										<th scope="col">Sl.no</th>
										<th scope="col">Grade</th>
										<th scope="col">Subject</th>
										<th scope="col">Chapter</th>
										<th scope="col">Action</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(chapter, index) in chapters.data" :key="chapter.id">
										<th scope="row">{{ chapters.from + index }}</th>
										<td>{{ chapter.grade.name }}</td>
										<td>{{ chapter.subject.name }}</td>
										<td>{{ chapter.name }}</td>
										<td class="d-flex" >
											<button type="button" class="btn btn-info me-2" @click="editChapter(chapter)">
												<i class="fa fa-edit"></i>
											</button>
											<button type="button" class="btn btn-danger" @click="confirmDelete(chapter.id)">
												<i class="fa fa-trash"></i>
											</button>
										</td>
									</tr>
								</tbody>
							</table>
							<!-- Pagination Component -->
							<div class="d-flex justify-content-center">
								<Bootstrap5Pagination :data="chapters" @pagination-change-page="fetchChapters" :limit="limit" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Confirmation Dialog -->
		<div id="deleteChapter" class="modal" ref="deleteModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Confirm Deletion</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>Are you sure you want to delete this Chapter?</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-danger" @click="deleteChapter(confirmDeleteId)">Delete</button>
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
import LoadingComponent from '../../../components/LoadingComponent.vue';
import ToastComponent from '@/components/ToastComponent.vue';
import { BASE_URL } from '@/constants.js'
import { ref, onMounted } from 'vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { Modal } from "bootstrap";

export default {
	components: {
		Bootstrap5Pagination,
		LoadingComponent,
		ToastComponent,
	},
	setup() {
		const grades = ref([]);
		const subjects = ref([]);
		const chapters = ref({});
		const selectedGrade = ref('');
		const selectedSubject = ref('');
		const chapterValue = ref('');
		const errors = ref({});
		const showDeleteConfirm = ref(false);
		const confirmDeleteId = ref(null);
		const isEditing = ref(false);
		const currentChapterId = ref(null);
		const deleteModal = ref(null);
		const loading_modal = ref(null);
		const notice_message = ref('');
		const notice_toast = ref(null);
		var deleteModalHandle = null;

		onMounted(() => {
			fetchGrades();
			fetchChapters();
			deleteModalHandle = new Modal(deleteModal.value);
		});

		const fetchGrades = () => {
			const token = localStorage.getItem('tapasya_admin_token');
			axios.get(BASE_URL+'admin/configure/grade', {
					headers: {
						Authorization: `Bearer ${token}`
					},
				})
				.then(response => {
					grades.value = response.data;
					fetchSubjects();
				})
				.catch(error => {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		};

		const fetchSubjects = () => {
			const token = localStorage.getItem('tapasya_admin_token');
			axios.get(BASE_URL+'admin/configure/subject', {
					headers: {
						Authorization: `Bearer ${token}`
					},
				})
				.then(response => {
					subjects.value = response.data;
				})
				.catch(error => {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		};

		const fetchChapters = (page = 1) => {
			const token = localStorage.getItem('tapasya_admin_token');
			axios.get(BASE_URL+`admin/configure/chapter?page=${page}`, {
					headers: {
						Authorization: `Bearer ${token}`
					},
				})
				.then(response => {
					chapters.value = response.data;
				})
				.catch(error => {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		};

		const submitChapter = () => {
			const token = localStorage.getItem('tapasya_admin_token');
			const payload = {
				grade_id: selectedGrade.value,
				subject_id: selectedSubject.value,
				name: chapterValue.value,
			};
			loading_modal.value.show();
			const request = isEditing.value ?
				axios.put(BASE_URL+`admin/configure/chapter/${currentChapterId.value}`, payload, {
					headers: {
						Authorization: `Bearer ${token}`
					},
				}) :
				axios.post(BASE_URL+'admin/configure/chapter', payload, {
					headers: {
						Authorization: `Bearer ${token}`
					},
				});

			request
				.then((response) => {
					fetchChapters();
					resetForm();
					loading_modal.value.hide();
					notice_message.value = response.data.message;
					notice_toast.value.show();
				})
				.catch(error => {
					loading_modal.value.hide();
					if (error.response.status >= 400 && error.response.status < 500) {
						const validationErrors = error.response.data.errors;
						if(validationErrors) {
							errors.value = validationErrors;
						} else {
							notice_message.value = error.response.data.message;
							notice_toast.value.show();
						}
					} else {
						notice_message.value = 'Something went wrong';
						notice_toast.value.show();
					}
				});
		};

		const editChapter = (chapter) => {
			selectedGrade.value = chapter.grade_id;
			selectedSubject.value = chapter.subject_id;
			chapterValue.value = chapter.name;
			currentChapterId.value = chapter.id;
			isEditing.value = true;
			errors.value = {};
		};

		const resetForm = () => {
			selectedGrade.value = '';
			selectedSubject.value = '';
			chapterValue.value = '';
			isEditing.value = false;
			currentChapterId.value = null;
			errors.value = {};
		};
		const confirmDelete = (id) => {
			deleteModalHandle.show();
			confirmDeleteId.value = id;
		};

		const deleteChapter = (id) => {
			const token = localStorage.getItem('tapasya_admin_token');
			axios.delete(BASE_URL+`admin/configure/chapter/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`
					},
				})
				.then((response) => {
					fetchChapters();
					notice_message.value = response.data.message;
					notice_toast.value.show();
				})
				.catch(error => {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				})
				.finally(() => {
					deleteModalHandle.hide();
					confirmDeleteId.value = null;
				});
		};

		return {
			grades,
			subjects,
			chapters,
			selectedGrade,
			selectedSubject,
			chapterValue,
			errors,
			showDeleteConfirm,
			confirmDeleteId,
			isEditing,
			fetchGrades,
			fetchSubjects,
			fetchChapters,
			submitChapter,
			resetForm,
			editChapter,
			deleteModal,
			confirmDelete,
			confirmDeleteId,
			deleteChapter,
			loading_modal,
			notice_message,
			notice_toast,
			limit:5,
		};
	},
};
</script>

