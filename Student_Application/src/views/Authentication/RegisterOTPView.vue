<template>
	<div id="main-wrapper">
        <div class="container">
            <br>
            <div class="row justify-content-center">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div id="main-card" class="card mx-auto">
                        <div class="card-body text-light px-5">
                            <img src="@/assets/images/taplogo.png" alt="TAPASYA Logo" class="logo mx-auto d-block mb-3" style="width: 150px">
							<h5 class="text-center mb-3">OTP Verification</h5>
							<form @submit.prevent="handleSubmit">

								<div class="row g-3">
									<div class="col-lg-8 mb-3">
										<div class="input-group">
											<span class="input-group-text">
												<i class="fa fa-key"></i>
											</span>
											<input type="text" id="enter_otp" class="form-control" v-model="formData.otp" @input="clearServerMessage" placeholder="Enter OTP">
										</div>
									</div>
									<div class="col-lg-4 mb-3">
										<button v-if="!isAttemptVerify" type="submit" class="btn btn-success w-100">
											<i class="fas fa-check"></i> Verify
										</button>
										<button v-else type="submit" class="btn btn-success w-100">
											<div class="spinner-border spinner-border-sm" role="status">
												<span class="visually-hidden">Loading...</span>
											</div>
										</button>
									</div>
								</div>

								<div class="row">
									<div class="col-lg-6 mb-3">
										<button v-if="!isAttemptResend" type="button" class="btn btn-warning text-light w-100" @click="resendOTP">
											<i class="fas fa-sync-alt"></i> Resend OTP 
										</button>
										<button v-else type="button" class="btn btn-warning text-light w-100" @click="resendOTP">
											<div class="spinner-border spinner-border-sm" role="status">
												<span class="visually-hidden">Loading...</span>
											</div>
										</button>
									</div>
									<div class="col-lg-6 mb-3">
										<button type="button" class="btn btn-primary w-100" @click="goToRegister">
											<i class="fas fa-arrow-left"></i> Back to Register 
										</button>
									</div>
								</div>
							</form>
							<p class="server-message text-center mb-3" :class="responseStatus ? 'text-success' : 'text-danger'">{{ serverMessage }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-if="showToast" class="toast-container position-fixed top-0 end-0 p-3">
		<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header bg-success text-light">
				<strong class="me-auto">Success</strong>
			</div>
			<div class="toast-body"> OTP verified successfully! </div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '@/constants.js';
export default {
	name: 'RegisterOTP',
	data() {
		return {
			formData: {
				otp: '',
			},
			serverMessage: '',
			isAttemptVerify: false,
			isAttemptResend: false,
			showToast: false,
			responseStatus: false,
		};
	},
	mounted() {
		document.body.classList.add('customer-bg');
		const tapasyaStudentUserOTPId = localStorage.getItem('tapasya_student_user_otp_id');
		if (!tapasyaStudentUserOTPId) {
			this.$router.push('/register');
		}
	},
	beforeUnmount() {
		document.body.classList.remove('customer-bg');
	},
	methods: {
		handleSubmit() {
			this.isAttemptVerify = true;
			const tapasyaStudentUserOTPId = localStorage.getItem('tapasya_student_user_otp_id');
			axios.post(BASE_URL + 'student/register/otp/verify', {
					otp: this.formData.otp,
					id: tapasyaStudentUserOTPId
				})
				.then(response => {
					localStorage.removeItem('tapasya_student_user_otp_id');
					localStorage.setItem('tapasya_student_token', response.data.token);
					localStorage.setItem('tapasya_student_first_name', response.data.first_name);
					this.showToast = true;
					setTimeout(() => {
						this.$router.push('/dashboard');
					}, 3000);
				})
				.catch(error => {
					this.isAttemptVerify = false;
					this.responseStatus = false;
					if(error.response) {
						if(error.response.status == 422) {
							if(error.response.data.errors.otp) {
								this.serverMessage = error.response.data.errors.otp[0];
							} else {
								this.serverMessage = 'Failed to verify OTP. Please try again later.';
							}
						} else if(error.response.status == 401) {
							this.serverMessage = error.response.data.message;
						} else {
							this.serverMessage = 'Failed to verify OTP. Please try again later.';
						}
					} else {
						this.serverMessage = 'Failed to verify OTP. Please try again later.';
					}
					
				});
		},

		resendOTP() {
			this.isAttemptResend = true;
			const tapasyaStudentUserOTPId = localStorage.getItem('tapasya_student_user_otp_id');
			axios.post(BASE_URL + 'student/register/otp/resend', {
					id: tapasyaStudentUserOTPId
				})
				.then(response => {
					this.responseStatus = true;
					this.serverMessage = 'OTP resent successfully.';
					setTimeout(() => {
						this.serverMessage = '';
					}, 3000);
				})
				.catch(error => {
					this.responseStatus = false;
					if(error.response) {
						if(error.response.status == 422) {
							this.serverMessage = 'Failed to resend OTP. Please try again later.';
						} else if(error.response.status == 401) {
							this.serverMessage = error.response.data.message;
						} else {
							this.serverMessage = 'Failed to resend OTP. Please try again later.';
						}
					} else {
						this.serverMessage = 'Failed to resend OTP. Please try again later.';
					}
				})
				.finally(() => {
					this.isAttemptResend = false;
				})
		},

		goToRegister() {
			this.$router.push('/register');
		},

		clearServerMessage() {
			this.serverMessage = '';
		}
	}
};
</script>

<style scoped>
	.server-message {
        min-height: 18px;
    }
</style>
