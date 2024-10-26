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
				<li class="breadcrumb-item active" aria-current="page">Daily Test Series Report</li>
			</ol>
		</nav>
		<router-link class="btn btn-primary" to="/report">
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

					<div class="row mb-3">
						<div class="col-sm-2 ms-2">
							<label for="">From Date</label>
							<flat-pickr v-model="fromDate" class="form-control" :config="dateConfig" id="from-date" placeholder="Select From Date" />
						</div>
						<div class="col-sm-2">
							<label for="">To Date</label>
							<flat-pickr v-model="toDate" class="form-control" :config="dateConfig" id="to-date" placeholder="Select To Date" />
						</div>
						<div class="col-sm-2">
							<p class="mb-4"></p>
							<button class="btn btn-primary" @click="loadDailyTestSeries">Submit</button>
						</div>
					</div>

					<div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
						<table class="table table-bordered table-striped">
							<thead class="table-header">
								<tr class="table-secondary">
									<th>#</th>
									<th>Name</th>
									<th>Date</th>
									<th>Syllabus</th>
									<th>Total Attended</th>
									<th class="text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(report, index) in reports" :key="report.id">
									<th>{{ index + 1 }}</th>
									<td>{{ report.name }}</td>
									<td>{{ convertDateFormat(report.exam_date) }}</td>
									<td>
										<ul>
											<li v-for="subject in parseSyllabus(report.syllabus)" :key="subject.id">
												{{ subject.name }} : {{ subject.count }}
											</li>
										</ul>
									</td>
									<td>{{ report.total_attended }}</td>
									<td class="text-center">
										<button title="Show" class="btn btn-primary me-2" @click="show(report.id)">
											<span class="fa fa-eye"></span>
										</button>
										<button title="Ranking" class="btn btn-warning text-light" @click="ranking(report.id)">
											<span class="fa fa-medal"></span>
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { BASE_URL } from '@/constants.js';
import axios from 'axios';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';

export default {
	components: {
		FlatPickr,
	},
	setup() {
		const router = useRouter();		
		const reports = ref([]);
		const dateConfig = {
			dateFormat: 'd-m-Y',
		};
		const formatDateToLocal = () => {
			const today = new Date();
			const day = String(today.getDate()).padStart(2, '0');
			const month = String(today.getMonth() + 1).padStart(2, '0'); 
			const year = today.getFullYear();
			return `${day}-${month}-${year}`; 
		};
		const fromDate = ref(formatDateToLocal());
		const toDate = ref(formatDateToLocal());

		onMounted(() => {
			loadDailyTestSeries();
		})

		const loadDailyTestSeries = () => {
			const token = localStorage.getItem('tapasya_admin_token');
			axios.get(BASE_URL+`admin/reports/daily-test-series`, {
					params: {
						from_date: fromDate.value,
						to_date: toDate.value,
					},
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					reports.value = response.data.dailyTestSeries;
				})
				.catch((error) => {
					console.error('Error fetching report:', error);
				});
		};	

		const convertDateFormat = (dateString) => {
			const [year, month, day] = dateString.split('-');
			const formattedDate = `${day}-${month}-${year}`;
			return formattedDate;
		}

		const parseSyllabus = (syllabus) => {
			return JSON.parse(syllabus);
		};

		const show = (id) => {
			router.push({ path: `/report/daily-test-series/show/${id}` });
		}

		const ranking = (id) => {
			router.push({ path: `/report/daily-test-series/ranking/${id}` });
		}

		return {
			fromDate,
			toDate,
			reports,
			dateConfig,
			loadDailyTestSeries,
			convertDateFormat,
			parseSyllabus,
			show,
			ranking,
		};
	},
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
