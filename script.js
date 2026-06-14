// Form State
let currentPage = 1;
let formData = {
    satisfaction: null,
    billingEase: null,
    valueForMoney: null,
    storeLook: null,
    staffHelpfulness: null,
    eyeTesting: null,
    varietyDesigns: null,
    onTimeDelivery: null,
    feedback: '',
    additionalFeedback: ''
};

// Rating buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    // Face button listeners
    const faceBtns = document.querySelectorAll('.face-btn');
    faceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove previous selection
            faceBtns.forEach(b => b.classList.remove('selected'));
            // Add selection to clicked button
            this.classList.add('selected');
            // Store value
            formData.satisfaction = this.dataset.value;
            document.getElementById('satisfactionScore').value = this.dataset.value;
            enableNextButton();
            // Deselect quick options
            document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('selected'));
        });
    });

    // Quick option buttons (map to representative values)
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.dataset.value;
            // Clear any previous quick selection
            quickBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');

            let targetValue = null;
            if (value === 'definitely') targetValue = '10';
            else if (value === 'maybe') targetValue = '7';
            else if (value === 'not-at-all') targetValue = '3';

            if (targetValue !== null) {
                // Select corresponding face button
                const targetFace = document.querySelector('.face-btn[data-value="' + targetValue + '"]');
                if (targetFace) {
                    faceBtns.forEach(b => b.classList.remove('selected'));
                    targetFace.classList.add('selected');
                }
                formData.satisfaction = targetValue;
                document.getElementById('satisfactionScore').value = targetValue;
                enableNextButton();
            }
        });
    });

    // Generic scale buttons for follow-up questions
    const scaleBtns = document.querySelectorAll('.scale-btn');
    scaleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.dataset.target;
            const value = this.dataset.value;

            // Deselect other buttons for same target
            document.querySelectorAll('.scale-btn[data-target="' + target + '"]').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');

            // Store value in formData
            if (target && formData.hasOwnProperty(target)) {
                formData[target] = value;
            }
            // Update submit button state when a scale is selected
            updateSubmitButtonState();
            // Hide validation for this field when selected
            const errEl = document.getElementById('err-' + target);
            if (errEl) { errEl.style.display = 'none'; errEl.setAttribute('aria-hidden','true'); }
        });
    });

    // Textarea validation on page 2
    const feedbackTextarea = document.getElementById('feedbackText');
    if (feedbackTextarea) {
        feedbackTextarea.addEventListener('input', function() {
            const page2NextBtn = document.getElementById('page2NextBtn');
            const errFeedback = document.getElementById('err-feedback');
            if (this.value.trim().length > 0) {
                page2NextBtn.disabled = false;
                errFeedback.style.display = 'none';
                errFeedback.setAttribute('aria-hidden', 'true');
            } else {
                page2NextBtn.disabled = true;
                errFeedback.style.display = 'block';
                errFeedback.setAttribute('aria-hidden', 'false');
            }
        });
    }

    // Ensure submit button state reflects any existing selections
    updateSubmitButtonState();
});

function updateSubmitButtonState() {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;
    const required = ['billingEase','valueForMoney','storeLook','staffHelpfulness','eyeTesting','varietyDesigns','onTimeDelivery'];
    const allSet = required.every(k => formData[k] !== null && formData[k] !== '');
    submitBtn.disabled = !allSet;
}

