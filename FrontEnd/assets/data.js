// Récupération du token dans le stockage local
const storedToken = localStorage.getItem('token');
    
// Vérifie que le token est stocké 
if (storedToken) {
    // Affiche l'élément HTML pour l'administrateur connecté
  const adminElement = document.getElementById('edit');
  adminElement.style.display = 'flex';
}

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
const modal = document.querySelector('.modal')
const modalContent = document.getElementById('modal-content')
const fermerModalBtn = document.getElementById('fermer-modal')
const btnAddPict = document.getElementById('btn-add-pict')

function openModal(){
    modal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    // const focusableElement = modal.querySelectorAll('button, href')
    // if (focusableElement.length > 0) {
    //     focusableElement[0].focus()
    // }
}

function fermerModal(){
    modal.style.display = 'none'
    document.body.style.overflow = 'auto'
}

function modalAddPict() {
    const titleModal = document.getElementById('title-modal')
    titleModal.textContent = 'Ajout photo'


}

document.getElementById('edit').addEventListener('click', openModal);

fermerModalBtn.addEventListener('click', fermerModal)

// fonction pour afficher les photos dans la modal 
function galleryModal(modalData) {
    const galleryModal = document.querySelector('.modal-gallery');
    galleryModal.innerHTML ='';

    modalData.forEach( item => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        //const poubelle = document.createElement('i')

        img.src = item.imageUrl;
        img.alt = item.title;
        //poubelle.classList.add('fa-solid', 'fa-trash-can')

        figure.appendChild(img);
        galleryModal.appendChild(figure);
        //figure.appendChild(poubelle)
    });
}

// function récupération et affichage des photos dans la modal
function picturesModal(){
    fetchWork()
        .then(modalData => {
            galleryModal(modalData);
            openModal();
        })
        .catch(error => {
            console.error("Erreur Serveur", error)
        });
}

document.getElementById('edit').addEventListener('click', picturesModal);
