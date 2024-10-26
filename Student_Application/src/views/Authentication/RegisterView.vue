<template>
	<div id="main-wrapper">
		<div class="container">
			<br>
			<div class="row justify-content-center">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div id="main-card" class="card mx-auto">
						<div class="card-body text-light px-5">
							<img src="@/assets/images/taplogo.png" alt="TAPASYA Logo" class="logo mx-auto d-block mb-3" style="width: 150px">
							<h5 class="text-center mb-4">SIGN UP</h5>
							<form @submit.prevent="register">
								<div class="row mb-3">
									<div class="col-md-6 mb-3">
										<label for="firstname" class="input-label">First Name</label>
										<div class="input-group">
											<span class="input-group-text">
												<i class="fa fa-user"></i>
											</span>
											<input type="text" id="firstname" class="form-control rounded-end" v-model="formData.first_name" @input="clearFieldError('first_nameErrorMessage')" placeholder="First Name">
											<div class="invalid-feedback d-block">
                                                {{ first_nameErrorMessage }}
                                            </div>
										</div>
									</div>
									<div class="col-md-6 mb-3">
										<label for="lastname" class="input-label">Last Name</label>
										<div class="input-group">
											<span class="input-group-text">
												<i class="fa fa-user"></i>
											</span>
											<input type="text" id="lastname" class="form-control rounded-end" v-model="formData.last_name" @input="clearFieldError('last_nameErrorMessage')" placeholder="Last Name">
											<div class="invalid-feedback d-block">
                                                {{ last_nameErrorMessage }}
                                            </div>
										</div>
									</div>
									<div class="col-md-6 mb-3">
										<label for="phonenumber" class="input-label">Phone Number</label>
										<div class="input-group">
											<span class="input-group-text">
												<i class="fa fa-phone"></i>
											</span>
											<input type="text" id="phonenumber" class="form-control rounded-end" v-model="formData.phone_no" @input="clearFieldError('phone_noErrorMessage')" placeholder="Phone Number">
											<div class="invalid-feedback d-block">
                                                {{ phone_noErrorMessage }}
                                            </div>
										</div>
									</div>
									<div class="col-md-6 mb-3">
										<label for="email" class="input-label">Email</label>
										<div class="input-group">
											<span class="input-group-text">
												<i class="fa fa-envelope"></i>
											</span>
											<input type="email" id="email" class="form-control rounded-end" v-model="formData.email" @input="clearFieldError('emailErrorMessage')" placeholder="Email">
											<div class="invalid-feedback d-block">
                                                {{ emailErrorMessage }}
                                            </div>
										</div>
									</div>
									<div class="col-md-6 mb-3">
										<label for="password" class="input-label">Password</label>
										<div class="input-group password-group">
											<span class="input-group-text">
												<i class="fa fa-lock"></i>
											</span>
											<input ref="passField" id="password" :type="showPassword ? 'text' : 'password'" v-model="formData.password" @input="clearFieldError('passwordErrorMessage')" class="form-control password-field" placeholder="Password">
											<span class="btn btn-light password-toggle rounded-end" @click="togglePassword">
												<i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
											</span>
											<div class="invalid-feedback d-block">
                                                {{ passwordErrorMessage }}
                                            </div>
										</div>
									</div>
									<div class="error-wrapper">
										<div v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</div>
									</div>
								</div>
		
								<div class="row justify-content-center">
									<div class="col-xl-4 col-lg-4 col-md-4 col-xs-12 col-sm-12">
										<button v-if="!isAttemptRegister" type="submit" class="btn btn-primary w-100">Register</button>
										<button v-else class="btn btn-primary w-100">
											<div class="spinner-border spinner-border-sm" role="status">
												<span class="visually-hidden">Loading...</span>
											</div>
										</button>
										<br><br>
										<div class="text-center">
											<div class="signup"> Already have an account? Try <router-link to="/">Sign in</router-link></div>
										</div>
									</div>
								</div>
		
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '@/constants.js';

export default {
	data() {
		return {
			formData: {
				first_name: '',
				last_name: '',
				phone_no: '',
				email: '',
				password: '',
			},
			showPassword: false,
			first_nameErrorMessage: '',
			last_nameErrorMessage: '',
			phone_noErrorMessage: '',
			emailErrorMessage: '',
			passwordErrorMessage: '',
			errorMessage: '',
			isAttemptRegister: false,
		};
	},
	mounted() {
		document.body.classList.add('customer-bg');
	},
	beforeUnmount() {
		document.body.classList.remove('customer-bg');
	},
	methods: {
		togglePassword() {
			this.showPassword = !this.showPassword;
		},
		register() {
			this.clearErrorMessages();
			this.isAttemptRegister = true;

			axios.post(BASE_URL + 'student/register', this.formData)
				.then(response => {
					// Handle successful response
					if (response.data) {
						// Store the response ID in localStorage
						localStorage.setItem('tapasya_student_user_otp_id', response.data.id);
						// Redirect to the register-otp page
						this.$router.push('/register-otp');
					}
				})
				.catch(error => {
					this.isAttemptRegister = false;
					if(error.response) {
						if(error.response.status == 422) {
							const errors = error.response.data.errors;
							if (errors.first_name) {
								this.first_nameErrorMessage = errors.first_name[0];
							}
							if (errors.last_name) {
								this.last_nameErrorMessage = errors.last_name[0];
							}
							if (errors.phone_no) {
								this.phone_noErrorMessage = errors.phone_no[0];
							}
							if (errors.email) {
								this.emailErrorMessage = errors.email[0];
							}
							if (errors.password) {
								this.passwordErrorMessage = errors.password[0];
							}
						} else if(error.response.status == 401) {
							this.errorMessage = error.response.data.message;
						} else {
							this.errorMessage = 'Something went wrong';
						}
					} else {
						this.errorMessage = 'Something went wrong';
					}
				});
		},
		clearErrorMessages() {
			this.first_nameErrorMessage = '';
			this.last_nameErrorMessage = '';
			this.phone_noErrorMessage = '';
			this.emailErrorMessage = '';
			this.passwordErrorMessage = '';
			this.errorMessage = '';
		},
		clearFieldError(field) {
			this[field] = '';
		},
		goToHome() {
			this.$router.push('/');
		}
	}
};
</script>

<style>
	.customer-bg {
		position: relative;
		margin: 0;
		padding: 0;
		background: url("@/assets/images/regbg.avif");
		background-size: cover;
		background-position: center;
		height: 100vh;
	}

	.customer-bg::before {
		content: "";
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 1;
	}

	#main-card {
		background: rgba(255, 255, 255, 0.04);
		box-shadow: -1px 4px 28px 0px rgba(0, 0, 0, 0.75);
		z-index: 999;
	}

	.input-label {
		margin-bottom: 5px;
	}

	.invalid-feedback {
        height: 18px;
    }
</style>