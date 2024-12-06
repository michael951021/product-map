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
    else {stateElements.forEach(state => {state.classList.add('highlight');})}

}
document.getElementById('highlightBtn').addEventListener('click', () => {
    const stateInput = document.getElementById('stateInput').value.trim().toLowerCase();

    highlightStates(Array.of(stateInput));
});