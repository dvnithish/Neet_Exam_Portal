<template>
    <div id="main-wrapper">
        <div class="container">
            <br>
            <div class="row justify-content-center">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div id="main-card" class="card mx-auto">
                        <div class="card-body text-light px-5">
                            <img src="@/assets/images/taplogo.png" alt="TAPASYA Logo" class="logo mx-auto d-block mb-3" style="width: 150px">
                            <h2 class="text-center">EXAM PORTAL</h2>
                            <p class="text-center">Welcome back!</p>
                            <form @submit.prevent="login">
                                <div class="row mb-3">
                                    <div class="col-12">
                                        <label for="email" class="input-label">Email</label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="fa fa-user"></i>
                                            </span>
                                            <input type="text" id="email" class="form-control rounded-end" v-model="email" @input="clearFieldError('emailErrorMessage')" placeholder="Email">
                                            <div class="invalid-feedback d-block">
                                                {{ emailErrorMessage }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-12">
                                        <label for="password" class="input-label">Password</label>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text">
                                                <i class="fa fa-lock"></i>
                                            </span>
                                            <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="password" @input="clearFieldError('passwordErrorMessage')" placeholder="Password">
                                            <button class="btn btn-light rounded-end" type="button" @click="togglePassword">
                                                <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                                            </button>
                                            <div class="invalid-feedback d-block">
                                                {{ passwordErrorMessage }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="pass">
                                    <a href="#">Forgot Password?</a>
                                </div> -->
                                <div class="row mb-3">
                                    <div class="col-12">
                                        <button v-if="!isAttemptLogin" class="btn btn-primary w-100" type="submit">LOGIN</button>
                                        <button v-else class="btn btn-primary w-100" type="button">
                                            <div class="spinner-border spinner-border-sm" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </button>
                                        <br><br>
                                        <div class="text-center">
                                            <div class="signup"> Don't have an account? <router-link to="/register">Signup</router-link></div>
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
			email: '',
			password: '',
			showPassword: false,
			emailErrorMessage: '',
			passwordErrorMessage: '',
            isAttemptLogin: false,
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
		clearErrorMessages() {
			this.emailErrorMessage = '';
			this.passwordErrorMessage = '';
		},
		login() {
			this.clearErrorMessages();
            this.isAttemptLogin = true;

			axios.post(BASE_URL+'student/login', {
					email: this.email,
					password: this.password,
				})
				.then((response) => {
					localStorage.setItem('tapasya_student_token', response.data.token);
					localStorage.setItem('tapasya_student_first_name', response.data.user.first_name);
					this.$router.push('/dashboard');
				})
				.catch((error) => {
                    this.isAttemptLogin = false;
					if(error.response) {
						if(error.response.status == 422) {
							if (error.response.data.errors.email) {
								this.emailErrorMessage = error.response.data.errors.email[0];
							}
							if (error.response.data.errors.password) {
								this.passwordErrorMessage = error.response.data.errors.password[0];
							}
						} else if(error.response.status == 403) {
							this.emailErrorMessage = error.response.data.message;
						} else {
							this.emailErrorMessage = 'Something went wrong. Please try later';
						}
					} else {
						this.emailErrorMessage = 'Something went wrong. Please try later';
					}
				});
		},
		clearErrorMessages() {
			this.emailErrorMessage = '';
			this.passwordErrorMessage = '';
		},
		clearFieldError(field) {
			this[field] = '';
		},
	},
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
  