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
				<li class="breadcrumb-item active" aria-current="page">Student Report</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/report">
			<i class="fas fa-arrow-left me-2"></i> Back
		</router-link>
	</div>
	<div class="row">
		<div class="col-md-12 d-flex">
			<input type="text" class="form-control w-75 shadow-none" v-model="search_query" placeholder="search by first name / last name / phone number...">
			<button class="btn btn-primary col-md-2 me-2" @click="loadStudents()"><i class="fa fa-search"></i> Search</button>
			<button class="btn btn-secondary col-md-1" @click="clearSearch()"><i class="fa fa-xmark"></i> Clear</button>
		</div>
	</div>
	<div class="row">
		<!-- Candidate Profile Section -->
		<div class="col-md-12">
			<div v-for="(student, index) in students.data" :key="index" class="card p-4 my-3">
				<div class="card-body k-card-body">
					<div class="row">
						<!-- Profile Image -->
						<div class="mt-30 col-md-3 d-flex justify-content-center align-items-center">
							<img src="@/assets/themes/assets/img/avatars/userimage.png" alt="Avatar" class="avatar-img" />
						</div>
						<!-- Profile Details -->
						<div class="col-md-9">
							<div class="row">
								<div class="col-md-12">
									<div class="row mt-4">
										<div class="col-md-4">
											<div class="d-flex h-100 align-items-center">
												<ul class="list-unstyled">									
													<li>
														<strong>Name:</strong> {{ student.first_name }} {{ student.last_name }}
													</li>
													<li>
														<strong>Email:</strong> {{ student.email }}
													</li>
													<li>
														<strong>Phone #:</strong> {{ student.phone_no }}
													</li>
													<li>
														<strong>Status:</strong> {{ student.status  ? 'Active' : 'Blocked' }}
													</li>
												</ul>
											</div>
										</div>
										<div class="col-md-4">
											<div class="stats-box text-center p-3">
												<h3 class="fw-bold">{{ student.unit_test_series_count }}</h3>
												<p>Unit Test Series Taken</p>
											</div>
										</div>
										<div class="col-md-4">
											<div class="stats-box text-center p-3">
												<h3 class="fw-bold">{{ student.daily_test_series_count }}</h3>
												<p>Daily Test Series Attended</p>
											</div>
										</div>									
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Statistics Section -->
			</div>
		</div>
	</div>
	<div class="d-flex justify-content-center mt-2">
		<Bootstrap5Pagination :data="students" :limit="limit" @pagination-change-page="loadStudents" />
	</div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import ToastComponent from '@/components/ToastComponent.vue';
import { Modal } from 'bootstrap';
import { BASE_URL } from '@/constants.js'
export default {
	components: {
		Bootstrap5Pagination,
		ToastComponent
	},
	setup() {
		const router = useRouter();
		const route = useRoute();	
		const students = ref([]);
		const search_query = ref('');
		const notice_message = ref('');
		const notice_toast = ref(null);

		onMounted(() => {
			loadStudents();	
		});

		const loadStudents = (page = 1) => {
			const tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			var url = BASE_URL + `admin/reports/students?page=${page}`;
			if (search_query.value) {
				url = url + '&search_query=' + search_query.value
			}
			axios.get(url, {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				}
			})
				.then(function (response) {
					students.value = response.data.students;
				})
				.catch(function (error) {
					notice_message.value = 'Something went wrong oho';
					notice_toast.value.show();
				});
		};

		const clearSearch = () => {
			search_query.value = '';
			loadStudents();
		}

		return {
			search_query,
			students,
			notice_message,
			notice_toast,
			loadStudents,
			clearSearch,
			limit: 5,
		}
  },
};
</script>

<style scoped>

.details{
  margin-top: 60px;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.stats-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
}

.lead {
  font-size: 1.25rem;
}
</style> 