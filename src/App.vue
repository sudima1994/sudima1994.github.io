<template>
  <div class="homepage-wrapper">
    <div class="header">
      <h2>Country Informtation Center</h2>
    </div>
    <div class="search-wrapper">
      <autocomplete
        :search="search"
        @submit="filterCountry"
        placeholder="Search for a country"
        auto-select
      ></autocomplete>
    </div>
    <div class="no-country-msg" v-if="isEmpty">
      {{ noCountryMsg }}
    </div>
    <country-card
    :countries="countries"
    :filter="filter"
    :show="show"
    :isEmpty="isEmpty"
    ></country-card>
  </div>
</template>

<script>
import "regenerator-runtime/runtime.js";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import countryCard from "./components/countryCard.component.vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  created() {
    this.fetchCountries();
  },
  components: {
    Autocomplete, countryCard
  },
  data() {
    return {
      source: "https://restcountries.eu/rest/v2/all",
      countries: [],
      countriesNames: [],
      filter: "",
      isEmpty: false,
      show: false,
      noCountryMsg:
        "Wer'e sorry, there are no countries with such name, please try again",
    };
  },
  computed: {},
  methods: {
    /**
     * Fetching all the countries data from the external API
     */
    fetchCountries() {
      fetch(this.source)
        .then((res) => res.json())
        .then((data) => {
          this.countries = data;
          data.forEach((country) => this.countriesNames.push(country.name));
        })
        .catch((error) => console.error(error));
    },
    /**
     * Find the country that we wish to present to the user according to his input
     */
    filterCountry(result) {
      this.isEmpty = false;
      if (typeof result != "undefined") {
        // Find the country  that matches the search string that was provided
        this.filter = this.countries.find(
          (country) => country.name.toLowerCase() === result.toLowerCase()
        );
        this.show = true;
      } else {
        this.filter = "";
        this.isEmpty = true;
        this.show = false;
      }
    },
    /**
     * Search countries with matching strings for the auto-complete functionality
     */
    search(input) {
      if (input.length < 1) {
        return [];
      }
      return this.countriesNames.filter((country) => {
        return country.toLowerCase().startsWith(input.toLowerCase());
      });
    }
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}
.homepage-wrapper {
  font-family: "Roboto", sans-serif;
}
.header {
  display: flex;
  justify-content: center;
  padding-top: 4em;
}
.search-wrapper {
  padding: 5em 0 3em 0;
  margin: 0 auto;
  max-width: 45%;
}
</style>
