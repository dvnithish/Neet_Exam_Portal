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
				<li class="breadcrumb-item">
					<router-link to="/report/daily-test-series">Daily Test Series Report</router-link>
				</li>
				<li class="breadcrumb-item active" aria-current="page">Ranking</li>
			</ol>
		</nav>
		<div>
			<router-link class="btn btn-primary me-2" to="/report/daily-test-series">
				<i class="fas fa-arrow-left me-2"></i> Back
			</router-link>
			<router-link class="btn btn-secondary" :to ="`/report/daily-test-series/ranking/print/${daily_test_series_id}`">
				<i class="fas fa-file-pdf"></i> Print
			</router-link>
		</div>
	</div>
	<div class="row">
		<!-- Test Series Report Table -->
		<div class="col-md-12 mt-2">
			<div class="card h-100">
				<div class="card-header">
					<h6>Daily Test Series Report</h6>
				</div>
				<div class="card-body">            
					<div class="row">
						<div class="col-sm-12">
							<div class="ck-content" >
								<table class="table table-bordered table-striped">
									<thead class="table-secondary">
										<tr>
											<th class="text-center">Ranking</th>
											<th>Student</th> 
											<th>Contact</th> 
											<th>Score</th>                                  
										</tr>
									</thead>
                                    <tbody>
                                        <tr v-for="(student, index) in students" :key="index">
                                            <td class="text-center">{{ index+1 }}</td>
                                            <td>{{ student.student.first_name }} {{ student.student.last_name }}</td>
                                            <td>
                                                <p>Phone: {{ student.student.phone_no }}</p>
                                                <p>Email: {{ student.student.email }}</p>
                                            </td>
                                            <td>{{ student.score }}</td>
                                        </tr>
                                    </tbody>
								</table>
							</div>
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
import { BASE_URL } from '@/constants.js';
import { ref, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';

export default {
	components: {
		ToastComponent,
	},
	setup() {
        const route = useRoute();
		const students = ref([]);
		const daily_test_series_id = route.params.id;
		const notice_message = ref('');
		const notice_toast = ref(null);

		onMounted(() => {
			loadRankings();
		});

		const loadRankings = () => {
			students.value = []; 
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(BASE_URL+`admin/reports/daily-test-series/ranking/${route.params.id}`, {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				},
			})
			.then((response) => {
				students.value = response.data;
			})
			.catch((error) => {
				notice_message.value = "Something went wrong";
				notice_toast.value.show();
			});
		}

		return {
			daily_test_series_id,
			students,
			limit:5,
			notice_message,
			notice_toast,
		}
	}
};
</script>

  