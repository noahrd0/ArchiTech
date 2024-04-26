function createAlert(message, type) {
    const alert = document.getElementById('alerts');
    var alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-' + type, 'col-md-6', 'mx-auto');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = message;
    alert.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}