function enableNextButton() {
    const nextBtn = document.getElementById('nextBtn');
    if (formData.satisfaction !== null) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

function nextPage() {
    if (currentPage === 1) {
        // Validate page 1
        if (formData.satisfaction === null) {
            alert('Please select a satisfaction rating');
            return;
        }
        // Move to page 2
        document.getElementById('page1').classList.add('hidden');
        document.getElementById('page2').classList.remove('hidden');
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
        currentPage = 2;
    } else if (currentPage === 2) {
        // Move to page 3 (follow-up ratings)
        document.getElementById('page2').classList.add('hidden');
        document.getElementById('page3').classList.remove('hidden');
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step3').classList.add('active');
        currentPage = 3;
        // Make sure submit button state is updated when arriving on page3
        updateSubmitButtonState();
    }
}

function previousPage() {
    if (currentPage === 2) {
        // Move back to page 1
        document.getElementById('page2').classList.add('hidden');
        document.getElementById('page1').classList.remove('hidden');
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step1').classList.add('active');
        currentPage = 1;
    } else if (currentPage === 3) {
        // Move back to page 2
        document.getElementById('page3').classList.add('hidden');
        document.getElementById('page2').classList.remove('hidden');
        document.getElementById('step3').classList.remove('active');
        document.getElementById('step2').classList.add('active');
        currentPage = 2;
    }
}

function submitFeedback() {
    // Get textarea values (feedback on page2 and additional feedback on page3)
    formData.feedback = document.getElementById('feedbackText').value;
    formData.additionalFeedback = document.getElementById('additionalFeedback').value;

    // Ensure follow-up ratings are captured (fallback to reading DOM if not set)
    if (!formData.billingEase) {
        const b = document.querySelector('.scale-btn[data-target="billingEase"].selected');
        formData.billingEase = b ? b.dataset.value : '';
    }
    if (!formData.valueForMoney) {
        const b = document.querySelector('.scale-btn[data-target="valueForMoney"].selected');
        formData.valueForMoney = b ? b.dataset.value : '';
    }
    if (!formData.storeLook) {
        const b = document.querySelector('.scale-btn[data-target="storeLook"].selected');
        formData.storeLook = b ? b.dataset.value : '';
    }
    if (!formData.staffHelpfulness) {
        const b = document.querySelector('.scale-btn[data-target="staffHelpfulness"].selected');
        formData.staffHelpfulness = b ? b.dataset.value : '';
    }
    if (!formData.eyeTesting) {
        const b = document.querySelector('.scale-btn[data-target="eyeTesting"].selected');
        formData.eyeTesting = b ? b.dataset.value : '';
    }
    if (!formData.varietyDesigns) {
        const b = document.querySelector('.scale-btn[data-target="varietyDesigns"].selected');
        formData.varietyDesigns = b ? b.dataset.value : '';
    }
    if (!formData.onTimeDelivery) {
        const b = document.querySelector('.scale-btn[data-target="onTimeDelivery"].selected');
        formData.onTimeDelivery = b ? b.dataset.value : '';
    }

    // Check if all required ratings are set
    const required = ['billingEase','valueForMoney','storeLook','staffHelpfulness','eyeTesting','varietyDesigns','onTimeDelivery'];
    const allSet = required.every(k => formData[k] !== null && formData[k] !== '');

    if (!allSet) {
        // Show validation messages for missing fields and prevent submit
        required.forEach(k => {
            if (!formData[k] || formData[k] === '') {
                const errEl = document.getElementById('err-' + k);
                if (errEl) { errEl.style.display = 'block'; errEl.setAttribute('aria-hidden','false'); }
            }
        });
        // Move user to page3 if not already there
        if (currentPage !== 3) {
            document.getElementById('page2').classList.add('hidden');
            document.getElementById('page3').classList.remove('hidden');
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step3').classList.add('active');
            currentPage = 3;
        }
        return;
    }

    // Add timestamp
    formData.submittedAt = new Date().toISOString();

    // Log the feedback data
    console.log('Feedback Submitted:', formData);

    // Show success message
    document.getElementById('page3').classList.add('hidden');
    document.getElementById('successPage').classList.remove('hidden');

    // Optional: also send to server if available
    sendFeedbackToServer(formData);
}

// Image gallery modal handlers
// Image gallery modal handlers (removed)

function sendFeedbackToServer(data) {
    // Example API call (uncomment and modify with your actual API endpoint)
    /*
    fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    */

    // For now, just log it
    console.log('Sending to server:', data);
}

function resetForm() {
    // Reset form data
    formData = {
        satisfaction: null,
        billingEase: null,
        valueForMoney: null,
        storeLook: null,
        staffHelpfulness: null,
        feedback: '',
        additionalFeedback: ''
    };

    // Reset UI
    document.querySelectorAll('.face-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.scale-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('feedbackText').value = '';
    document.getElementById('satisfactionScore').value = '';

    // Reset pages
    document.getElementById('page1').classList.remove('hidden');
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');

    // Update submit button state (disable)
    updateSubmitButtonState();

    // Clear validation messages
    ['billingEase','valueForMoney','storeLook','staffHelpfulness'].forEach(k => {
        const el = document.getElementById('err-' + k);
        if (el) { el.style.display = 'none'; el.setAttribute('aria-hidden','true'); }
    });


    // Reset progress
    document.getElementById('step1').classList.add('active');
    document.getElementById('step2').classList.remove('active');

    // Reset button
    document.getElementById('nextBtn').disabled = true;

    // Reset current page
    currentPage = 1;
}
