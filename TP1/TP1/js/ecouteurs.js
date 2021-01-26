function ajouteEcouteurSurImg(grille, img) {
  img.addEventListener("click", (event) => {
    let clickedImg = event.target;
    let cookie = grille.tabCookies[clickedImg.dataset.ligne][clickedImg.dataset.colonne];
    cookie.selectionne();

    //Aucun cookie n'est sélectionné -> on enregistre le cookie
    if (grille.cookiesAEchanger[0] == null) {
      grille.cookiesAEchanger[0] = cookie;
    }

    //Un cookie est sélectionné
    else {
      // Si on clique à nouveau sur le même on le déselectionne
      if (grille.cookiesAEchanger[0] == cookie) {
        grille.cookiesAEchanger[0].deselectionne();
        grille.cookiesAEchanger.splice(0, 1);
      }

      // Si c'est un autre on l'enregistre aussi
      else {
        grille.cookiesAEchanger[1] = cookie;

        // Si la distance est de 1 on swap
        if (Cookie.distance(grille.cookiesAEchanger[0], grille.cookiesAEchanger[1]) == 1) {
          Cookie.swapCookies(grille.cookiesAEchanger[0], grille.cookiesAEchanger[1]);
          grille.cookiesAEchanger.splice(0, 2);
          grille.verifierMatchs();
        }
        //Sinon on déselectionne le deuxième
        else {
          grille.cookiesAEchanger[1].deselectionne();
          grille.cookiesAEchanger.splice(1, 1);
        }
      }
    }
  });

  //Lorsqu'on commence à drager un cookie, on le sélectionne et l'enregistre
  img.addEventListener("dragstart", (event) => {
    let clickedImg = event.target;
    let cookie = grille.tabCookies[clickedImg.dataset.ligne][clickedImg.dataset.colonne];
    cookie.selectionne();
    grille.cookiesAEchanger[0] = cookie;
  });

  //Permet de dropper sur une image
  img.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  //Change le fond d'une image qu'on on passe dessus lors d'un drag
  img.addEventListener("dragenter", (event) => {
    let clickedImg = event.target;
    clickedImg.classList.add("grilleDragOver");
  });

  //Remet le fond initial d'une image qu'on on sort de sa zone lors d'un drag
  img.addEventListener("dragleave", (event) => {
    let clickedImg = event.target;
    clickedImg.classList.remove("grilleDragOver");
  });

  //Lorqu'on drop sur une image, swap avec celle qui a été droppée si c'est possible puis vérifie si il y a des nouveaux matchs
  img.addEventListener("drop", (event) => {
    let clickedImg = event.target;
    let cookie = grille.tabCookies[clickedImg.dataset.ligne][clickedImg.dataset.colonne];
    cookie.selectionne();
    grille.cookiesAEchanger[1] = cookie;

    // Si la distance est de 1 on swap puis on déselectionne les deux cookies
    if (Cookie.distance(grille.cookiesAEchanger[0], grille.cookiesAEchanger[1]) == 1) {
      Cookie.swapCookies(grille.cookiesAEchanger[0], grille.cookiesAEchanger[1]);
    }
    grille.cookiesAEchanger[0].deselectionne();
    grille.cookiesAEchanger[1].deselectionne();
    grille.cookiesAEchanger.splice(0, 2);

    grille.verifierMatchs();

  });

}