<template>
    <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Daily Test Series</li>
                <li class="breadcrumb-item active" aria-current="page">{{ examName }}</li>
            </ol>
        </nav>
        <div>
            <router-link class="btn btn-primary me-2" to="/daily-test-series">
                  <i class="fas fa-arrow-left me-2"></i> Back
            </router-link>
            <router-link class="btn btn-secondary" :to ="`/daily-test-series/print/${daily_test_series_id}`">
                  <i class="fas fa-file-pdf me-2"></i> Print
            </router-link> 
        </div>  
    </div>
    <div class="card mb-3">
        <div class="card-header">
            <h6>All Questions</h6>
        </div>
        <div class="card-body">            
            <div class="row">
                <div class="col-12">
                    <div class="card">                    
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-4">
                                    <h5>Name : {{ examName }}</h5>
                                </div>
                                <div class="col-sm-4">
                                    <h5>Date : {{ examDate }}</h5>
                                </div>
                                <div class="col-sm-4  ">
                                    <div class="d-flex">
                                        <div class="flex-shrink-1">
                                            <h5>Syllabus :</h5>
                                        </div>
                                        <div class="flex-fill">
                                            <ul class="">
                                                <li v-for="(syllabusItem,index) in syllabus" :key="index" class="list-group-item">
                                                    <strong>{{ syllabusItem.name }} : {{ syllabusItem.count }}</strong>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="ck-content" >
                        <table class="table table-bordered table-striped">
                            <thead class="table-secondary">
                                <tr>
                                    <th>#</th>
                                    <th>Questions</th>                                   
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="questions.data.length == 0">
                                    <td colspan="3" align="center">Loading...</td>
                                </tr>
                                <tr v-for="(question, index) in questions.data">
                                    <td>{{  questions.from + index  }}</td>
                                    <td>
                                        <div id="question" class="d-flex mb-3">
                                            <div class="overflow-auto" v-html="question.content"></div>
                                        </div>
                                        <hr>
                                        <div id="choices" class="mb-3">
                                            <div class="row">
                                                <div class="col-6 mb-3" v-for="(choice, choiceIndex) in question.choices">
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
                                </tr>
                            </tbody>
                        </table>
                    </div>                   
                    <!-- Pagination Component -->                        
                    <div class="d-flex justify-content-center">
                        <Bootstrap5Pagination :data="questions" :limit="limit" @pagination-change-page="loadQuestions" />
                    </div>
                </div>
            </div>           
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import ToastComponent from '@/components/ToastComponent.vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import { ref, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import {BASE_URL} from '@/constants.js';

export default {
    components: {
        ToastComponent,
        Bootstrap5Pagination,
    },
    setup() {
        const questions = ref({ data: []});
        const router = useRouter();
        const route = useRoute();
        const examName = ref('');  
        const examDate = ref('');
        const syllabus = ref('');      
        const notice_message = ref('');
        const notice_toast = ref(null);
        const daily_test_series_id = route.params.id;

        onMounted(() => {      
            loadQuestions();                     
        });

        const loadQuestions = (page = 1) => {         
            questions.value = { data: [] };         
            var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
            axios.get(BASE_URL+`admin/daily-test-series/${route.params.id}?page=${page}`, {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				},
			})
            .then(function (response) {
                examName.value = response.data.dailyTestSeries.name;
                examDate.value = response.data.dailyTestSeries.exam_date;
                syllabus.value = response.data.dailyTestSeries.syllabus; 
                syllabus.value = JSON.parse(syllabus.value)	              
                questions.value = response.data.questions;
            })
            .catch(function(error) {
                notice_message.value = 'Something went wrong';
				notice_toast.value.show();
            });
        }  

        return {
            daily_test_series_id,
            examName,
            examDate,
            syllabus,
            questions,
            loadQuestions,
            notice_message,
            notice_toast,
            limit: 5
        }
    }
}
</script>