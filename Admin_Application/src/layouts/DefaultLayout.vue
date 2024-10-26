<template>
	<div class="sidebar k-sidebar sidebar-dark sidebar-fixed" id="sidebar">
		<div class="sidebar-brand d-none d-md-flex">
			<img src="../assets/images/TapasyaLogo.jpg" width="100%" class="" />
		</div>
		<ul class="sidebar-nav" data-coreui="navigation" data-simplebar="">
			<li class="nav-item">
				<router-link class="nav-link" to="/dashboard">
					<svg class="nav-icon">
						<use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-home"></use>
					</svg> Dashboard
				</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-link" to="/configuration">
					<svg class="nav-icon">
						<use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-settings"></use>
					</svg> Configuration
				</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-link" to="/question-bank">
					<svg class="nav-icon">
						<use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-book"></use>
					</svg> Question Bank
				</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-link" to="/user-management">
					<svg class="nav-icon">
						<use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-people"></use>
					</svg> User Management
				</router-link>
				</li>
				<li class="nav-item">
				<router-link class="nav-link" to="/daily-test-series">
					<svg class="nav-icon">
						<use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-notes"></use>
					</svg> Daily Test Series
				</router-link>
				</li>
				<li class="nav-item">
				<router-link class="nav-link" to="/report">
					<svg class="nav-icon">
					<use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-chart-line"></use>
					</svg> Report
				</router-link>
		       </li>
				<li class="nav-item">
				<router-link class="nav-link" to="/report/student">
					<svg class="nav-icon">
						<use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-user"></use>
					</svg> Students
				</router-link>
			</li>
		</ul>
		<button class="sidebar-toggler" type="button" data-coreui-toggle="unfoldable"></button>
	</div>
	<div class="wrapper d-flex flex-column min-vh-100 bg-light">
		<header class="header header-sticky mb-4">
			<div class="container-fluid">
				<button class="header-toggler px-md-0 me-md-3" type="button" @click="toggleSidebar()">
					<svg class="icon icon-lg">
						<use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-menu"></use>
					</svg>
				</button>
				<a class="header-brand d-md-none" href="#">
					<img src="../assets/images/taplogo.png" width="90%" class="p-3" />
				</a>
				<ul class="header-nav ms-3">
					<h4 class="text-start m-2">Welcome, {{ firstName }}</h4>
					<li class="nav-item dropdown">
						<a id="drop-down-menu" class="nav-link py-0" @click="toggleDropdownMenu()" data-coreui-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
							<div class="avatar avatar-md">
                                <img class="avatar-img" src="../assets/themes/assets/img/avatars/userimage.png" alt="user@email.com">
                            </div>
						</a>
						<div class="dropdown-menu dropdown-menu-end pt-0">
							<div class="dropdown-header bg-light py-2">
								<div class="fw-semibold">Settings</div>
							</div>
							<router-link class="dropdown-item" to="/profile">
								Profile
							</router-link>
							<router-link class="dropdown-item" to="/configuration">
								Configuration
							</router-link>
							<div class="dropdown-divider"></div>
							<a class="dropdown-item" role="button" @click="logout">Logout</a>
						</div>
					</li>
				</ul>
			</div>
		</header>
		<div class="body flex-grow-1 px-3">
			<div class="container-lg">
				<slot></slot>
			</div>
		</div>
		<footer class="footer">
			<div class="ms-auto">Powered by&nbsp; <a target="_blank" href="https://mdbstech.com">MDBS TECH</a>
			</div>
		</footer>
	</div>
	<ToastComponent :message="notice_message" ref="notice_toast" />
</template>
  
<script>
import axios from 'axios';
import { BASE_URL } from '@/constants.js'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ToastComponent from '@/components/ToastComponent.vue';

export default {
	components: {
        ToastComponent,
    },
	setup() {
		const router = useRouter();
		const firstName = ref('');
		const notice_message = ref('');
		const notice_toast = ref(null);

		onMounted(() => {
			firstName.value = localStorage.getItem('tapasya_admin_first_name') || 'Guest';
		});

		const logout = () => {
			var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
			axios.get(BASE_URL+`admin/logout`, {
                headers: {
                    Authorization: 'Bearer ' + tapasyaAdminToken
                }
            })
			.then((response) => {
				
			})
			.catch((error) => {
				
			});
			doLogout();
		}

		const doLogout = () => {
			if(localStorage.getItem('tapasya_admin_token')) {
				localStorage.removeItem('tapasya_admin_token');
			}
			if(localStorage.getItem('tapasya_admin_first_name')) {
				localStorage.removeItem('tapasya_admin_first_name');
			}
			router.push({ path: `/` });
		}

		const toggleSidebar = () => {
			coreui.Sidebar.getInstance(document.querySelector('#sidebar')).toggle();
		}

		const toggleDropdownMenu = () => {
			coreui.Dropdown.getInstance(document.querySelector('#drop-down-menu')).toggle();
		}

		return {
			firstName,
			logout,
			toggleSidebar,
			toggleDropdownMenu,
			notice_message,
			notice_toast,
		}
	}
}
</script>
<style>
    .k-sidebar{
        background: linear-gradient(to bottom, transparent, #fcad02d4);
        background-color: #C40C0C;
        font-size: medium;
        font-weight: 500;
    }
</style>