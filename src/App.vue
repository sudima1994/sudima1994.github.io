<template>
  <div class="homepage-wrapper">
    <div class="header">
      <h1>Country Informtation Center</h1>
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
                <font-awesome-icon icon="home" />
                <span class="info-title">Capital:</span>
                {{ filter.capital }}
              </p>
              <p class="card-text">
                <font-awesome-icon icon="globe" />
                <span class="info-title">Region:</span>
                {{ filter.region }}
              </p>
              <p class="card-text">
                <font-awesome-icon icon="user-friends" />
                <span class="info-title">Population:</span>
                {{ filter.population }}
              </p>
            </span>
            <span class="secondary-card-info">
              <p class="card-text">
                <font-awesome-icon icon="clock" />
                <span class="info-title">Time-zone:</span>
                {{ filter.timezones[0] }}
              </p>
              <p class="card-text">
                <font-awesome-icon icon="language" />
                <span class="info-title">Language:</span>
                {{ filter.languages[0].name }}
              </p>
              <p class="card-text">
                <font-awesome-icon icon="coins" />
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
  </div>
</template>

<script>
import "regenerator-runtime/runtime.js";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  created() {
    this.fetchCountries();
  },
  components: {
    Autocomplete,
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
    fetchCountries() {
      // Fetch the data of all the countries to avoid making the user wait every time for a data fetch
      fetch(this.source)
        .then((res) => res.json())
        .then((data) => {
          this.countries = data;
          data.forEach((country) => this.countriesNames.push(country.name));
        })
        .catch((error) => console.error(error));
    },
    filterCountry(result) {
      this.isEmpty = false;
      if (typeof result != "undefined") {
        // Find the country or countries that match the search string that was provided
        this.filter = this.countries.find(
          (country) => country.name.toLowerCase() === result.toLowerCase()
        );
        this.show = true;
      } else {
        this.filter = "";
        this.isEmpty = true;
        this.show = false;
      }
      this.createKnowledgeBase();
    },
    search(input) {
      if (input.length < 1) {
        return [];
      }
      return this.countriesNames.filter((country) => {
        return country.toLowerCase().startsWith(input.toLowerCase());
      });
    },
    getBorderCountries(borders) {
      let borderCountriesNames = [];
      this.countries.forEach((country) => {
        if (borders.includes(country.alpha3Code)) {
          borderCountriesNames.push(country.name);
        }
      });
      return borderCountriesNames;
    },
    createKnowledgeBase() {
      let questions = [
        {
          title: '"What is the capital of COUNTRY?"',
          tags: ["capital", "city", "COUNTRY"],
          summary: '"The capital of COUNTRY is ANSWER"',
          alternates: '"What is the capital city of COUNTRY"',
        },
        {
          title: '"In what region is COUNTRY located?"',
          tags: ["region", "location", "continent", "COUNTRY"],
          summary: '"COUNTRY is located in ANSWER"',
          alernates:
            '"What is the continent of COUNTRY, Where is COUNTRY located"',
        },
        {
          title: '"What is the population of COUNTRY?"',
          tags: [
            "population",
            "populace",
            "citizens",
            "people",
            "live",
            "COUNTRY",
          ],
          summary: '"There are ANSWER people living in COUNTRY"',
          alternates: '"How many people live in COUNTRY"',
        },
        {
          title: '"What is the time zone of COUNTRY?"',
          tags: [
            "timezones",
            "time zone",
            "belt",
            "time",
            "difference",
            "UTC",
            "COUNTRY",
          ],
          summary: '"The time zone of COUNTRY is ANSWER"',
          alternates: '"What is the time difference in COUNTRY"',
        },
        {
          title: '"What language is spoken in COUNTRY?"',
          tags: [
            "languages",
            "language",
            "speak",
            "communicate",
            "dialect",
            "speech",
            "tongue",
            "COUNTRY",
          ],
          summary: '"The language that is spoken in COUNTRY is ANSWER"',
          alternates: '"In what language do people communicate in COUNTRY"',
        },
        {
          title: '"what is the currency of COUNTRY?"',
          tags: [
            "currencies",
            "currency",
            "money",
            "coin",
            "payment",
            "coinage",
            "cash",
            "COUNTRY",
          ],
          summary: '"The accepted currency in COUNTRY is ANSWER"',
          alternates: '"What money should I bring to COUNTRY"',
        },
        {
          title: '"What are the neighboring countries of COUNTRY?"',
          tags: [
            "borders",
            "border",
            "neighbor",
            "neighboring",
            "bounds",
            "COUNTRY",
          ],
          summary: '"The neighboring countries of COUNTRY are ANSWER"',
          alternates: '"What are the borders of COUNTRY"',
        },
      ];
      let headers = [
        "id",
        "tags",
        "title",
        "summary",
        "alternates",
        "detail",
        "content_url",
        "image_url",
        "audio_url",
        "video_url",
        "category",
        "positiveLearnings",
        "negativeLearnings",
        "intentName",
        "validFrom",
        "validTo",
      ];
      let csv = "";

      // Generate the headers of the CSV file
      csv += headers.join(",") + "\r\n";
      let id = 1;
      this.countries.forEach((country) => {
        questions.forEach((question) => {
          headers.forEach((header, i) => {
            // Auto increment the id
            if (header === "id") {
              csv += id + ",";
              id++;
            } else {
              let addition;
              if (Array.isArray(question[header])) {
                // Escape commas in double-quotes for the CSV format
                addition = '"' + question[header].join(",") + '"';
              } else {
                addition = question[header] ? question[header] : "";
              }
              if (header === "summary") {
                let answer = this.getAnswer(country, question.tags[0]);
                if (answer === "none") {
                  if (question.tags[0] === "borders") {
                    addition = '"There are no bordering countries for COUNTRY"';
                  } else {
                    addition =
                      '"There is no information on that topic for COUNTRY"';
                  }
                } else {
                  // For each question add the specific country and answer that it is asked for
                  addition = addition.replace("ANSWER", answer);
                }
              }
              addition = addition.replace(
                "COUNTRY",
                country.name.split(",")[0].split("(")[0].trim()
              );
              csv += addition + (i < headers.length - 1 ? "," : "\r\n");
            }
          });
        });
      });
      var hiddenElement = document.createElement("a");
      hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
      hiddenElement.target = "_blank";
      hiddenElement.download = "knowledgeBase.csv";
      hiddenElement.click();
    },
    getAnswer(country, condition) {
      let answer;
      switch (condition) {
        case "timezones":
          answer = country[condition][0];
          break;
        case "languages":
          answer = country[condition][0].name;
          break;
        case "currencies":
          answer = country[condition][0].name;
          break;
        case "borders":
          answer = this.getBorderCountries(country[condition]);
          break;
        default:
          answer = country[condition];
      }
      return answer.toString().length > 0 ? answer : "none";
    },
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
  padding: 8em 0 5em 0;
  margin: 0 auto;
  max-width: 20vw;
}
.country-card {
  display: flex;
  justify-content: center;
}
.card-container {
  display: flex;
  justify-content: center;
}
.card {
  width: 35%;
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
