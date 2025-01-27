document.addEventListener('DOMContentLoaded', function() {
    // Logic for resetting input fields (if any specific behavior is needed)
    document.querySelector('.btn-outline-light')?.addEventListener('click', function() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            // Reset all number fields to 0 except the fixed charge field
            if(input.value !== '90') {
                input.value = '0';
            }
        });
    });

    // Add Event Listener for the 'Add' button (example)
    document.querySelector('.btn.w-auto-sm')?.addEventListener('click', function() {
        // Example of adding a new row dynamically to the table
        const tableBody = document.querySelector('table tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="text-center">1</td>
            <td><input type="number" class="form-control" value="0"></td>
            <td><input type="number" class="form-control" value="300"></td>
            <td><input type="number" class="form-control" value="0"></td>
            <td><input type="number" class="form-control" value="0"></td>
        `;
        tableBody.appendChild(newRow);
    });

    // Add more dynamic behaviors as needed
});
