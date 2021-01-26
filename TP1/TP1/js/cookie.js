class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  type;
  ligne;
  colonne;
  htmlImage;

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.htmlImage = document.createElement("img");
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    this.htmlImage.width = 80;
    this.htmlImage.height = 80;
    this.htmlImage.dataset.ligne = ligne;
    this.htmlImage.dataset.colonne = colonne;
    this.htmlImage.className = "cookie";
  }

  //Surligne le cookie
  selectionne() {
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
    this.htmlImage.className = "cookie-selected";
  }

  //Remet le cookie dans son état normal
  deselectionne() {
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    this.htmlImage.className = "cookie";
  }

  //Cache le cookie
  cache(){
    this.htmlImage.className = "cookie-cache";
  }

  static swapCookies(c1, c2) {
    // On échange leurs images et types
    let tempSrc = c1.htmlImage.src;
    let tempType = c1.type;

    c1.htmlImage.src = c2.htmlImage.src;
    c1.type = c2.type;
    c2.htmlImage.src = tempSrc;
    c2.type = tempType;

    // et on remet les désélectionne
    c1.deselectionne();
    c2.deselectionne();
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    return distance;
  }

  //Retourne l'url normale correspondant au type passé en paramètre
  static getUrlNormale(type){
    return this.urlsImagesNormales[type];
  }
}
