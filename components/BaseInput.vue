<template>
  <div>
    <label v-if="label" v-bind:for="id">{{ label }}</label>
    <input v-bind:id="id" v-bind:type="type" v-bind:value="modelValue" v-on:input="changeInput" />
  </div>
</template>

<script setup>
// export default {
//     props: {
//         label: {
//             type: String,
//             default: ''
//         },
//         id: {
//             type: String,
//             default: '',
//         },
//         type: {
//             type: String,
//             default: 'text'
//         },
//         modelValue: {
//             type: [String, Number],
//             default: ''
//         },
//     },
//     methods: {
//         changeInput(event) {
//             this.$emit('updateValue', event.target.value);
//         }
//     },
// }
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})
const emit = defineEmits(['updateValue'])

function changeInput(event) {
  emit('updateValue', event.target.value)
}
</script>
