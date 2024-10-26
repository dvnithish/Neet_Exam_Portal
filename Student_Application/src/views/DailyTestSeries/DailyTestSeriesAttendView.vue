<template>
	<div id="main-wrapper" class="container">
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h5>Daily Test Series / {{ status }}</h5>
                    <div>
                        <h5 class="d-inline my-0 me-5">{{ remainingTime }}</h5>
                        <!-- <button class="btn btn-success" @click="finishTest()">Finish Test</button> -->
                        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#finishTest">
                            Finish Test
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div v-if="questions">
                    <div id="question" class="d-flex mb-3">
                        <div class="flex-shrink-1">Q{{ questionId + 1 }}.&nbsp;&nbsp;&nbsp;</div>
                        <div class="flex-fill">
                            <div class="ck-content overflow-auto" v-html="questions[questionId].content"></div>
                        </div>
                    </div>
                    <div id="choices" class="mb-3">
                        <div class="row">
                            <div class="col-6 mb-3" v-for="(choice, index) in questions[questionId].choices">
                                <div class="d-flex">
                                    <div class="flex-shrink-1">
                                        <input type="radio" name="choice" :checked="checkIfChoiceSelected(choice)" @click="selectChoice(questions[questionId].id, choice.id)"> {{ index + 1 }}.&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <div class="flex-fill">
                                        <div class="ck-content overflow-auto" v-html="choice.content"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isChoiceUploaded" class="text-center">                    
                    <button class="btn btn-danger me-3" @click="prevQuestion()" :disabled="questionId === 0">Prev</button>
                    <button class="btn btn-success" @click="nextQuestion()" :disabled="questionId === totalQuestions - 1">Next</button>
                </div>
                <div v-if="!isChoiceUploaded" class="text-center">
                    <button class="btn btn-danger me-3" disabled>Prev</button>
                    <button class="btn btn-success" disabled>Next</button>
                </div>
            </div>
        </div>
        <!--Modal to finish-->
        <div class="modal fade" id="finishTest" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="finishTestLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="finishTestLabel">Are you sure!!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div v-if="totalQuestions - answeredQuestions" class="modal-body">
                    <p>You have {{ totalQuestions - answeredQuestions }} questions unanswered.</p>
                    <p>You're almost there! Keep going and answer the remaining questions to finish strong!</p>
                </div>
                <div v-if="!(totalQuestions - answeredQuestions)" class="modal-body">                    
                    <p>You still have time, so take a moment to review your answers and ensure everything is perfect!</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" @click="finishTest()">Finish</button>
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
import { ref, onMounted,onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { BASE_URL } from '@/constants.js';

export default {
    components: {
        ToastComponent,
    },
    setup() {       
		const router = useRouter();
        const route = useRoute();
		const notice_message = ref('');
		const notice_toast = ref(null);
		const status = ref('');
		const dailyTestSeries = ref({});
		const dailyTestSeriesStudent = ref({});
		const questions = ref(null);
		const answers = ref([]);
		const questionId = ref(0);
		const isChoiceUploaded = ref(1);
        const remainingTime = ref('');
        const currentTime = ref(new Date().toLocaleTimeString());
        const intervalId = ref(null);
        const totalQuestions = ref(0);
        const answeredQuestions = ref(0);       

        onMounted(() => {
            startTest();
		});

        const startTest = async () => {
            isChoiceUploaded.value = 0;
            const tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
            axios.get(BASE_URL+`student/daily-test-series/${route.params.id}`, {
                headers: { Authorization: `Bearer ${tapasyaStudentToken}` }
            })
            .then(function(response) {
                status.value = response.data.status;
                dailyTestSeries.value = response.data.dailyTestSeries;
                dailyTestSeriesStudent.value = response.data.dailyTestSeriesStudent;
                questions.value = response.data.questions;
                totalQuestions.value = questions.value.length;
                if (dailyTestSeriesStudent.value.is_finished) {
                    router.push({ path: `/daily-test-series` });
                }
                
                if(response.data.status == 're-entry') {
                    answers.value = response.data.answers;
                    answeredQuestions.value = answers.value.length;
                }
                isChoiceUploaded.value = 1;

                intervalId.value = setInterval(updateTime, 1000);
            })
            .catch(function (error) {
                if (error.response && error.response.status == 403) {                    
                    router.push({ path: '/daily-test-series' });  
                } else {
                    notice_message.value = 'Something went wrong';
                    notice_toast.value.show(); 
                }
            });
        }

        const selectChoice = async (questionId, choiceId) => {
            isChoiceUploaded.value = 0;
            var tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
            axios.post(BASE_URL+`student/daily-test-series-student-answer`, {
                daily_test_series_id: dailyTestSeries.value.id,
                question_id: questionId,
                choice_id: choiceId,
            }, {
                headers: { Authorization: `Bearer ${tapasyaStudentToken}` }
            })
            .then(function(response) {
                answers.value = response.data.answers;
                answeredQuestions.value = answers.value.length;
                isChoiceUploaded.value = 1;
            })
            .catch(function(error) {
                notice_message.value = 'Unable to update choice; an error occurred.';
                notice_toast.value.show();
            });
        }

        const checkIfChoiceSelected = (choice) => {
            const index = answers.value.findIndex(answer => answer.choice_id === choice.id);
            if (index !== -1) {
                return true;
            } else {
                return false;
            }
        }

        const prevQuestion = () => {
            if(questionId.value > 0)
                --questionId.value;
        }

        const nextQuestion = () => {
            if(questionId.value < (questions.value.length - 1))
                ++questionId.value;
        }

        const updateTime = () => {
            currentTime.value = new Date().toLocaleTimeString();
            const targetDate = new Date(dailyTestSeriesStudent.value.end);
            const currentDate = new Date();
            if(currentDate >= targetDate) {
                finishTest();
            }
            const differenceInMilliseconds = targetDate - currentDate;
            const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
            const minutes = (Math.floor(differenceInSeconds / 60)).toString().padStart(2, '0');
            const seconds = (differenceInSeconds % 60).toString().padStart(2, '0');
            remainingTime.value = `Remining Time: ${minutes}:${seconds}`;
        }

        const finishTest = () => {
            const modalElement = document.getElementById('finishTest');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            setTimeout(() => {
                modalInstance.dispose();
                router.push({ path: `/daily-test-series/result/${route.params.id}` });
            }, 300);
        }

        onUnmounted(() => {
            if (intervalId.value) {              
                clearInterval(intervalId.value);
            }
        });
            
        return {
            status,
            questions,
            questionId,
            isChoiceUploaded,
            remainingTime,
            selectChoice,
            checkIfChoiceSelected,
            prevQuestion,
            nextQuestion,
            totalQuestions,
            answeredQuestions,
            finishTest,
            notice_message,
            notice_toast
        }
    }
}
</script>