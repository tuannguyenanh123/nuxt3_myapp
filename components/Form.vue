<template>
  <va-form ref="formRef">
    <va-input
      v-for="key in Object.keys(props.createdItem)"
      :rules="[(value) => (value && value.length > 0) || `${value} is required`]"
      v-bind:key="key"
      v-model="props.createdItem[key]"
      v-bind:label="key"
      v-bind:placeholder="key"
    />
  </va-form>
</template>

<script setup>
import { useForm } from 'vuestic-ui'
const props = defineProps({
    createdItem: {
        type: Object,
        required: true,
        default: {
            title: '',
            description: '',
            distanceFromSun: ''
        }
    },
    
})
const { isValid, validate, reset, resetValidation } = useForm('formRef')

onMounted(() => {
    console.log(props.createdItem);
})
</script>
