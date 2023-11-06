import { defineStore } from 'pinia'
import { useApi } from '@/helpers/useFetch'
import { toRaw } from 'vue'

export const usePlanets = defineStore('planet', {
  state: () => ({
    planetData: []
  }),

  getters: {
    deletePlanet: (state) => (itemId) => {
      // state này ko đổi sau mỗi lần run func
      const convertData = toRaw(state.planetData.data)
      // return convertData.filter((ele,index) => index !== itemId)
      return [...convertData.slice(0, itemId), ...convertData.slice(itemId + 1)]
    }
  },

  actions: {
    async fetchPlanets() {
      try {
        const tmp = await useApi.requestElic.get('https://api.nuxtjs.dev/planets')
        this.planetData = toRaw(tmp.data)
      } catch (error) {
        // let the form component display the error
        return error
      }
    },
    deletePlanetById(id) {
      this.$state.planetData = toRaw(this.$state.planetData).filter((ele, index) => index !== id)

      //     this.planetData = [
      //   ...toRaw(this.planetData?.data).slice(0, item),
      //   ...toRaw(this.planetData?.data).slice(item + 1)
      // ]
    }
  }
})
