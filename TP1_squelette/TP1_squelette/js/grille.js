/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {

  tabCookies;
  cookiesAEchanger;
  animationId;
  nbDeCookiesDifferents;

  constructor(nbLignes, nbColonnes, nbCookies) {
    this.tabCookies = [];
    this.cookiesAEchanger = [];
    this.nbLignes = nbLignes;
    this.nbColonnes = nbColonnes;
    this.nbDeCookiesDifferents = nbCookies
    this.remplirTableauDeCookies(this.nbDeCookiesDifferents);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */

  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.nbColonnes);
      let colonne = index % this.nbColonnes;
      let img = this.tabCookies[ligne][colonne].htmlImage;

      ajouteEcouteurSurImg(this, img);

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.append(img);
    });
  }

  //Cherche les matchs dans toute la grille et retourne le nombre de matchs trouvés
  chercheMatchs() {
    let nbMatchs = 0;

    for (let i = 0; i < this.nbColonnes; i++) {
      nbMatchs += this.chercheMatchsColonne(i);
    }
    for (let i = 0; i < this.nbLignes; i++) {
      nbMatchs += this.chercheMatchsLigne(i);
    }
    return nbMatchs;
  }

  //Cherche des matchs dans une ligne, cache les cookies concernés et retourne le nombre de matchs trouvés
  chercheMatchsLigne(ligne) {
    let cookies = [];
    let j;
    let nbMatchs = 0;

    //Parcours de la ligne
    for (let i = 0; i <= (this.nbColonnes - 3); i = j) {
      j = i + 1;
      cookies[0] = this.tabCookies[ligne][i];

      //Tant que le cookie à droite est du même type, on l'enregistre et on regarde le cookie suivant
      while (j < this.nbColonnes && cookies[0].type == this.tabCookies[ligne][j].type) {
        cookies.push(this.tabCookies[ligne][j]);
        j++;
      }

      // Si on a trouvé une suite de au moins 3 cookie identiques on les cache
      if (cookies.length >= 3) {
        nbMatchs++;
        cookies.forEach(cookie => {
          cookie.cache();
        });
      }

      cookies = [];
    }
    return nbMatchs;
  }

  //Cherche des matchs dans une colonne, cache les cookies concernés et retourne le nombre de matchs trouvés
  chercheMatchsColonne(colonne) {
    let cookies = [];
    let j;
    let nbMatchs = 0;

    //Parcours de la colonne
    for (let i = 0; i <= (this.nbLignes - 3); i = j) {
      j = i + 1;
      cookies[0] = this.tabCookies[i][colonne];

      //Tant que le cookie dessous est du même type, on l'enregistre et on regarde le cookie suivant
      while (j < this.nbLignes && cookies[0].type == this.tabCookies[j][colonne].type) {
        cookies.push(this.tabCookies[j][colonne]);
        j++;
      }

      // Si on a trouvé une suite de au moins 3 cookie identiques on les cache
      if (cookies.length >= 3) {
        nbMatchs++;
        cookies.forEach(cookie => {
          cookie.cache();
        });
      }

      cookies = [];
    }
    return nbMatchs;
  }

  //Permet de chercher les matchs du tableau afin de faire tomber les cookies
  verifierMatchs() {
    let colonnes = [];

    //Tant qu'on trouve des matchs
    while (grille.chercheMatchs()) {
      //On parcours les ligne de bas en haut
      for (let i = this.nbLignes - 1; i >= 0; i--) {
        //Tant que la ligne possède des "cookie-cache"
        while (this.possedeCookieCache(i)) {
          //On récupère l'indice des colonnes où se trouvent les "cookie-cache"
          for (let j = 0; j < this.nbColonnes; j++) {
            if (this.tabCookies[i][j].htmlImage.className == "cookie-cache") {
              colonnes.push(j);
            }
          }
          //On fait tomber (d'une case) les cases au dessus des "cookie-cache"
          this.faireTomber(i, colonnes);
          colonnes = [];
        }
      }
    }

  }

  //Recoit une ligne où se trouvent des "cookie-cache" et un tableau contenant l'indice des colonnes ou se trouvent les cookies en question
  //Pour chacune des colonnes, fais tomber d'une case tous les cookies se trouvant au dessus de la ligne et génère un nouveau cookie sur la première ligne du tableau
  faireTomber(ligne, colonnes) {
    let col;
    let ligneArrivee;

    for (let i = 0; i < colonnes.length; i++) {
      col = colonnes[i];
      ligneArrivee = ligne;

      //Parcours des lignes depuis la ligne passée en paramètre jusqu'au haut du tableau et déplacement des cookies d'une case vers la bas
      while (ligneArrivee > 0) {
        this.tabCookies[ligneArrivee][col].htmlImage.src = this.tabCookies[ligneArrivee - 1][col].htmlImage.src;
        this.tabCookies[ligneArrivee][col].type = this.tabCookies[ligneArrivee - 1][col].type;
        this.tabCookies[ligneArrivee][col].htmlImage.className = this.tabCookies[ligneArrivee - 1][col].htmlImage.className;
        ligneArrivee--;
      }

      //Ajout d'un nouveau cookie aléatoire dans la première ligne
      let type = Math.floor(this.nbDeCookiesDifferents * Math.random());
      this.tabCookies[0][col].type = type;
      this.tabCookies[0][col].htmlImage.src = Cookie.getUrlNormale(type);
    }

  }

  //Parcours une ligne du tableau de cookies et renvoie vrai si un "cookie-cache" s'y trouve, sinon renvoie faux
  possedeCookieCache(ligne) {
    
    for (let i = 0; i < this.nbColonnes; i++) {
      if (this.tabCookies[ligne][i].htmlImage.className == "cookie-cache") {
        return true;
      }
    }
    return false;
  }

  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies() {
    this.tabCookies = create2DArray(this.nbLignes);
    let type;

    //On parcours le tableau et affecte un cookie généré aléatoirement à chaque cellule
    for (let i = 0; i < this.nbLignes; i++) {
      for (let j = 0; j < this.nbColonnes; j++) {
        type = Math.floor(this.nbDeCookiesDifferents * Math.random());
        this.tabCookies[i][j] = new Cookie(type, i, j);
      }
    }

    // Tant qu'on trouve des matchs dans le tableau, on remplace les cookies concernés par d'autres (générés aléatoirement)
    while (this.chercheMatchs() > 0) {
      console.log("matchs");
      for (let i = 0; i < this.nbLignes; i++) {
        for (let j = 0; j < this.nbColonnes; j++) {
          if (this.tabCookies[i][j].htmlImage.className == "cookie-cache") {
            type = Math.floor(this.nbDeCookiesDifferents * Math.random());
            this.tabCookies[i][j] = new Cookie(type, i, j);
          }
        }
      }
    }
  }
}
