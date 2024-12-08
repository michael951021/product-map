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
const state_names = Array.of("Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming");

state_names.forEach(state_name => {
    state_map.set(state_name, 0);
})

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
    queried_states = queried_states.map((state) => state.toLowerCase())
    // Reset highlight of all states
    const states = document.querySelectorAll('.state');
    states.forEach(state => state.classList.remove('highlight'));

    const stateElements = Array.from(states).filter(state =>
        queried_states.includes(state.getAttribute('data-name')?.toLowerCase())
    );

    if (stateElements.length === 0) {console.log("No states updated")}
    else {stateElements.forEach(state => {fillState(state, 1);})}

}
document.getElementById('highlightBtn').addEventListener('click', () => {
    const stateInput = document.getElementById('stateInput').value.trim().toLowerCase();
    highlightStates(Array.of(stateInput));
});