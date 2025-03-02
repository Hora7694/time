// Fonction pour convertir une couleur hex abrégée (ex: "0F0") en hex complet (ex: "00FF00")
function expandHexColor(hex) {
  if (hex.length === 3) {
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  } else if (hex.length === 6) {
      return `#${hex}`;
  }
  return "#FFFFFF"; // Valeur par défaut si incorrect
}

// Fonction pour récupérer les paramètres de l'URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
      color: expandHexColor(params.get("color") || "FFFFFF"),  // Couleur du texte (blanc par défaut)
      bgColor: expandHexColor(params.get("bgColor") || "00FF00"),  // Couleur du fond (vert par défaut)
      size: params.get("size") ? `${params.get("size")}px` : "380px", // Taille du texte (par défaut 380px)
      shadow: params.get("shadow") ? params.get("shadow").split("-").map(Number) : [2, 2, 4], // Ombre par défaut
      shadowColor: expandHexColor(params.get("shadowColor") || "000000"), // Couleur de l'ombre (noir par défaut)
      style: params.get("style") ? parseInt(params.get("style")) : 1, // Style par défaut = 1
  };
}

// Fonction pour mettre à jour l'URL dynamiquement
function updateURL(color, bgColor, size, shadow, shadowColor) {
  const params = new URLSearchParams();
  params.set("color", color.replace("#", ""));
  params.set("bgColor", bgColor.replace("#", ""));
  params.set("size", parseInt(size)); // Toujours en px
  params.set("shadow", shadow.join("-")); // Format "2-2-4"
  params.set("shadowColor", shadowColor.replace("#", "")); // Couleur de l'ombre

  // Met à jour l'URL sans recharger la page
  window.history.replaceState({}, "", `?${params.toString()}`);
}

// Fonction pour mettre à jour l'affichage de l'heure et les styles
// Fonction pour mettre à jour l'affichage de l'heure et les styles
function updateClock() {
  const { color, bgColor, size, shadow, shadowColor, style } = getQueryParams();
  const clockElement = document.getElementById('clock');
  const bodyElement = document.body;

  if (clockElement) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      let timeString = "";

      // Appliquer le style en fonction du paramètre
      switch (style) {
          case 1:
              timeString = `${hours}:${minutes}:${seconds}`;
              break;
          case 2:
              timeString = `${hours}h${minutes}:${seconds}`;
              break;
          case 3:
              timeString = `${hours}:${minutes}`;
              break;
          case 4:
              timeString = `${hours}h${minutes}`;
              break;
          case 5:
              timeString = `${hours}h`;
              break;
          default:
              timeString = `${hours}:${minutes}:${seconds}`; // Valeur par défaut
      }

      // Afficher l'heure formatée
      clockElement.textContent = timeString;

      // Appliquer les couleurs récupérées depuis l'URL
      clockElement.style.color = color;
      bodyElement.style.background = bgColor;

      // Appliquer la taille du texte
      clockElement.style.fontSize = size;

      // Appliquer l'ombre avec la couleur personnalisée
      if (shadow.length === 3) {
          clockElement.style.textShadow = `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadowColor}`;
      }

      // Met à jour l'URL
      updateURL(color, bgColor, size, shadow, shadowColor, style);
  }
}

// Mise à jour de l'URL pour inclure le style
function updateURL(color, bgColor, size, shadow, shadowColor, style) {
  const params = new URLSearchParams();
  params.set("color", color.replace("#", ""));
  params.set("bgColor", bgColor.replace("#", ""));
  params.set("size", parseInt(size)); // Toujours en px
  params.set("shadow", shadow.join("-")); // Format "2-2-4"
  params.set("shadowColor", shadowColor.replace("#", "")); // Couleur de l'ombre
  params.set("style", style); // Ajout du style

  // Met à jour l'URL sans recharger la page
  window.history.replaceState({}, "", `?${params.toString()}`);
}


// Mettre à jour l'heure toutes les secondes
setInterval(updateClock, 1000);

// Appel initial pour afficher immédiatement l'heure et les couleurs
updateClock();
