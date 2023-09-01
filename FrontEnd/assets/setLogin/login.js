const fetchLogin = 'http://localhost:5678/api/users/login'

let usersLogin = {
    email: 'sophie.bluel@test.tld',
    password: 'S0phie'
  };
  
  // Sélectionner le formulaire de connexion par son ID
  const login = document.getElementById('login');
  const errorMessage = document.getElementById('errorMessage');
  
  // Écouter l'événement de soumission du formulaire
  login.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page
  
    // Récupérer les valeurs des champs email et mot de passe
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Utiliser les valeurs de l'objet usersLogin pour l'email et le mot de passe
    usersLogin.email = email;
    usersLogin.password = password;
  
    // Configuration de la requête
    const requestOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usersLogin)
    };
    try {
      // Envoi de la requête POST à l'API
      const response = await fetch(fetchLogin, requestOptions);
    
      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Convertir la réponse en format JSON et récupérer le token d'authentification
      const data = await response.json();
      const token = data.token;
    
      // Stocker le token d'authentification dans le stockage local (localStorage) du navigateur
      localStorage.setItem('token', token);
      console.log(token);
    
      // Rediriger vers la page d'accueil
      window.location.href = '/FrontEnd/index.html';
      
    } catch (error) {
      errorMessage.style.display = 'block';
    }
  });