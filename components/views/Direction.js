import html from "html-literal";

export default state => html`
  <h2>Input the Starting Location and The Desired Destination!</h2>
  <form id="direction" method="POST" action="">
    <div id="fromLocation">
      <h3>Starting Location</h3>
      <div>
        <label for="fromStreet">Street: </label>
        <input
          type="text"
          name="fromStreet"
          id="fromStreet"
          placeholder="Enter Street Address"
          required
        />
        <label for="fromCity">City: </label>
        <input
          type="text"
          name="fromCity"
          id="fromCity"
          placeholder="Enter City"
          required
        />
        <label for="fromState">State: </label>
        <input
          type="text"
          name="fromState"
          id="fromState"
          placeholder="Enter State Initials"
          required
        />
      </div>
    </div>
    <div id="toLocation">
      <h3>Final Location</h3>
      <div>
        <label for="toStreet">Street: </label>
        <input
          type="text"
          name="toStreet"
          id="toStreet"
          placeholder="Enter Street Address"
          required
        />
        <label for="toCity">City: </label>
        <input
          type="text"
          name="toCity"
          id="toCity"
          placeholder="Enter City"
          required
        />
        <label for="toState">State: </label>
        <input
          type="text"
          name="toState"
          id="toState"
          placeholder="Enter State Initials"
          required
        />
      </div>
    </div>
    <input type="submit" name="showDirections" value="Show Directions" />
    <input type="submit" name="showRoute" value="Show Route" />
  </form>

  <h2>Here are your directions</h2>
  <div class="directions">
    <ul class="directions">
      ${checkDirection(state.directions.maneuvers)}
    </ul>
  </div>
`;

function checkDirection(maneuvers) {
  if (maneuvers) {
    return maneuvers.map(leg => `<li>${leg.narrative}<br/><img src="${leg.mapUrl}"></li>`);
  }

  return `Please Submit Addresses Above!`;
}

