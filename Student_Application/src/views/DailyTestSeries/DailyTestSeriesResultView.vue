<template>
     <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item "><a href="#">Home</a></li>
            <li class="breadcrumb-item " aria-current="page">
                <router-link to="/daily-test-series">Daily Test Series</router-link>
            </li>
            <li class="breadcrumb-item active">Result</li>
        </ol>
        </nav>        
    </div>
	<div id="main-wrapper" class="container">
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h5>Daily Test Series / Results</h5>
                    <router-link class="btn btn-primary" to="/daily-test-series">
                        <svg class="icon icon-lg">
                            <use xlink:href="../../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-list"></use>
                        </svg>
                        Daily Test Series
                    </router-link>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tbody>
                        <tr>
                            <td align="right" style="width: 49%;">Total Questions:</td>
                            <td align="left">{{ total_questions }}</td>
                        </tr>
                        <tr>
                            <td align="right">Correct Attempts:</td>
                            <td align="left">{{ correct_attempts }}</td>
                        </tr>
                        <tr>
                            <td align="right">Wrong Attempts:</td>
                            <td align="left">{{ wrong_attempts }}</td>
                        </tr>
                        <tr>
                            <td align="right">Not Attempted:</td>
                            <td align="left">{{ not_attempted }}</td>
                        </tr>
                        <tr>
                            <td align="right">Score:</td>
                            <td align="left">{{ result }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="col-md-4 mb-3">
                    <div class="card-body">
                        <div class="doughnut">
                            <canvas id="doughnutChart"></canvas>
                        </div>
                        <p class="text-center mt-2"></p>
                    </div>
    			</div>
            </div>
        </div>
    </div>
    <ToastComponent :message="notice_message" ref="notice_toast" />
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '@/constants.js';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/User';
import ToastComponent from '@/components/ToastComponent.vue';
import Chart from 'chart.js/auto'

export default {
    components: {
        ToastComponent
    },
    setup() {
        const userStore = useUserStore();
		const router = useRouter();
        const route = useRoute();
		const notice_message = ref('');
		const notice_toast = ref(null);		
        const total_questions = ref(0);
		const correct_attempts = ref(0);
		const wrong_attempts = ref(0);
		const not_attempted = ref(0);
		const result = ref(0);

        onMounted(() => {
            finishTest();
		});

        const finishTest = async () => {
            const tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
			axios.get(BASE_URL+`student/daily-test-series/custom/finish/${route.params.id}`, {
				headers: { Authorization: `Bearer ${tapasyaStudentToken}` }
			})
			.then(function(response) {
				total_questions.value = response.data.total_questions;
				correct_attempts.value = response.data.correct_attempts;
				wrong_attempts.value = response.data.wrong_attempts;
				not_attempted.value = response.data.not_attempted;
                result.value = response.data.result;
                renderDoughnutChart();
			})
			.catch(function(error) {                
				notice_message.value = error.response.data.message ?? 'Someting went wrong';
				notice_toast.value.show();
			});
        }

        const renderDoughnutChart = () => {
			const ctx = document.getElementById('doughnutChart').getContext('2d');
			new Chart(ctx, {
				type: 'doughnut',
				data: {
                    labels: [
                        `Correct: ${correct_attempts.value}`,
                        `Wrong: ${wrong_attempts.value}`,
                        `Not Attended: ${not_attempted.value}`
                    ],
					datasets: [{
						data: [correct_attempts.value, wrong_attempts.value, not_attempted.value],
						backgroundColor: ['#28a745', '#fd7e14', '#007bff'],
						hoverBackgroundColor: ['#1e7e34', '#e96e00', '#0056b3'],
					}],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: '70%',
					plugins: {
						tooltip: {
							callbacks: {
								label: function(tooltipItem) {
									return tooltipItem.label + ': ' + tooltipItem.raw;
								},
							},
						},
					},
				},
			});
		};

        return {
            total_questions,
            correct_attempts,
            wrong_attempts,
            not_attempted,
            result,
            notice_message,
            notice_toast,
        }
    }
}
</script>

<style>
    td {
        font-size: 20px;
    }
    .doughnut{
        position: relative; 
        margin-left: 270px; 
        height: 250px; 
        width: 500px;
    }
</style>