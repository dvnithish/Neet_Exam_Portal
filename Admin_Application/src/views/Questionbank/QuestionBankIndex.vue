<template>
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a href="#">Home</a>
				</li>
				<li class="breadcrumb-item active" aria-current="page">Question Bank</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/question-bank/create">
			<i class="fas fa-plus me-2"></i> Add New Question
		</router-link>
	</div>
	<div class="card">
		<div class="card-header">
			<h6>All Questions</h6>
		</div>
		<div class="card-body">
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="">Grade</label>
					<select name="" id="" class="form-control" v-model="grade" @change="loadChapters()">
						<option value="">Select Grade</option>
						<option :value="grade.id" v-for="(grade, index) in grades">{{ grade.name }}</option>
					</select>
				</div>
				<div class="col-sm-2">
					<label for="">Subject</label>
					<select name="" id="" class="form-control" v-model="subject" @change="loadChapters()">
						<option value="">Select Subject</option>
						<option :value="subject.id" v-for="(subject, index) in subjects">{{ subject.name }}</option>
					</select>
				</div>
				<div class="col-sm-4">
					<label for="">Chapter</label>
					<select name="" id="" class="form-control" v-model="chapter">
						<option value="">Select Chapter</option>
						<option :value="chapter.id" v-for="(chapter, index) in chapters">{{ chapter.name }}</option>
					</select>
				</div>
				<div class="col-sm-2">
					<label for="">Difficulty Level</label>
					<select name="" id="" class="form-control" v-model="difficultyLevel">
						<option value="">Select Difficulty Level</option>
						<option :value="difficultyLevel.master_value" v-for="(difficultyLevel, index) in difficultyLevels">{{ difficultyLevel.master_value }}</option>
					</select>
				</div>
				<div class="col-sm-2">
					<p class="mb-4"></p>
					<button class="btn btn-primary w-100" @click="loadQuestions()">SEARCH</button>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12">
					<div class="ck-content">
						<table class="table table-bordered table-striped">
							<thead class="table-secondary">
								<tr>
									<th>#</th>									
									<th>Questions</th>
									<th class="text-center">Action</th>
								</tr>
							</thead>
							<tbody>								
								<tr v-if="questions.length == 0">
									<td colspan="3" align="center">Loading...</td>
								</tr>
								<tr v-for="(question, index) in questions.data">
									<td class="text-end">
										<div style="margin-bottom: 1.6em;"></div>
										{{ questions.from + index }}
									</td>
									<td>										
										<td >
											<div class="question-info rounded-2 px-2"> 
												Grade: {{ question.grade.name}} /&nbsp;&nbsp;
												Subject: {{  question.subject.name }} /&nbsp;&nbsp;
												Chapter: {{ question.chapter.name }} /&nbsp;&nbsp;
												Level: {{ question.difficulty_level }}
										 	</div>
										</td>
										<div id="question" class="d-flex mb-3">
											<div class="overflow-auto" v-html="question.content"></div>
										</div>
										<hr>
										<div id="choices" class="mb-3">
											<div class="row">
												<div class="col-6 mb-3" v-for="(choice, choiceIndex) in question.choices">
													<div class="d-flex">
														<div class="flex-shrink-1">
															<div class="flex-shrink-1">{{ choiceIndex + 1 }}.&nbsp;&nbsp;&nbsp;</div>
														</div>
														<div class="flex-fill">
															<div class="overflow-auto" v-html="choice.content"></div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</td>
									<td>
										<div class="text-center mb-2">
											<button class="btn btn-warning text-light" @click="editQuestion(question.id)">
												<span class="fa fa-edit"></span>
											</button>
										</div>
										<div class="text-center">
											<button class="btn btn-danger text-light" @click="confirmDelete(question.id)">
												<span class="fa fa-trash"></span>
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="d-flex justify-content-center">
						<Bootstrap5Pagination :data="questions" :limit="limit" @pagination-change-page="handlePageChange" />
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
							<p>Are you sure you want to delete this Question?</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button" class="btn btn-danger" @click="deleteQuestion(confirmDeleteId)">Delete</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ToastComponent :message="notice_message" ref="notice_toast" />
</template>

