<template>
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a href="#">Home</a>
				</li>
				<li class="breadcrumb-item">
					<router-link to="/report">Report</router-link>
				</li>
				<li class="breadcrumb-item active" aria-current="page">Chapter Wise Report</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/report">
			<i class="fas fa-arrow-left me-2"></i> Back
		</router-link>
	</div>
	<div class="card mt-2">
		<div class="card-header">
			<div class="d-flex justify-content-between">
				<h5>Chapter Wise Report</h5>
			</div>
		</div>
		<div class="card-body">
			<div class="card">
				<div class="mt-3 ms-3">
					<div class="row">
						<div class="col-sm-2">
							<label for="">Grade</label>
							<select name="" id="" class="form-control" :class="{'is-invalid': errors.grade}" v-model="grade" @change="loadChapters()">
								<option value="">Select Grade</option>
								<option :value="grade.id" v-for="(grade, index) in grades">{{ grade.name }}</option>
							</select>
							<p v-if="errors.grade" class="invalid-feedback">{{ errors.grade[0] }}</p>
						</div>
						<div class="col-sm-2">
							<label for="">Subject</label>
							<select name="" id="" class="form-control" :class="{'is-invalid': errors.subject}" v-model="subject" @change="loadChapters()">
								<option value="">Select Subject</option>
								<option :value="subject.id" v-for="(subject, index) in subjects">{{ subject.name }}</option>
							</select>
							<p v-if="errors.subject" class="invalid-feedback">{{ errors.subject[0] }}</p>
						</div>
						<div class="col-sm-4">
							<label for="">Chapter</label>
							<select name="" id="" class="form-control" :class="{'is-invalid': errors.chapter}" v-model="chapter">
								<option value="">Select Chapter</option>
								<option :value="chapter.id" v-for="(chapter, index) in chapters">{{ chapter.name }}</option>
							</select>
							<p v-if="errors.chapter" class="invalid-feedback">{{ errors.chapter[0] }}</p>
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
							<button class="btn btn-primary" @click="loadChapterWise()">SEARCH</button>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<div class="card-body ">
							<table class="table table-bordered table-striped">
								<tbody>
									<tr v-for="(question, index) in questions.data">
										<td>{{ questions.from + index }}</td>
										<td>
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
											<QuestionAnalyticsChart :question_id="question.id" :total_correct_attempts="question.total_correct_attempts" :total_wrong_attempts="question.total_wrong_attempts" :total_not_attempted="question.total_not_attempted" />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="d-flex justify-content-center">
							<Bootstrap5Pagination :data="questions" :limit="limit" @pagination-change-page="loadChapterWise" />
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
import QuestionAnalyticsChart from '../../../components/QuestionAnalyticsChart.vue';
import { BASE_URL } from '@/constants.js';
import { ref, onMounted } from 'vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';

export default {
	components: {
		ToastComponent,
		Bootstrap5Pagination,
		QuestionAnalyticsChart,
	},
	setup() {
		const questions = ref({});
		const grades = ref([]);
		const subjects = ref([]);
		const chapters = ref([]);
		const difficultyLevels = ref([]);
		const grade = ref('');
		const subject = ref('');
		const chapter = ref('');
		const difficultyLevel = ref('');
		const notice_message = ref('');
		const notice_toast = ref(null);
		const errors = ref({});

		onMounted(() => {
			loadAllGrades();
		});

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
				.catch((error) => {
					notice_message.value = "Something went wrong";
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
				.catch((error) => {
					notice_message.value = "Something went wrong";
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
					.catch((error) => {
						notice_message.value = "Something went wrong";
						notice_toast.value.show();
					});
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
				.catch((error) => {
					notice_message.value = "Something went wrong";
					notice_toast.value.show();
				});
		}

		const loadChapterWise = (page = 1) => {
			questions.value = [];
			var url = BASE_URL + `admin/reports/chapter-wise?page=${page}`;
			if (grade.value) {
				url = url + '&grade=' + grade.value;
			}
			if (subject.value) {
				url = url + '&subject=' + subject.value;
			}
			if (chapter.value) {
				url = url + '&chapter=' + chapter.value;
			}
			if (difficultyLevel.value) {
				url = url + '&difficulty_level=' + difficultyLevel.value;
			}

			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			errors.value = {};
			axios.get(url, {
					headers: {
						Authorization: 'Bearer ' + tapasyaAdminToken
					}
				})
				.then(function(response) {
					questions.value = response.data;

					// Initialize counters
					let correct_attempts = 0;
					let wrong_attempts = 0;
					let not_attempted = 0;

					// Loop through the data array to sum attempts
					response.data.data.forEach((question) => {
						correct_attempts += question.total_correct_attempts;
						wrong_attempts += question.total_wrong_attempts;
						not_attempted += question.total_not_attempted;
					});

				})
				.catch((error) => {
					if(error.response.status == 422) {
						errors.value = error.response.data.errors;
					}
					notice_message.value = "Something went wrong";
					notice_toast.value.show();
				});
		};

		return {
			errors,
			grades,
			subjects,
			chapters,
			difficultyLevels,
			grade,
			subject,
			chapter,
			difficultyLevel,
			questions,
			loadChapters,
			loadChapterWise,
			notice_message,
			notice_toast,
			limit: 5,
		};
	}
};
</script>
