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

/*
 * Color a state element with a brightness value and a color target
 *
 * @param {Element} stateElement - HTML element of the state in the svg
 * @param {number} value - Brightness value of the color in [0,1]
 * @param {string} [targetColor='rgb(255, 0, 0)'] - The target color for interpolation, defaulting to red.
 * @return void
 */
function fillState(stateElement, value, targetColor = 'rgb(255, 0, 0)') {
    if (!stateElement) {
        console.error(`State element not found.`);
        return;
    }

    // Ensure brightness is between 0 and 1
    let brightness = Math.max(0, Math.min(1, value));

    // Retrieve the base color from the .state CSS class or the current element
    const computedStyle = getComputedStyle(stateElement);
    const baseColor = computedStyle.fill || 'rgb(204, 204, 204)'; // Default to #cccccc if not set

    // Parse the base and target colors into RGB components
    const parseRGB = (color) => {
        const match = color.match(/\d+/g);
        return match ? match.map(Number) : [204, 204, 204];
    };
    const [baseR, baseG, baseB] = parseRGB(baseColor);
    const [targetR, targetG, targetB] = parseRGB(targetColor);

    // Interpolate between base and target colors
    const interpolate = (start, end, factor) => Math.round(start + (end - start) * factor);
    const redValue = interpolate(baseR, targetR, brightness);
    const greenValue = interpolate(baseG, targetG, brightness);
    const blueValue = interpolate(baseB, targetB, brightness);

    // Construct the RGB color
    const fillColor = `rgb(${redValue}, ${greenValue}, ${blueValue})`;

    // Apply the fill color to the element
    stateElement.style.fill = fillColor;
}

/*
 * Highlights all the states in the map queried_states with their associated brightness
 *
 * @param {Object.<string, number>} queried_states - Map of lowercase state names to value in [0,1]
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
    // const randomArray = Array.from({ length: 50 }, () => Math.round(Math.random()));
    // randomArray.forEach((item, i) => {
    //     state_map_clone.set(state_names[i], item);
    // })

    highlightStates(state_map_clone);
});