import { createRouter, createWebHistory, createWebHashHistory  } from 'vue-router'
import BlankLayout from '../layouts/BlankLayout.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
// Login
import LoginView from '@/views/Authentication/LoginView.vue'
// Register
import RegisterView from '@/views/Authentication/RegisterView.vue'
import RegisterOTPView from '@/views/Authentication/RegisterOTPView.vue'
// Dashboard
import Dashboard from '@/views/Dashboard.vue'
// Daily Test Series
import DailyTestSeriesIndexView from '@/views/DailyTestSeries/DailyTestSeriesIndexView.vue'
import DailyTestSeriesShowView from '@/views/DailyTestSeries/DailyTestSeriesShowView.vue'
import DailyTestSeriesInstructionView from '@/views/DailyTestSeries/DailyTestSeriesInstructionView.vue'
import DailyTestSeriesAttendView from '@/views/DailyTestSeries/DailyTestSeriesAttendView.vue'
import DailyTestSeriesResultView from '@/views/DailyTestSeries/DailyTestSeriesResultView.vue'
//Unit Test Series
import UnitTestSeriesAttendView from '@/views/UnitTestSeries/UnitTestSeriesAttendView.vue'
import UnitTestSeriesIndexView from '@/views/UnitTestSeries/UnitTestSeriesIndexView.vue'
import UnitTestSeriesInstructionView from '@/views/UnitTestSeries/UnitTestSeriesInstructionView.vue'
import UnitTestSeriesResultView from '@/views/UnitTestSeries/UnitTestSeriesResultView.vue'
import UnitTestSeriesShowView from '@/views/UnitTestSeries/UnitTestSeriesShowView.vue'
//MyAccount
import MyAccountIndexView from '@/views/MyAccount/MyAccountIndexView.vue'
//MyLearning
import MyLearningIndexView from '@/views/MyLearning/MyLearningIndexView.vue'
//MyRewards
import MyRewardsIndexView from '@/views/MyRewards/MyRewardsIndexView.vue'
//MySubscriptions
import MySubscriptionsIndexView from '@/views/MySubscriptions/MySubscriptionsIndexView.vue'
//OldQuestionBank
import OldQuestionBankIndexView from '@/views/OldQuestionBank/OldQuestionBankIndexView.vue'
//TestSeries
import TestSeriesIndexView from '@/views/TestSeries/TestSeriesIndexView.vue'
//Misc
import ComingSoon from '../components/ComingSoon.vue'

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
            name: 'Dashboard',
            component: Dashboard,
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
        {
          path: '/unit-test-series/attend/:id',
            name: 'UnitTestSeriesAttendView',
            component: UnitTestSeriesAttendView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/unit-test-series',
            name: 'UnitTestSeriesIndexView',
            component: UnitTestSeriesIndexView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/unit-test-series/instruction',
            name: 'UnitTestSeriesInstructionView',
            component: UnitTestSeriesInstructionView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/unit-test-series/result/:id',
            name: 'UnitTestSeriesResultView',
            component: UnitTestSeriesResultView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/unit-test-series/show/:id',
            name: 'UnitTestSeriesShowView',
            component: UnitTestSeriesShowView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/my-account',
            name: 'MyAccountIndexView',
            component: MyAccountIndexView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/my-learning',
            name: 'MyLearningIndexView',
            component: MyLearningIndexView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/my-rewards',
            name: 'MyRewardsIndexView',
            component: ComingSoon,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/my-subscriptions',
            name: 'MySubscriptionsIndexView',
            component: ComingSoon,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/old-question-bank',
            name: 'OldQuestionBankIndexView',
            component: OldQuestionBankIndexView,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        },
        {
          path: '/test-series',
            name: 'TestSeriesIndexView',
            component: ComingSoon,
            meta: {
              layout: DefaultLayout,
              auth: true
            },
        }
    ],
    scrollBehavior(to, from, savedPosition) {
      return { top: 0 };
    },
})

router.beforeEach((to, from, next) => {
  	var tapasyaStudentToken = localStorage.getItem("tapasya_student_token");
	if (to.meta.auth && !tapasyaStudentToken) {
	  next({ name: 'Login' });
	} else if(!to.meta.auth && tapasyaStudentToken) {
		next({ name: 'Dashboard' });
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