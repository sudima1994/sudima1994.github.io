import { questions, headers } from "../constants.js";

// Creating the knowledge base csv file
function createKnowledgeBase(countries) {
  let csv = "";

  // Generate the headers of the CSV file
  csv += headers.join(",") + "\r\n";
  let id = 1;
  countries.forEach((country) => {
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
            let answer = getAnswer(countries, country, question.tags[0]);
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
            country.name
              .split(",")[0]
              .split("(")[0]
              .trim()
          );
          addition = addition.replace("PICTURE", country.flag);
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
}

function getAnswer(countries, country, condition) {
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
      answer = getBorderCountries(countries, country[condition]);
      break;
    default:
      answer = country[condition];
  }
  return answer.toString().length > 0 ? answer : "none";
}

function getBorderCountries(countries, borders) {
  let borderCountriesNames = [];
  countries.forEach((country) => {
    if (borders.includes(country.alpha3Code)) {
      borderCountriesNames.push(country.name);
    }
  });
  return borderCountriesNames;
}

export default createKnowledgeBase
