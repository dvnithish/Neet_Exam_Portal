<template>
    <div class="bg-img">
    	<div class="content">
    		<img src="@/assets/images/logo-new.png" alt="TAPASYA Logo" class="logo" style="width:250px">
    		<h3>ADMIN PORTAL</h3>    		
    		<form @submit.prevent="login">
    			<div class="field">
    				<label for="email" class="input-label">Email</label>
    				<div class="input-container">
    					<span class="fa fa-user"></span>
    					<input type="text" id="email" v-model="email" @input="clearFieldError('emailErrorMessage')" placeholder="Email">
    				</div>
    			</div>
    			<div class="errormsg">
    				<p v-if="emailErrorMessage" class="error-message">{{ emailErrorMessage }}</p>
    			</div>
    			<div class="field space">
    				<label for="password" class="input-label">Password</label>
    				<div class="input-container">
    					<span class="fa fa-lock"></span>
    					<input ref="passField" id="password" :type="showPassword ? 'text' : 'password'" v-model="password" class="pass-key" @input="clearFieldError('passwordErrorMessage')" placeholder="Password">
    					<span class="btn btn-outline-secondary border-0 password-toggle" @click="togglePassword">
    						<i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
    					</span>
    				</div>
    			</div>
    			<div class="errormsg">
    				<p v-if="passwordErrorMessage" class="error-message">{{ passwordErrorMessage }}</p>
    			</div>
    			<div class="field">
                    <button v-if="!isAttemptLogin" class="k-btn" type="submit">LOGIN</button>
                    <button v-else class="k-btn" type="button">
                        <div class="spinner-border spinner-border-sm" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
    			</div>
    		</form>
    	</div>
    </div>
</template>
  
<script>
import { BASE_URL } from '@/constants.js'
import axios from 'axios';
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
  	methods: {
  		togglePassword() {
  			this.showPassword = !this.showPassword;
  		},
  		login() {
  			this.clearErrorMessages();
            this.isAttemptLogin = true;

  			axios.post(BASE_URL+'admin/login', {
  					email: this.email,
  					password: this.password,
  				})
  				.then((response) => {
					localStorage.setItem('tapasya_admin_token', response.data.token);
					localStorage.setItem('tapasya_admin_first_name', response.data.user.first_name);
					this.$router.push('/dashboard');
  				})
  				.catch((error) => {
                    this.isAttemptLogin = false;
                    if(error.response) {
                        if(error.response.status == 422) {
                            const validationErrors = error.response.data.errors;
                            if (validationErrors.email) {
                                this.emailErrorMessage = validationErrors.email[0];
                            }
                            if (validationErrors.password) {
                                this.passwordErrorMessage = validationErrors.password[0];
                            }
                        } else if(error.response.status == 403) {
                            this.emailErrorMessage = error.response.data.message;
                        } else {
                            this.emailErrorMessage = 'Something went wrong';
                        }
                    } else {
                        this.emailErrorMessage = 'Something went wrong';
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
  
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
}

.bg-img {
    background: url("@/assets/images/loginbg.jpg");
    height: 100vh;
    background-size: cover;
    background-position: center;
    position: relative;
}

.bg-img:after {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
}

.content {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    text-align: center;
    padding: 60px 32px;
    width: 370px;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: -1px 4px 28px 0px rgba(0, 0, 0, 0.75);
}

.content .logo {   
    margin-bottom: 20px;
}

.content h3 {
    color: white;
    font-size: 25px;
    margin-bottom: 20px;
    font-family: "Montserrat", sans-serif;
}

.content p {
    color: white;
    font-size: 16px;
    margin-bottom: 20px;
    font-family: "Poppins", sans-serif;
}

.field {
    position: relative;
    margin-bottom: 20px;
}

.input-label {
    display: block;
    color: white;
    font-size: 14px;
    font-family: "Poppins", sans-serif;
    margin-bottom: 8px;
    text-align: left;
}

.input-container {
    height: 45px;
    width: 100%;
    display: flex;
    background: rgba(255, 255, 255, 0.94);
}

.input-container span {
    color: #222;
    width: 40px;
    line-height: 45px;
}

.input-container input {
    height: 100%;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #222;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
}

.errormsg p {
    color: rgb(234, 79, 79);
    font-size: 12px;

    text-align: left;
}

.space {
    margin-top: 16px;
}

.toggle-password {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #222;
    cursor: pointer;
}

.pass {
    text-align: left;
    margin: 10px 0;
}

.pass a {
    color: white;
    text-decoration: none;
    font-family: "Poppins", sans-serif;
}

.pass:hover a {
    text-decoration: underline;
}

.k-btn {
    height: 40px;
    width: 50%;
    background: #3498db;
    border: 1px solid #2691d9;
    color: white;
    font-size: 18px;
    letter-spacing: 1px;
    font-weight: 600;
    cursor: pointer;
}

.k-btn:hover {
    background: #2691d9;
}

.signup {
    margin-top: 10px;
    font-size: 15px;
    color: white;
    font-family: "Poppins", sans-serif;
}

.signup a {
    color: #3498db;
    text-decoration: none;
}

.signup a:hover {
    text-decoration: underline;
}

.error-message {
    color: red;
    font-size: 12px;
    margin-top: -10px;
    text-align: left;
}

.password-toggle {
    line-height: 35px !important;
}

.password-toggle:hover {
    background-color: transparent !important;
}
</style>
    