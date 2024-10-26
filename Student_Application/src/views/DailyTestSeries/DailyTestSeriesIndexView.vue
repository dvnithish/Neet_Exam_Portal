<template>
    <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item "><a href="#">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Daily Test Series</li>
            </ol>
        </nav>        
    </div>
    <div id="main-wrapper" class="container">
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h5>Daily Test Series</h5>
                </div>
            </div>
            <div class="card-body">
                <div v-if="dailyTestSeries.data" class="row">
                    <div class="col-sm-4" v-for="(dailyTestSeriesItem, index) in dailyTestSeries.data" :key="dailyTestSeriesItem.id">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h3 class="text-center">{{ dailyTestSeriesItem.name }}</h3>
                            </div>
                            <div class="card-body">
                                <h6 class="text-center">Date: {{ convertDateFormat(dailyTestSeriesItem.exam_date) }}</h6>
                                <h6 class="text-center">Total Questions: {{ totalQuestionCount }}</h6>
                                <h6 class="text-center">Total Marks: {{ totalQuestionCount * 4 }}</h6>
                            </div>
                            <div class="card-footer text-center">
                                <button v-if="checkTestStatus(dailyTestSeriesItem).locked" class="btn btn-secondary"><i class="fa fa-lock text-light"></i> Unlocks @ {{ convertTimeTo12HourFormat(dailyTestSeriesItem.exam_time) }}</button>
                                <button v-if="checkTestStatus(dailyTestSeriesItem).take" @click="gotoDailyTestSeriesInstructionView(dailyTestSeriesItem.id)" class="btn btn-success me-2">Take Test</button>
                                <button v-if="checkTestStatus(dailyTestSeriesItem).continue" @click="gotoDailyTestSeriesAttendView(dailyTestSeriesItem.id)" class="btn btn-primary me-2">Continue Test</button>
                                <div v-if="checkTestStatus(dailyTestSeriesItem).show">
                                    <button @click="gotoDailyTestSeriesShowView(dailyTestSeriesItem.id)" class="btn btn-secondary me-2">Show Test</button>
                                    <button @click="gotoDailyTestSeriesResultView(dailyTestSeriesItem.id)" class="btn btn-success me-2">Show Result</button>
                                </div>
                                <button v-if="checkTestStatus(dailyTestSeriesItem).finish" @click="gotoDailyTestSeriesResultView(dailyTestSeriesItem.id)" class="btn btn-danger me-2">Finish Test</button>
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
                <div class="d-flex justify-content-center">
                    <Bootstrap5Pagination :data="dailyTestSeries" @pagination-change-page="getDailyTestSeriesDataPaginate" />
                </div>
            </div>
        </div>
    </div>
    <ToastComponent :message="notice_message" ref="notice_toast" />
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/User';
import ToastComponent from '@/components/ToastComponent.vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { BASE_URL } from '@/constants.js'

export default {
    components: {
        ToastComponent,
        Bootstrap5Pagination
    },
    setup() {
        const userStore = useUserStore();
        const dailyTestSeries = ref({});
        const totalQuestionCount = ref(0);
		const router = useRouter();
		const notice_message = ref('');
		const notice_toast = ref(null);

        onMounted(() => {
            getDailyTestSeriesDataPaginate();
		});

        const getDailyTestSeriesDataPaginate = async (page = 1) => {
            dailyTestSeries.value = {};
            const tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
			axios.get(BASE_URL+`student/daily-test-series?page=${page}`, {
				headers: { Authorization: `Bearer ${tapasyaStudentToken}` }
			})
			.then(function(response) {
                dailyTestSeries.value = response.data;
                if(dailyTestSeries.value.data.length > 0) {
                    const syllabusString = dailyTestSeries.value.data[0].syllabus;
                    const syllabusArray = JSON.parse(syllabusString);
                    totalQuestionCount.value = syllabusArray.reduce((sum, item) => sum + parseInt(item.count), 0);                                   
                }
			})
			.catch(function(error) {
                dailyTestSeries.value.data = [];
				notice_message.value = 'Something went wrong';
				notice_toast.value.show();
			});
		}

        const convertDateFormat = (dateString) => {
			const [year, month, day] = dateString.split('-');
			const formattedDate = `${day}-${month}-${year}`;
			return formattedDate;
        }

        const checkTestStatus = (dailyTestSeriesItem) => {
            var status = {
                locked:true,
                take: false,
                continue: false,
                finish: false,
                show: false,
           };

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayFormatted = `${year}-${month}-${day}`;
            const hours = String(today.getHours()).padStart(2, '0');
            const minutes = String(today.getMinutes()).padStart(2, '0');
            const seconds = String(today.getSeconds()).padStart(2, '0');
            const currentTime = `${hours}:${minutes}:${seconds}`; 

            if (currentTime >= dailyTestSeriesItem.exam_time) {
                status.locked = false;
            }
            if (!status.locked && !dailyTestSeriesItem.daily_test_series_student && dailyTestSeriesItem.exam_date == todayFormatted) {
                // take = student dont exist AND exam_date is today
                status.take = true;
            } else if (
                !status.locked && 
                dailyTestSeriesItem.daily_test_series_student && 
                dailyTestSeriesItem.daily_test_series_student.is_finished == 0 && 
                new Date(dailyTestSeriesItem.daily_test_series_student.end) >  new Date()
            ) {
                // continue =  student exists AND is_finised = 0 AND end time greater than current time
                status.continue = true;
            } else if (
                !status.locked && 
                dailyTestSeriesItem.daily_test_series_student && 
                dailyTestSeriesItem.daily_test_series_student.is_finished == 0 && 
                new Date(dailyTestSeriesItem.daily_test_series_student.end) <  new Date()
            ) {
                // finish = student exists AND is_finised = 0 AND end time lesser than current time
                status.finish = true;
            } else if(!status.locked) {
                // show = else condition 
                status.show = true;
            }

           return status
        }

        function convertTimeTo12HourFormat(timeString) {			
			const [hours, minutes, seconds] = timeString.split(':').map(Number);
			const period = hours >= 12 ? 'PM' : 'AM';
			const hourIn12 = hours % 12 || 12; 
			return `${hourIn12}:${String(minutes).padStart(2, '0')} ${period}`;
		}

        const gotoDailyTestSeriesInstructionView = async (id) => {
			router.push({ path: `/daily-test-series/instruction/${id}` })
		}

        const gotoDailyTestSeriesAttendView = async (id) => {
			router.push({ path: `/daily-test-series/attend/${id}` })
		}

        const gotoDailyTestSeriesResultView = (id) => {
            router.push({ path: `/daily-test-series/result/${id}` })
        }

        const gotoDailyTestSeriesShowView = (id) => {
            router.push({ path: `/daily-test-series/show/${id}` })
        }

        return {
            dailyTestSeries,
            totalQuestionCount,
			notice_message,
  			notice_toast,
            getDailyTestSeriesDataPaginate,
            convertDateFormat,
            convertTimeTo12HourFormat,
            checkTestStatus,
            gotoDailyTestSeriesInstructionView,
            gotoDailyTestSeriesAttendView,
            gotoDailyTestSeriesResultView,
            gotoDailyTestSeriesShowView,
		}
    }
}
</script>

<style>
    .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .loader span {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 4px solid #3498db;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
    }
    .loading-text {
        margin-top: 10px;
        font-size: 16px;
        color: #333;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>