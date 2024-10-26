<template>
	<div class="position-fixed top-0 end-0 p-3" style="z-index: 1030">
		<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="toast">
			<div class="toast-header bg-warning">
				<strong class="me-auto">Notice</strong>
				<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">
				{{ message }}
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			message: String,
		},
		mounted() {
			// Initialize the Bootstrap toast when the component is mounted
			this.toast = new bootstrap.Toast(this.$refs.toast);
		},
		methods: {
			show() {
				// Show the toast
				this.toast.show();
			},
		},
	};
</script>