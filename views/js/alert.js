function createAlert(response) {
    const alert = document.getElementById('alerts');
    var alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-' + (response.success ? 'success' : 'danger'), 'col-md-6', 'mx-auto');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = response.message;
    console.log(alertDiv);
    alert.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function catchAlert() {
    createAlert({ success: false, message: "Une erreur s\'est produite"});
}