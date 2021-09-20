<template>
  <div class="covid-vis-error-modal-container">
    <div
      class="covid-vis-error-modal-close-icon material-icons covid-vis-controls-close-icon"
      @click="closeButtonClick"
    >
      close
    </div>

    <div class="covid-vis-error-modal standard-font">
      An error has occured.
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

  name: 'ErrorModal',

  methods: {
    closeButtonClick() {
      this.$emit('closeErrorModal')
    }
  }

})
</script>

<style lang="scss" scoped>

@import '../../styles/main';

.covid-vis-error-modal-container {
  background-color: $primary-color;
  max-width: 200px;
  width: 150px;
  padding: 8px 8px 8px 8px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px;
}
.covid-vis-error-modal {
  color: $accent-color;
}
.covid-vis-error-modal-close-icon {
  color: $accent-color;
  float: right;
  position: relative;
  right: 5px;
}
.covid-vis-controls-close-icon:hover {
  color: $secondary-color;
  cursor: pointer;
}

</style>
