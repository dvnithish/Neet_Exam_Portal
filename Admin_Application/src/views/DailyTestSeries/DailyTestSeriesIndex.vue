<template>
	<!-- Breadcrumb Navigation -->
	<div class="d-flex justify-content-between mb-3">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a href="#">Home</a>
				</li>
				<li class="breadcrumb-item active" aria-current="page">Daily Test Series</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/daily-test-series/create">
			<i class="fas fa-plus me-2"></i> Add Test
		</router-link>
	</div>
	<div class="row">
		<!-- User List Table -->
		<div class="col-md-12">
			<div class="card h-100">
				<div class="card-header">
					<h6>Daily Test Series</h6>
				</div>
				<div class="card-body">
					<div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
						<table class="table table-bordered table-striped">
							<thead class="table-secondary ">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Name</th>
									<th scope="col">Date</th>
									<th scope="col">Time</th>
									<th scope="col">Syllabus</th>
									<th scope="col" class="text-center">Action</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(dailyTestSeries, index) in dailyTestSerieses.data">
									<td>{{ dailyTestSerieses.from + index }}</td>
									<td>{{ dailyTestSeries.name }}</td>
									<td>{{ convertDateFormat(dailyTestSeries.exam_date) }}</td>
									<td>{{ convertTimeTo12HourFormat(dailyTestSeries.exam_time) }}</td>
									<td>
										<ul>											
											<li v-for="(syllabusItem, index) in dailyTestSeries.syllabus" :key="index">								
												{{ syllabusItem.name }} : {{ syllabusItem.count }}
											</li>											
										</ul>
									</td>
									<td>
										<div class="d-flex justify-content-center">
											<div class="text-center me-2">
												<router-link class="btn btn-primary" :to="`/daily-test-series/show/${dailyTestSeries.id}`">
													<span class="fa fa-eye"></span>												
												</router-link>
											</div>
											<div class="text-center me-2" v-if="dailyTestSeries.isEditable">
												<button class="btn btn-warning text-light" @click="editDailyTestSeries(dailyTestSeries.id)">
													<span class="fa fa-edit"></span>
												</button>
											</div>
											<div class="text-center" v-if="dailyTestSeries.isDeletable">
												<button class="btn btn-danger text-light" @click="confirmDeleteDailyTestSeries(dailyTestSeries.id)">
													<span class="fa fa-trash"></span>
												</button>
											</div>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<!-- Pagination Component -->
						<div class="d-flex justify-content-center">
                        	<Bootstrap5Pagination :data="dailyTestSerieses" :limit="limit" @pagination-change-page="loadDailyTestSerieses" />
                    	</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="deleteDTS" class="modal" ref="deleteModal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Confirm Deletion</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>Are you sure you want to delete this Daily Test Series?</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-danger" @click="deleteDailyTestSeries(deleteId)">Delete</button>
				</div>
			</div>
		</div>
	</div>
    <ToastComponent :message="notice_message" ref="notice_toast" />
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import ToastComponent from '@/components/ToastComponent.vue';
import { Modal } from 'bootstrap';
import { BASE_URL } from '@/constants.js'

export default {
	components: {
		Bootstrap5Pagination,
		ToastComponent
	},
	setup() {
		const dailyTestSerieses = ref([]);
		const router = useRouter();
		const route = useRoute();		
		const notice_message = ref('');
		const notice_toast = ref(null);
		const deleteId = ref(null);
		const deleteModal = ref(null);
		var deleteModalHandle = null;

		onMounted(() => {
			loadDailyTestSerieses();
			deleteModalHandle = new Modal(deleteModal.value);
		});

		const loadDailyTestSerieses = (page=1) => {
			const tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(BASE_URL+`admin/daily-test-series?page=${page}`, {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				}
			})
			.then((response) => {			
				dailyTestSerieses.value = response.data;
				dailyTestSerieses.value.data.forEach(item => {
					if (item.syllabus) {
						try {
							item.syllabus = JSON.parse(item.syllabus);
						} catch (error) {
							console.error("Error parsing syllabus JSON", error);
							item.syllabus = [];
						}
					}
				});							
			})
			.catch((error) => {
				notice_message.value = "Something went wrong";
				notice_toast.value.show();
			});			
		}
		const convertDateFormat = (dateString) => {
			const [year, month, day] = dateString.split('-');
			const formattedDate = `${day}-${month}-${year}`;
			return formattedDate;
		}
		
		function convertTimeTo12HourFormat(timeString) {			
			const [hours, minutes, seconds] = timeString.split(':').map(Number);
			const period = hours >= 12 ? 'PM' : 'AM';
			const hourIn12 = hours % 12 || 12; 
			return `${hourIn12}:${String(minutes).padStart(2, '0')} ${period}`;
		}

		const editDailyTestSeries = (id) => {			
			router.push({ path: `/daily-test-series/edit/${id}` })
		}

		const confirmDeleteDailyTestSeries = (id) => {
			deleteId.value = id;
			deleteModalHandle.show();
		}

		const deleteDailyTestSeries = (id) => {
			const tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.delete(BASE_URL+`admin/daily-test-series/${id}`, {
				headers: {
					Authorization: 'Bearer ' + tapasyaAdminToken
				}
			})
			.then((response) => {
				loadDailyTestSerieses();
				notice_message.value = response.data.message;
				notice_toast.value.show();
			})
			.catch(function (error) {
				if (error.response.status == 403) {
					notice_message.value = error.response.data.message;
					notice_toast.value.show();                        
				} else if (error.response.status == 404) {
					notice_message.value = error.response.data.message;
					notice_toast.value.show(); 
				} else {
					notice_message.value = 'Something went wrong';
					notice_toast.value.show();                        
				}
			})
			.finally(() => {
				deleteModalHandle.hide();
				deleteId.value = null;
			});
		}

		return {
			dailyTestSerieses,
			convertDateFormat,
			convertTimeTo12HourFormat,			
			editDailyTestSeries,
			deleteDailyTestSeries,
			loadDailyTestSerieses,
			deleteId,
			deleteModal,
			confirmDeleteDailyTestSeries,
			notice_message,
			notice_toast,  
			limit: 5        
		}
	},
};
</script>
