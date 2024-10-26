<template>
   <!-- Breadcrumb Navigation -->
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a href="#">Home</a>
				</li>
				<li class="breadcrumb-item active" aria-current="page">My Account</li>
			</ol>
		</nav>
	</div>
	<div class="card mb-3">
		<div class="card-header">
			<h6>Profile</h6>
		</div>
		<div class="card-body">
			<div class="row mb-3">
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">First Name</label>
					<input type="text" class="form-control" :class="{'is-invalid': profileErrors['first_name']}" v-model="student.first_name">
					<div  v-if="profileErrors['first_name']" class="invalid-feedback">{{ profileErrors['first_name'][0] }}</div>
				</div>
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">Last Name</label>
					<input type="text" class="form-control"  :class="{'is-invalid': profileErrors['last_name']}" v-model="student.last_name">
					<div  v-if="profileErrors['last_name']" class="invalid-feedback">{{ profileErrors['last_name'][0] }}</div>
				</div>
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">Email</label>
					<input type="text" class="form-control"  :class="{'is-invalid': profileErrors['email']}" v-model="student.email">
					<div  v-if="profileErrors['email']" class="invalid-feedback">{{ profileErrors['email'][0] }}</div>
				</div>
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">Password (optional)</label>
					<input type="text" class="form-control" v-model="student.password">
				</div>
			</div>
			<div class="d-flex justify-content-center">
				<button class="btn btn-primary me-2" @click="updateStudent(student.id)">Update</button>
				<button class="btn btn-danger" @click="discardStudent()">Discard</button>
			</div>
		</div>
	</div>
	<div class="card mb-3">
		<div class="card-header">
			<h6>Details</h6>
		</div>
		<div class="card-body">
			<div class="row mb-3">
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">Grade</label>
					<input type="text" class="form-control"  :class="{'is-invalid': detailsErrors['grade']}" v-model="studentDetails.grade">
					<div  v-if="detailsErrors['grade']" class="invalid-feedback">{{ detailsErrors['grade'][0] }}</div>
				</div>
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">College Name</label>
					<input type="text" class="form-control"  :class="{'is-invalid': detailsErrors['college_name']}" v-model="studentDetails.college_name">
					<div  v-if="detailsErrors['college_name']" class="invalid-feedback">{{ detailsErrors['college_name'][0] }}</div>
				</div>
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">Board</label>
					<input type="text" class="form-control"  :class="{'is-invalid': detailsErrors['board']}" v-model="studentDetails.board">
					<div  v-if="detailsErrors['board']" class="invalid-feedback">{{ detailsErrors['board'][0] }}</div>
				</div>
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">Address</label>
					<input type="text" class="form-control"  :class="{'is-invalid': detailsErrors['address']}" v-model="studentDetails.address">
					<div  v-if="detailsErrors['address']" class="invalid-feedback">{{ detailsErrors['address'][0] }}</div>
				</div>
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">City</label>
					<input type="text" class="form-control"  :class="{'is-invalid': detailsErrors['city']}" v-model="studentDetails.city">
					<div  v-if="detailsErrors['city']" class="invalid-feedback">{{ detailsErrors['city'][0] }}</div>
				</div>
				<div class="col-md-6 mb-3">
					<label for="" class="form-label">State</label>
					<input type="text" class="form-control"  :class="{'is-invalid': detailsErrors['state']}" v-model="studentDetails.state">
					<div  v-if="detailsErrors['state']" class="invalid-feedback">{{ detailsErrors['state'][0] }}</div>
				</div>
			</div>
			<div class="d-flex justify-content-center">
				<button class="btn btn-primary me-2" @click="updateStudentDeatils(student.id)">Update</button>
				<button class="btn btn-danger" @click="discardStudentDetails()">Discard</button>
			</div>
		</div>
	</div>
	<ToastComponent :message="notice_message" ref="noticeToast" />
</template>
  
<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import ToastComponent from '@/components/ToastComponent.vue'; 
import { BASE_URL } from '@/constants.js';

