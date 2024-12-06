// Add an event listener for the Enter key on the input box
document.getElementById('stateInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission if inside a form
        document.getElementById('highlightBtn').click(); // Trigger button click
    }
});

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

document.getElementById('highlightBtn').addEventListener('click', () => {
    const stateInput = document.getElementById('stateInput').value.trim().toLowerCase();

    const states = document.querySelectorAll('.state');
    states.forEach(state => state.classList.remove('highlight'));

    const stateElement = Array.from(states).find(state =>
        state.getAttribute('data-name')?.toLowerCase() === stateInput
    );

    if (stateElement) stateElement.classList.add('highlight');
    else alert('State not found!');
});