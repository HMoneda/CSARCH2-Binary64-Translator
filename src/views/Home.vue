<template>
  <div class="min-h-screen bg-gray-400 overflow-hidden">
    <Navbar />
    <Translator />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Translator from '../components/Translator.vue';

export default {
  components: {
    Navbar,
    Translator,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

.input-container {
  width: 35rem;
  height: 30rem;

  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 12px 12px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
}

.result-container {
  width: 35rem;
  height: 20rem;

  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 12px 12px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
}

.lato-regular {
  font-family: 'Lato', sans-serif;
  font-weight: 400;
}

.lato-semibold {
  font-family: 'Lato', sans-serif;
  font-weight: 600;
}

.lato-bold {
  font-family: 'Lato', sans-serif;
  font-weight: 800;
}
</style>
