<template>
	<div>
		<!-- Breadcrumb and Back Button -->
		<div class="d-flex justify-content-between mb-3">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<router-link to="/">Home</router-link>
					</li>
					<li class="breadcrumb-item active" aria-current="page">Daily Test Series</li>
				</ol>
			</nav>
			<router-link class="btn btn-primary" to="/daily-test-series">
				<i class="fas fa-arrow-left me-2"></i> Back
			</router-link>
		</div>
		<!-- Main Card -->
		<div class="card">
			<div class="card-header">
				<h6>Edit Daily Test Series</h6>
			</div>
			<div class="card-body">
				<!-- Inner Card for Question Selection -->
				<div class="row">
					<!-- Left Card: Inputs for Exam Name, Date, Subject, Chapter, Difficulty -->
					<div class="col-sm-3">
						<div class="card mt-3">
							<div class="card-body">
								<div class="mb-3">
									<label for="examName">Exam Name</label>
									<input id="examName" type="text" v-model="examName" :class="{'is-invalid': errors['name']}" class="form-control" placeholder="Enter Exam Name" />
									<div v-if="errors['name']" class="invalid-feedback">{{ errors['name'][0] }}</div>
								</div>
								<div class="mb-3">
									<label for="examDate">Exam Date</label>
									<input id="examDate" type="date" :class="{'is-invalid': errors['exam_date']}" v-model="examDate" class="form-control" />
									<div v-if="errors['exam_date']" class="invalid-feedback">{{ errors['exam_date'][0] }}</div>
								</div>
								<div class="mb-3">
									<label for="examTime">Exam Time</label>
									<input id="examTime" type="time" :class="{'is-invalid': errors['exam_time']}" v-model="examTime" class="form-control" />
									<div v-if="errors['exam_time']" class="invalid-feedback">{{ errors['exam_time'][0] }}</div>
								</div>
								<hr />								
								<div v-for="(syllabusItem, index) in syllabus" :key="index">
                                    <p>{{ syllabusItem.name }}: {{ syllabusItem.count }}</p>
                                </div>
								<hr />
								<!-- Add Question Section -->
								<div class="mb-3">
									<label for="grade">Grade</label>
									<select id="grade" class="form-control" v-model="grade" @change="loadChapters">
										<option value="">Select Grade</option>
										<option v-for="(grade, index) in grades" :key="index" :value="grade.id">
											{{ grade.name }}
										</option>
									</select>
								</div>
								<div class="mb-3">
									<label for="subject">Subject</label>
									<select id="subject" class="form-control" v-model="subject" @change="loadChapters">
										<option value="">Select Subject</option>
										<option v-for="(subject, index) in subjects" :key="index" :value="subject.id">
											{{ subject.name }}
										</option>
									</select>
								</div>
								<div class="mb-3">
									<label for="chapter">Chapter</label>
									<select id="chapter" class="form-control" v-model="chapter">
										<option value="">Select Chapter</option>
										<option v-for="(chapter, index) in chapters" :key="index" :value="chapter.id">
											{{ chapter.name }}
										</option>
									</select>
								</div>
								<div class="mb-3">
									<label for="difficultyLevel">Difficulty Level</label>
									<select id="difficultyLevel" class="form-control" v-model="difficultyLevel">
										<option value="">Select Difficulty Level</option>
										<option v-for="(level, index) in difficultyLevels" :key="index" :value="level.master_value">
											{{ level.master_value }}
										</option>
									</select>
								</div>
								<div class="mt-3 text-center">
									<button class="btn btn-primary" @click="loadQuestions">Pick Questions</button>
								</div>
							</div>
						</div>
					</div>
					<!-- Right Card: Display Questions and Choices -->
					<div class="col-sm-9">
						<div class="card mt-3">
							<div class="card-body">
								<div class="ck-content">
									<table class="table table-bordered">
										<tbody>
											<tr v-for="(question, index) in questions.data" :key="index">
												<td class="text-end"> 
													<div style="margin-bottom: 1.5em;"></div>
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
													<hr />
													<div class="choices">
														<div class="row">
															<div class="col-6 mb-3" v-for="(choice, choiceIndex) in question.choices" :key="choiceIndex">
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
												<td class="text-center align-middle">
													<button v-if="selectedQuestions.some(item => item.question_id === question.id)" class="btn btn-danger" @click="removeQuestion(question.id, question.subject_id)">Remove Question</button>
													<button v-else class="btn btn-dark" @click="pickQuestion(question.id, question.subject_id)">Pick Question</button>
												</td>
											</tr>
										</tbody>
									</table>
								</div>								
								<!-- Pagination -->
								<div class="d-flex justify-content-center">
									<Bootstrap5Pagination :data="questions" :limit="limit" @pagination-change-page="loadQuestions" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="card-footer text-center">
				<button class="btn btn-primary me-2" @click="updateDailyTestSeries()">Update</button>
				<router-link to="/daily-test-series" class="btn btn-danger text-light">Cancel</router-link>
			</div>
		</div>
		<!-- Toast Component -->
		<ToastComponent :message="notice_message" ref="notice_toast" />
	</div>
