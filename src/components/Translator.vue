<template>
  <div id="input-container" class="input-container relative m-auto mt-7">
    <!-- Input button toggles -->
    <div class="q-pa-md" style="height: 12.5%">
      <div class="q-gutter-y-md">
        <q-btn-toggle
          v-model="state.selected"
          spread
          toggle-color="blue"
          color="white"
          text-color="black"
          :options="[
            { label: 'Hexadecimal Input', value: 'hex' },
            { label: 'Binary Input', value: 'bin' },
          ]"
          :disable="state.translated == true"
        />
      </div>
    </div>
    <!-- Hex form -->
    <div v-if="state.selected === 'hex'">
      <form id="hex-form" class="px-4 flex-column justify-center">
        <div class="my-28">
          <h1 class="text-black text-xl lato-regular">
            Enter hexadecimal number
          </h1>
          <q-input
            outlined
            v-model="state.hex_input"
            :maxlength="16"
            lazy-rules
            :rules="[
              (val) =>
                val == null ||
                val.length > 0 ||
                val.length == 16 ||
                'Please enter a 16-digit hexadecimal number',
              (val) =>
                val == null ||
                /^[0-9A-F]+$/.test(val) ||
                'Please enter a valid hexadecimal number',
            ]"
            :disable="state.translated == true"
            :error="false"
            error-message=""
            style="text-transform: uppercase"
          />
        </div>

        <div style="height: 12.5%" v-if="state.selected === 'hex'">
          <div class="q-gutter-sm">
            <q-checkbox
              v-model="state.select_fixed"
              label="Show fixed point"
              color="blue"
              :disable="state.translated == true"
            />
            <q-checkbox
              v-model="state.select_floating"
              label="Show floating point"
              color="blue"
              :disable="state.translated == true"
            />
          </div>
          <q-btn
            v-if="state.translated == false"
            color="blue"
            label="Translate!"
            style="width: 100%"
            :disable="
              !valid_hex || !(state.select_fixed || state.select_floating)
            "
            @click="translateHex"
          />
          <q-btn
            v-if="state.translated == true"
            color="blue"
            label="New Translation"
            style="width: 100%"
            @click="resetInput"
          />
          <!-- TODO -->
        </div>
      </form>
    </div>
    <!-- Bin Form -->
    <form
      id="bin-form"
      v-if="state.selected === 'bin'"
      class="px-4 flex-column justify-center"
    >
      <div class="my-2">
        <h1 class="text-black text-xl lato-regular">Enter sign bit</h1>
        <q-input
          outlined
          v-model="state.signbit"
          :maxlength="1"
          lazy-rules
          :rules="[
            (val) => val == 0 || val == 1 || 'Sign bit must either be 0 or 1',
          ]"
          :readonly="state.translated == true"
          error-message=""
        />
        <h1 class="text-black text-xl lato-regular">Enter exponent</h1>
        <q-input
          outlined
          v-model="state.exponent"
          :maxlength="11"
          lazy-rules
          :rules="[
            (val) =>
              val == null ||
              val.length == 11 ||
              'Please enter an 11-bit binary number',
            (val) => /^[0-1]{1,}$/.test(val) || 'Enter a valid binary number',
          ]"
          :readonly="state.translated == true"
          error-message=""
        />
        <h1 class="text-black text-xl lato-regular">Enter mantissa</h1>
        <q-input
          outlined
          v-model="state.mantissa"
          :maxlength="52"
          lazy-rules
          :rules="[
            (val) => val.length == 52 || 'Please enter a 52-bit binary number',
            (val) => /^[0-1]{1,}$/.test(val) || 'Enter a valid binary number',
          ]"
          :readonly="state.translated == true"
          error-message=""
        />
      </div>
      <div style="height: 12.5%" v-if="state.selected === 'bin'">
        <div class="q-gutter-sm">
          <q-checkbox
            v-model="state.select_fixed"
            label="Show fixed point"
            color="blue"
            :disable="state.translated == true"
          />
          <q-checkbox
            v-model="state.select_floating"
            label="Show floating point"
            color="blue"
            :disable="state.translated == true"
          />
        </div>
        <q-btn
          v-if="state.translated == false"
          color="blue"
          label="Translate!"
          style="width: 100%"
          :disable="
            !valid_bin || !(state.select_fixed || state.select_floating)
          "
          @click="translateBin"
        />
        <q-btn
          v-if="state.translated == true"
          color="blue"
          label="New Translation"
          style="width: 100%"
          @click="resetInput"
        />
        <!-- TODO -->
      </div>
    </form>
  </div>
  <div id="result-container" class="result-container relative m-auto my-4">
    <div id="result" class="px-4 pt-4">
      <h1 class="lato-semibold text-lg">Result:</h1>
      <hr class="border-1 border-black" />
    </div>
    <div class="px-4 py-2" v-if="state.translated == true">
      <h1 class="lato-regular text-lg">Sign Bit: {{ state.result_signbit }}</h1>
      <h1 class="lato-regular text-lg">
        Exponent: {{ state.result_exponent }}
      </h1>
      <h1 class="lato-regular text-lg">
        Mantissa: {{ state.result_mantissa }}
      </h1>
      <br />
      <h1 v-if="state.select_fixed === true" class="lato-regular text-lg">
        Fixed point decimal: {{ state.fixed_point }}
      </h1>
      <h1 v-if="state.select_floating === true" class="lato-regular text-lg">
        Floating point decimal: {{ state.floating_point }}
      </h1>
    </div>
    <div class="px-4">
      <q-btn
        color="blue"
        label="Download Result"
        style="width: 94.5%"
        class="absolute bottom-4"
      />
      <!-- TODO -->
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';

