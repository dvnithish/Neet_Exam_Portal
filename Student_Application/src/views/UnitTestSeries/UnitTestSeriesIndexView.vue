<template>
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item ">
					<a href="#">Home</a>
				</li>
				<li class="breadcrumb-item active" aria-current="page">Unit Test Series</li>
			</ol>
		</nav>
	</div>
	<div class="card">
		<div class="card-header">
			<h6>Unit Test Series</h6>
		</div>
		<div class="card-body">
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="grade" class="fw-bold mb-2">Grade</label>
					<select id="grade" class="form-control" v-model="grade" @change="loadChapters">
						<option value="">Select</option>
						<option :value="grade.id" v-for="(grade, index) in grades" :key="index">{{ grade.name }}</option>
					</select>
					<div class="invalid-feedback d-block">
						{{ errors.grade }}
					</div>
				</div>
				<div class="col-sm-2">
					<label for="subject" class="fw-bold mb-2">Subject</label>
					<select id="subject" class="form-control" v-model="subject" @change="loadChapters">
						<option value="">Select</option>
						<option :value="subject.id" v-for="(subject, index) in subjects" :key="index">{{ subject.name }}</option>
					</select>
					<div class="invalid-feedback d-block">
						{{ errors.subject }}
					</div>
				</div>
				<div class="col-sm-2">
					<label for="chapter" class="fw-bold mb-2">Chapter</label>
					<select id="chapter" class="form-control" v-model="chapter">
						<option value="">Select</option>
						<option :value="chapter.id" v-for="(chapter, index) in chapters" :key="index">{{ chapter.name }}</option>
					</select>
					<div class="invalid-feedback d-block">
						{{ errors.chapter }}
					</div>
				</div>
				<div class="col-sm-2">
					<label for="difficultyLevel" class="fw-bold mb-2">Difficulty Level</label>
					<select id="difficultyLevel" class="form-control" v-model="difficultyLevel">
						<option value="">Select</option>
						<option :value="difficultyLevel.master_value" v-for="(difficultyLevel, index) in difficultyLevels" :key="index">{{ difficultyLevel.master_value }}</option>
					</select>
					<div class="invalid-feedback d-block">
						{{ errors.difficultyLevel }}
					</div>
				</div>
				<div class="col-sm-2">
					<label for="numberOfQuestions" class="fw-bold mb-2">No. of Questions</label>
					<select id="numberOfQuestions" class="form-control" v-model="numberOfQuestions">
						<option value="">Select</option>
						<option value="15">15</option>
						<option value="20">20</option>
						<option value="30">30</option>
					</select>
					<div class="invalid-feedback d-block">
						{{ errors.numberOfQuestions }}
					</div>
				</div>
				<div class="col-sm-2 ">
					<p class="mb-4"></p>
					<button class="btn btn-primary w-100 mt-2" @click="gotoUnitTestSeriesInstructionView">Take Test</button>
				</div>
			</div>
		</div>
	</div>
	<div class="card mt-2 mb-3">
		<div class="card-body">
			<div v-if="unitTestSeries.data" class="row mt-3 mb-3 ">
				<div class="col-sm-2 col-md-3 d-flex" v-for="unitTestSeriesItem in unitTestSeries.data" :key="unitTestSeriesItem.id">
					<div class="card k-width  d-flex flex-column ">
						<div class="card-header">
							<p class="fw-bold mb-0">Attended On:</p>
							<p class="mb-0">{{ convertDateFormat(unitTestSeriesItem.start) }}</p>
						</div>
						<div class="card-body  d-flex flex-column">
							<p class="card-text"><b>Grade:</b> {{ unitTestSeriesItem.grade.name }}</p>
							<p class="card-text"><b>Subject:</b> {{ unitTestSeriesItem.subject.name }}</p>
							<p class="card-text"><b>Chapter:</b> <br>{{ unitTestSeriesItem.chapter.name }}</p>
							<p class="card-text"><b>Difficulty Level:</b> {{ unitTestSeriesItem.difficulty_level }}</p>
							<p class="card-text"><b>No. of Questions:</b> {{ unitTestSeriesItem.no_of_question || 'N/A' }}</p>
						</div>
						<div class="card-footer  mt-auto text-start">
							<div class="d-flex justify-content-evenly">
								<button v-if="checkTestStatus(unitTestSeriesItem).continue" @click="gotoUnitTestSeriesAttendView(unitTestSeriesItem.id)" class="btn btn-primary me-2">Continue Test</button>
								<div v-if="checkTestStatus(unitTestSeriesItem).show">
									<button @click="gotoUnitTestSeriesShowView(unitTestSeriesItem.id)" class="btn btn-primary me-2">Show</button>
									<button @click="gotoUnitTestSeriesResultView(unitTestSeriesItem.id)" class="btn btn-danger me-2">Result</button>
								</div>
								<button v-if="checkTestStatus(unitTestSeriesItem).finish" @click="gotoUnitTestSeriesResultView(unitTestSeriesItem.id)" class="btn btn-danger me-2">Finish Test</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else>
				<div class="loader">
					<span></span>
					<div class="loading-text">Loading, please wait...</div>
				</div>
			</div>
		</div>
		<div class="d-flex justify-content-center">
			<Bootstrap5Pagination :data="unitTestSeries" :limit="limit" @pagination-change-page="fetchUnitTestSeries" />
		</div>
	</div>
	<!-- Toast Notification -->
	<ToastComponent :message="notice_message" ref="noticeToast" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import axios from 'axios';
