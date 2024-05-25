document.addEventListener("DOMContentLoaded", function() {
    // Récupérer le token d'authentification du stockage local
    const authToken = localStorage.getItem("token");

    // Sélectionner les éléments de navigation que vous souhaitez masquer ou afficher
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const filesLink = document.getElementById("filesLink");
    const uploadLink = document.getElementById("uploadLink");
    const profilLink = document.getElementById("profilLink");
    const logoutLink = document.getElementById("logoutLink");

    if (authToken) {
        // Si un jeton est présent, envoyez une requête au serveur pour vérifier sa validité
        fetch('/middleware/validateToken', {
            method: 'POST',
            headers: {
                'Authorization': authToken
            }
        })
        .then(response => {
            if (response.ok) {
                // Si le token est valide, masquez les liens de connexion
                loginLink.style.display = "none";
                registerLink.style.display = "none";

                filesLink.style.display = "block";
                uploadLink.style.display = "block";
                profilLink.style.display = "block";
            } else {
                // Si le token est invalide, supprimez-le du stockage local
                localStorage.removeItem("authToken");
                // Affichez les liens de connexion
                filesLink.style.display = "none";
                uploadLink.style.display = "none";
            profilLink.style.display = "none";
                
                loginLink.style.display = "block";
                registerLink.style.display = "block";
            }
        })
        .catch(error => {
            console.error('Erreur lors de la validation du token :', error);
        });
    } else {
        // Si aucun token n'est présent, affichez les liens de connexion
        filesLink.style.display = "none";
        uploadLink.style.display = "none";
        profilLink.style.display = "none";

        loginLink.style.display = "block";
        registerLink.style.display = "block";
    }
    // Ajouter un gestionnaire d'événements au lien de déconnexion
    logoutLink.addEventListener("click", function(event) {
        // Empêcher le comportement par défaut du lien
        event.preventDefault();
        // Supprimer le token d'authentification du stockage local
        localStorage.removeItem("token");
        // Rediriger l'utilisateur vers la page de connexion
        window.location.href = "/user/login";
    });
});