export default {
  name: 'Translator',
  head: {
    title() {
      return {
        inner: 'CSARCH2 - G12 | Binary64 Translator',
      };
    },
  },
  setup() {
    const state = reactive({
      selected: 'hex',
      translated: false,
      hex_input: null,
      signbit: null,
      exponent: null,
      mantissa: null,
      select_fixed: false,
      select_floating: false,
      fixed_point: null,
      floating_point: null,
      result_signbit: null,
      result_exponent: null,
      result_mantissa: null,
    });

    const valid_bin = computed(() =>
      isBin(state.signbit + state.exponent + state.mantissa)
    );
    const valid_hex = computed(() => isHex(state.hex_input));

    function resetInput() {
      state.selected = 'hex';
      state.hex_input = null;
      state.signbit = null;
      state.exponent = null;
      state.mantissa = null;
      state.fixed_point = null;
      state.floating_point = null;
      state.result_signbit = null;
      state.result_exponent = null;
      state.result_mantissa = null;
      state.select_fixed = false;
      state.select_floating = false;
      state.translated = false;
    }

    function translateHex() {
      if (isHex(state.hex_input)) {
        const hex = state.hex_input;
        const bin = hexToBin(hex);
        console.log(bin);
        const [signBit, expo, mantissa] = splitBinary(bin);

        const [isSpecial, code] = isSpecialCase(signBit, expo, mantissa);

        const [result, resultFp] = getResult(isSpecial, code, bin, signBit);

        state.result_signbit = signBit;
        state.result_exponent = expo;
        state.result_mantissa = mantissa;
        state.fixed_point = result;
        state.floating_point = resultFp;
        state.translated = true;
      }
    }

    function translateBin() {
      const bin = state.signbit + state.exponent + state.mantissa;
      if (isBin(bin)) {
        const [signBit, expo, mantissa] = splitBinary(bin);
        const [isSpecial, code] = isSpecialCase(signBit, expo, mantissa);

        const [result, resultFp] = getResult(isSpecial, code, bin, signBit);

        state.result_signbit = signBit;
        state.result_exponent = expo;
        state.result_mantissa = mantissa;
        state.fixed_point = result;
        state.floating_point = resultFp;
        state.translated = true;
      }
    }

    function decimaltoFloatingPoint(dec) {
      let expo = Number.parseFloat(dec).toExponential();
      const splitExpo = expo.split('.');
      let fpResult = '';

      for (let i = 0; i < expo.indexOf('e'); i++) {
        fpResult += expo[i];
      }
      if (splitExpo[0].length == 1 || splitExpo.length == 1) {
        if (expo.indexOf('e') == 1) fpResult += '.0';
      }
      fpResult += ' x 10^';
      if (expo[expo.indexOf('e') + 1] == '-') {
        fpResult += '-';
      }
      for (let j = expo.indexOf('e') + 2; j < expo.length; j++) {
        fpResult += expo[j];
      }

      return fpResult;
    }

    function convToFloatingPoint(bin) {
      const expoBin = parseInt(bin[1], 2);
      const exponentVal = expoBin - 1023;
      if (bin[2].includes('1')) {
        const lastInd = bin[2].lastIndexOf('1');
        const frac = [];
        for (let m = 0; m < lastInd + 1; m++) {
          frac[m] = bin[2][m];
        }
        const finFrac = frac.join('');
        if (exponentVal < -1022) {
          return '0' + '.' + finFrac + ' x 2^-1022';
        } else {
          return '1' + '.' + finFrac + ' x 2^' + exponentVal;
        }
      } else {
        const fPoint = '1' + '.' + '0' + ' x 2^' + exponentVal;
        return fPoint;
      }
    }

    function isZero(signBit, expo, fracPart) {
      let sign = '';
      for (let i = 0; i < 12; i++) {
        if (expo[i] == 1) {
          return [false, sign];
        }
      }
      for (let i = 0; i < 53; i++) {
        if (fracPart[i] == 1) {
          return [false, sign];
        }
      }
      if (signBit == 0) {
        sign = '+';
      } else {
        sign = '-';
      }

      return [true, sign];
    }

    function isDenormalized(expo, fracPart) {
      for (let i = 0; i < 12; i++) {
        if (expo[i] == 1) {
          return false;
        }
      }

      for (let i = 0; i < 53; i++) {
        if (fracPart[i] == 1) {
          return true;
        }
      }
      return false;
    }

    function isNaN(expo, fracPart) {
      let nanBool = false;
      let nanType = 'NaN';
      for (let i = 0; i < 12; i++) {
        if (expo[i] == 0) {
          return [nanBool, nanType];
        }
      }
      if (fracPart[0] == 0) {
        for (let j = 1; j < 53; j++) {
          if (fracPart[j] == 1) {
            nanBool = true;
            nanType = 'sNaN';
            return [nanBool, nanType];
          }
        }
      }
      if (fracPart[0] == 1) {
        nanBool = true;
        nanType = 'qNaN';
        return [nanBool, nanType];
      }

      return [nanBool, nanType];
    }

    function isSpecialCase(signBit, expo, fracPart) {
      let bool = false;
      let caseCode = 'NaN';

      let [zeroBool, sign] = isZero(signBit, expo, fracPart);
      let [nanBool, nanType] = isNaN(expo, fracPart);

      if (sign == '+' && zeroBool) {
        bool = true;
        caseCode = 'posZero';
      } else if (sign == '-' && zeroBool) {
        bool = true;
        caseCode = 'negZero';
      }

      if (isDenormalized(expo, fracPart)) {
        bool = true;
        caseCode = 'denorm';
      }

      if (nanBool) {
        if (nanType == 'sNaN') {
          bool = true;
          caseCode = 'sNaN';
        } else if (nanType == 'qNaN') {
          bool = true;
          caseCode = 'qNaN';
        }
      }

      if (!zeroBool) {
        return [bool, caseCode];
      }

      return [bool, caseCode];
    }

    function splitBinary(bin) {
      let binArray = bin.split('');
      const signBit = binArray[0];
      const expoRep = [];

      for (let i = 1; i < 12; i++) {
        expoRep[i - 1] = binArray[i];
      }
      const expoRepFin = expoRep.join('');
      const fracPart = [];
      for (let j = 12; j < bin.length + 1; j++) {
        fracPart[j - 12] = binArray[j];
      }
      const fracPartFin = fracPart.join('');
      return [signBit, expoRepFin, fracPartFin];
    }

    function normalizeToFixedPoint(normalize) {
      normalize = normalize.replace(/\s+/g, '');

      var negative = 0;

      if (normalize.substring(0, 1) === '-') {
        negative = 1;
      }

      var mantissa = normalize
        .substring(normalize.indexOf('.') + 1, normalize.indexOf('x'))
        .split('');
      var exponent = normalize.split('^');

      if (exponent[1].indexOf('-') == -1) {
        var exponentInt = parseInt(exponent[1]);

        if (exponentInt == 0) {
          return normalize;
        }

        var result = '1';

        for (let i = 0; i < exponentInt; i++) {
          if (i < mantissa.length) {
            result = result + mantissa[i];
          } else {
            result = result + '0';
          }
        }

        result = result + '.';

        if (exponentInt >= mantissa.length) {
          result = result + '0';
        } else {
          for (let i = exponentInt; i < mantissa.length; i++) {
            result = result + mantissa[i];
          }
        }

        if (negative === 1) {
          result = '-' + result;
        } else {
          result = result;
        }

        return result;
      } else {
        var nonSplitMantissa = normalize.substring(
          normalize.indexOf('.') + 1,
          normalize.indexOf('x')
        );
        var temp = exponent[1].split('-');
        var result = nonSplitMantissa;
        var exponentInt = parseInt(temp[1]);

        for (let i = 0; i < exponentInt; i++) {
          if (i == 0) {
            result = '1' + result;
          } else {
            result = '0' + result;
          }
        }

        if (negative === 1) {
          result = '-' + '0.' + result;
        } else {
          result = '0.' + result;
        }

        return result;
      }
    }

    function binaryFractiontoDecimal(bin, signBit) {
      const splitBin = bin.split('.');
      const binInt = parseInt(splitBin[0], 2);

      if (parseInt(splitBin[1], 2) === 0) {
        if (parseInt(signBit) === 1) {
          return (binInt * -1).toFixed(1);
        }
        return binInt.toFixed(1);
      }

      const binFrac = splitBin[1];
      let fracSum = 0;
      const fracSize = splitBin[1].length;
      let exponent = 2.0;

      for (let i = 0; i < fracSize; i++) {
        fracSum += parseInt(binFrac[i]) / exponent;
        exponent *= 2;
      }

      if (parseInt(signBit) === 1) {
        return (binInt + fracSum) * -1;
      }
      return binInt + fracSum;
    }

    function hexToBin(hex) {
      let bin = '';
      for (let nibble of hex) {
        switch (nibble) {
          case '0':
            bin += '0000';
            break;
          case '1':
            bin += '0001';
            break;
          case '2':
            bin += '0010';
            break;
          case '3':
            bin += '0011';
            break;
          case '4':
            bin += '0100';
            break;
          case '5':
            bin += '0101';
            break;
          case '6':
            bin += '0110';
            break;
          case '7':
            bin += '0111';
            break;
          case '8':
            bin += '1000';
            break;
          case '9':
            bin += '1001';
            break;
          case 'A':
            bin += '1010';
            break;
          case 'B':
            bin += '1011';
            break;
          case 'C':
            bin += '1100';
            break;
          case 'D':
            bin += '1101';
            break;
          case 'E':
            bin += '1110';
            break;
          case 'F':
            bin += '1111';
            break;
        }
      }
      return bin;
    }

    function getResult(isSpecial, code, bin, signBit) {
      let result = '';
      console.log(isSpecial);
      console.log(code);
      if (isSpecial) {
        if (code === 'posZero') {
          result = '+0';
        } else if (code === 'negZero') {
          result = '-0';
        } else if (code === 'denorm') {
          let fpBin = convToFloatingPoint(splitBinary(bin));
          let normalized = normalizeToFixedPoint(fpBin);
          result = binaryFractiontoDecimal(normalized);
          if (parseInt(signBit)) {
            result *= -1;
          }
          let resultFp = decimaltoFloatingPoint(result);
          return [result, resultFp];
        } else if (code === 'sNaN') {
          result = 'sNaN';
        } else if (code === 'qNaN') {
          result = 'qNaN';
        }

        return [result, result];
      } else {
        let fpBin = convToFloatingPoint(splitBinary(bin));
        let normalized = normalizeToFixedPoint(fpBin);
        result = binaryFractiontoDecimal(normalized, signBit);

        if (result == '-Infinity' || result == 'Infinity') {
          return [result, result];
        }

        let resultFp = decimaltoFloatingPoint(result);
        return [result, resultFp];
      }
    }

    function isHex(hex) {
      return /^[0-9A-F]+$/.test(hex) && hex.length === 16;
    }

    function isBin(bin) {
      return /^[0-1]{1,}$/.test(bin) && bin.length === 64;
    }

    return {
      state,
      isHex,
      translateHex,
      translateBin,
      valid_bin,
      valid_hex,
      resetInput,
    };
  },
};
</script>

<style></style>
