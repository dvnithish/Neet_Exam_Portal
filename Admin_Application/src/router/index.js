import { createRouter, createWebHistory, createWebHashHistory  } from 'vue-router'
import BlankLayout from '../layouts/BlankLayout.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
// Login
import LoginView from '@/views/LoginView.vue'
// Register
import RegisterView from '@/views/RegisterView.vue'
import RegisterOTPView from '@/views/RegisterOTPView.vue'
// Dashboard
import DashboardView from '@/views/DashboardView.vue'
// Daily Test Series
import DailyTestSeriesIndexView from '@/views/DailyTestSeries/DailyTestSeriesIndexView.vue'
import DailyTestSeriesShowView from '@/views/DailyTestSeries/DailyTestSeriesShowView.vue'
import DailyTestSeriesInstructionView from '@/views/DailyTestSeries/DailyTestSeriesInstructionView.vue'
import DailyTestSeriesAttendView from '@/views/DailyTestSeries/DailyTestSeriesAttendView.vue'
import DailyTestSeriesResultView from '@/views/DailyTestSeries/DailyTestSeriesResultView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'LoginView',
            component: LoginView,
            meta: {
              layout: BlankLayout,
              auth: false
            },
        },
        {
            path: '/register',
            name: 'RegisterView',
            component: RegisterView,
            meta: {
              layout: BlankLayout,
              auth: false
            },
        },
        {
            path: '/register-otp',
            name: 'RegisterOTPView',
            component: RegisterOTPView,
            meta: {
              layout: BlankLayout,
              auth: false
            },
        },
        {
            path: '/dashboard',
            name: 'DashboardView',
            component: DashboardView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
            path: '/daily-test-series',
            name: 'DailyTestSeriesIndexView',
            component: DailyTestSeriesIndexView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
            path: '/daily-test-series/show/:id',
            name: 'DailyTestSeriesShowView',
            component: DailyTestSeriesShowView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
            path: '/daily-test-series/instruction/:id',
            name: 'DailyTestSeriesInstructionView',
            component: DailyTestSeriesInstructionView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
            path: '/daily-test-series/attend/:id',
            name: 'DailyTestSeriesAttendView',
            component: DailyTestSeriesAttendView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
            path: '/daily-test-series/result/:id',
            name: 'DailyTestSeriesResultView',
            component: DailyTestSeriesResultView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
    ]
})

router.beforeEach((to, from, next) => {
  	var tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
	if (to.meta.auth && !tapasyaStudentToken) {
	  next({ name: 'LoginView' });
	} else if(!to.meta.auth && tapasyaStudentToken) {
		next({ name: 'DashboardView' });
	} else {
	  next();
	}
});

router.afterEach(() => {
  // Reinitialize jQuery plugins here
  // $('.nav-group-toggle').navGroupToggle();
  // coreui.Sidebar.getInstance(document.querySelector('#sidebar')).toggle()
});

export default router