<script>
import axios from 'axios';
import ToastComponent from '@/components/ToastComponent.vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { BASE_URL } from '@/constants.js'
import { Modal } from "bootstrap";
export default {
	components: {
		ToastComponent,
		Bootstrap5Pagination,
	},
	setup() {
		const questions = ref([]);
		const router = useRouter();
		const route = useRoute();
		const grades = ref([]);
		const subjects = ref([]);
		const chapters = ref([]);
		const difficultyLevels = ref([]);
		const grade = ref('');
		const subject = ref('');
		const chapter = ref('');
		const difficultyLevel = ref('');
		const showDeleteConfirm = ref('');
		const confirmDeleteId = ref('');
		const deleteModal = ref(null);
		const loading_modal = ref(null);
		const notice_message = ref('');
		const notice_toast = ref(null);
		var deleteModalHandle = null;

		onMounted(() => {
			const page = parseInt(route.query.page) || 1;
			loadQuestions(page);
			loadAllGrades();
			deleteModalHandle = new Modal(deleteModal.value);
		});

		const loadQuestions = (page) => {
			questions.value = [];
			var url = BASE_URL+`admin/question?page=${page}`;
			if (grade.value) {
				url = url + '&grade=' + grade.value
			}
			if (subject.value) {
				url = url + '&subject=' + subject.value
			}
			if (chapter.value) {
				url = url + '&chapter=' + chapter.value
			}
			if (difficultyLevel.value) {
				url = url + '&difficulty_level=' + difficultyLevel.value
			}

			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(url, {
					headers: {
						Authorization: 'Bearer ' + tapasyaAdminToken
					}
				})
				.then(function(response) {
					questions.value = response.data;
				})
				.catch(function(error) {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		}

		const handlePageChange = (page) => {
			// Update the URL with the current page
			router.push({
				name: route.name,
				query: {
					...route.query,
					page,
					grade: grade.value,
					subject: subject.value,
					chapter: chapter.value,
					difficulty_level: difficultyLevel.value
				}
			});
			// Load the new page of questions
			loadQuestions(page);
		};

		/**Filters */
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
					loadAllSubjects();
				})
				.catch(function(error) {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		}

		const loadAllSubjects = () => {
			subjects.value = [];
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(BASE_URL+'admin/configure/subject', {
					headers: {
						Authorization: 'Bearer ' + tapasyaAdminToken
					}
				})
				.then(function(response) {
					subjects.value = response.data;
					loadAllDifficultyLevels();
				})
				.catch(function(error) {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		}

		const loadChapters = () => {
			chapters.value = [];
			if (grade.value && subject.value) {
				var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
				axios.post(BASE_URL+'admin/configure/chapter/custom/search-by-grade-and-subject', {
						grade_id: grade.value,
						subject_id: subject.value
					}, {
						headers: {
							Authorization: 'Bearer ' + tapasyaAdminToken
						}
					})
					.then(function(response) {
						chapters.value = response.data;
					})
					.catch(function(error) {
						notice_message.value = 'Something went wrong';
						notice_toast.value.show();
					})
			}
		}

		const loadAllDifficultyLevels = () => {
			difficultyLevels.value = [];
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(BASE_URL+'admin/configure/master/custom/get-all-difficulty-levels', {
					headers: {
						Authorization: 'Bearer ' + tapasyaAdminToken
					}
				})
				.then(function(response) {
					difficultyLevels.value = response.data;
				})
				.catch(function(error) {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		}

		const editQuestion = (id) => {
			router.push({
				path: `/question-bank/edit/${id}`
			})
		}

		const confirmDelete = (id) => {
			deleteModalHandle.show();
			confirmDeleteId.value = id;
		};	

		const deleteQuestion = (id) => {
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.delete(BASE_URL+`admin/question/${id}`, {
					headers: {
						Authorization: 'Bearer ' + tapasyaAdminToken
					}
				})
				.then(function(response) {
					notice_message.value = response.data.message;
					notice_toast.value.show();
					cancelDelete();
					loadQuestions();
				})
				.catch(function(error) {
					if (error.response.status == 403 || error.response.status == 404) {											
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
		}

		return {
			grades,
			subjects,
			chapters,
			difficultyLevels,
			grade,
			subject,
			chapter,
			difficultyLevel,
			questions,
			showDeleteConfirm,
			confirmDeleteId,
			confirmDelete,			
			loadQuestions,
			loadChapters,
			editQuestion,
			loading_modal,
			deleteModal,
			deleteQuestion,
			notice_message,
			notice_toast,
			limit: 5,
			handlePageChange,
		}
	}
}
</script>
<style>
	.question-info{
		background-color: #664c43;
		color:white;
	}
</style>