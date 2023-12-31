<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div
      v-if="route.query.preview"
      class="text-white p-4 bg-weather-secondary w-full text-center"
    >
      <p>
        You are currently previewing this city, click the "+"
        icon to start tracking this city.
      </p>
    </div>
    <!-- Weather Overview -->
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData?.current?.currentTime).toLocaleDateString(
            "en-us",
            {
              weekday: "short",
              day: "2-digit",
              month: "short",
            }
          )
        }}
        {{
          new Date(weatherData?.current?.currentTime).toLocaleTimeString(
            "en-us",
            {
              timeStyle: "short",
            }
          )
        }}
      </p>
      <p class="text-8xl mb-8">
        {{ Math.round(weatherData?.current?.main.temp) }}&deg;
      </p>
      <p>
        Feels like
        {{ Math.round(weatherData?.current?.main.feels_like) }} &deg;
      </p>
      <p class="capitalize">
        {{ weatherData?.current?.weather[0].description }}
      </p>
      <img
        class="w-[150px] h-auto"
        :src="
          `http://openweathermap.org/img/wn/${weatherData?.current?.weather[0].icon}@2x.png`
        "
        alt=""
      />
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Hourly Weather -->
    <div class=" w-full py-12">
      <div class="mx-12 text-white">
        <h2 class="text-2xl mb-2 text-center mb-4">Hourly Weather</h2>
        <div class="flex gap-10 element-with-scroll justify-center element-with-scroll">
          <div
            v-for="hourData in weatherData.original"
            :key="hourData.dt"
            class="flex flex-col gap-4 items-center"
          >
            <p class="whitespace-nowrap text-md">
              {{
                new Date(
                  hourData.dt_txt
                ).toLocaleTimeString("en-us", {
                  day: "2-digit",
                  month: "short",
                  hour: "numeric"
                })
              }}
            </p>
            <img
              class="w-auto h-[50px] object-cover"
              :src="
                `http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`
              "
              alt=""
            />
            <p class="text-xl">
              {{ Math.round(hourData?.main?.temp) }}&deg;
            </p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Weekly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="text-2xl mb-2 text-center mb-4">2 Day Forecast</h2>
        <div
          v-for="day in weatherData.original"
          :key="day.dt"
          class="flex items-center"
        >
          <p class="flex-1">
            {{
              new Date(day.dt_txt).toLocaleDateString(
                "en-us",
                {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  hour: "numeric"
                }
              )
            }}
          </p>
          <img
            class="w-[50px] h-[50px] object-cover"
            :src="
              `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
            "
            alt=""
          />
          <div class="flex gap-2 flex-1 justify-end">
            <p>H: {{ Math.round(day.main.temp_max) }}</p>
            <p>L: {{ Math.round(day.main.temp_min) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `http://127.0.0.1:8000/api/v1/forecast?lat=${route.query.lat}&lng=${route.query.lng}`
    );

    // cal current date & time
    weatherData.data.result.data.current.currentTime = weatherData?.data?.result?.data?.current?.dt_txt;

    // cal hourly weather offset
    weatherData?.data?.result?.data?.original.forEach((cur) => {
      cur.currentTime = cur.dt * 1000;
    });

    return weatherData?.data?.result?.data;
  } catch (err) {
    console.log(err);
  }
};
const weatherData = await getWeatherData();

console.table(weatherData.current)

const router = useRouter();
const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  const updatedCities = cities.filter(
    (city) => city.id !== route.query.id
  );
  localStorage.setItem(
    "savedCities",
    JSON.stringify(updatedCities)
  );
  router.push({
    name: "home",
  });
};
</script>
