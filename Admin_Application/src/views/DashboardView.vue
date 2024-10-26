<template>
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item active" aria-current="page">Home</li>
			</ol>
		</nav>
	</div>
	<div class="container mt-3">
		<div class="row">
			<div class="col-sm-6 mb-3">
				<div class="card rounded-pill">
					<div class="card-body">
						<div class="text-center mb-3">
							<h5>No.of Students</h5>
						</div>
						<div class="text-center">
							<div v-if="information.studentCount == undefined" class="spinner-border text-dark b" role="status">
								<span class="sr-only">Loading...</span>
							</div>
							<h1 v-else>{{ information.studentCount }}</h1>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-6 mb-3">
				<div class="card rounded-pill">
					<div class="card-body">
						<div class="text-center mb-3">
							<h5>Daily Test Series Conducted</h5>
						</div>
						<div class="text-center">
							<div v-if="information.dailyTestSeriesCount == undefined" class="spinner-border text-dark" role="status">
								<span class="sr-only">Loading...</span>
							</div>
							<h1 v-else>{{ information.dailyTestSeriesCount }}</h1>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-6 mb-3">
				<div class="card rounded-pill">
					<div class="card-body">
						<div class="text-center mb-3">
							<h5>Daily Test Series Attended</h5>
						</div>
						<div class="text-center">
							<div v-if="information.dailyTestSeriesStudentCount == undefined" class="spinner-border text-dark" role="status">
								<span class="sr-only">Loading...</span>
							</div>
							<h1 v-else>{{ information.dailyTestSeriesStudentCount }}</h1>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-6 mb-3">
				<div class="card rounded-pill">
					<div class="card-body">
						<div class="text-center mb-3">
							<h5>Unit Test Series Attended</h5>
						</div>
						<div class="text-center">
							<div v-if="information.unitTestSeriesCount == undefined" class="spinner-border text-dark" role="status">
								<span class="sr-only">Loading...</span>
							</div>
							<h1>{{ information.unitTestSeriesCount }}</h1>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ToastComponent :message="notice_message" ref="notice_toast" />
</template>

<script>
import { BASE_URL } from '@/constants.js'
import axios from 'axios';
import ToastComponent from '@/components/ToastComponent.vue';
import { ref, onMounted } from 'vue';
export default {
	components: {
  		ToastComponent,
  	},
	setup() {
		const information = ref({});
		const notice_message = ref('');
		const notice_toast = ref(null);

		onMounted(() => {
			loadDashboardInformation();
		});

		const loadDashboardInformation = () => {
			const token = localStorage.getItem('tapasya_admin_token');
			axios.get(BASE_URL+'admin/dashboard', {
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
/* Add your styles here */
</style>