import ToastComponent from '@/components/ToastComponent.vue'; // Adjust the path as necessary
import { BASE_URL } from '@/constants.js';

export default {
	components: {
		ToastComponent,
		Bootstrap5Pagination,
	},
	setup() {
		const router = useRouter();
		const grades = ref([]);
		const subjects = ref([]);
		const chapters = ref([]);
		const difficultyLevels = ref([]);
		const grade = ref('');
		const subject = ref('');
		const chapter = ref('');
		const difficultyLevel = ref('');
		const numberOfQuestions = ref('');
		const notice_message = ref('');
		const unitTestSeries = ref([]);
		const noticeToast = ref(null);
		const errors = ref({
			grade: '',
			subject: '',
			chapter: '',
			difficultyLevel: '',
			numberOfQuestions: '',
		});

		onMounted(() => {
			loadAllGrades();
			fetchUnitTestSeries();
		});

		const fetchUnitTestSeries = async (page = 1) => {
			reset();
			unitTestSeries.value = [];
			const token = localStorage.getItem('tapasya_student_token');
			axios.get(BASE_URL + `student/unit-test-series?page=${page}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					unitTestSeries.value = response.data.unitTestSeries;
				})
				.catch((error) => {
					unitTestSeries.value.data = [];
					console.error('Error fetching unit test series:', error);
				});
		};

		const loadAllGrades = () => {
			const token = localStorage.getItem('tapasya_student_token');

			axios.get(BASE_URL + 'admin/configure/grade', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					grades.value = response.data;
					loadAllSubjects();
				})
				.catch(() => {
					notice_message.value = 'Something went wrong';
					noticeToast.value?.show();
				});
		};

		const loadAllSubjects = () => {
			const token = localStorage.getItem('tapasya_student_token');

			axios.get(BASE_URL + 'admin/configure/subject', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					subjects.value = response.data;
					loadAllDifficultyLevels();
				})
				.catch(() => {
					notice_message.value = 'Something went wrong';
					noticeToast.value?.show();
				});
		};

		const loadChapters = () => {
			if (grade.value && subject.value) {
				const token = localStorage.getItem('tapasya_student_token');

				axios.post(BASE_URL + 'admin/configure/chapter/custom/search-by-grade-and-subject', {
						grade_id: grade.value,
						subject_id: subject.value,
					}, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})
					.then((response) => {
						chapters.value = response.data;
					})
					.catch(() => {
						notice_message.value = 'Something went wrong';
						noticeToast.value?.show();
					});
			}
		};

		const loadAllDifficultyLevels = () => {
			const token = localStorage.getItem('tapasya_student_token');

			axios.get(BASE_URL + 'admin/configure/master/custom/get-all-difficulty-levels', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					difficultyLevels.value = response.data;
				})
				.catch(() => {
					notice_message.value = 'Something went wrong';
					noticeToast.value?.show();
				});
		};

		const gotoUnitTestSeriesInstructionView = () => {
			if (!validations()) {
				return;
			}
			router.push({
				path: '/unit-test-series/instruction',
				query: {
					grade_id: grade.value,
					subject_id: subject.value,
					chapter_id: chapter.value,
					difficulty_level: difficultyLevel.value,
					no_of_question: numberOfQuestions.value,
				},
			});
		};

		const convertDateFormat = (originalDate) => {
			const date = new Date(originalDate.replace(" ", "T") + "Z");
			const options = {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true,
				timeZone: 'UTC'
			};
			const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
			return formattedDate;
		}

		const checkTestStatus = (unitTestSeriesItem) => {
			var status = {
				continue: false,
				finish: false,
				show: false,
			};

			const today = new Date();
			const year = today.getFullYear();
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const day = String(today.getDate()).padStart(2, '0');
			const todayFormatted = `${year}-${month}-${day}`;

			if (
				unitTestSeriesItem.is_finished == 0 &&
				new Date(unitTestSeriesItem.end) > new Date()
			) {
				// continue =  student exists AND is_finised = 0 AND end time greater than current time
				status.continue = true;
			} else if (
				unitTestSeriesItem.is_finished == 0 &&
				new Date(unitTestSeriesItem.end) < new Date()
			) {
				// finish = student exists AND is_finised = 0 AND end time lesser than current time
				status.finish = true;
			} else {
				// show = else condition 
				status.show = true;
			}

			return status
		}

		const gotoUnitTestSeriesShowView = (id) => {
			router.push({
				path: `/unit-test-series/show/${id}`
			});
		};

		const gotoUnitTestSeriesAttendView = async (id) => {
			router.push({
				path: `/unit-test-series/attend/${id}`
			})
		}

		const gotoUnitTestSeriesResultView = (id) => {
			router.push({
				path: `/unit-test-series/result/${id}`
			});
		};

		const validations = () => {
			reset();
			var status = true;
			if (grade.value == '') {
				errors.value.grade = 'Grade cannot be left empty';
				status = false;
			}
			if (subject.value == '') {
				errors.value.subject = 'Subject cannot be left empty';
				status = false;
			}
			if (chapter.value == '') {
				errors.value.chapter = 'Chapter cannot be left empty';
				status = false;
			}
			if (difficultyLevel.value == '') {
				errors.value.difficultyLevel = 'Difficulty level cannot be left empty';
				status = false;
			}
			if ( numberOfQuestions.value == '') {
				errors.value.numberOfQuestions = 'No.of Quest. has to be selected';
				status = false;
			}
			if(!status) {
				notice_message.value = 'Please fill out all required fields before submitting!';
				noticeToast.value?.show();
			}
			return status;
		}

		const reset = () => {
			errors.value = {
				grade: '',
				subject: '',
				chapter: '',
				difficultyLevel: '',
				numberOfQuestions: '',
			};
		}

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
			numberOfQuestions,
			notice_message,
			noticeToast,
			unitTestSeries,
			loadChapters,
			gotoUnitTestSeriesInstructionView,
			gotoUnitTestSeriesShowView,
			gotoUnitTestSeriesResultView,
			checkTestStatus,
			convertDateFormat,
			fetchUnitTestSeries,
			gotoUnitTestSeriesAttendView,
			limit: 5
		};
	},
};
</script>

<style scoped>
.card-spacing {
  margin: 0 10px 20px 10px;
}

.breadcrumb {
  background-color: #f8f9fa;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.card-footer {
  background-color: #f8f9fa;
}

.k-width{
  width:270px;
  margin-left: 10px;
}
.col-sm-2 option{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