export default {
	components: {
		ToastComponent,
	},
	setup() {
		const student = ref({
			id: null,
			first_name: '',
			last_name: '',
			email: '',
			password: '',
		});
		const studentDetails = ref({
			grade: '',
			college_name: '',
			board: '',
			address: '',
			city: '',
			state: ''
		});
		const profileErrors = ref({});
		const detailsErrors = ref({});
		const notice_message = ref('');
		const noticeToast = ref(null);

		onMounted(() => {
			loadStudent();
		});

		const loadStudent = () => {
			profileErrors.value = {};
			const token = localStorage.getItem('tapasya_student_token');
			axios.get(BASE_URL + 'student/profile/'+token, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					student.value.id = response.data.student.id;	
					student.value.first_name = response.data.student.first_name;	
					student.value.last_name = response.data.student.last_name;	
					student.value.email = response.data.student.email;	
					loadStudentDetails();								
				})
				.catch((error) => {
					notice_message.value = 'Something went wrong';
					noticeToast.value?.show();
				});
		};
		
		const loadStudentDetails = () => {		
			const token = localStorage.getItem('tapasya_student_token');
			axios.get(BASE_URL + 'student/details/'+token, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					if(response.data.studentDetails) {
						studentDetails.value.grade = response.data.studentDetails.grade;									
						studentDetails.value.college_name = response.data.studentDetails.college_name;									
						studentDetails.value.board = response.data.studentDetails.board;									
						studentDetails.value.address = response.data.studentDetails.address;									
						studentDetails.value.city = response.data.studentDetails.city;									
						studentDetails.value.state = response.data.studentDetails.state;									
					} else {
						studentDetails.value.grade = '';
						studentDetails.value.college_name = '';
						studentDetails.value.board = '';
						studentDetails.value.address = '';
						studentDetails.value.city = '';
						studentDetails.value.state = '';
					}
				})
				.catch((error) => {
					notice_message.value = 'Something went wrong';
					noticeToast.value?.show();
				});
		};		

		const updateStudent = (id) => {
			const token = localStorage.getItem('tapasya_student_token');
			axios.put(BASE_URL + 'student/profile/' + id, {
				first_name : student.value.first_name,
				last_name : student.value.last_name,
				email: student.value.email,
				password :student.value.password ?? null
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				notice_message.value = response.data.message;
				noticeToast.value.show();									
				loadStudent();
				student.value.password = '';
			})
			.catch((error) => {
				if(error.response) {
					if(error.response.status == 422) {
						profileErrors.value = error.response.data.errors;
					} else if(error.response.status == 403) {
						notice_message.value = error.response.data.message;
						noticeToast.value?.show();
					} else {
						notice_message.value = 'Something went wrong';
						noticeToast.value?.show();
					}
				} else {
					notice_message.value = 'Something went wrong';
					noticeToast.value?.show();
				}	
			});
		};

		const updateStudentDeatils = (id) => {
			detailsErrors.value = {};
			const token = localStorage.getItem('tapasya_student_token');
			axios.post(BASE_URL + 'student/details', {
				student_id : id,
				grade : studentDetails.value.grade ,
				college_name: studentDetails.value.college_name ,
				board : studentDetails.value.board ,
				address : studentDetails.value.address ,
				city : studentDetails.value.city ,
				state : studentDetails.value.state 
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				notice_message.value = response.data.message;
				noticeToast.value.show();									
				loadStudentDetails();
			})
			.catch((error) => {
				if(error.response) {
					if (error.response.status == 422) {
						detailsErrors.value = error.response.data.errors;
					} else if (error.response.status == 403) {
						notice_message.value = error.response.data.message;
						noticeToast.value?.show();
					} else {
						notice_message.value = 'Something went wrong';
						noticeToast.value?.show();
					}
				} else {
					notice_message.value = 'Something went wrong';
					noticeToast.value?.show();
				}
					
			});
		};

		const discardStudent = () => {
			profileErrors.value = {};
			loadStudent();
		}

		const discardStudentDetails = () => {
			detailsErrors.value = {};
			loadStudentDetails();
		}

		return {
			student,
			studentDetails,
			loadStudent,
			updateStudent,
			loadStudentDetails,
			updateStudentDeatils,
			discardStudent,
			discardStudentDetails,
			profileErrors,
			detailsErrors,
			notice_message,
			noticeToast
		}
	},

};
</script>
  
  
  