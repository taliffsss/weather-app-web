<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full placeholder-search bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
        aria-label="Search for a city or state"
      />
      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="mapboxSearchResults"
      >
        <p class="py-2" v-if="searchError">
          Sorry, something went wrong, please try again.
        </p>
        <p
          class="py-2"
          v-if="!searchError && mapboxSearchResults.length === 0"
        >
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { debounce } from 'lodash'; // Assuming lodash is in your project
import CityList from "../components/CityList.vue";

const router = useRouter();

interface SearchResult {
  id: string;
  place_name: string;
  geometry: {
    coordinates: [number, number];
  };
}

const previewCity = (searchResult: SearchResult) => {
  const [city, state] = searchResult.place_name.split(",");
  router.push({
    name: "cityView",
    params: { state: state.trim(), city: city.trim() },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: 'true',
    },
  });
};

const searchQuery = ref("");
const mapboxSearchResults = ref<Array<SearchResult>>([]);
const searchError = ref<boolean | null>(null);

const getSearchResults = debounce(async () => {
  searchError.value = null;

  if (!searchQuery.value.trim()) {
    mapboxSearchResults.value = [];
    return;
  }

  try {
    const result = await axios.get(`http://127.0.0.1:8000/api/v1/city?query=${searchQuery.value}`);
    mapboxSearchResults.value = result?.data?.result?.data?.features || [];
  } catch {
    searchError.value = true;
  }
}, 300);
</script>

<style lang="scss" scoped></style>