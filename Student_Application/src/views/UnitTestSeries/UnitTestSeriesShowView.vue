<template>
    <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item "><a href="#">Home</a></li>
            <li class="breadcrumb-item " aria-current="page">
                <router-link to="/unit-test-series">Unit Test Series</router-link>
            </li>
            <li class="breadcrumb-item active">Show Test</li>
        </ol>
        </nav>        
    </div>
	<div id="main-wrapper" class="container">
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h5>Unit Test Series / {{ status }}</h5>
                    <router-link class="btn btn-primary" to="/unit-test-series">
                        <svg class="icon icon-lg">
                            <use xlink:href="../../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-list"></use>
                        </svg>
                        Unit Test Series
                    </router-link>
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
                                        <input type="radio" name="choice" :checked="choice.is_correct" @click.prevent=""> {{ index + 1 }}.&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <div class="flex-fill">
                                        <div class="ck-content overflow-auto" v-html="choice.content"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-danger me-3" @click="prevQuestion()" :disabled="questionId === 0">Prev</button>
                        <button class="btn btn-success" @click="nextQuestion()" :disabled="questionId === questions.length - 1">Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ToastComponent :message="notice_message" ref="notice_toast" />
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/User';
import ToastComponent from '@/components/ToastComponent.vue';
import { BASE_URL } from '@/constants.js';

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
		const status = ref('');
		const unitTestSeries = ref({});
		const unitTestSeriesStudent = ref({});
		const questions = ref(null);
		const questionId = ref(0);

        onMounted(() => {
            showTest();
		});

        const showTest = async () => {
            var tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
            axios.get(BASE_URL+`student/unit-test-series/${route.params.id}`, {
                headers: { Authorization: `Bearer ${tapasyaStudentToken}` }
            })
            .then(function(response) {
                status.value = response.data.status;
                unitTestSeries.value = response.data.unitTestSeries;
                unitTestSeriesStudent.value = response.data.unitTestSeriesStudent;
                questions.value = response.data.questions;
            })
            .catch(function(error) {
                notice_message.value = 'Something went wrong';
                notice_toast.value.show();
            });
        }

        const prevQuestion = () => {
            if(questionId.value > 0)
                --questionId.value;
        }

        const nextQuestion = () => {
            if(questionId.value < (questions.value.length - 1))
                ++questionId.value;
        }

        return {
            status,
            unitTestSeries,
            unitTestSeriesStudent,
            questions,
            questionId,
            prevQuestion,
            nextQuestion,
            notice_message,
            notice_toast,
        }
    }
}
</script>