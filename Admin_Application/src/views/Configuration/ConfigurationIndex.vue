<template>
	<div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/">Home</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Configuration</li>
            </ol>
        </nav>
    </div>
    <!-- Filters Row -->
    <div class="container mt-3">
        <div class="row">
            <!-- Masters Button -->
            <div class="col-12 col-md-4 mb-3">
				<router-link class="btn btn-outline-primary w-100 py-3" to="/configuration/master">
                    <i class="fas fa-cog me-2"></i> Masters
                </router-link>
            </div>
            <!-- Grades Button -->
            <div class="col-12 col-md-4 mb-3">
                <router-link class="btn btn-outline-primary w-100 py-3" to="/configuration/grade">
                    <i class="fas fa-graduation-cap me-2"></i> Grades
                </router-link>
            </div>
            <!-- Subjects Button -->
            <div class="col-12 col-md-4 mb-3">
				<router-link class="btn btn-outline-primary w-100 py-3" to="/configuration/subject">
                    <i class="fas fa-book-open me-2"></i> Subjects
                </router-link>
            </div>
            <!-- Chapters Button -->
            <div class="col-12 col-md-4 mb-3">
				<router-link class="btn btn-outline-primary w-100 py-3" to="/configuration/chapter">
                    <i class="fas fa-folder-open me-2"></i> Chapters
                </router-link>
            </div>
        </div>
    </div>
</template>
  
<script>
	export default {

	};
</script>
  
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
  