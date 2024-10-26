<template>
    <!-- Breadcrumb Navigation -->
    <div class="d-flex justify-content-between mb-3">
    	<nav aria-label="breadcrumb">
    		<ol class="breadcrumb">
    			<li class="breadcrumb-item">
    				<a href="#">Home</a>
    			</li>
    			<li class="breadcrumb-item active" aria-current="page">Report</li>
    		</ol>
    	</nav>
    </div>
    <!-- Filters Row -->
    <div class="container mt-3">
    	<div class="row">
    		<!-- Daily Test Series Report Button -->
    		<div class="col-12 col-md-4 mb-3">
    			<router-link class="btn btn-outline-primary w-100 py-3" to="/report/daily-test-series">
    				<i class="fas fa-calendar-check me-2"></i> Daily Test Series Report
    			</router-link>
    		</div>
    		<!-- Unit Test Series Report Button -->
    		<div class="col-12 col-md-4 mb-3">
    			<router-link class="btn btn-outline-primary w-100 py-3" to="/report/chapter-wise">
    				<i class="fas fa-calendar-check me-2"></i> Chapter Wise Report
    			</router-link>
    		</div>
			<div class="col-12 col-md-4 mb-3">
    			<router-link class="btn btn-outline-primary w-100 py-3" to="/report/student">
    				<i class="fas fa-calendar-check me-2"></i> Student Report
    			</router-link>
    		</div>
    	</div>
    </div>
</template>

<style scoped>
	/* Responsive padding */
	.p-3 {
		padding: 1rem !important;
	}

	/* Breadcrumb styles */
	.breadcrumb {
		background-color: #f8f9fa;
		margin-bottom: 1rem;
		border-radius: 0.375rem;
	}

	.breadcrumb-item a {
		text-decoration: none;
		color: #007bff;
	}

	.breadcrumb-item a:hover {
		text-decoration: underline;
	}

	/* Button styles */
	.btn-outline-primary {
		border: 2px solid #007bff;
		background-color: white;
		color: #007bff;
		transition: background-color 0.2s, color 0.2s;
	}

	.btn-outline-primary:hover {
		background-color: #007bff;
		color: white;
	}

	.btn i {
		font-size: 1.2rem;
	}

	.btn {
		font-size: 1rem;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.btn {
			font-size: 0.9rem;
			padding: 0.75rem;
		}
	}
</style>
