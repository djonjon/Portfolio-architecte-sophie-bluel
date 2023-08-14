// Récupération des données via l'API
async function fetchWork (){
    const r = await fetch("http://localhost:5678/api/works", {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        }
    })
    if (r.ok === true) {
        return r.json();
    }
    throw new Error ('Impossible de contacter le serveur')
}

// création des éléments HTML pour afficher les images et les titres associés dans la galerie
function pictures(dataPicture) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML ='';

    dataPicture.forEach( item => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = item.imageUrl;
        img.alt = item.title;
        figcaption.textContent = item.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
}
// l'affichage gallery par défaut au chargement  
window.addEventListener('load', function() {
    filterPictByCat('Tous');
});

// Ajout de la class .active au bouton sélectionné
function categoryActive(category) {
    const buttons = document.querySelectorAll('.btnCat');
    buttons.forEach( button => {
        if  (button.textContent === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function filterPictByCat(category) {
    // obtenir les données des images
    fetchWork()
        .then(data => {
            if (category === 'Tous') {
                pictures(data);
            }else {
                // Filtre les données par categorie 
                const filterData = data.filter(item => item.category.name === category);
                pictures(filterData);
            }

            // Appelle la fonction pour définir la catégorie active
            categoryActive(category);
        })
        .catch(error => {
            console.error("Une erreur s'est produite", error);
        });
}

