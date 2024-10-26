<template>
	<div class="coming-soon">
		<div class="content">
			<h1>Coming Soon</h1>
			<p>We’re working hard to bring something amazing to you. Stay tuned!</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ComingSoon'
}
</script>

<style scoped>
.coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  background: linear-gradient(135deg, #f069e7, #48c6ef);
  color: white;
  text-align: center;
}

.content {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

h1 {
  font-size: 3rem;
  margin-bottom: 10px;
}

p {
  font-size: 1.2rem;
}
</style>