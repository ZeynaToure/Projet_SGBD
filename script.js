document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/authors');
        const authors = await response.json();
        
        const authorsTable = document.getElementById('authorsTable').getElementsByTagName('tbody')[0];
        
        authors.forEach(author => {
            const row = authorsTable.insertRow();
            row.innerHTML = `<td>${author._id}</td><td>${author.name}</td>`;
        });
    } catch (error) {
        console.error('Error fetching authors:', error);
        // Gérer l'erreur ici, par exemple afficher un message d'erreur à l'utilisateur
    }
});
