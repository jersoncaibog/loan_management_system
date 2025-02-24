document.addEventListener('DOMContentLoaded', function() {
    const loanPurposeSelect = document.getElementById('loanPurpose');
    const otherPurposeGroup = document.getElementById('otherPurposeGroup');
    const otherPurposeInput = document.getElementById('otherPurpose');

    // Function to toggle other purpose input visibility
    function toggleOtherPurpose() {
        if (loanPurposeSelect.value === 'other') {
            otherPurposeGroup.classList.remove('hidden');
            otherPurposeInput.required = true;
        } else {
            otherPurposeGroup.classList.add('hidden');
            otherPurposeInput.required = false;
            otherPurposeInput.value = ''; // Clear the input when hidden
        }
    }

    // Listen for changes on the select element
    loanPurposeSelect.addEventListener('change', toggleOtherPurpose);

    // Initial check in case the page is loaded with 'other' selected
    toggleOtherPurpose();
});
