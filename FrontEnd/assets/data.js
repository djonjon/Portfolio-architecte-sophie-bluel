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

// Modal

const openModal = function(e){
    e.preventDefault()
    const target = document.querySelector(e.target.querySelector('.modal'))
    target.style.display = 'flex'
    modal = target
    modal.addEventListener('click' , closeModal)
}

const closeModal = function(e){
    e.preventDefault()
    target.style.display = 'flex'
    target.style.display.setAttribute('aria-hiden')
    target.removeAttribute('aria-modal')
    modal.removeEventListener('click' , closeModal)
    modal.querySelector('.fermer-modal').removeEventListener('click', closeModal)
    modal.querySelector('.modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function(e) {
    e.stopPropagation()
}

  document.querySelector('#modal', (event) => {
    event.addEventListener('click', openModal)
  })

// Récupération du token dans le stockage local
const storedToken = localStorage.getItem('token');
console.log(storedToken)
    
// Vérifie que le token est stocké 
if (storedToken) {
    // Affiche l'élément HTML pour l'administrateur connecté
  const adminElement = document.querySelector('#edit');
  adminElement.style.display = 'flex';
}