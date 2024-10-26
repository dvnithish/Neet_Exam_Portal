<template>
   <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item "><a href="#">Home</a></li>
                <li class="breadcrumb-item " aria-current="page">
                    <router-link to="/unit-test-series">Unit Test Series</router-link>
                </li>
                <li class="breadcrumb-item active">Instructions</li>
            </ol>
        </nav>        
    </div>
    <div id="main-wrapper" class="container">
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between">
            <h5>Unit Test Series / Instructions</h5>
            <router-link class="btn btn-primary" to="/unit-test-series">
              <svg class="icon icon-lg">
                <use xlink:href="../../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-list"></use>
              </svg> Unit Test Series
            </router-link>
          </div>
        </div>
        <div class="card-body">
          <h3 class="text-center mb-2">Instructions</h3>
          <div class="d-flex justify-content-center">
            <ul>
              <li>Total {{ no_of_question }} questions</li>
              <li>Duration {{ no_of_question }} min</li>
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
            <button class="btn btn-success me-3" @click="startUnitTestSeries()">START</button>
            <router-link class="btn btn-danger" to="/unit-test-series">BACK</router-link>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { BASE_URL } from '@/constants.js';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/User';
import ToastComponent from '@/components/ToastComponent.vue';
    export default {
      setup() {
        const route = useRoute();
        const router = useRouter();     
        const no_of_question = ref(route.query.no_of_question);
        const unitTestSeries = ref({});
        const notice_message = ref('');
        const notice_toast = ref(null);
        
        const startUnitTestSeries = async () => {
          var tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
          axios.post(BASE_URL+`student/unit-test-series`, {
            grade_id: route.query.grade_id,
            subject_id: route.query.subject_id,
            chapter_id: route.query.chapter_id,
            difficulty_level: route.query.difficulty_level,
            no_of_question: route.query.no_of_question,
          }, {
            headers: {
              Authorization: `Bearer ${tapasyaStudentToken}`
            }
          }).then(function(response) {                       
              unitTestSeries.value = response.data.unitTestSeries;                         
              if(unitTestSeries) {
                router.push({ path: `/unit-test-series/attend/${unitTestSeries.value.id}`});      
              }
          }).catch(function (error) {                         
              notice_message.value = 'Something went wrong'; 
              notice_toast.value.show();
          });
        };    
        return {          
          no_of_question,
          startUnitTestSeries
        };
      }
    };
</script>