<template>
    <div class="sidebar sidebar-dark sidebar-fixed" id="sidebar">
        <div class="sidebar-brand d-md-flex">
            <img src="../assets/images/taplogo.png" width="90%" class="p-3" />
        </div>
        <ul class="sidebar-nav" data-coreui="navigation" data-simplebar="">
            <li class="nav-item" @click="hideSidebar()">
                <router-link class="nav-link" to="/dashboard">
                    <svg class="nav-icon">
                        <use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-speedometer"></use>
                    </svg> Dashboard
                </router-link>
            </li>
            <li class="nav-item" @click="hideSidebar()">
                <router-link class="nav-link" to="/daily-test-series">
                    <svg class="nav-icon">
                        <use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-notes"></use>
                    </svg> Daily Test Series
                </router-link>
            </li>
            <li class="nav-item" @click="hideSidebar()">
                <router-link class="nav-link" to="/test-series">
                    <svg class="nav-icon">
                        <use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-task"></use>
                    </svg> Test Series
                </router-link>
            </li>
            <li class="nav-item" @click="hideSidebar()">
                <router-link class="nav-link" to="/unit-test-series">
                    <svg class="nav-icon">
                        <use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-book"></use>
                    </svg> Unit Test Series
                </router-link>
            </li>
            <li class="nav-item" @click="hideSidebar()">
                <router-link class="nav-link" to="/my-subscriptions">
                    <svg class="nav-icon">
                        <use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-list"></use>
                    </svg> My Subscriptions
                </router-link>
            </li>
            <li class="nav-item" @click="hideSidebar()">
                <router-link class="nav-link" to="/my-account">
                    <svg class="nav-icon">
                        <use xlink:href="../assets/themes/vendors/@coreui/icons/svg/free.svg#cil-user"></use>
                    </svg> My Account
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
                    <img src="" width="90%" class="p-3" />
                </a>
                <ul class="header-nav ms-3">
                    <h4 class="text-start m-2">{{ firstName }}</h4>
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
                            <router-link class="dropdown-item" to="/my-account">
								Profile
							</router-link>                           
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" role="button"  @click="logout">Logout</a>
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
            <div class="ms-auto">Powered by&nbsp;<a target="_blank" href="https://mdbstech.com">MDBS TECH</a></div>
        </footer>
    </div>
	<ToastComponent :message="notice_message" ref="noticeToast" />
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ToastComponent from '@/components/ToastComponent.vue'; 
import { BASE_URL } from '@/constants.js';
export default {
    components: {
        ToastComponent,
    },
    setup() {
		const router = useRouter();
        const firstName = ref('');
        const notice_message = ref('');
        const noticeToast = ref(null);

        onMounted(() => {
            firstName.value = localStorage.getItem('tapasya_student_first_name') || 'Guest';
        });

        const logout = () => {
            const token = localStorage.getItem('tapasya_student_token');
            axios.get(BASE_URL + 'student/logout', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                doLogout();
            })
            .catch((error) => {
                doLogout();
            });
        };

        const doLogout = () => {
			if(localStorage.getItem('tapasya_student_token')) {
				localStorage.removeItem('tapasya_student_token');
			}
			if(localStorage.getItem('tapasya_student_first_name')) {
				localStorage.removeItem('tapasya_student_first_name');
			}
			router.push({ path: `/` });
		}

        const toggleSidebar = () => {
            var sidebarInstance = coreui.Sidebar.getInstance(document.querySelector('#sidebar'));
            if(sidebarInstance) {
                sidebarInstance.toggle();
            } else {
                window.location.reload();
            }
        };

        const hideSidebar = () => {
            if (window.innerWidth < 768) {
                coreui.Sidebar.getInstance(document.querySelector('#sidebar')).hide();
            }
        }

        const toggleDropdownMenu = () => {
            coreui.Dropdown.getInstance(document.querySelector('#drop-down-menu')).toggle();
        };

        return {
            firstName,
            logout,
            toggleSidebar,
            hideSidebar,
            toggleDropdownMenu,
            notice_message,
            noticeToast
        }
    },
}
</script>
