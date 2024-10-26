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
				<li class="breadcrumb-item active" aria-current="page">Show</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/report/daily-test-series">
			<i class="fas fa-arrow-left me-2"></i> Back
		</router-link>
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
											<th>#</th>
											<th>Questions</th> 
											<th>Analytics</th>                                  
										</tr>
									</thead>
									<tbody>
										<tr v-for="(question, index) in questions.data">
											<td>{{  questions.from + index  }}</td>
											<td>
												<div id="question" class="d-flex mb-3">
													<div class="overflow-auto" v-html="question.question.content"></div>
												</div>
												<hr>
												<div id="choices" class="mb-3">
													<div class="row">
														<div class="col-6 mb-3" v-for="(choice, choiceIndex) in question.question.choices">
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
												<QuestionAnalyticsChart :question_id="question.question.id" :total_correct_attempts="question.correct_attempts" :total_wrong_attempts="question.wrong_attempts" :total_not_attempted="question.not_attempted" />
											</td>                                 
										</tr>
									</tbody>
								</table>
							</div>                   
							<!-- Pagination Component -->                        
							<div class="d-flex justify-content-center">
								<Bootstrap5Pagination :data="questions" :limit="limit" @pagination-change-page="showDailyTestSeries" />
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
import QuestionAnalyticsChart from '../../../components/QuestionAnalyticsChart.vue';
import { BASE_URL } from '@/constants.js';
import { ref, onMounted } from 'vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { useRouter,useRoute } from 'vue-router';

export default {
	components: {
		ToastComponent,
		Bootstrap5Pagination,
		QuestionAnalyticsChart,
	},
	setup() {
		const route = useRoute();
		const questions = ref({ data: []});
		const notice_message = ref('');
		const notice_toast = ref(null);

		onMounted(() => {
			showDailyTestSeries();
		});

		const showDailyTestSeries = (page = 1) => {
			questions.value = { data: [] }; 
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(BASE_URL+`admin/reports/daily-test-series/show/${route.params.id}?page=${page}`, {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				},
			})
			.then((response) => {
				questions.value = response.data.dailyTestSeriesQuestions;
			})
			.catch((error) => {
				notice_message.value = "Something went wrong";
				notice_toast.value.show();
			});
		}

		return {
			questions,
			showDailyTestSeries,
			limit:5,
			notice_message,
			notice_toast,
		}
	}
};
</script>

  