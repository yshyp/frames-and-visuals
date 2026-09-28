/**
 * High-fidelity photographic art generator
 * Renders atmospheric, film-graded photographic scenes as crisp vector/raster SVG data URIs.
 * This guarantees zero external network dependency, zero broken images, and instant loading
 * while providing an authentic editorial art look until the user uploads their own photo files.
 */

export function createPhotoArtwork(type: 
  | 'wildlife-leopard' 
  | 'wildlife-hornbill' 
  | 'macro-dewdrop' 
  | 'macro-butterfly' 
  | 'macro-wasp-bloom'
  | 'macro-robber-fly'
  | 'macro-praying-mantis'
  | 'macro-jumping-spider'
  | 'macro-mantis-focus'
  | 'nature-munnar' 
  | 'nature-waterfall' 
  | 'travel-backwaters' 
  | 'travel-temple' 
  | 'story-monsoon' 
  | 'story-shadows' 
  | 'photographer-portrait'
): string {
  let svgContent = '';

  switch (type) {
    case 'macro-wasp-bloom':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="100%" height="100%">
          <defs>
            <radialGradient id="waspBg" cx="65%" cy="35%" r="75%">
              <stop offset="0%" stop-color="#423010" />
              <stop offset="45%" stop-color="#1c1407" />
              <stop offset="100%" stop-color="#0a0804" />
            </radialGradient>
            <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffd54f" />
              <stop offset="40%" stop-color="#ffb300" />
              <stop offset="85%" stop-color="#ff8f00" />
              <stop offset="100%" stop-color="#bf360c" />
            </linearGradient>
            <radialGradient id="waspEye" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#4a4235" />
              <stop offset="50%" stop-color="#1a1610" />
              <stop offset="100%" stop-color="#080705" />
            </radialGradient>
            <linearGradient id="chitinStripes" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#14110d" />
              <stop offset="25%" stop-color="#ffc107" />
              <stop offset="40%" stop-color="#120e0a" />
              <stop offset="65%" stop-color="#ffb300" />
              <stop offset="80%" stop-color="#14110d" />
            </linearGradient>
            <linearGradient id="wingTranslucent" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stop-color="#fff8e1" stop-opacity="0.4" />
              <stop offset="50%" stop-color="#ffe082" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#ffd54f" stop-opacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="1600" height="1100" fill="url(#waspBg)" />

          <!-- Golden Blossom Petals in Foreground & Macro Depth of Field -->
          <g filter="blur(1px)">
            <path d="M -100 1100 Q 200 680, 800 850 Q 1400 980, 1700 1100 Z" fill="url(#petalGrad)" opacity="0.95" />
            <path d="M 50 1150 Q 400 620, 950 780 T 1750 920" stroke="#ffca28" stroke-width="6" fill="none" opacity="0.6" />
            <path d="M 150 1150 Q 600 660, 1100 820" stroke="#ffa000" stroke-width="4" fill="none" opacity="0.5" />
            <!-- Soft out-of-focus background petal curves -->
            <path d="M 300 450 Q 700 200, 1200 400 Q 1500 550, 1700 850 L 1700 1100 L 200 1100 Z" fill="#996c0d" opacity="0.25" filter="blur(40px)" />
            <circle cx="1250" cy="280" r="160" fill="#ffca28" opacity="0.12" filter="blur(60px)" />
          </g>

          <!-- Golden Wasp Macro Anatomy (YSH_7289) -->
          <g transform="translate(680, 520)">
            <!-- Dropped shadow on yellow petal -->
            <ellipse cx="60" cy="190" rx="220" ry="45" fill="#241503" opacity="0.65" filter="blur(18px)" />

            <!-- Translucent Folded Wings -->
            <path d="M 30 20 Q 240 -120, 480 -80 Q 520 20, 280 80 Z" fill="url(#wingTranslucent)" stroke="#ffe082" stroke-width="1.8" />
            <path d="M 40 30 Q 200 -60, 420 -30" stroke="#d4af37" stroke-width="1.5" fill="none" opacity="0.7" />
            <path d="M 120 -10 Q 260 -30, 360 10" stroke="#d4af37" stroke-width="1.2" fill="none" opacity="0.6" />

            <!-- Abdomen (Gaster) with Segmented Black & Golden-Amber Bands -->
            <g transform="rotate(-18, 120, 70)">
              <ellipse cx="220" cy="80" rx="140" ry="75" fill="url(#chitinStripes)" />
              <path d="M 140 15 Q 160 80, 140 145" stroke="#ffca28" stroke-width="14" fill="none" opacity="0.85" />
              <path d="M 210 10 Q 230 80, 210 150" stroke="#ffca28" stroke-width="16" fill="none" opacity="0.9" />
              <path d="M 280 18 Q 295 80, 280 142" stroke="#ffca28" stroke-width="12" fill="none" opacity="0.85" />
              <circle cx="350" cy="80" r="15" fill="#14110d" />
            </g>

            <!-- Slender Petiole (Waist) -->
            <path d="M 65 60 Q 85 55, 100 68" stroke="#100d09" stroke-width="18" stroke-linecap="round" fill="none" />

            <!-- Muscular Golden-Furry Thorax (Mesosoma) -->
            <path d="M -40 20 Q 30 -30, 80 40 Q 60 110, -20 90 Z" fill="#2d2214" />
            <!-- Golden Thoracic Micro-hairs & Setae -->
            <g stroke="#e5a93b" stroke-width="2" opacity="0.75">
              <line x1="-30" y1="10" x2="-25" y2="-5" />
              <line x1="-15" y1="5" x2="-8" y2="-12" />
              <line x1="0" y1="0" x2="8" y2="-15" />
              <line x1="20" y1="5" x2="30" y2="-10" />
              <line x1="40" y1="15" x2="52" y2="0" />
            </g>

            <!-- Wasp Head (Cranium) angled toward petal surface -->
            <g transform="translate(-85, 30)">
              <ellipse cx="0" cy="0" rx="55" ry="48" fill="#1c160f" />
              <!-- Clypeus & golden facial mask plate -->
              <polygon points="-15,10 15,10 20,40 -20,40" fill="#e5a729" />
              <circle cx="-5" cy="22" r="3" fill="#111" />
              <circle cx="5" cy="22" r="3" fill="#111" />

              <!-- Large Compound Eye with Facet Texture and Specular Glint -->
              <ellipse cx="-20" cy="-6" rx="22" ry="32" transform="rotate(-15, -20, -6)" fill="url(#waspEye)" stroke="#524330" stroke-width="2" />
              <!-- Ommatidia micro-grid impression -->
              <ellipse cx="-18" cy="-8" rx="14" ry="22" fill="#221b14" opacity="0.6" stroke="#d4a34b" stroke-width="0.8" stroke-dasharray="2 2" />
              <ellipse cx="-24" cy="-14" rx="6" ry="12" fill="#fff" opacity="0.6" filter="blur(1px)" />

              <!-- Long Curved Segmented Antennae -->
              <path d="M 0 -15 Q -60 -90, -140 -85 Q -190 -75, -220 -40" stroke="#16120c" stroke-width="6.5" stroke-linecap="round" fill="none" />
              <path d="M 0 -15 Q -60 -90, -140 -85 Q -190 -75, -220 -40" stroke="#e5a729" stroke-width="1.8" stroke-dasharray="6 4" fill="none" opacity="0.6" />
              <!-- Left antenna -->
              <path d="M 12 -12 Q -20 -105, -90 -130 Q -150 -140, -180 -120" stroke="#16120c" stroke-width="5.5" stroke-linecap="round" fill="none" />
            </g>

            <!-- Slender Jointed Legs clasping flower petal -->
            <!-- Front leg -->
            <path d="M -40 70 Q -80 120, -100 170 L -115 180" stroke="#221910" stroke-width="9" stroke-linecap="round" fill="none" />
            <path d="M -100 170 L -120 185" stroke="#e5a729" stroke-width="4" stroke-linecap="round" fill="none" />
            <!-- Middle leg -->
            <path d="M 10 80 Q 20 140, 0 190 L -10 205" stroke="#241b11" stroke-width="9" stroke-linecap="round" fill="none" />
            <!-- Back leg reaching back -->
            <path d="M 70 70 Q 140 120, 160 175 L 175 195" stroke="#1c150d" stroke-width="10" stroke-linecap="round" fill="none" />
            <path d="M 160 175 L 180 198" stroke="#e5a729" stroke-width="4.5" stroke-linecap="round" fill="none" />
          </g>

          <!-- Golden Micro-pollen grains on petals -->
          <g fill="#ffe082" opacity="0.8">
            <circle cx="540" cy="730" r="3.5" />
            <circle cx="560" cy="745" r="2.5" />
            <circle cx="525" cy="760" r="3" />
            <circle cx="820" cy="780" r="4" />
            <circle cx="845" cy="790" r="2.5" />
            <circle cx="910" cy="810" r="3" />
            <circle cx="480" cy="690" r="3" />
            <circle cx="610" cy="710" r="2.5" />
          </g>
        </svg>
      `;
      break;

    case 'macro-robber-fly':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="100%" height="100%">
          <defs>
            <radialGradient id="robberBg" cx="40%" cy="40%" r="75%">
              <stop offset="0%" stop-color="#18221c" />
              <stop offset="50%" stop-color="#0d1410" />
              <stop offset="100%" stop-color="#040705" />
            </radialGradient>
            <linearGradient id="iridescentEye" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7b1fa2" />
              <stop offset="30%" stop-color="#29b6f6" />
              <stop offset="70%" stop-color="#26a69a" />
              <stop offset="100%" stop-color="#66bb6a" />
            </linearGradient>
            <linearGradient id="perchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3d2f23" />
              <stop offset="50%" stop-color="#1d1610" />
              <stop offset="100%" stop-color="#0b0806" />
            </linearGradient>
            <radialGradient id="bokehOrb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#4db6ac" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#040705" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="1100" fill="url(#robberBg)" />

          <!-- Forest Bokeh Circles -->
          <circle cx="280" cy="260" r="180" fill="url(#bokehOrb)" />
          <circle cx="1350" cy="350" r="240" fill="url(#bokehOrb)" opacity="0.6" />
          <circle cx="1100" cy="780" r="160" fill="#2e7d32" opacity="0.08" filter="blur(50px)" />

          <!-- Slender Weathered Twig / Perch -->
          <path d="M -50 920 Q 500 740, 1100 580 T 1700 480" stroke="url(#perchGrad)" stroke-width="32" stroke-linecap="round" fill="none" />
          <path d="M 400 770 Q 750 675, 1100 580" stroke="#5a4534" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.5" />

          <!-- Robber Fly (Asilidae) Macro Profile (DSC_0099) -->
          <g transform="translate(680, 430)">
            <!-- Powerful Thorax with Dorsal Bristles -->
            <ellipse cx="60" cy="90" rx="95" ry="65" fill="#1b1713" />
            <path d="M 10 35 Q 70 20, 130 50" stroke="#33291f" stroke-width="12" fill="none" />
            <!-- Prominent Thoracic Bristles (Macrochaetae) -->
            <g stroke="#d4af37" stroke-width="2.5" opacity="0.85">
              <line x1="20" y1="40" x2="10" y2="0" />
              <line x1="40" y1="35" x2="35" y2="-8" />
              <line x1="60" y1="30" x2="65" y2="-12" />
              <line x1="80" y1="35" x2="90" y2="-5" />
              <line x1="100" y1="45" x2="118" y2="10" />
            </g>

            <!-- Tapered Segmented Abdomen extending along twig -->
            <path d="M 140 100 Q 280 130, 420 180 Q 480 205, 520 220" stroke="#16120e" stroke-width="36" stroke-linecap="round" fill="none" />
            <path d="M 140 100 Q 280 130, 420 180 Q 480 205, 520 220" stroke="#2c2219" stroke-width="18" stroke-dasharray="24 16" stroke-linecap="round" fill="none" />

            <!-- Translucent Smokey Wings along the back -->
            <path d="M 90 60 Q 260 70, 460 140 Q 470 170, 320 140 Z" fill="#2a241c" opacity="0.45" stroke="#756149" stroke-width="1.5" />

            <!-- Head & Astonishing Multi-faceted Compound Eye -->
            <g transform="translate(-50, 60)">
              <circle cx="0" cy="0" r="62" fill="#0f0c09" />

              <!-- Enormous Iridescent Violet-Emerald Eye (The Signature Feature) -->
              <ellipse cx="-8" cy="-4" rx="46" ry="54" fill="url(#iridescentEye)" stroke="#1a140f" stroke-width="3" />
              <!-- Ommatidia micro-facet overlay pattern -->
              <ellipse cx="-8" cy="-4" rx="42" ry="50" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-dasharray="3 3" opacity="0.35" />
              <!-- Glossy specular light reflections -->
              <ellipse cx="-20" cy="-22" rx="10" ry="18" transform="rotate(-25, -20, -22)" fill="#ffffff" opacity="0.8" />
              <circle cx="-10" cy="-32" r="4" fill="#ffffff" opacity="0.9" />

              <!-- Predatory Black Proboscis (Beak) pointing downward -->
              <polygon points="-25,30 -5,35 -15,90" fill="#0a0806" />
              <line x1="-15" y1="35" x2="-15" y2="85" stroke="#443" stroke-width="1.5" />

              <!-- Golden Bristly Beard (Mystax) guarding the face -->
              <g stroke="#e2b855" stroke-width="2.2" stroke-linecap="round" opacity="0.9">
                <line x1="-30" y1="20" x2="-65" y2="45" />
                <line x1="-28" y1="25" x2="-62" y2="55" />
                <line x1="-25" y1="30" x2="-58" y2="65" />
                <line x1="-22" y1="35" x2="-52" y2="75" />
                <line x1="-20" y1="40" x2="-45" y2="82" />
                <line x1="-15" y1="42" x2="-35" y2="86" />
                <line x1="-26" y1="18" x2="-55" y2="35" />
                <line x1="-24" y1="22" x2="-50" y2="45" />
              </g>

              <!-- Short 3-segmented Antennae -->
              <line x1="-42" y1="-12" x2="-75" y2="-18" stroke="#111" stroke-width="4" stroke-linecap="round" />
              <line x1="-75" y1="-18" x2="-95" y2="-22" stroke="#e2b855" stroke-width="1.8" stroke-linecap="round" />
            </g>

            <!-- Powerful Bristled Predatory Legs Clasping Perch -->
            <!-- Front leg -->
            <path d="M -10 120 Q -40 170, -35 220 L -25 240" stroke="#16120d" stroke-width="11" stroke-linecap="round" fill="none" />
            <g stroke="#d4af37" stroke-width="1.8">
              <line x1="-32" y1="160" x2="-45" y2="155" />
              <line x1="-37" y1="185" x2="-52" y2="182" />
              <line x1="-33" y1="210" x2="-48" y2="212" />
            </g>
            <!-- Middle leg wrapping around branch -->
            <path d="M 50 130 Q 30 190, 45 235 L 60 250" stroke="#1a1510" stroke-width="12" stroke-linecap="round" fill="none" />
            <!-- Hind leg extending backward -->
            <path d="M 110 125 Q 160 175, 175 225 L 195 240" stroke="#14100c" stroke-width="13" stroke-linecap="round" fill="none" />
            <path d="M 175 225 L 190 242" stroke="#d4af37" stroke-width="4.5" stroke-linecap="round" fill="none" />
          </g>
        </svg>
      `;
      break;

    case 'macro-praying-mantis':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
          <defs>
            <radialGradient id="mantisBg" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stop-color="#1b2e1f" />
              <stop offset="55%" stop-color="#0f1c12" />
              <stop offset="100%" stop-color="#060a07" />
            </radialGradient>
            <linearGradient id="jadeChitin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7bed9f" />
              <stop offset="35%" stop-color="#2ed573" />
              <stop offset="70%" stop-color="#1e9c52" />
              <stop offset="100%" stop-color="#126333" />
            </linearGradient>
            <radialGradient id="mantisEyeGrad" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stop-color="#a8f5ba" />
              <stop offset="50%" stop-color="#44bd32" />
              <stop offset="85%" stop-color="#207a1b" />
              <stop offset="100%" stop-color="#0e3d0c" />
            </radialGradient>
          </defs>
          <rect width="1200" height="1500" fill="url(#mantisBg)" />

          <!-- Out-of-focus tropical foliage bokeh discs -->
          <circle cx="200" cy="300" r="140" fill="#2ed573" opacity="0.08" filter="blur(40px)" />
          <circle cx="1020" cy="420" r="180" fill="#7bed9f" opacity="0.06" filter="blur(55px)" />
          <circle cx="600" cy="1250" r="260" fill="#1b4324" opacity="0.2" filter="blur(70px)" />

          <!-- Mantis Head & Torso Frontal Portrait (DSC_6917) -->
          <g transform="translate(600, 680)">
            <!-- Slender Elongated Prothorax -->
            <path d="M -30 220 L -20 580 L 20 580 L 30 220 Z" fill="#1b632d" />
            <path d="M 0 220 L 0 580" stroke="#7bed9f" stroke-width="2.5" opacity="0.4" />

            <!-- Folded Spined Raptorial Forelegs (Held in "Prayer") -->
            <!-- Left foreleg -->
            <g transform="translate(-60, 240)">
              <path d="M 0 0 Q -110 80, -90 190 Q -80 270, 0 320" stroke="#25823c" stroke-width="28" stroke-linecap="round" fill="none" />
              <path d="M -90 190 Q -40 230, -5 260" stroke="#7bed9f" stroke-width="12" stroke-linecap="round" fill="none" />
              <!-- Raptorial spines -->
              <g stroke="#113318" stroke-width="4">
                <line x1="-95" y1="140" x2="-115" y2="150" />
                <line x1="-92" y1="165" x2="-114" y2="178" />
                <line x1="-88" y1="190" x2="-112" y2="205" />
                <line x1="-82" y1="215" x2="-106" y2="232" />
              </g>
            </g>
            <!-- Right foreleg -->
            <g transform="translate(60, 240)">
              <path d="M 0 0 Q 110 80, 90 190 Q 80 270, 0 320" stroke="#25823c" stroke-width="28" stroke-linecap="round" fill="none" />
              <path d="M 90 190 Q 40 230, 5 260" stroke="#7bed9f" stroke-width="12" stroke-linecap="round" fill="none" />
              <g stroke="#113318" stroke-width="4">
                <line x1="95" y1="140" x2="115" y2="150" />
                <line x1="92" y1="165" x2="114" y2="178" />
                <line x1="88" y1="190" x2="112" y2="205" />
                <line x1="82" y1="215" x2="106" y2="232" />
              </g>
            </g>

            <!-- Flexible Cervical Neck Joint -->
            <ellipse cx="0" cy="180" rx="35" ry="25" fill="#1e5429" />

            <!-- Triangular Mantis Head (Cranium) -->
            <polygon points="0,175 -155,-50 155,-50" fill="url(#jadeChitin)" stroke="#1a5226" stroke-width="4" />
            <!-- Facial Ridge and Frons Plate -->
            <polygon points="0,165 -60,20 60,20" fill="#2ed573" opacity="0.85" />
            <line x1="0" y1="30" x2="0" y2="155" stroke="#164721" stroke-width="3" />

            <!-- Mouthparts (Labrum & Palps) -->
            <ellipse cx="0" cy="170" rx="18" ry="12" fill="#143b1c" />
            <path d="M -12 175 Q -20 200, -10 215" stroke="#7bed9f" stroke-width="5" fill="none" />
            <path d="M 12 175 Q 20 200, 10 215" stroke="#7bed9f" stroke-width="5" fill="none" />

            <!-- Ocelli (3 Simple Eyes in Center of Forehead) -->
            <circle cx="0" cy="-2" r="5" fill="#f1f2f6" stroke="#222" stroke-width="1" />
            <circle cx="-16" cy="10" r="4.5" fill="#f1f2f6" stroke="#222" stroke-width="1" />
            <circle cx="16" cy="10" r="4.5" fill="#f1f2f6" stroke="#222" stroke-width="1" />

            <!-- Huge Bulging Compound Eyes on Upper Corners -->
            <!-- Left Compound Eye -->
            <g transform="translate(-140, -45)">
              <circle cx="0" cy="0" r="75" fill="url(#mantisEyeGrad)" stroke="#1a4d25" stroke-width="3" />
              <!-- Ommatidia micro-facet fine ring -->
              <circle cx="0" cy="0" r="68" fill="none" stroke="#fff" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.3" />
              <!-- Pseudopupil (Dark focal spot that creates the illusion of looking at viewer) -->
              <circle cx="15" cy="15" r="14" fill="#08140a" />
              <!-- Crisp catchlight -->
              <ellipse cx="-20" cy="-22" rx="16" ry="8" transform="rotate(-30, -20, -22)" fill="#ffffff" opacity="0.85" />
            </g>

            <!-- Right Compound Eye -->
            <g transform="translate(140, -45)">
              <circle cx="0" cy="0" r="75" fill="url(#mantisEyeGrad)" stroke="#1a4d25" stroke-width="3" />
              <circle cx="0" cy="0" r="68" fill="none" stroke="#fff" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.3" />
              <!-- Pseudopupil -->
              <circle cx="-15" cy="15" r="14" fill="#08140a" />
              <!-- Crisp catchlight -->
              <ellipse cx="-12" cy="-24" rx="16" ry="8" transform="rotate(-20, -12, -24)" fill="#ffffff" opacity="0.85" />
            </g>

            <!-- Long Slender Curved Filiform Antennae -->
            <path d="M -30 -40 Q -100 -240, -180 -380 Q -240 -490, -270 -560" stroke="#7bed9f" stroke-width="4.5" stroke-linecap="round" fill="none" />
            <path d="M 30 -40 Q 100 -240, 180 -380 Q 240 -490, 270 -560" stroke="#7bed9f" stroke-width="4.5" stroke-linecap="round" fill="none" />
          </g>
        </svg>
      `;
      break;

    case 'macro-jumping-spider':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
          <defs>
            <radialGradient id="spiderBg" cx="50%" cy="45%" r="75%">
              <stop offset="0%" stop-color="#142118" />
              <stop offset="50%" stop-color="#0a120d" />
              <stop offset="100%" stop-color="#030504" />
            </radialGradient>
            <radialGradient id="medianEye" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stop-color="#2a2520" />
              <stop offset="40%" stop-color="#120f0c" />
              <stop offset="85%" stop-color="#050403" />
              <stop offset="100%" stop-color="#000000" />
            </radialGradient>
            <linearGradient id="cheliceraeShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00e5ff" />
              <stop offset="50%" stop-color="#00b0ff" />
              <stop offset="100%" stop-color="#651fff" />
            </linearGradient>
          </defs>
          <rect width="1200" height="1500" fill="url(#spiderBg)" />

          <!-- Lush Rainforest Leaf Surface with Micro-ribs -->
          <path d="M -200 1100 Q 600 950, 1400 1200 L 1400 1600 L -200 1600 Z" fill="#0d2416" />
          <path d="M -100 1150 Q 600 1020, 1300 1230" stroke="#1d452d" stroke-width="6" fill="none" />
          <path d="M 200 1100 Q 400 1200, 600 1350" stroke="#1d452d" stroke-width="3" fill="none" />
          <path d="M 700 1080 Q 900 1180, 1100 1300" stroke="#1d452d" stroke-width="3" fill="none" />

          <!-- Salticidae Jumping Spider (YSH_0950) -->
          <g transform="translate(600, 750)">
            <!-- Cephalothorax (Body dome with velvety hairs) -->
            <ellipse cx="0" cy="50" rx="260" ry="220" fill="#18130e" />
            <!-- Velvety copper and silver setae (micro-hairs) -->
            <g stroke="#c79659" stroke-width="2.5" opacity="0.6">
              ${Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10 * Math.PI) / 180;
                const x1 = Math.cos(angle) * 220;
                const y1 = Math.sin(angle) * 190 + 50;
                const x2 = Math.cos(angle) * 245;
                const y2 = Math.sin(angle) * 215 + 50;
                return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" />`;
              }).join('')}
            </g>

            <!-- Spiky Jointed Front Legs resting on leaf -->
            <!-- Left leg -->
            <path d="M -180 120 Q -320 180, -380 340 L -410 420" stroke="#140f0a" stroke-width="42" stroke-linecap="round" fill="none" />
            <path d="M -180 120 Q -320 180, -380 340 L -410 420" stroke="#8d6237" stroke-width="8" stroke-dasharray="20 25" stroke-linecap="round" fill="none" />
            <!-- Right leg -->
            <path d="M 180 120 Q 320 180, 380 340 L 410 420" stroke="#140f0a" stroke-width="42" stroke-linecap="round" fill="none" />
            <path d="M 180 120 Q 320 180, 380 340 L 410 420" stroke="#8d6237" stroke-width="8" stroke-dasharray="20 25" stroke-linecap="round" fill="none" />

            <!-- Iridescent Jaws / Chelicerae -->
            <g transform="translate(0, 160)">
              <ellipse cx="-45" cy="50" rx="38" ry="60" fill="url(#cheliceraeShine)" opacity="0.85" />
              <ellipse cx="45" cy="50" rx="38" ry="60" fill="url(#cheliceraeShine)" opacity="0.85" />
              <!-- Sharp fangs folded below -->
              <path d="M -30 100 Q -10 125, 0 135" stroke="#000" stroke-width="8" stroke-linecap="round" fill="none" />
              <path d="M 30 100 Q 10 125, 0 135" stroke="#000" stroke-width="8" stroke-linecap="round" fill="none" />
            </g>

            <!-- Fluffy Pedipalps (Front "Mittens" with white/golden tips) -->
            <g transform="translate(-80, 180)">
              <ellipse cx="0" cy="0" rx="32" ry="55" transform="rotate(-15, 0, 0)" fill="#2a1f16" />
              <ellipse cx="0" cy="40" rx="26" ry="24" fill="#e8dcc4" />
            </g>
            <g transform="translate(80, 180)">
              <ellipse cx="0" cy="0" rx="32" ry="55" transform="rotate(15, 0, 0)" fill="#2a1f16" />
              <ellipse cx="0" cy="40" rx="26" ry="24" fill="#e8dcc4" />
            </g>

            <!-- The Legendary Four Frontal Eyes -->
            <!-- Two Giant Anterior Median Eyes (AME) — Deep Glassy Obsidian Lenses -->
            <!-- Left AME -->
            <g transform="translate(-75, 20)">
              <circle cx="0" cy="0" r="78" fill="url(#medianEye)" stroke="#38291a" stroke-width="7" />
              <!-- Glass curve caustic reflection -->
              <circle cx="0" cy="0" r="70" fill="none" stroke="#634c35" stroke-width="1.5" opacity="0.5" />
              <!-- Twin Catchlights (Photographer Softbox / Sky Reflection) -->
              <ellipse cx="-18" cy="-24" rx="24" ry="14" transform="rotate(-20, -18, -24)" fill="#ffffff" opacity="0.92" />
              <circle cx="-6" cy="-38" r="7" fill="#ffffff" opacity="0.95" />
              <circle cx="22" cy="24" r="9" fill="#ffffff" opacity="0.3" filter="blur(2px)" />
            </g>

            <!-- Right AME -->
            <g transform="translate(75, 20)">
              <circle cx="0" cy="0" r="78" fill="url(#medianEye)" stroke="#38291a" stroke-width="7" />
              <circle cx="0" cy="0" r="70" fill="none" stroke="#634c35" stroke-width="1.5" opacity="0.5" />
              <!-- Twin Catchlights -->
              <ellipse cx="-12" cy="-24" rx="24" ry="14" transform="rotate(-20, -12, -24)" fill="#ffffff" opacity="0.92" />
              <circle cx="0" cy="-38" r="7" fill="#ffffff" opacity="0.95" />
              <circle cx="28" cy="24" r="9" fill="#ffffff" opacity="0.3" filter="blur(2px)" />
            </g>

            <!-- Two Smaller Anterior Lateral Eyes (ALE) on outer sides -->
            <!-- Left ALE -->
            <g transform="translate(-185, -5)">
              <circle cx="0" cy="0" r="38" fill="url(#medianEye)" stroke="#38291a" stroke-width="5" />
              <ellipse cx="-8" cy="-10" rx="10" ry="6" fill="#ffffff" opacity="0.85" />
            </g>
            <!-- Right ALE -->
            <g transform="translate(185, -5)">
              <circle cx="0" cy="0" r="38" fill="url(#medianEye)" stroke="#38291a" stroke-width="5" />
              <ellipse cx="-4" cy="-10" rx="10" ry="6" fill="#ffffff" opacity="0.85" />
            </g>

            <!-- Fine Brow Hairs over the Eyes -->
            <path d="M -140 -55 Q -75 -75, -10 -55" stroke="#f0dfc8" stroke-width="6" stroke-linecap="round" fill="none" />
            <path d="M 10 -55 Q 75 -75, 140 -55" stroke="#f0dfc8" stroke-width="6" stroke-linecap="round" fill="none" />
          </g>
        </svg>
      `;
      break;

    case 'macro-mantis-focus':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%">
          <defs>
            <radialGradient id="focusBg" cx="30%" cy="50%" r="70%">
              <stop offset="0%" stop-color="#142618" />
              <stop offset="60%" stop-color="#0a120c" />
              <stop offset="100%" stop-color="#030504" />
            </radialGradient>
            <linearGradient id="chitinRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a8ff78" />
              <stop offset="50%" stop-color="#78ffd6" />
              <stop offset="100%" stop-color="#005c53" />
            </linearGradient>
          </defs>
          <rect width="1600" height="1000" fill="url(#focusBg)" />

          <!-- High-Magnification Compound Eye Ommatidia Hexagonal Cellular Mesh -->
          <g transform="translate(480, 500)">
            <ellipse cx="0" cy="0" rx="420" ry="360" fill="#1b4d27" stroke="url(#chitinRim)" stroke-width="12" />
            <!-- Ommatidia Hex Grid Lines -->
            <g stroke="#78ffd6" stroke-width="1" opacity="0.35">
              ${Array.from({ length: 16 }).map((_, i) => `
                <line x1="-380" y1="${-300 + i * 40}" x2="380" y2="${-300 + i * 40}" />
                <line x1="${-360 + i * 48}" y1="-320" x2="${-360 + i * 48}" y2="320" stroke-dasharray="4 4" />
              `).join('')}
            </g>
            <!-- Pseudopupil Dark Core -->
            <circle cx="40" cy="20" r="110" fill="#061208" opacity="0.9" filter="blur(10px)" />
            <!-- Macro Specular Highlight Arch -->
            <path d="M -220 -180 Q -120 -280, 80 -250" stroke="#ffffff" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.75" />
            <path d="M -180 -140 Q -100 -220, 60 -200" stroke="#a8ff78" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9" />
          </g>

          <!-- Sensory Setae (Micro-hairs) emerging from chitin plate -->
          <g stroke="#a8ff78" stroke-width="3" stroke-linecap="round" opacity="0.85">
            <line x1="880" y1="320" x2="1060" y2="240" />
            <line x1="895" y1="420" x2="1140" y2="390" />
            <line x1="870" y1="520" x2="1120" y2="540" />
            <line x1="840" y1="620" x2="1050" y2="690" />
          </g>

          <!-- Editorial Technical Depth Indicator -->
          <text x="80" y="920" fill="#78ffd6" font-family="monospace" font-size="13" letter-spacing="4">
            EXTREME MACRO FOCUS STACK · 105MM MICRO · 16 SLICES
          </text>
        </svg>
      `;
      break;
    case 'wildlife-leopard':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%">
          <defs>
            <radialGradient id="mist" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stop-color="#3d4944" />
              <stop offset="50%" stop-color="#1a2421" />
              <stop offset="100%" stop-color="#0a0f0d" />
            </radialGradient>
            <linearGradient id="branch" x1="0%" y1="100%" x2="100%" y2="20%">
              <stop offset="0%" stop-color="#14110e" />
              <stop offset="60%" stop-color="#2d2218" />
              <stop offset="100%" stop-color="#0e0a07" />
            </linearGradient>
            <linearGradient id="goldLight" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stop-color="#d4af37" stop-opacity="0.35" />
              <stop offset="70%" stop-color="#000" stop-opacity="0" />
            </linearGradient>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0" />
              <feComposite in2="SourceGraphic" in="gl" operator="over" />
            </filter>
          </defs>
          <rect width="1600" height="1000" fill="url(#mist)" />
          <!-- Rainforest Canopy Fog Layers -->
          <circle cx="200" cy="300" r="450" fill="#2d3f38" opacity="0.25" filter="blur(60px)" />
          <circle cx="1200" cy="200" r="500" fill="#4d5c52" opacity="0.2" filter="blur(80px)" />
          
          <!-- Ancient Moss Tree Branch -->
          <path d="M -50 850 Q 400 750, 850 620 T 1650 500 L 1650 850 L -50 1050 Z" fill="url(#branch)" />
          <path d="M 300 780 Q 550 720, 900 630" stroke="#4a5f45" stroke-width="18" fill="none" opacity="0.6" filter="blur(4px)" />
          
          <!-- Leopard Silhouette & Eye Glow -->
          <g transform="translate(680, 410)">
            <!-- Body posture reclining on branch -->
            <path d="M 0 190 Q 60 110, 180 120 Q 260 125, 340 180 Q 380 230, 420 220 Q 450 250, 400 290 Q 300 280, 200 270 Q 80 280, 0 250 Z" fill="#18130d" />
            <!-- Head & alert ears -->
            <path d="M 40 160 Q 20 120, -10 130 Q -40 140, -50 170 Q -60 210, -20 230 Q 30 220, 50 180 Z" fill="#1c160f" />
            <polygon points="-30,130 -25,95 -5,120" fill="#2d2218" />
            <polygon points="15,125 35,90 40,130" fill="#2d2218" />
            <!-- Piercing Amber Feline Eye -->
            <circle cx="-22" cy="165" r="4.5" fill="#f5c242" />
            <circle cx="-22" cy="165" r="1.8" fill="#0b0805" />
            <circle cx="-23" cy="164" r="1" fill="#fff" />
            <!-- Tail hanging natural curve -->
            <path d="M 390 260 Q 460 340, 450 440 Q 440 480, 420 490" stroke="#16120d" stroke-width="26" stroke-linecap="round" fill="none" />
            <!-- Spotted pattern hints -->
            <ellipse cx="140" cy="170" rx="9" ry="6" fill="#0d0905" opacity="0.8" />
            <ellipse cx="200" cy="180" rx="12" ry="7" fill="#0d0905" opacity="0.8" />
            <ellipse cx="270" cy="190" rx="10" ry="6" fill="#0d0905" opacity="0.8" />
            <ellipse cx="170" cy="220" rx="14" ry="8" fill="#0d0905" opacity="0.8" />
            <ellipse cx="320" cy="220" rx="11" ry="7" fill="#0d0905" opacity="0.8" />
          </g>

          <!-- Golden Morning Light Shafts -->
          <polygon points="400,-10 750,-10 1150,1000 650,1000" fill="url(#goldLight)" />
          <polygon points="800,-10 1050,-10 1500,1000 1200,1000" fill="url(#goldLight)" opacity="0.5" />
          
          <!-- Atmospheric Foreground Leaves Out of Focus -->
          <circle cx="100" cy="100" r="160" fill="#121e17" opacity="0.5" filter="blur(25px)" />
          <circle cx="1500" cy="900" r="220" fill="#0d1410" opacity="0.6" filter="blur(30px)" />
          <rect width="1600" height="1000" fill="#000" opacity="0.15" />
        </svg>
      `;
      break;

    case 'wildlife-hornbill':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
          <defs>
            <linearGradient id="bgHorn" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#1e2925" />
              <stop offset="45%" stop-color="#141c18" />
              <stop offset="100%" stop-color="#0a0d0c" />
            </linearGradient>
            <radialGradient id="sunSpot" cx="65%" cy="30%" r="50%">
              <stop offset="0%" stop-color="#e8a838" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#000" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="1500" fill="url(#bgHorn)" />
          <rect width="1200" height="1500" fill="url(#sunSpot)" />
          <!-- Perch -->
          <path d="M 0 1100 Q 500 1020, 1200 1080" stroke="#221b16" stroke-width="48" fill="none" />
          <!-- Malabar Great Hornbill Form -->
          <g transform="translate(480, 520)">
            <!-- Body & glossy black plumage -->
            <path d="M 40 280 Q 20 450, 80 580 Q 140 680, 180 720 Q 210 650, 190 480 Q 170 340, 120 280 Z" fill="#0f1110" />
            <!-- White tail bands -->
            <path d="M 140 700 L 160 880 L 210 880 L 180 700 Z" fill="#e6e1d5" />
            <rect x="155" y="770" width="40" height="40" fill="#111" />
            <!-- Neck & Head -->
            <path d="M 60 290 Q 50 180, 100 120 Q 150 140, 140 250 Z" fill="#d99b26" opacity="0.9" />
            <!-- Immense Golden Casque & Bill -->
            <path d="M 70 140 Q 20 100, -80 120 Q -160 170, -220 230 Q -140 210, -50 190 Q 20 185, 80 175 Z" fill="#e5aa24" />
            <path d="M 60 155 Q -10 135, -120 140 Q -70 170, 70 180 Z" fill="#bf4324" />
            <!-- Beak lower mandibles -->
            <path d="M 70 180 Q -60 195, -190 240 Q -100 245, 60 215 Z" fill="#e2af3b" />
            <!-- Ruby red eye -->
            <circle cx="75" cy="165" r="7" fill="#b82222" />
            <circle cx="75" cy="165" r="3" fill="#000" />
            <circle cx="73" cy="163" r="1.5" fill="#fff" />
          </g>
          <!-- Rainforest vines and misty bokeh -->
          <path d="M 200 0 Q 220 400, 160 800 T 240 1500" stroke="#1d2b23" stroke-width="8" fill="none" opacity="0.4" />
          <circle cx="950" cy="400" r="120" fill="#31473d" opacity="0.15" filter="blur(40px)" />
        </svg>
      `;
      break;

    case 'macro-dewdrop':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1100" width="100%" height="100%">
          <defs>
            <radialGradient id="dewBg" cx="30%" cy="30%" r="80%">
              <stop offset="0%" stop-color="#16291e" />
              <stop offset="50%" stop-color="#0c1711" />
              <stop offset="100%" stop-color="#050a07" />
            </radialGradient>
            <radialGradient id="dropLight" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
              <stop offset="15%" stop-color="#a8e6cf" stop-opacity="0.6" />
              <stop offset="50%" stop-color="#3d8262" stop-opacity="0.2" />
              <stop offset="85%" stop-color="#113322" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#0a1a11" stop-opacity="0.95" />
            </radialGradient>
            <radialGradient id="flowerReflect" cx="50%" cy="55%" r="40%">
              <stop offset="0%" stop-color="#ffb347" stop-opacity="0.85" />
              <stop offset="60%" stop-color="#ff6b6b" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#222" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="1400" height="1100" fill="url(#dewBg)" />
          
          <!-- Leaf Micro Surface & Organic Veins -->
          <g stroke="#264532" stroke-width="3" opacity="0.7">
            <path d="M -100 700 Q 600 550, 1500 500" stroke-width="12" stroke="#375e46" />
            <path d="M 300 600 Q 420 480, 550 420" />
            <path d="M 500 570 Q 620 460, 780 390" />
            <path d="M 700 540 Q 850 430, 1020 370" />
            <path d="M 900 520 Q 1060 410, 1250 350" />
            <path d="M 400 620 Q 480 750, 580 850" />
            <path d="M 650 590 Q 750 730, 890 830" />
            <path d="M 850 560 Q 980 700, 1150 810" />
          </g>

          <!-- Suspended Spherical Water Droplet -->
          <g transform="translate(680, 510)">
            <!-- Drop shadow on leaf -->
            <ellipse cx="25" cy="55" rx="145" ry="40" fill="#040806" opacity="0.7" filter="blur(14px)" />
            <!-- The Glassy Water Sphere -->
            <circle cx="0" cy="0" r="140" fill="url(#dropLight)" />
            <!-- Upside-down Forest Flower Refraction inside droplet -->
            <circle cx="10" cy="20" r="55" fill="url(#flowerReflect)" />
            <circle cx="10" cy="20" r="16" fill="#fff" opacity="0.6" filter="blur(4px)" />
            <!-- Caustic specular highlight -->
            <ellipse cx="-45" cy="-55" rx="35" ry="18" transform="rotate(-30, -45, -55)" fill="#ffffff" opacity="0.9" />
            <circle cx="-25" cy="-70" r="6" fill="#ffffff" opacity="0.8" />
            <!-- Edge chromatic aberration glow -->
            <circle cx="0" cy="0" r="139" stroke="#b8e8d4" stroke-width="2" fill="none" opacity="0.6" />
          </g>

          <!-- Tiny satellite micro-droplets -->
          <circle cx="380" cy="580" r="24" fill="url(#dropLight)" />
          <circle cx="372" cy="572" r="5" fill="#fff" opacity="0.8" />
          <circle cx="1020" cy="460" r="32" fill="url(#dropLight)" />
          <circle cx="1010" cy="450" r="7" fill="#fff" opacity="0.8" />
          <circle cx="1140" cy="420" r="14" fill="url(#dropLight)" />

          <!-- Out of focus background bokeh circles -->
          <circle cx="200" cy="220" r="140" fill="#3b6e51" opacity="0.12" filter="blur(35px)" />
          <circle cx="1200" cy="200" r="180" fill="#6ba883" opacity="0.08" filter="blur(50px)" />
        </svg>
      `;
      break;

    case 'macro-butterfly':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
          <defs>
            <radialGradient id="wingBg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stop-color="#1c1611" />
              <stop offset="60%" stop-color="#100d0a" />
              <stop offset="100%" stop-color="#070504" />
            </radialGradient>
            <linearGradient id="iridescent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2a7b9b" />
              <stop offset="50%" stop-color="#ed7939" />
              <stop offset="100%" stop-color="#d4af37" />
            </linearGradient>
          </defs>
          <rect width="1200" height="1500" fill="url(#wingBg)" />
          <!-- Abstract Macro Wing Scale Structure -->
          <g opacity="0.85">
            ${Array.from({ length: 18 }).map((_, i) => `
              <path d="M ${-100 + i * 80} 100 Q ${200 + i * 70} 700, ${-50 + i * 85} 1400" 
                    stroke="url(#iridescent)" stroke-width="${12 + (i % 4) * 4}" fill="none" opacity="${0.4 + (i % 3) * 0.25}" />
            `).join('')}
          </g>
          <!-- Individual Chitin Scales Texture -->
          <g fill="#df933e" opacity="0.3">
            ${Array.from({ length: 30 }).map((_, i) => `
              <ellipse cx="${300 + (i * 47) % 700}" cy="${200 + (i * 37) % 1100}" rx="18" ry="8" transform="rotate(${i * 12}, ${300 + (i * 47) % 700}, ${200 + (i * 37) % 1100})" />
            `).join('')}
          </g>
          <!-- Soft golden side illumination -->
          <circle cx="100" cy="750" r="400" fill="#e88f34" opacity="0.1" filter="blur(80px)" />
        </svg>
      `;
      break;

    case 'nature-munnar':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#152129" />
              <stop offset="35%" stop-color="#34484f" />
              <stop offset="65%" stop-color="#7a7863" />
              <stop offset="85%" stop-color="#b89b6c" />
              <stop offset="100%" stop-color="#e8c288" />
            </linearGradient>
            <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#3c524b" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#1d2e29" />
            </linearGradient>
            <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#243831" />
              <stop offset="100%" stop-color="#101e19" />
            </linearGradient>
            <linearGradient id="teaHillFront" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#2d4a3e" />
              <stop offset="100%" stop-color="#0c1713" />
            </linearGradient>
          </defs>
          <!-- Dawn Sky -->
          <rect width="1600" height="1000" fill="url(#skyGrad)" />
          
          <!-- Distant Western Ghats Mountain Ridges -->
          <path d="M 0 520 Q 300 420, 650 460 T 1300 410 Q 1450 440, 1600 430 L 1600 1000 L 0 1000 Z" fill="url(#mountain1)" opacity="0.6" />
          
          <!-- Ethereal Morning Valley Mist Layer -->
          <ellipse cx="800" cy="530" rx="900" ry="70" fill="#e8dec8" opacity="0.45" filter="blur(25px)" />
          
          <!-- Midground Ridge with Contoured Tea Lines -->
          <path d="M -50 630 Q 350 510, 850 570 T 1650 540 L 1650 1000 L -50 1000 Z" fill="url(#mountain2)" />
          <!-- Tea Plantation Contour Ribbons -->
          <g stroke="#3a5a4c" stroke-width="2.5" fill="none" opacity="0.6">
            <path d="M 100 620 Q 400 540, 800 590" />
            <path d="M 120 645 Q 430 565, 830 615" />
            <path d="M 140 670 Q 460 590, 860 640" />
            <path d="M 160 695 Q 490 615, 890 665" />
          </g>

          <!-- Foreground Rolling Tea Hill -->
          <path d="M 200 1000 Q 600 670, 1200 700 Q 1450 720, 1650 820 L 1650 1000 Z" fill="url(#teaHillFront)" />
          <path d="M -50 780 Q 300 720, 700 880 L 700 1000 L -50 1000 Z" fill="#14241d" />

          <!-- Lone Mountain Silhouetted Pine / Silver Oak -->
          <g transform="translate(420, 610)">
            <path d="M 0 140 L 0 -120" stroke="#0e1713" stroke-width="5" />
            <path d="M -20 -90 Q 0 -115, 20 -90" stroke="#0e1713" stroke-width="3" fill="none" />
            <path d="M -30 -60 Q 0 -85, 30 -60" stroke="#0e1713" stroke-width="3" fill="none" />
            <path d="M -40 -30 Q 0 -55, 40 -30" stroke="#0e1713" stroke-width="3.5" fill="none" />
            <path d="M -50 5 Q 0 -20, 50 5" stroke="#0e1713" stroke-width="4" fill="none" />
          </g>

          <!-- Soft Golden Sun Flare breaking through high pass -->
          <circle cx="1180" cy="380" r="14" fill="#fffcee" />
          <circle cx="1180" cy="380" r="80" fill="#ffd470" opacity="0.3" filter="blur(20px)" />
          <circle cx="1180" cy="380" r="260" fill="#ffb84d" opacity="0.12" filter="blur(60px)" />
        </svg>
      `;
      break;

    case 'nature-waterfall':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
          <defs>
            <linearGradient id="wetRock" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stop-color="#0f1412" />
              <stop offset="50%" stop-color="#24302b" />
              <stop offset="100%" stop-color="#0b0e0d" />
            </linearGradient>
            <linearGradient id="waterFlow" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#e0f2f1" stop-opacity="0.9" />
              <stop offset="50%" stop-color="#b2dfdb" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0.95" />
            </linearGradient>
          </defs>
          <rect width="1200" height="1500" fill="#080c0a" />
          <!-- Black basalt canyon walls -->
          <polygon points="0,0 450,0 350,1500 0,1500" fill="url(#wetRock)" />
          <polygon points="750,0 1200,0 1200,1500 680,1500" fill="url(#wetRock)" />
          <!-- Long Exposure Silk Cascade -->
          <g filter="blur(2px)">
            <path d="M 460 0 Q 520 400, 480 800 T 500 1500 L 640 1500 Q 600 800, 680 400 T 730 0 Z" fill="url(#waterFlow)" opacity="0.85" />
            <path d="M 520 0 L 510 1500" stroke="#fff" stroke-width="8" opacity="0.9" filter="blur(3px)" />
            <path d="M 570 0 L 590 1500" stroke="#fff" stroke-width="12" opacity="0.9" filter="blur(4px)" />
            <path d="M 640 0 L 630 1500" stroke="#fff" stroke-width="6" opacity="0.8" filter="blur(2px)" />
          </g>
          <!-- Mist cloud basin at bottom -->
          <ellipse cx="580" cy="1420" rx="350" ry="120" fill="#d9f2ec" opacity="0.4" filter="blur(35px)" />
          <!-- Moss drips on cliffs -->
          <circle cx="360" cy="400" r="45" fill="#3e6347" opacity="0.6" filter="blur(8px)" />
          <circle cx="760" cy="650" r="55" fill="#32523a" opacity="0.6" filter="blur(10px)" />
        </svg>
      `;
      break;

    case 'travel-backwaters':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%">
          <defs>
            <linearGradient id="sunsetBack" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#1a1215" />
              <stop offset="40%" stop-color="#42252c" />
              <stop offset="70%" stop-color="#a6543b" />
              <stop offset="88%" stop-color="#e08e45" />
              <stop offset="100%" stop-color="#f5c26b" />
            </linearGradient>
            <linearGradient id="waterReflect" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#df8a42" />
              <stop offset="25%" stop-color="#7a3e2a" />
              <stop offset="60%" stop-color="#241618" />
              <stop offset="100%" stop-color="#0d090a" />
            </linearGradient>
          </defs>
          <!-- Dusk Sky -->
          <rect width="1600" height="580" fill="url(#sunsetBack)" />
          <!-- Mirror Waters of Vembanad / Alleppey -->
          <rect y="580" width="1600" height="420" fill="url(#waterReflect)" />
          
          <!-- Silhouette Palm Tree Shoreline -->
          <path d="M 0 580 L 1600 580" stroke="#0e0a0b" stroke-width="4" />
          <g fill="#120c0e">
            ${Array.from({ length: 14 }).map((_, i) => `
              <path d="M ${50 + i * 115} 580 Q ${60 + i * 115} ${430 + (i % 3) * 30}, ${30 + i * 115} ${320 + (i % 4) * 25}" stroke="#120c0e" stroke-width="7" fill="none" />
              <circle cx="${30 + i * 115}" cy="${320 + (i % 4) * 25}" r="${45 + (i % 3) * 12}" fill="#120c0e" opacity="0.9" />
            `).join('')}
          </g>

          <!-- Traditional Wooden Canoe Boatman -->
          <g transform="translate(920, 560)">
            <!-- Canoe reflection -->
            <path d="M -160 30 Q 0 45, 180 30 Q 20 24, -160 30 Z" fill="#080506" opacity="0.6" filter="blur(2px)" />
            <!-- Slender Kettuvalam / Canoe -->
            <path d="M -180 15 Q 0 35, 200 12 Q 220 2, 230 -2 Q 200 10, 0 16 Q -160 12, -190 -2 Z" fill="#0d090a" />
            <!-- Standing Boatman Silhouette with Oar -->
            <circle cx="20" cy="-60" r="10" fill="#0d090a" />
            <path d="M 12 -50 L 28 -15 L 20 12" stroke="#0d090a" stroke-width="10" stroke-linecap="round" fill="none" />
            <!-- Long Wooden Punting Pole -->
            <line x1="-30" y1="-85" x2="80" y2="70" stroke="#0a0708" stroke-width="4.5" stroke-linecap="round" />
          </g>

          <!-- Soft Golden Water Ripples -->
          <g stroke="#f0ae5d" stroke-width="1.8" opacity="0.45">
            <line x1="850" y1="620" x2="1050" y2="620" />
            <line x1="780" y1="650" x2="1120" y2="650" />
            <line x1="720" y1="690" x2="1190" y2="690" stroke-width="2.5" />
            <line x1="680" y1="740" x2="1240" y2="740" stroke-width="3" opacity="0.3" />
            <line x1="600" y1="810" x2="1320" y2="810" stroke-width="3.5" opacity="0.2" />
          </g>

          <!-- Setting Sun Disc -->
          <circle cx="950" cy="460" r="42" fill="#fff2d6" />
          <circle cx="950" cy="460" r="110" fill="#fca849" opacity="0.25" filter="blur(25px)" />
        </svg>
      `;
      break;

    case 'travel-temple':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
          <defs>
            <radialGradient id="templeLight" cx="50%" cy="65%" r="60%">
              <stop offset="0%" stop-color="#e08f2d" stop-opacity="0.5" />
              <stop offset="60%" stop-color="#24150d" />
              <stop offset="100%" stop-color="#0a0604" />
            </radialGradient>
          </defs>
          <rect width="1200" height="1500" fill="url(#templeLight)" />
          <!-- Ancient Kerala Teak Wooden Temple Pillars (Kuthiramalika / Padmanabhapuram style) -->
          <g fill="#170e09">
            <!-- Left Pillar -->
            <rect x="180" y="0" width="110" height="1500" />
            <polygon points="140,400 290,400 310,480 120,480" />
            <!-- Right Pillar -->
            <rect x="910" y="0" width="110" height="1500" />
            <polygon points="870,400 1020,400 1040,480 850,480" />
            <!-- Carved Wooden Beam Overhang -->
            <rect x="100" y="320" width="1000" height="70" />
          </g>
          <!-- Traditional Brass Hanging Oil Lamp (Vilakku) in Center -->
          <g transform="translate(600, 680)">
            <line x1="0" y1="-680" x2="0" y2="-60" stroke="#b08137" stroke-width="6" />
            <polygon points="-8,-60 8,-60 14,-20 -14,-20" fill="#b08137" />
            <ellipse cx="0" cy="0" rx="90" ry="24" fill="#946b28" />
            <!-- Glowing Wick Flames -->
            <circle cx="0" cy="-6" r="18" fill="#ffef99" />
            <circle cx="0" cy="-6" r="60" fill="#ff9922" opacity="0.4" filter="blur(18px)" />
            <circle cx="-65" cy="-2" r="10" fill="#ffea78" />
            <circle cx="65" cy="-2" r="10" fill="#ffea78" />
          </g>
          <!-- Atmospheric Incense Smoke Drift -->
          <path d="M 600 640 Q 520 480, 640 320 T 560 120" stroke="#f0cf9e" stroke-width="12" fill="none" opacity="0.18" filter="blur(16px)" />
        </svg>
      `;
      break;

    case 'story-monsoon':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="100%" height="100%">
          <defs>
            <linearGradient id="monsoonRain" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stop-color="#141c22" />
              <stop offset="60%" stop-color="#1d2933" />
              <stop offset="100%" stop-color="#0a1014" />
            </linearGradient>
          </defs>
          <rect width="1600" height="1000" fill="url(#monsoonRain)" />
          <!-- Heavy Monsoon Diagonal Downpour -->
          <g stroke="#8ba5b5" stroke-width="1.8" opacity="0.35">
            ${Array.from({ length: 45 }).map((_, i) => `
              <line x1="${(i * 41) % 1700}" y1="0" x2="${((i * 41) % 1700) - 220}" y2="1000" stroke-dasharray="14 18" />
            `).join('')}
          </g>
          <!-- Lonely Figure with Black Umbrella on Wet Glistening Road -->
          <g transform="translate(760, 620)">
            <!-- Road water reflection of umbrella & shoes -->
            <ellipse cx="40" cy="190" rx="90" ry="25" fill="#040608" opacity="0.8" filter="blur(6px)" />
            <ellipse cx="40" cy="190" rx="140" ry="12" fill="#50697a" opacity="0.25" filter="blur(12px)" />
            <!-- Walking figure -->
            <path d="M 25 100 L 15 185 M 45 100 L 60 180" stroke="#080c0f" stroke-width="12" stroke-linecap="round" />
            <rect x="18" y="25" width="40" height="85" rx="12" fill="#14181c" />
            <!-- Deep curved umbrella -->
            <path d="M -50 30 Q 38 -55, 126 30 Z" fill="#050709" />
            <line x1="38" y1="-55" x2="38" y2="40" stroke="#222" stroke-width="4" />
          </g>
          <!-- Wet asphalt sheen -->
          <rect y="780" width="1600" height="220" fill="#080d12" opacity="0.75" />
          <ellipse cx="800" cy="850" rx="600" ry="40" fill="#4d6f85" opacity="0.12" filter="blur(28px)" />
        </svg>
      `;
      break;

    case 'story-shadows':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
          <defs>
            <linearGradient id="wallLight" x1="0" y1="0" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2c2724" />
              <stop offset="50%" stop-color="#171412" />
              <stop offset="100%" stop-color="#080706" />
            </linearGradient>
          </defs>
          <rect width="1200" height="1500" fill="url(#wallLight)" />
          <!-- Slanted Window Louver Geometric Shadows on Raw Plaster Wall -->
          <g fill="#070504">
            <polygon points="0,150 1200,650 1200,780 0,280" />
            <polygon points="0,380 1200,880 1200,1010 0,510" />
            <polygon points="0,610 1200,1110 1200,1240 0,740" />
            <polygon points="0,840 1200,1340 1200,1470 0,970" />
          </g>
          <!-- Warm Amber Rim Light on Edge -->
          <line x1="0" y1="150" x2="1200" y2="650" stroke="#d49c55" stroke-width="3" opacity="0.4" />
          <line x1="0" y1="380" x2="1200" y2="880" stroke="#d49c55" stroke-width="3" opacity="0.4" />
          <line x1="0" y1="610" x2="1200" y2="1110" stroke="#d49c55" stroke-width="3" opacity="0.4" />
          <!-- Solitary Clay Chai Glass on Windowsill -->
          <g transform="translate(740, 1100)">
            <ellipse cx="0" cy="50" rx="35" ry="12" fill="#000" opacity="0.6" filter="blur(4px)" />
            <polygon points="-25,45 25,45 35,-30 -35,-30" fill="#a8623d" />
            <ellipse cx="0" cy="-30" rx="35" ry="10" fill="#c4784f" />
          </g>
        </svg>
      `;
      break;

    case 'photographer-portrait':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
          <defs>
            <radialGradient id="portraitBg" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stop-color="#2b2622" />
              <stop offset="55%" stop-color="#141210" />
              <stop offset="100%" stop-color="#080706" />
            </radialGradient>
            <linearGradient id="rimLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f0d5a3" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#000" stop-opacity="0" />
            </linearGradient>
          </defs>
          <rect width="1200" height="1500" fill="url(#portraitBg)" />
          
          <!-- Cinematic Silhouette of Photographer with Camera -->
          <g transform="translate(600, 750)">
            <!-- Shoulders & Coat -->
            <path d="M -320 600 Q -300 350, -180 260 Q -90 220, 0 220 Q 90 220, 180 260 Q 300 350, 320 600 Z" fill="#111112" />
            <!-- Camera & Telephoto Lens held in hands -->
            <!-- Camera Body -->
            <rect x="-80" y="60" width="160" height="110" rx="14" fill="#1b1c1e" />
            <!-- Viewfinder prism -->
            <polygon points="-35,60 35,60 25,25 -25,25" fill="#202226" />
            <!-- Lens Barrel pointing slightly forward/left -->
            <rect x="60" y="80" width="140" height="75" rx="8" fill="#161719" />
            <rect x="180" y="75" width="25" height="85" rx="4" fill="#0f1012" />
            <!-- Lens glass glint -->
            <circle cx="195" cy="118" r="32" fill="#1a2d36" stroke="#4da8c7" stroke-width="2.5" opacity="0.75" />
            <circle cx="190" cy="112" r="10" fill="#fff" opacity="0.6" />
            <!-- Photographer Hands -->
            <circle cx="-75" cy="130" r="32" fill="#261d18" />
            <circle cx="95" cy="150" r="28" fill="#261d18" />
            <!-- Head & Profile -->
            <path d="M -70 20 Q -90 -80, -40 -160 Q 0 -210, 60 -190 Q 120 -150, 110 -60 Q 100 20, 40 50 Z" fill="#1e1814" />
            <!-- Rim light on hair and shoulder -->
            <path d="M -40 -160 Q 0 -210, 60 -190" stroke="#edd5a4" stroke-width="7" fill="none" opacity="0.6" filter="blur(2px)" />
            <path d="M 180 260 Q 300 350, 320 600" stroke="#edd5a4" stroke-width="5" fill="none" opacity="0.35" filter="blur(3px)" />
          </g>

          <!-- Subtle Studio Ambient Glow -->
          <circle cx="600" cy="550" r="380" fill="#c49b66" opacity="0.06" filter="blur(90px)" />
        </svg>
      `;
      break;

    default:
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#141414"/></svg>`;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}
