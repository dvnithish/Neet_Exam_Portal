<template>
    <div class="d-flex justify-content-between mb-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Daily Test Series</li>
                <li class="breadcrumb-item active" aria-current="page">Print</li>
            </ol>
        </nav>
        <div>
            <router-link class="btn btn-primary me-2" to="/daily-test-series">
                  <i class="fas fa-arrow-left me-2"></i> Back
            </router-link>            
        </div>  
    </div>
    <div class="holds-the-iframe">
        <iframe :src="dailyTestSeries" width="100%" height="90%" frameborder="0"></iframe>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { BASE_URL } from '@/constants.js';

export default {
    components: {

    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const dailyTestSeries = ref('');

        onMounted(() => {
            loadPdf();
        });

        const loadPdf = async () => {
            var tapasyaAdminToken = localStorage.getItem("tapasya_admin_token");
            axios.get(BASE_URL + `admin/daily-test-series/custom/pdf/${route.params.id}`, {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: 'Bearer ' + tapasyaAdminToken,
                    ContentType: 'application/json',
                    Accept: 'application/pdf'
				},
			})
            .then(function (response) {
                let blob = new Blob([response.data], { type: 'application/pdf' })
                dailyTestSeries.value = window.URL.createObjectURL(blob);
            })
            .catch(function(error) {
                // notice_message.value = 'Something went wrong';
				// notice_toast.value.show();
            });
        }


        return {
            dailyTestSeries
        }
    }
};
</script>

<style>
    .holds-the-iframe {
        background:url("@/assets/images/loader.gif") center top no-repeat;
        height: 90vh;
    }
</style>