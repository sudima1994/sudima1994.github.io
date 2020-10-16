<template>
  <transition name="slide-fade">
    <div v-if="!isEmpty && filter != '' && show" class="card-container">
      <div class="card">
        <div class="card-header">
          <img class="country-flag" :src="filter.flag" />
          <span class="country-title">{{ filter.name }}</span>
        </div>
        <div class="card-body">
          <span class="initial-card-info">
            <p class="card-text">
              <font-awesome-icon class="info-icon" icon="home" />
              <span class="info-title">Capital:</span>
              {{ filter.capital }}
            </p>
            <p class="card-text">
              <font-awesome-icon class="info-icon" icon="globe" />
              <span class="info-title">Region:</span>
              {{ filter.region }}
            </p>
            <p class="card-text">
              <font-awesome-icon class="info-icon" icon="user-friends" />
              <span class="info-title">Population:</span>
              {{ filter.population }}
            </p>
          </span>
          <span class="secondary-card-info">
            <p class="card-text">
              <font-awesome-icon class="info-icon" icon="clock" />
              <span class="info-title">Time-zone:</span>
              {{ filter.timezones[0] }}
            </p>
            <p class="card-text">
              <font-awesome-icon class="info-icon" icon="language" />
              <span class="info-title">Language:</span>
              {{ filter.languages[0].name }}
            </p>
            <p class="card-text">
              <font-awesome-icon class="info-icon" icon="coins" />
              <span class="info-title">Currency:</span>
              {{ filter.currencies[0].name }}
              {{ filter.currencies[0].symbol }}
            </p>
          </span>
        </div>
        <div v-if="filter.borders.length > 0" class="card-footer">
          <p class="card-text">
            <span class="info-title">Border countries:</span>
            <br />
            <span
              v-for="(neighbor, i) in getBorderCountries(filter.borders)"
              v-bind:key="neighbor"
            >
              {{ neighbor }}
              <span v-if="i != getBorderCountries(filter.borders).length - 1"
                >,</span
              >
            </span>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "countryCard.component",
  data() {
    return {};
  },
  props: {
    filter: {
      required: true,
    },
    countries: {
      required: true,
    },
    isEmpty: {
      type: Boolean,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    /**
     * Parses the Borders from alpha3Code to regular name
     */
    getBorderCountries(borders) {
      let borderCountriesNames = [];
      this.countries.forEach((country) => {
        if (borders.includes(country.alpha3Code)) {
          borderCountriesNames.push(country.name);
        }
      });
      return borderCountriesNames;
    },
  },
};
</script>

<style lang="scss">
.country-card {
  display: flex;
  justify-content: center;
}
.card-container {
  display: flex;
  justify-content: center;
}
.card {
  width: 45%;
  box-shadow: 0 2px 5px black;
}
.card-header {
  display: flex;
  flex-direction: row;
  align-items: center;

  .country-flag {
    width: 4vw;
    height: 3vw;
    border-radius: 7%;
  }
  .country-title {
    padding-left: 1em;
    font-weight: 700;
    font-size: 1.5vw;
  }
}
.card-body {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .info-title {
    font-weight: 600;
    font-size: 0.9vw;
  }
  .info-icon {
    margin-right: 0.4em;
  }
}
.card-body,
.card-footer {
  font-size: 0.8vw;
}
.no-country-msg {
  display: flex;
  justify-content: center;
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
