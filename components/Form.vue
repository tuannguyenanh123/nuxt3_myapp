<template>
  <va-form ref="formRef">
    <va-input
      v-for="key in Object.keys(props.createdItem)"
      v-bind:key="key"
      v-model="createdItem[key]"
      v-bind:rules="[(value) => (value && value.length > 0) || `${value} is required`]"
      v-bind:label="key"
      v-bind:placeholder="key"
    />
  </va-form>
</template>

<script setup>
const props = defineProps({
  createdItem: {
    type: Object,
    required: true
  }
})
const createdItem = ref(props.createdItem)

onMounted(() => {
  console.log(props.createdItem)
})
</script>
