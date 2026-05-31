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
      shadow: params.get("shadow") ? params.get("shadow").split("-").map(Number) : [5, 5, 25, 50], // Ombre par défaut
      shadowColor: expandHexColor(params.get("shadowColor") || "000000"), // Couleur de l'ombre (noir par défaut)
      style: params.get("style") ? parseInt(params.get("style")) : 1, // Style par défaut = 1
  };
}

// Fonction outil pour l'opacité
function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

// Fonction pour mettre à jour l'affichage de l'heure et les styles
function updateClock() {
  const params = new URLSearchParams(window.location.search);
  const color = expandHexColor(params.get("color") || "FFFFFF");
  const bgColor = expandHexColor(params.get("bgColor") || "00FF00");
  const size = params.get("size") ? `${params.get("size")}px` : "380px";
  
  // Récupération de l'ombre [X, Y, Blur, Opacity]
  const shadowParams = params.get("shadow") ? params.get("shadow").split("-").map(Number) : [5, 5, 25, 50];
  const shadowColor = expandHexColor(params.get("shadowColor") || "000000");
  const style = params.get("style") ? parseInt(params.get("style")) : 1;

  const clockElement = document.getElementById('clock');
  const bodyElement = document.body;

  if (clockElement) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      let timeString = "";

      switch (style) {
          case 1: timeString = `${hours}:${minutes}:${seconds}`; break;
          case 2: timeString = `${hours}h${minutes}:${seconds}`; break;
          case 3: timeString = `${hours}:${minutes}`; break;
          case 4: timeString = `${hours}h${minutes}`; break;
          case 5: timeString = `${hours}h`; break;
          default: timeString = `${hours}:${minutes}:${seconds}`;
      }

      clockElement.textContent = timeString;
      clockElement.style.color = color;
      bodyElement.style.background = bgColor;
      clockElement.style.fontSize = size;

      // --- INJECTION ET APPLICATION EN TEMPS RÉEL DE LA POLICE ---
      const fontParam = params.get("font");
      if (fontParam) {
          const fontName = decodeURIComponent(fontParam);
          
          // Si la règle CSS @font-face pour cette police n'existe pas encore dans la page, on la crée
          if (!document.getElementById(`face-${fontName}`)) {
              const fontFaceStyle = document.createElement('style');
              fontFaceStyle.id = `face-${fontName}`;
              
              // On définit des fallbacks d'extensions pour que le navigateur trouve le bon fichier local
              fontFaceStyle.textContent = `
                  @font-face {
                      font-family: '${fontName}';
                      src: url('fonts/${fontName}.ttf') format('truetype'),
                           url('fonts/${fontName}.otf') format('opentype'),
                           url('fonts/${fontName}.woff2') format('woff2');
                  }
              `;
              document.head.appendChild(fontFaceStyle);
          }
          
          clockElement.style.fontFamily = `'${fontName}', sans-serif`;
      } else {
          clockElement.style.fontFamily = '"Gotham Black", sans-serif';
      }

      // Application de l'ombre harmonisée avec l'opacité et division par 3 (identique à la preview)
      if (shadowParams.length === 4) {
          const rgbaColor = hexToRgba(shadowColor, shadowParams[3]);
          clockElement.style.textShadow = `${shadowParams[0] / 3}px ${shadowParams[1] / 3}px ${shadowParams[2] / 3}px ${rgbaColor}`;
      } else if (shadowParams.length === 3) {
          clockElement.style.textShadow = `${shadowParams[0] / 3}px ${shadowParams[1] / 3}px ${shadowParams[2] / 3}px ${shadowColor}`;
      }
  }
}

// Fonction pour mettre à jour l'URL pour inclure le style sans recharger la page
function updateURL(color, bgColor, size, shadow, shadowColor, style) {
  const params = new URLSearchParams();
  params.set("color", color.replace("#", ""));
  params.set("bgColor", bgColor.replace("#", ""));
  params.set("size", parseInt(size)); // Toujours en px
  params.set("shadow", shadow.join("-")); // Format "2-2-4"
  params.set("shadowColor", shadowColor.replace("#", "")); // Couleur de l'ombre
  params.set("style", style); // Ajout du style

  window.history.replaceState({}, "", `?${params.toString()}`);
}

// Mettre à jour l'heure toutes les secondes
setInterval(updateClock, 1000);

// Appel initial pour afficher immédiatement l'heure et les couleurs
updateClock();