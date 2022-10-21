import html from "html-literal";

export default (state) => html`
  <h2>Route Map</h2>
  <div class="routeMap">
    ${outputMap(state)}
  </div>
`;

function outputMap(state) {
  if (typeof state.from !== 'undefined' && typeof state.to !== 'undefined') {

    /*
      Please refer to the documentation:
      https://developer.mapquest.com/documentation/static-map-api/v5/
    */

    return `<img src="https://www.mapquestapi.com/staticmap/v5/map?key=${process.env.MAPQUEST_API_KEY}&start=${state.from.street},${state.from.city},${state.from.state}&end=${state.to.street},+${state.to.city},+${state.to.state}&size=600,400@2x" alt="">`
  }
}