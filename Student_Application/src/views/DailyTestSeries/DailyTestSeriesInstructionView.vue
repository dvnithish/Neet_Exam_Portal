<template>
    <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item "><a href="#">Home</a></li>
                <li class="breadcrumb-item " aria-current="page">
                    <router-link to="/daily-test-series">Daily Test Series</router-link>
                </li>
                <li class="breadcrumb-item active">Instructions</li>
            </ol>
        </nav>        
    </div>
	<div id="main-wrapper" class="container">
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h5>Daily Test Series / Instructions</h5>
                    <router-link class="btn btn-primary" to="/daily-test-series">
                        <svg class="icon icon-lg">
                            <use xlink:href="../../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-list"></use>
                        </svg>
                        Daily Test Series
                    </router-link>
                </div>
            </div>
            <div class="card-body">
                <h3 class="text-center mb-5">{{ dailyTestSeries.name }}</h3>
                <div class="d-flex justify-content-center">
                    <ul>
                        <li>Total {{ totalQuestionCount }} questions</li>
                        <li>Duration {{ totalQuestionCount }} min</li>
                        <li>Correct Answer 4 marks</li>
                        <li>Wrong Answer -1 marks</li>
                        <li>No Answer 0 marks</li>
                        <li>Read and follow the instructions</li>
                        <li>No Cheating</li>
                    </ul>
                </div>
            </div>
            <div class="card-footer">
                <div class="text-center">
                    <button class="btn btn-success me-3" @click="startDailyTestSeries()">START</button>
                    <router-link class="btn btn-danger" to="/daily-test-series">BACK</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { BASE_URL } from '@/constants.js'

export default {
    components: {

    },
    setup() {    
        const dailyTestSeries = ref({});
        const totalQuestionCount = ref(0);
		const router = useRouter();
        const route = useRoute();
		const notice_message = ref('');
		const notice_toast = ref(null);

        onMounted(() => {
            getDailyTestSeriesInfoData();
		});

        const getDailyTestSeriesInfoData = async () => {
            const tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
			axios.get(BASE_URL+`student/daily-test-series/custom/info/${route.params.id}`, {
				headers: { Authorization: `Bearer ${tapasyaStudentToken}` }
			})
			.then(function(response) {
                dailyTestSeries.value = response.data;                
                const syllabusString = dailyTestSeries.value.syllabus;
                const syllabusArray = JSON.parse(syllabusString);
                totalQuestionCount.value = syllabusArray.reduce((sum, item) => sum + parseInt(item.count), 0);                                
			})
			.catch(function(error) {
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			});
        }

        const startDailyTestSeries = async () => {
            router.push({ path: `/daily-test-series/attend/${route.params.id}` })
        }

        return {
            dailyTestSeries,
            totalQuestionCount,
            startDailyTestSeries
        }
    }
}
</script>