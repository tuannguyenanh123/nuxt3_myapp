<template>
  <ClientOnly>
    <div class="header">
      <va-input v-model="valueSearch" placeholder="Search..." v-on:change="handleChangeSearch" />
      <va-button v-on:click="openModalToAddItem(rowIndex)">Create Planet</va-button>
    </div>
    <va-data-table
      v-bind:cell-bind="getCellBind"
      class="table-crud"
      v-bind:items="items.data"
      v-bind:columns="columns"
      striped
    >
      <template #header(description)="{ label }">
        <va-chip size="small">
          {{ label }}
        </va-chip>
      </template>
      <template #cell(actions)="{ rowIndex }">
        <va-button preset="plain" icon="edit" v-on:click="openModalToEditItemById(rowIndex)" />
        <va-button
          preset="plain"
          icon="delete"
          class="ml-3"
          v-on:click="openModalToDeleteItemById(rowIndex)"
        />
      </template>
    </va-data-table>

    <!-- Modal create Planet -->
    <va-modal
      v-model="isOpenModalCreate"
      class="modal-crud"
      title="Create Planet"
      size="small"
      v-on:ok="addNewItem"
      v-on:cancel="resetCreatedItem"
    >
      <va-form ref="formRef">
        <va-input
          v-for="key in Object.keys(createdItem.value)"
          v-bind:key="key"
          v-model="createdItem.value[key]"
          v-bind:rules="[(value) => (value && value.length > 0) || `${value} is required`]"
          v-bind:label="key"
          v-bind:placeholder="key"
        />
      </va-form>
      <!-- <form v-bind:createdItem="createdItem.value" /> -->
    </va-modal>

    <!-- Modal Edit Planet -->
    <va-modal
      class="modal-crud"
      v-bind:model-value="!!editedItem.item"
      title="Edit item"
      size="small"
      v-on:ok="editItem"
      v-on:cancel="resetEditedItem"
    >
      <va-form ref="formRef" class="form-edit">
        <va-input
          v-for="key in Object.keys(
            Object.fromEntries(
              Object.entries(editedItem.item).filter((e) => e[0] !== 'slug' && e[0] !== 'dir')
            )
          )"
          v-bind:key="key"
          v-model="editedItem.item[key]"
          v-bind:rules="[(value) => (value && value.length > 0) || `${value} is required`]"
          class="my-6"
          v-bind:label="key"
        />
      </va-form>
    </va-modal>
    <va-modal
      class="modal-crud"
      v-bind:model-value="!!deletedItem.item"
      title="Delete item"
      size="small"
      v-on:ok="deleteItemById(deletedItemId.value)"
      v-on:cancel="resetEditedItem"
    >
      <h6 class="va-h6">Are you sure you want to delete this item?</h6>
    </va-modal>
  </ClientOnly>
</template>

<script setup>
import { usePlanets } from '~/store/planets/getPlanets'
import { useRouter, useRoute } from 'vue-router'
import { useForm } from 'vuestic-ui'

const planetStore = usePlanets()
const router = useRouter()
const route = useRoute()

const { validate } = useForm('formRef')

const defaultItem = {
  title: '',
  description: '',
  distanceFromSun: ''
}

// const form = reactive({
//   title: '',
//   description: '',
//   distanceFromSun: ''
// })

const columns = [
  { key: 'title', sortable: true },
  { key: 'description', sortable: true },
  { key: 'distanceFromSun', sortable: true, value: 'image' },
  { key: 'actions' }
]

const items = reactive({
  data: []
})
const editedItemId = ref(null)
const valueSearch = ref('')
const editedItem = reactive({
  item: null
})
const deletedItemId = ref(null)
const deletedItem = reactive({
  item: null
})
const createdItem = reactive({
  value: defaultItem
})
const isOpenModalCreate = ref(false)

onMounted(async () => {
  const query = { ...route.query }
  valueSearch.value = query.s

  await planetStore.fetchPlanets()
  items.data = planetStore?.planetData

  if (query.s) {
    const updatePlanets = items.data.filter((planet) =>
      planet.title.toLowerCase().includes(query.s.toLowerCase())
    )
    items.data = updatePlanets
  }
})

//computed
// const isNewData = computed(() => {
//   return Object.keys(createdItem.value).every((key) => !!createdItem.value[key])
// })

// const filtered = computed((arrKey, arrOrig) => {
//   return arrKey.reduce((result, key) => {
//     result[key] = arrOrig[key]
//     return result
//   }, {})
// })

// method
function resetEditedItem() {
  editedItem.item = null
  editedItemId.value = null
  deletedItemId.value = null
  deletedItem.item = null
}

function resetCreatedItem() {
  createdItem.value.description = ''
  createdItem.value.distanceFromSun = ''
  createdItem.value.title = ''
}

function deleteItemById() {
  // items.data = [
  //   ...items.data.slice(0, deletedItemId.value),
  //   ...items.data.slice(deletedItemId.value + 1)
  // ]
  // const getSearch = (id) => planetStore.deletePlanet(id);
  // items.data = getSearch(deletedItemId.value);
  planetStore.deletePlanetById(deletedItemId.value) //toRaw(deletedItem.item)
  items.data = toRaw(planetStore?.planetData)
  resetEditedItem()
}

function openModalToAddItem() {
  isOpenModalCreate.value = true
}

function addNewItem() {
  validate()
  items.data = [...items.data, { ...createdItem.value }]
  // resetCreatedItem()
}

function editItem() {
  items.data = [
    ...items.data.slice(0, editedItemId.value),
    { ...editedItem.item },
    ...items.data.slice(editedItemId.value + 1)
  ]
  resetEditedItem()
}

function openModalToEditItemById(id) {
  editedItemId.value = id
  editedItem.item = { ...items.data[id] }
}

function openModalToDeleteItemById(id) {
  deletedItemId.value = id
  deletedItem.item = { ...items.data[id] }
}

async function handleChangeSearch(e) {
  router.push({ query: { s: e.target.value } })
  await planetStore.fetchPlanets()
  const updatePlanets = planetStore.planetData.filter((planet) =>
    planet.title.toLowerCase().includes(e.target.value.toLowerCase())
  )
  items.data = updatePlanets
}

//cell action
function getCellBind(cell, row, column) {
  if (column.key === 'actions') {
    return {
      style: { color: '#EF476F', position: 'sticky', right: 0, backgroundColor: '#f6f6f6' }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-crud {
  --va-form-element-default-width: 0;
  width: 98%;
  margin: 0 auto;

  .va-input {
    display: block;
  }

  &__slot {
    th {
      vertical-align: middle;
    }
  }
}

.header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.modal-crud {
  .va-input {
    display: block;
    margin: 20px 0;
  }
  .form-edit {
  }
}

.table-inline {
  &__cell {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }

  &__item {
    cursor: pointer;

    &--hidden {
      z-index: -1;
      opacity: 0;
      pointer-events: none;
    }
  }

  .va-input {
    position: absolute;
    width: 100%;
  }
}
</style>
