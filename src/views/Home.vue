<template>
  <div class="min-h-screen bg-gray-400 overflow-hidden">
    <Navbar />
    <div id="input-container" class="input-container relative m-auto mt-7">
      <div class="q-pa-md">
        <div class="q-gutter-y-md">
          <q-btn-toggle
            v-model="state.selected"
            spread
            toggle-color="blue"
            color="white"
            text-color="black"
            :options="[
              {label: 'Hexadecimal Input', value: 'hex'},
              {label: 'Binary Input', value: 'bin'}
            ]"
          />
        </div>
      </div>
      
      <div>
        <form id="hex-form" v-if="state.selected === 'hex'" class="px-4 flex-column justify-center">
          <h1 class="text-black text-xl lato-regular">Enter hexadecimal number</h1>
          <q-input outlined v-model="state.hex_input" 
          :dense="dense" 
          :maxlength="16" 
          lazy-rules
          :rules="[ val => val && val.length > 0 && val.length == 16 || 'Please enter a 16-digit hexadecimal number']"
          error="true" error-message="" style="text-transform: uppercase"/> <!-- TODO -->
          <div class="">
            <div class="q-gutter-sm absolute bottom-14 mb-1">
              <q-checkbox v-model="state.select_fixed" label="Show fixed point" color="blue"/>
              <q-checkbox v-model="state.select_floating" label="Show floating point" color="blue"/>
            </div>
            <q-btn color="blue" type="submit" label="Translate!" style="width:94.5%"
            class="absolute bottom-4"/> <!-- TODO -->
          </div>
        </form>
      </div>
      

      <div id="bin-form" v-if="state.selected === 'bin'" class="px-4 flex-column justify-center">
        <h1 class="text-black text-xl lato-regular">Enter sign bit</h1>
        <q-input outlined v-model="state.signbit" 
        :dense="dense" 
        :maxlength="1"
        lazy-rules
        :rules="[ val => (val == 0 || val == 1) || 'Sign bit must either be 0 or 1']"
        error-message=""/> <!-- TODO -->
        <h1 class="text-black text-xl lato-regular">Enter exponent</h1>
        <q-input outlined v-model="state.exponent" 
        :dense="dense" 
        :maxlength="11"
        lazy-rules
        :rules="[ val => val && val.length == 11 || 'Please enter an 11-bit exponent number']"
        error-message=""/> <!-- TODO -->
        <h1 class="text-black text-xl lato-regular">Enter mantissa</h1>
        <q-input outlined v-model="state.mantissa" 
        :dense="dense" 
        :maxlength="52"
        lazy-rules
        :rules="[ val => val && val.length == 52 || 'Please enter a 52-bit mantissa']"
        error-message=""/> <!-- TODO -->
        <div id="" class="">
          <div class="q-gutter-sm">
            <q-checkbox v-model="state.select_fixed" label="Show fixed point" color="blue"/>
            <q-checkbox v-model="state.select_floating" label="Show floating point" color="blue"/>
          </div>
          <q-btn color="blue" label="Translate!" style="width:94.5%" 
          class="absolute bottom-4"/> <!-- TODO -->
        </div>
      </div>

    </div>
    <div id="result-container" class="result-container relative m-auto my-4">
      <div id="result" class="px-4 pt-4">
        <h1 class="lato-semibold text-lg">Result:</h1>
        <hr class="border-1 border-black">
      </div>
      <div class="px-4 py-2">
        <h1 class="lato-regular text-lg">Sign Bit:</h1>
        <h1 class="lato-regular text-lg">Exponent:</h1>
        <h1 class="lato-regular text-lg">Mantissa:</h1>
        <br>
        <h1 v-if="state.select_fixed === true" class="lato-regular text-lg">Fixed point decimal:</h1>
        <h1 v-if="state.select_floating === true" class="lato-regular text-lg">Floating point decimal:</h1>
      </div>
      <div class="px-4">
          <q-btn color="blue" label="Download Result" style="width:94.5%" 
          class="absolute bottom-4"/> <!-- TODO -->
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import { reactive } from 'vue';

export default {
  components: {
    Navbar,
  },
  setup() {
    const state = reactive({
      selected: 'hex',
      hex_input: '',
      signbit: '',
      exponent: '',
      mantissa: '',
      select_fixed: false,
      select_floating: false,
      fixed_point: '',
      floating_point: ''
    });

    function showResult() {
      if (state.selected === 'hex') {
        const data = {
          hex_input: hex_input,
          signbit: signbit,
          exponent: exponent,
          mantissa: mantissa,
        }

        if (!isHex(hex_input)){
          data.hex_input = 'taena bobo hindi yan hex';
        }
      }
    }

    function isHex(hex) {
    return /^[0-9A-F]+$/.test(hex) && hex.length === 16;
  }

    return { state, showResult, isHex };
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

.input-container {
  width: 35rem;
  height: 30rem;

  background: #FFFFFF;
  box-sizing: border-box;
  box-shadow: 0px 12px 12px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
}

.result-container {
  width: 35rem;
  height: 20rem;

  background: #FFFFFF;
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
