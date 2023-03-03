import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios, { Axios } from "axios";

const router = new Navigo("/");

function render(state = store.Home) {
  document.querySelector("#root").innerHTML = `
      ${Header(state)}
      ${Nav(store.Links)}
      ${Main(state)}
      ${Footer()}
    `;

  afterRender(state);

  router.updatePageLinks();
}

function afterRender(state) {
  // add menu toggle to bars icon in nav bar
  document.querySelector(".fa-bars").addEventListener("click", () => {
    document.querySelector("nav > ul").classList.toggle("hidden--mobile");
  });
  if (state.view === "Home") {
    // DO DOM stuff here
    console.log("Hello");
  }

  if (state.view === "Direction") {
    const formEntry = document.querySelector("form");
    const directionList = document.querySelector(".directions");

    formEntry.addEventListener("submit", async event => {
      event.preventDefault();

      console.log('matsinet-event:', event);

      // directionList.classList.toggle("directions");
      const inputList = event.target.elements;
      console.log("Input Element List", inputList);

      const from = {
        street: inputList.fromStreet.value,
        city: inputList.fromCity.value,
        state: inputList.fromStreet.value
      };

      store.Direction.from = from;
      store.Route.from = from;

      const to = {
        street: inputList.toStreet.value,
        city: inputList.toCity.value,
        state: inputList.toStreet.value
      };

      store.Direction.to = to;
      store.Route.to = to;

      if (event.submitter.name === "showDirections") {

        /*
          Please refer to the documentation:
          https://developer.mapquest.com/documentation/directions-api/
        */

        axios.get(`http://www.mapquestapi.com/directions/v2/route?key=${process.env.MAPQUEST_API_KEY}&from=${from.street},+${from.city},+${from.state}&to=${to.street},+${to.city},+${to.state}`)
          .then(response => {
            store.Direction.directions = response.data;
            store.Direction.directions.maneuvers = response.data.route.legs[0].maneuvers;
            router.navigate("/Direction");
          })
          .catch(error => {
            console.log("It puked", error);
          });
      }

      if (event.submitter.name === "showRoute") {
        router.navigate("/Route");
      }
    });
  }

  if (state.view === "Map") {

    /*
      Please refer to the documentation:
      https://developer.mapquest.com/documentation/mapquest-js/v1.3/
    */

    L.mapquest.key = process.env.MAPQUEST_API_KEY;

    // 'map' refers to a <div> element with the ID map
    const map = L.mapquest.map('map', {
      center: [42, -71],
      layers: L.mapquest.tileLayer('map'),
      zoom: 5
    });

    // var directions = L.mapquest.directions();
    
    // directions.route({
    //   start: 'Washington, DC',
    //   end: 'New York, NY'
    // });

    L.mapquest
      .textMarker([42, -71], {
        text: "Sample Marker",
        subtext: "Click Here for More Details",
        position: "right",
        type: "marker",
        hover: "Howdy",
        icon: {
          primaryColor: "#333333",
          secondaryColor: "#333333",
          size: "sm"
        }
      })
      .addTo(map);

      L.marker([30, -90], {
        icon: L.mapquest.icons.marker({
          primaryColor: '#22407F',
          secondaryColor: '#3B5998',
          shadow: true,
          size: 'md'
          // symbol: 'T'
        })
      })
      .addTo(map);

    map.addControl(L.mapquest.control());
  }
}

router.hooks({
  before: (done, params) => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Home";

    // Add a switch case statement to handle multiple routes
    switch (view) {
      case "Home":
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=st%20louis`
          )
          .then(response => {
            const kelvinToFahrenheit = kelvinTemp =>
              Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

            store.Home.weather = {};
            store.Home.weather.city = response.data.name;
            store.Home.weather.temp = kelvinToFahrenheit(
              response.data.main.temp
            );
            store.Home.weather.feelsLike = kelvinToFahrenheit(
              response.data.main.feels_like
            );
            store.Home.weather.description = response.data.weather[0].main;

            console.log(response.data);
            done();
          })
          .catch(err => console.log(err));
        break;
      default:
        done();
    }
  },
  already: params => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Home";

    render(store[view]);
  }
});

router
  .on({
    "/": () => render(),
    ":view": params => {
      let view = capitalize(params.data.view);
      render(store[view]);
    }
  })
  .resolve();
