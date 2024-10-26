<template>
	<div class="row">
		<!-- Candidate Profile Section -->
		<div class="col-md-12">
			<div class="card h-100 p-4">
				<h5 class="mb-5 text-center">Welcome back! Excited to have you here for another awesome learning journey!</h5>
				<div class="row">
					<!-- Profile Image -->
					<div class="mt-30 col-md-3 d-flex justify-content-center align-items-center">
						<img src="@/assets/themes/assets/img/avatars/userimage.png" alt="Avatar" class="avatar-img" />
					</div>
					<!-- Profile Details -->
					<div class="col-md-9">
						<div class="row">
							<div class="col-md-4">
								<div class="d-flex h-100 align-items-center">
									<ul class="list-unstyled">
										<h2 class="fw-bold">About Me</h2>
										<li>
											<strong>Name:</strong> {{ information.student.first_name }} {{ information.student.last_name }}
										</li>
										<li>
											<strong>Email:</strong> {{ information.student.email }}
										</li>
										<li>
											<strong>Phone Number:</strong> {{ information.student.phone_no }}
										</li>
									</ul>
								</div>
							</div>
							<div class="col-md-8">
								<div class="row mt-4">
									<div class="col-md-6">
										<div class="stats-box text-center p-3">
											<h3 class="fw-bold">{{ information.unitTestSeriesCount }}</h3>
											<p>Unit Test Series Taken</p>
										</div>
									</div>
									<div class="col-md-6">
										<div class="stats-box text-center p-3">
											<h3 class="fw-bold">{{ information.dailyTestSeriesCount }}</h3>
											<p>Daily Test Series Attended</p>
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
	<ToastComponent :message="notice_message" ref="notice_toast" />
</template>
  
<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { BASE_URL } from '@/constants.js';
import ToastComponent from '@/components/ToastComponent.vue';
export default {
	components: {
		ToastComponent,
	},
	setup() {
		const information = ref({
			student: {
				first_name: '',
				last_name: '',
				email: '',
				phone_no: '',
			},
			dailyTestSeriesCount: '',
			unitTestSeriesCount: '',
		});
		const notice_message = ref('');
		const notice_toast = ref(null);

		onMounted(() => {
			loadDashboardInformation();
		});

		const loadDashboardInformation = () => {
			const token = localStorage.getItem('tapasya_student_token');
			axios.get(BASE_URL+'student/dashboard', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				information.value = response.data;
			})
			.catch((error) => {
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			});
		}

		return {
			information,
			notice_message,
  			notice_toast,
		}
	}
};
</script>
  
<style scoped>
	.details {
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