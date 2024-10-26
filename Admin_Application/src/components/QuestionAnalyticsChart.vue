<template>
    <div class="doughnut">
        <canvas :id="computedCanvasId"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
export default {
    props: {
        question_id: Number,
        total_correct_attempts: Number,
        total_wrong_attempts: Number,
        total_not_attempted: Number,
    },
    mounted() {
        this.renderChart();
    },
    computed: {
        computedCanvasId() {
            return `doughnutChart-${this.question_id}`;
        }
    },
    methods: {
    renderChart() {
        const ctx = document.getElementById(`doughnutChart-${this.question_id}`).getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                // Adding the values directly beside the labels
                labels: [
                    `Correct: ${this.total_correct_attempts}`,
                    `Wrong: ${this.total_wrong_attempts}`,
                    `Not Attended: ${this.total_not_attempted}`
                ],
                datasets: [{
                    data: [this.total_correct_attempts, this.total_wrong_attempts, this.total_not_attempted],
                    backgroundColor: ['#28a745', '#fd7e14', '#007bff'],
                    hoverBackgroundColor: ['#1e7e34', '#e96e00', '#0056b3']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => tooltipItem.raw
                        }
                    }
                }
            }
        });
    }
    }

}
</script>

<style scoped>
    .doughnut {
        width: 200px;
        height: 180px;
        margin: 10px auto;
    }
</style>