async function deleteAccount(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Utilisateur non authentifié');
        return;
    }

    try {
        const response = await fetch(`/user/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
            // Redirection ou mise à jour de l'interface utilisateur
            localStorage.removeItem('token');
            window.location.href = '/user/login';
        } else {
            alert(data.message);
        }   
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la suppression du compte.');
    }
    }