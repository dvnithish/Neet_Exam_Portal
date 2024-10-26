<template>
    <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Question Bank</li>
            </ol>
        </nav>
        <router-link class="btn btn-primary" to="/question-bank">
              <i class="fas fa-book me-2"></i> All Questions
        </router-link>
    </div>
    <div class="card">
        <div class="card-header">
            <h6>Add New Question</h6>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-sm-3">
                    <label for="">Grade</label>
                    <select name="" id="" class="form-control" :class="{'is-invalid': errors['question.grade']}" v-model="grade" @change="loadChapters()">
                        <option value="">Select Grade</option>
                        <option :value="grade.id" v-for="(grade, index) in grades">{{ grade.name }}</option>
                    </select>
                    <div  v-if="errors['question.grade']" class="invalid-feedback">{{ errors['question.grade'][0] }}</div>
                </div>
                <div class="col-sm-3">
                    <label for="">Subject</label>
                    <select name="" id="" class="form-control" :class="{'is-invalid': errors['question.subject']}" v-model="subject" @change="loadChapters()">
                        <option value="">Select Subject</option>
                        <option :value="subject.id" v-for="(subject, index) in subjects">{{ subject.name }}</option>
                    </select>
                    <div v-if="errors['question.subject']" class="invalid-feedback">{{ errors['question.subject'][0] }}</div>
                </div>
                <div class="col-sm-3">
                    <label for="">Chapter</label>
                    <select name="" id="" class="form-control" :class="{'is-invalid': errors['question.chapter']}" v-model="chapter">
                        <option value="">Select Chapter</option>
                        <option :value="chapter.id" v-for="(chapter, index) in chapters">{{ chapter.name }}</option>
                    </select>
                    <div v-if="errors['question.chapter']" class="invalid-feedback">{{ errors['question.chapter'][0] }}</div>
                </div>
                <div class="col-sm-3">
                    <label for="">Difficulty Level</label>
                    <select name="" id="" class="form-control" :class="{'is-invalid': errors['question.difficulty_level']}" v-model="difficultyLevel">
                        <option value="">Select Difficulty Level</option>
                        <option :value="difficultyLevel.master_value" v-for="(difficultyLevel, index) in difficultyLevels">{{ difficultyLevel.master_value }}</option>
                    </select>
                    <div v-if="errors['question.difficulty_level']" class="invalid-feedback">{{ errors['question.difficulty_level'][0] }}</div>
                </div>
            </div>

            <!-- Question -->
            <section class="mb-3">
                <div class="row">
                    <div class="col-12">
                        <label for="">Enter Question</label>
                        <div :class="{'is-invalid': errors['question.content']}">
                            <ckeditor 
                                v-model="questionData" 
                                :editor="questionEditor" 
                                :config="questionConfig" />
                            </div>
                            <div class="text-danger" v-if="errors['question.content']">{{ errors['question.content'][0] }}</div>
                    </div>
                </div>
            </section>

            <!-- Choices -->
            <section class="mb-3">
                <div class="row mb-3">
                    <div class="col-sm-9">
                        <label for="">Enter Choice</label>
                        <ckeditor 
                            v-model="choiceData" 
                            :editor="choiceEditor" 
                            :config="choiceConfig" />
                    </div>
                    <div class="col-sm-2">
                        <label for="">Is Correct?</label>
                        <select name="" id="" class="form-control" v-model="isCorrectChoice">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                    <div class="col-sm-1 text-center">
                        <p class="mb-4"></p>
                        <button class="btn btn-primary" :class="{'d-none': mode.choice.hideStore}" @click="storeChoice()">
                            <span class="fa fa-plus"></span>
                        </button>
                        <div :class="{'d-none': mode.choice.hideUpdate}">
                            <button class="btn btn-warning text-light m-1" @click="updateChoice()">
                                <span class="fa fa-pencil"></span>
                            </button>
                            <button class="btn btn-danger text-light m-1" @click="resetChoice()">
                                <span class="fa fa-undo"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="ck-content" >
                    <table class="table table-bordered table-striped table-sm">
                        <tbody>
                            <tr v-for="(choice,index) in choices">
                                <td>{{ index + 1 }}</td>
                                <td v-html="choice.content"></td>
                                <td>{{ choice.is_correct == 1 ? 'Yes' : 'No' }}</td>
                                <td class="text-center">
                                    <button class="btn btn-primary" @click="editChoice(index)">
                                        <span class="fa fa-edit"></span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Solution -->
            <section class="mb-3">
                <div class="row mb-3">
                    <div class="col-sm-9">
                        <label for="">Enter Solution</label>
                        <ckeditor 
                            v-model="solutionData" 
                            :editor="solutionEditor" 
                            :config="solutionConfig" />
                        <div class="text-danger" v-if="errors['solution.content']">{{ errors['solution.content'][0] }}</div>
                    </div>
                    <div class="col-sm-3">
                        <label for="">Video URL</label>
                        <input type="text" class="form-control" placeholder="www.example.com/video" :class="{'is-invalid': errors['solution.video']}" v-model="solutionVideo" />
                        <div v-if="errors['solution.video']" class="invalid-feedback">{{ errors['solution.video'][0] }}</div>
                    </div>
                </div>
            </section>
        </div>
        <div class="card-footer text-center">
            <button class="btn btn-primary me-2" @click="storeQuestionBank()">Submit</button>
            <router-link to="/question-bank" class="btn btn-danger text-light">Discard</router-link>
        </div>
    </div>
    <ToastComponent :message="notice_message" ref="notice_toast" />
    <LoadingComponent ref="loading_modal" />