</template>

<script>
import axios from 'axios';
import ToastComponent from '@/components/ToastComponent.vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { ref, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { BASE_URL} from '@/constants.js';
export default {
	components: {
		ToastComponent,
		Bootstrap5Pagination,
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const examDate = ref('');
		const examTime = ref('');
		const examName = ref('');
		const grades = ref([]);
		const subjects = ref([]);
		const chapters = ref([]);
		const difficultyLevels = ref([]);
		const syllabus = ref([]);
		const grade = ref('');
		const subject = ref('');
		const chapter = ref('');
		const difficultyLevel = ref('');
		const questions = ref([]);
		const selectedQuestions = ref([]);
		const errors = ref({});
		const notice_message = ref('');
		const notice_toast = ref(null);

		onMounted(() => {			
			loadAllGrades();
		});

		const setDailyTestSeriesDetail = () => {
			const tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(BASE_URL+'admin/daily-test-series/'+route.params.id, {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				},
			})
			.then((response) => {	
				examDate.value = response.data.dailyTestSeries.exam_date;
				examTime.value = response.data.dailyTestSeries.exam_time;
				examName.value = response.data.dailyTestSeries.name;
				syllabus.value = JSON.parse(response.data.dailyTestSeries.syllabus);
				selectedQuestions.value = response.data.selectedQuestions;
			})
			.catch((error) => {								
				notice_message.value = "Something went wrong";
				notice_toast.value.show();
			});
		}

		const loadQuestions = (page = 1) => {
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
					window.scrollTo(0, 0);
				})
				.catch(function(error) {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		}

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
					setDailyTestSeriesDetail();
				})
				.catch(function(error) {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();
				});
		}

		const pickQuestion = (questionId, subjectId) => {
			selectedQuestions.value.push({question_id:questionId});	
			syllabus.value.forEach((syllabusItem) => {
				if (syllabusItem.id == subjectId) {
					++syllabusItem.count;
					return;
				}
			});
		}

		const removeQuestion = (questionId, subjectId) => {
			const index = selectedQuestions.value.findIndex(item => item.question_id === questionId);
			if (index !== -1) {
				selectedQuestions.value.splice(index, 1);

				syllabus.value.forEach((syllabusItem) => {
					if (syllabusItem.id == subjectId) {
						--syllabusItem.count;
						return;
					}
				});
			}
		}

		const formatTime = (time) => {
			const parts = time.split(':');
			const hours = parts[0].padStart(2, '0');
			const minutes = parts[1]?.padStart(2, '0') || '00';
			const seconds = parts[2]?.padStart(2, '0') || '00';
			return `${hours}:${minutes}:${seconds}`;
		};

		const updateDailyTestSeries = () => {
			const formattedTime = formatTime(examTime.value);
			const tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.post(BASE_URL+'admin/daily-test-series/' + route.params.id, {
				_method: 'PUT',
				'exam_date': examDate.value,
				'exam_time': formattedTime,
				'name': examName.value,
				'syllabus': syllabus.value,
				'questions': selectedQuestions.value
			}, {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				},
			})
			.then((response) => {	
				notice_message.value = "Daily Test Series was Updated";
				notice_toast.value.show();			
				router.push({ path: `/daily-test-series` });
			})
			.catch((error) => {
				if (error.response.status == 422) {
					errors.value = error.response.data.errors; 
					if (errors.value['questions']) {
						notice_message.value = errors.value['questions'][0];
						notice_toast.value.show();
					}                      
				} else if (error.response.status == 403) {
					notice_message.value = error.response.data.message;
					notice_toast.value.show(); 
				} else {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();                        
				}
			});
		}

		return {
			examDate,
			examTime,
			examName,
			grades,
			errors,
			subjects,
			chapters,
			difficultyLevels,
			syllabus,
			grade,
			subject,
			chapter,
			difficultyLevel,
			questions,
			loadQuestions,
			loadChapters,
			pickQuestion,
			removeQuestion,
			selectedQuestions,
			updateDailyTestSeries,
			notice_message,
			notice_toast,
			limit: 5 
		}
	}
}
</script>