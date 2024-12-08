// Add an event listener for the Enter key on the input box
document.getElementById('stateInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission if inside a form
        document.getElementById('highlightBtn').click(); // Trigger button click
    }
});

// Initialize U.S. map
fetch('assets/us.svg')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load SVG');
        return response.text();
    })
    .then(svgContent => {
        document.getElementById('map').innerHTML = svgContent;

        const states = document.querySelectorAll('#map path');
        states.forEach(state => {
            if (!state.hasAttribute('fill') || state.getAttribute('fill') === 'none') {
                state.style.fill = '#cccccc'; // Inline style to override everything
            }
            state.classList.add('state'); // Ensure default styling
            state.addEventListener('mouseover', () => state.style.fill = '#ffcccb');
            state.addEventListener('mouseout', () => state.style.fill = '');
        });
    })
    .catch(error => console.error('Error loading SVG:', error));

// State class with name {statename}
class State {
    constructor(statename, val) {
        this.state = statename.toLowerCase();
        this.val = val;
    }
}
// Map of state to gradient value
const state_map = new Map();

// All 50 U.S. states in alphabetical order
const state_names = Array.of(
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
    "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
    "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine",
    "maryland", "massachusetts", "michigan", "minnesota", "mississippi",
    "missouri", "montana", "nebraska", "nevada", "new hampshire", "new jersey",
    "new mexico", "new york", "north carolina", "north dakota", "ohio",
    "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina",
    "south dakota", "tennessee", "texas", "utah", "vermont", "virginia",
    "washington", "west virginia", "wisconsin", "wyoming"
);

state_names.forEach(state_name => {
    state_map.set(state_name, 0);
})

// TODO add target color as function parameter
// Fill a {state} object with its attributed brightness value
function fillState(stateElement, value) {
    // Ensure brightness is between 0 and 1
    let brightness = 0;
    if (value < 0) brightness = 0;
    else if (value > 1) brightness = 1;
    else brightness = value;

    // Base gray color: #cccccc
    const baseGray = 204; // Decimal value of #cc in RGB

    // Interpolate between gray and red
    const redValue = Math.round(baseGray + (255 - baseGray) * brightness); // Blend from gray to red
    const greenBlueValue = Math.round(baseGray * (1 - brightness)); // Reduce gray components as brightness increases

    // Construct the RGB color
    const fillColor = `rgb(${redValue}, ${greenBlueValue}, ${greenBlueValue})`;

    if (stateElement) {
        stateElement.style.fill = fillColor;
    } else {
        console.error(`State element not found.`);
    }
}

// TODO update to take in tuple with probabilities, and change color on gradient
/*
 * Highlights all the states in the array {queried_states}
 * @param {queried_states} capitalization insensitive states to highlight
 * @return void
 */
function highlightStates(queried_states) {
    console.log('Queried states:', queried_states);
    // Reset highlight of all states
    const states = document.querySelectorAll('.state');
    states.forEach(state => state.classList.remove('highlight'));

    states.forEach(state => {
        const state_name = state.getAttribute('data-name').toLowerCase();
        console.log(state_name);
        if (queried_states.has(state_name)) {
            console.log("Queried: ", state_name)
            fillState(state, queried_states.get(state_name));
        } else {
            fillState(state, 0);
        }
    });
}
document.getElementById('highlightBtn').addEventListener('click', () => {
    const stateInput = document.getElementById('stateInput').value.trim().toLowerCase();



    // Array of state objects that contain their associated brightness values
    const state_array = Array.of(new State(stateInput, 1));

    const state_map_clone = new Map(state_map)

    state_array.forEach(stateObj => {
        const state = stateObj.state;
        if (state_map_clone.has(state)) {
            state_map_clone.set(state, stateObj.val);
        }
    })

    // LIGHT SHOW!!
    const randomArray = Array.from({ length: 50 }, () => Math.round(Math.random()));
    randomArray.forEach((item, i) => {
        state_map_clone.set(state_names[i], item);
    })

    highlightStates(state_map_clone);
});