</template>

<script>
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Image,
  ImageResizeEditing,
  ImageResizeHandles,
  ImageUpload,
  ImageToolbar,
  ImageStyle,
  SimpleUploadAdapter,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import MathType from '@wiris/mathtype-ckeditor5/dist/index.js';
import axios from 'axios';
import ToastComponent from '@/components/ToastComponent.vue';
import LoadingComponent from '../../components/LoadingComponent.vue';
import { ref, onMounted, nextTick } from 'vue';
import { BASE_URL } from '@/constants.js'
export default {
    components: {
        ToastComponent,
        LoadingComponent,
    },
    setup() {
        const mode = ref({
            choice: {
                hideStore: false,
                hideUpdate: true
            }
        });
        const errors = ref({});
        const grades = ref([]);
        const subjects = ref([]);
        const chapters = ref([]);
        const difficultyLevels = ref([]);
        const grade = ref('');
        const subject = ref('');
        const chapter = ref('');
        const difficultyLevel = ref('');
        const loading_modal = ref(null);
        // question editor
        const questionData = ref('');
        const questionEditor = ClassicEditor;
        const questionConfig = {
            plugins: [ Bold, Essentials, Italic, Mention, Paragraph, Undo, MathType,Image,ImageResizeEditing,ImageResizeHandles,ImageUpload,ImageToolbar,ImageStyle,SimpleUploadAdapter],
            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'MathType', 'ChemType', 'imageUpload', 'toggleImageCaption', 'ckboxImageEdit'],
            image: {
                toolbar: ['imageTextAlternative','imageStyle:alignLeft','imageStyle:alignCenter','imageStyle:alignRight'],
                styles: ['alignLeft','alignCenter','alignRight']
            },
            simpleUpload: {
                uploadUrl: BASE_URL+'admin/question-bank/custom/upload-image',
                withCredentials: false,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("tapasya_admin_token"),
                }
            }
        }
        // choice editor
        const choiceData = ref('');
        const choiceEditor = ClassicEditor;
        const choiceConfig = {
            plugins: [ Bold, Essentials, Italic, Mention, Paragraph, Undo, MathType,Image,ImageResizeEditing,ImageResizeHandles,ImageUpload,ImageToolbar,ImageStyle,SimpleUploadAdapter],
            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'MathType', 'ChemType', 'imageUpload', 'toggleImageCaption', 'ckboxImageEdit'],
            image: {
                toolbar: ['imageTextAlternative','imageStyle:alignLeft','imageStyle:alignCenter','imageStyle:alignRight'],
                styles: ['alignLeft','alignCenter','alignRight']
            },
            simpleUpload: {
                uploadUrl: BASE_URL+'admin/question-bank/custom/upload-image',
                withCredentials: false,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("tapasya_admin_token"),
                }
            }
        }
        const isCorrectChoice = ref('0');
        const choices = ref([]);
        const choiceIndex = ref(null);
        // solution editor
        const solutionData = ref('');
        const solutionEditor = ClassicEditor;
        const solutionConfig = {
            plugins: [ Bold, Essentials, Italic, Mention, Paragraph, Undo, MathType,Image,ImageResizeEditing,ImageResizeHandles,ImageUpload,ImageToolbar,ImageStyle,SimpleUploadAdapter],
            toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'MathType', 'ChemType', 'imageUpload', 'toggleImageCaption', 'ckboxImageEdit'],
            image: {
                toolbar: ['imageTextAlternative','imageStyle:alignLeft','imageStyle:alignCenter','imageStyle:alignRight'],
                styles: ['alignLeft','alignCenter','alignRight']
            },
            simpleUpload: {
                uploadUrl: BASE_URL+'admin/question-bank/custom/upload-image',
                withCredentials: false,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("tapasya_admin_token"),
                }
            }
        }
        const solutionVideo = ref('');
        const notice_message = ref('');
		const notice_toast = ref(null);

        onMounted(() => {
            loadAllGrades();
        });

        /** Question */
        const loadAllGrades = () => {
            grades.value = [];
            var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
            axios.get(BASE_URL+'admin/configure/grade', {
                headers: {
                    Authorization: 'Bearer ' + tapasyaAdminToken
                }
            })
            .then(function(response) {
                grades.value = response.data;
                loadAllSubjects();
            })
            .catch(function(error) {
                notice_message.value = 'Something went wrong';
				notice_toast.value.show();
            });
        }

        const loadAllSubjects = () => {
            subjects.value = [];
            var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
            axios.get(BASE_URL+'admin/configure/subject', {
                headers: {
                    Authorization: 'Bearer ' + tapasyaAdminToken
                }
            })
            .then(function(response) {
                subjects.value = response.data;
                loadAllDifficultyLevels();
            })
            .catch(function(error) {
                notice_message.value = 'Something went wrong';
				notice_toast.value.show();
            });
        }

        const loadAllDifficultyLevels = () => {
            difficultyLevels.value = [];
            var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
            axios.get(BASE_URL+'admin/configure/master/custom/get-all-difficulty-levels', {
                headers: {
                    Authorization: 'Bearer ' + tapasyaAdminToken
                }
            })
            .then(function(response) {
                difficultyLevels.value = response.data;
            })
            .catch(function(error) {
                notice_message.value = 'Something went wrong';
				notice_toast.value.show();
            });
        }

        const loadChapters = () => {
            chapters.value = [];
            if(grade.value && subject.value) {
                var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
                axios.post(BASE_URL+'admin/configure/chapter/custom/search-by-grade-and-subject', {
                    grade_id: grade.value,
                    subject_id: subject.value
                }, {
                    headers: {
                        Authorization: 'Bearer ' + tapasyaAdminToken
                    } 
                })
                .then(function(response) {
                    chapters.value = response.data;
                })
                .catch(function(error) {
                    notice_message.value = 'Something went wrong';
                    notice_toast.value.show();
                })
            }
        }

        /** Choice */
        const storeChoice = () => {
            // only 4 choices
            if(choices.value.length >= 4) {
                notice_message.value = 'Cannot add more than 4 choices';
                notice_toast.value.show();
                return;
            }
            // only 1 is_correct
            const isCorrectCount = choices.value.filter(choice => choice.is_correct == 1).length;
            if(isCorrectCount >= 1 && isCorrectChoice.value == 1) {
                notice_message.value = 'Only 1 choice can be correct';
                notice_toast.value.show();
                return;
            }
            // atleast 1 is_correct
            if(choices.value.length == 3 && isCorrectCount <= 0 && isCorrectChoice.value == 0) {
                notice_message.value = 'Atleast 1 choice must be correct';
                notice_toast.value.show();
                return;
            }
            // empty content not allowed
            if(choiceData.value == '' || choiceData.value == null || choiceData.value == undefined) {
                notice_message.value = 'Choice content cannot be empty';
                notice_toast.value.show();
                return;
            }
            // add to choices
            var content = choiceData.value;
            var is_correct = isCorrectChoice.value;
            choices.value.push({
                content,
                is_correct
            });
            resetChoice();
        }

        const editChoice = (index) => {
            mode.value.choice.hideStore = true;
            mode.value.choice.hideUpdate = false;
            choiceData.value = choices.value[index].content;
            isCorrectChoice.value = choices.value[index].is_correct;
            choiceIndex.value = index;
        }

        const updateChoice = () => {
            // empty content not allowed
            if(choiceData.value == '' || choiceData.value == null || choiceData.value == undefined) {
                notice_message.value = 'Choice content cannot be empty';
                notice_toast.value.show();
                return;
            }
            if(choices.value[choiceIndex.value].is_correct == 1 && isCorrectChoice.value == 1) {
                // 1 to 1
                choices.value[choiceIndex.value].content = choiceData.value;
            } else if(choices.value[choiceIndex.value].is_correct == 1 && isCorrectChoice.value == 0) {
                // 1 to 0
                notice_message.value = 'Atleast 1 choice must be correct';
                notice_toast.value.show();
                return;
            } else if(choices.value[choiceIndex.value].is_correct == 0 && isCorrectChoice.value == 1) {
                // 0 to 1
                const currentIsCorrectIndex = choices.value.findIndex(choice => choice.is_correct == 1);
                if(currentIsCorrectIndex > -1) {
                    choices.value[currentIsCorrectIndex].is_correct = 0;
                }
                choices.value[choiceIndex.value].content = choiceData.value;
                choices.value[choiceIndex.value].is_correct = isCorrectChoice.value;
            } else {
                // 0 to 0
                choices.value[choiceIndex.value].content = choiceData.value;
            }    
            resetChoice();
        }

        const resetChoice = () => {
            mode.value.choice.hideStore = false;
            mode.value.choice.hideUpdate = true;
            choiceIndex.value = null;
            choiceData.value = '';
            isCorrectChoice.value = 0;
        }

        /** submit fn */
        const storeQuestionBank = () => {
            if(choices.value.length < 4) {
                notice_message.value = 'Atleast 4 choices are required';
				notice_toast.value.show();
                return;
            }
            var data = {
                question: {
                    content: questionData.value,
                    grade: grade.value,
                    subject: subject.value,
                    chapter: chapter.value,
                    difficulty_level: difficultyLevel.value,
                },
                choices: choices.value,
                solution: {
                    content: solutionData.value,
                    video: solutionVideo.value,
                }
            }
            loading_modal.value.show();
            var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
            axios.post(BASE_URL + 'admin/question-bank', data, {
                headers: {
                    Authorization: 'Bearer ' + tapasyaAdminToken
                },
            })
            .then(function (response) {
                grade.value = '',
                    subject.value = '',
                    chapter.value = '',
                    difficultyLevel.value = '',
                    questionData.value = '';
                choices.value = [];
                resetChoice();
                errors.value = {};
                solutionData.value = '';
                solutionVideo.value = '';
                notice_message.value = response.data.message;             
                notice_toast.value.show();
            })
            .catch(function (error) {
                if (error.response.status == 422) {
                    errors.value = error.response.data.errors;
                    nextTick(() => {
                        scrollToFirstError();
                    });                    
                } else {
                    notice_message.value = 'Something went wrong';
                    notice_toast.value.show();  
                }
            })
            .finally(() => { 
                loading_modal.value.hide();
            });
        }
        const scrollToFirstError = () => {
            const firstErrorElement = document.querySelector('.is-invalid');                       
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        };

        return {
            // var
            mode,
            errors,
            grades,
            subjects,
            chapters,
            difficultyLevels,
            grade,
            subject,
            chapter,
            difficultyLevel,
            questionData,
            questionEditor,
            questionConfig,
            choiceData,
            choiceEditor,
            choiceConfig,
            isCorrectChoice,
            choices,
            solutionData,
            solutionEditor,
            solutionConfig,
            solutionVideo,
            // fn
            loadChapters,
            storeChoice,
            editChoice,
            updateChoice,
            resetChoice,
            storeQuestionBank,
            // others
            notice_message,
  			notice_toast,
            loading_modal,
        }
    }
}
</script>

<style>
    label {
        font-weight: bold;
    }
</style>