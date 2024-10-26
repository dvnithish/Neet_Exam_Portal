<template>
    <div ref="loadingModal" class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="card w-100">
                    <div class="card-body py-5 d-flex justify-content-center align-items-center">
                        <div class="spinner-border text-info" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <span class="ms-3">Loading, Please wait...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
        data() {
            return {
                modalShown: false,
            };
        },
		mounted() {
			this.loadingModal = new bootstrap.Modal(this.$refs.loadingModal);

            this.$refs.loadingModal.addEventListener('shown.bs.modal', () => {
                this.modalShown = true;
            });
            
            this.$refs.loadingModal.addEventListener('hidden.bs.modal', () => {
                this.modalShown = false;
            });
		},
		methods: {
			show() {
				this.loadingModal.show();
			},
            hide() {
                if (this.modalShown) {
                    this.loadingModal.hide();
                } else {
                    setTimeout(() => {
                        this.loadingModal.hide();
                    }, 1000);
                }
            },
		},
	};
</script>