# Système d'exercices — Guide d'utilisation (FR) 🚀

Ce README explique **comment écrire et intégrer** des exercices interactifs (QCM, texte à trou, etc.) dans les pages HTML, comment configurer les indices, la réinitialisation et les effets visuels, et comment déboguer.

---

## 🗂️ Structure recommandée

Portfolio/Cours_HTML/
- HTML/ (pages .html)
- JS/
  - `quiz.js` (loader — inclure **seulement** ce fichier dans vos pages)
  - `ui.js` (helpers DOM)
  - `effects.js` (feux d'artifice)
  - `hints.js` (modal d'indices)
  - `qcm.js` (QCM)
  - `results.js` (modal de résultats)
  - `core.js` (orchestrateur, API publique)
  - `quiz.css` (styles partagés)
  - `README.md` (ce fichier)

---

## ⚙️ Objectifs des fichiers

- **`quiz.js`** : loader séquentiel. Inclure uniquement ce fichier dans les pages HTML — il charge les modules automatiquement.
- **`ui.js`** : fonctions utilitaires DOM (création d'éléments).
- **`effects.js`** : effets visuels (feux d'artifice). Expose `window.Effects.launch()` et `window.Effects.stop()`.
- **`hints.js`** : modal d'indices. Expose `window.Hints.set(hintsArray)` et `window.Hints.open()`.
- **`qcm.js`** : création d'un bloc QCM : `window.QCM.create(question, options, correct, onCorrect)`.
- **`core.js`** : API publique : `addExercise(question, options, correct)` et `setExerciseHints(hints)`.
- **`quiz.css`** : styles partagés (bordures vert/rouge, modal, canvas, etc.).

---

## ✅ Étapes pour ajouter un exercice sur une page HTML

1. Dans le `<head>` :
   - Assure-toi d'avoir ton CSS global; `quiz.css` est déjà inclus si tu as suivi les exemples.

2. Dans le `<body>`, insère la zone d'exercices (une seule par page ou plusieurs si tu veux) :

```html
<section class="exercise">
  <h3>Exercice</h3>
  <!-- Les questions seront ajoutées ici par JS -->
</section>
```

3. Inclure le loader (`quiz.js`) — garde **une seule** inclusion :

```html
<script src="../JS/quiz.js"></script>
```

4. Ajouter les exercices (après le loader). IMPORTANT : attendre que `addExercise` soit disponible — utiliser ce pattern robuste :

```html
<script>
function initExercises(){
  if (typeof addExercise !== 'function') { setTimeout(initExercises, 50); return; }
  // Exemple QCM
  addExercise("<img> — Choisis la bonne correction", ["<img href=...>","<img src=... alt=...>","<img data-src=...>"], "<img src=... alt=...>");
  // Définir les indices pour la page (optionnel)
  setExerciseHints([
    { href: 'Working with Images and SVGs.html', text: 'Working with Images and SVGs' },
    { href: 'Working with Links.html', text: 'Working with Links' }
  ]);
}
initExercises();
</script>
```

> Pourquoi le `setTimeout` ? Le loader ajoute les scripts des modules dynamiquement ; ce pattern attend que la fonction `addExercise` soit prête.

---

## 🧩 Types d'exercices (exemples)

### 1) QCM (déjà fourni)
- Usage : `addExercise(questionText, choicesArray, correctAnswer)`
- Comportement :
  - Apparition d'une bordure verte si la réponse est correcte (et verrouillage des choix),
  - Bordure rouge momentanée si incorrect,
  - Quand toutes les questions d'un conteneur `.exercise` sont correctes, les feux d'artifice se déclenchent automatiquement.

**Exemple** (mettre dans un script après `quiz.js`) :
```js
addExercise("<a> — Choisis l'attribut correct", ["<a src=...>", "<a href=...>", "<link href=...>"], "<a href=...>");
```

### 2) Texte à trou (modèle / tutorial)
- Pas encore implémenté par défaut : créer `cloze.js` avec fonction `Cloze.create(textWithBlanks, answers, onCorrect)`.
- Exemple d'API recommandée :
```js
// textWithBlanks: 'Le <___> est bleu'
Cloze.create('Le <___> est bleu', ['ciel','mer'], 'ciel', (el)=>{ /* on correct */ });
```
- Intégrer la même logique de `controls` (Réinitialiser, Indice) et d'effet à la réussite.

---

## 🧰 Contrôles & Indices

- Les boutons **Réinitialiser** et **Indice** sont générés automatiquement et placés sous la liste complète des questions.
- **Réinitialiser** : remet l'état des questions, réactive les boutons et arrête les effets.
  - Correction importante : auparavant, le bouton **Réinitialiser** remettait uniquement l'état visuel des questions, mais ne réinitialisait pas la variable interne `answered` des questions QCM. Résultat : après réinitialisation, les boutons restaient inactifs et les exercices ne pouvaient plus être validés (d'où l'absence d'effets comme les feux d'artifice).
  - Correction appliquée : chaque type d'exercice (ex. QCM) expose désormais une méthode `reset()` sur l'élément question (ex. `questionEl.reset()`), utilisée par le handler de réinitialisation général pour restaurer l'état interne et visuel.
  - Si tu implémentes de nouveaux types d'exercices (ex : `cloze.js`), assure-toi d'exposer une méthode `reset()` qui restaure : état interne (`answered`), boutons (`disabled=false`), messages de statut, et styles visuels.
- **Indice** : ouvre le modal injecté par `hints.js`. Défini les indices par page via `setExerciseHints([...]).`
- **Affichage du score** : quand toutes les questions d'un conteneur `.exercise` ont été répondues (correctes ou non), un élément `.exercise-score` est mis à jour (ex. `Score : 2 / 3`) et placé au-dessus des contrôles; le modal de résultats s'affiche également automatiquement. Le bouton **Réinitialiser** du modal efface l'affichage inline du score.

---

## 🔍 Debugging & Checklist (si ça ne fonctionne pas)

1. Ouvrir la console (F12) — voir erreurs de chargement des scripts (404, etc.).
2. Vérifier chemins relatifs : la page HTML -> `../JS/quiz.js` (ou adapte selon emplacement).
3. S'assurer que la page contient `<section class="exercise">`.
4. Si `addExercise` n'existe pas au moment où tu l'appelles, utilise le pattern `initExercises()` ci-dessus.
5. Si les bordures ne s'affichent pas : vérifier que `quiz.css` est chargé et que tu n'as pas de `!important` qui l'écrase. Le code applique aussi des styles inline en fallback.
6. Pour déboguer un module spécifique, ouvre son fichier (`qcm.js`, `effects.js`, `hints.js`) et ajoute `console.log` pour observer le flux.

---

## ✅ Bonnes pratiques

- Extraire les appels `addExercise(...)` dans un fichier `exercises.<page>.js` et l'inclure **après** le loader, ou utiliser `initExercises()` pour s'assurer que l'API est prête.
- Mettre des textes courts dans les boutons (lisibilité) et vérifier l'accessibilité (aria-live pour le statut, aria-hidden pour canvas/modal).
- Versionner les fichiers JS dans Git pour faciliter le revert et le debug.

---

## Exemple complet minimal (HTML)

```html
<!-- head -->
<link rel="stylesheet" href="../JS/quiz.css">

<!-- body somewhere -->
<section class="exercise">
  <h3>Exercice</h3>
</section>

<script src="../JS/quiz.js"></script>
<script>
function initExercises(){
  if (typeof addExercise !== 'function') { setTimeout(initExercises, 50); return; }
  addExercise("<img> — Corrige la ligne", ["<img href=...>","<img src=... alt=...>"], "<img src=... alt=...>");
  setExerciseHints([{ href:'Working with Images and SVGs.html', text: 'Images & SVGs' }]);
}
initExercises();
</script>
```

---

Si tu veux, je peux :
- Générer un `cloze.js` (texte à trou) avec exemple prêt à l'emploi ✅
- Extraire les appels `addExercise(...)` de chaque page dans des fichiers `exercises.<page>.js` pour organiser le repo ✅
- Ajouter des tests simples pour les modules (logiques) 🧪

Dis-moi quelle option tu préfères et je l'implémente. Bonne continuation !