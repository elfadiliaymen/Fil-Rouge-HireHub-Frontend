# HireHub — Frontend (Application React)

**Nom du projet :** HireHub — Frontend (interface utilisateur de la plateforme de recrutement)

---

# 2. Présentation du projet

Ce projet est une **application web** (interface utilisateur) de la plateforme de recrutement HireHub. Elle s'adresse principalement aux **recruteurs** qui veulent publier des offres et suivre les candidatures, ainsi qu'aux **candidats** qui recherchent un emploi et déposent leur CV.

Son objectif principal est de **fournir une interface claire et simple**, connectée à l'API HireHub, pour permettre à chacun de gérer les offres d'emploi, les CV, les candidatures et les entretiens sans connaissance technique.

L'application est développée avec **React** et la bibliothèque de composants **Material UI**, et elle communique avec le backend via **Axios**.

---

# 3. Problématique

Le problème identifié est que **consulter et gérer les démarches de recrutement uniquement via une API technique n'est pas utilisable par les recruteurs et les candidats** : les informations sont dispersées et aucune interface ne les organise.

La solution proposée permet de **regrouper toutes les opérations dans une seule application** : tableaux de bord, formulaires et pages dédiées pour les utilisateurs, les offres, les CV, les candidatures et les entretiens, avec des notifications visuelles claires à chaque action.

---

# 4. Fonctionnalités principales

- Créer un compte et se connecter (authentification par jeton JWT)
- Consulter et gérer les utilisateurs selon leur rôle (ADMIN, RECRUTEUR, CANDIDAT)
- Publier, modifier et consulter les offres d'emploi
- Téléverser et consulter les CV des candidats
- Suivre les candidatures et modifier leur statut
- Planifier et gérer les entretiens
- Mettre à jour son profil et changer son mot de passe

---

# 5. Technologies utilisées

| Technologie | Utilisation dans le projet |
|-------------|----------------------------|
| React 19 | Développement de l'interface utilisateur |
| Vite 8 | Outil de développement et de compilation du projet |
| Material UI (MUI) | Bibliothèque de composants graphiques (boutons, tableaux, formulaires) |
| Axios | Envoi des requêtes HTTP vers l'API backend |
| React Router | Gestion de la navigation entre les pages |
| React Hook Form + Yup | Création des formulaires et validation des données saisies |
| react-toastify | Affichage des notifications (succès, erreur, information) |
| jwt-decode | Lecture du contenu du jeton JWT côté client |
| Oxlint | Vérification du code (linter) |
| Docker / Nginx | Empaquetage et service de l'application en production |

---

# 6. Installation et lancement

## 6.1 Prérequis

Pour utiliser ce projet, vous devez disposer de :

- Node.js 22 (ou plus récent)
- npm (fourni avec Node.js)
- Git
- Visual Studio Code ou un autre éditeur
- Le backend HireHub démarré (voir le README du dépôt backend)

---

## 6.2 Cloner le dépôt

```bash
git clone https://github.com/elfadiliaymen/Fil-Rouge-HireHub-Frontend.git
```

---

## 6.3 Ouvrir le dossier

```bash
cd Fil-Rouge-HireHub-Frontend/hirehub-frontend
```

---

## 6.4 Installer les dépendances

```bash
npm install
```


## 6.6 Lancer le projet

```bash
npm run dev
```

---

## 6.7 Ouvrir le projet

```
http://localhost:5173
```

---

# 7. Captures d'écran

## Capture 1

### Titre

```
Tableau de bord de l'application
```

### Image

```md
![Tableau de bord de l'application](docs/captures/tableau-de-bord.png)
```

### Explication

Cette capture montre la page principale de l'application après connexion : elle présente un résumé général (statistiques et accès rapides aux différents modules).

---

## Capture 2

### Titre

```
Formulaire de création d'une offre d'emploi
```

### Image

```md
![Formulaire de création d'une offre d'emploi](docs/captures/offre-emploi.png)
```

### Explication

Cette capture montre un formulaire de l'application : le recruteur renseigne les informations de l'offre, avec la validation des champs assurée par React Hook Form et Yup.

---

# 8. Contribution personnelle

Ma contribution principale a porté sur le **développement de l'interface utilisateur** : création des pages, des composants réutilisables et des formulaires.

J'ai également travaillé sur la **connexion de l'application au backend** : configuration d'Axios avec le jeton JWT, gestion de la session et renvoi automatique vers la page de connexion en cas d'expiration.

J'ai été responsable de la **gestion de la sécurité côté client** : protection des routes selon les rôles, déconnexion et traitement des erreurs de l'API.

---

# 9. Difficultés rencontrées

## Difficulté 1

### Problème rencontré

Les routes protégées étaient accessibles même sans être connecté, car rien ne vérifiait la présence du jeton avant d'afficher les pages.

### Recherches / Tests

J'ai consulté la documentation de React Router et testé les comportements avec le JWT stocké dans le navigateur.

### Solution

J'ai créé une protection de navigation qui vérifie le jeton et le rôle de l'utilisateur avant d'autoriser l'accès à chaque page, et qui redirige vers la page de connexion quand le jeton est absent ou expiré.

### Ce que j'ai appris

J'ai appris à contrôler l'accès aux pages d'une application React selon l'état de connexion et le rôle de l'utilisateur.

### Texte final

J'ai rencontré le problème suivant : les pages sécurisées étaient accessibles sans connexion. Pour comprendre l'origine du problème, j'ai étudié la documentation de React Router et vérifié comment le jeton était stocké. J'ai résolu le problème en ajoutant un contrôle d'accès basé sur le jeton et le rôle. Cette difficulté m'a permis d'apprendre à sécuriser la navigation côté client.

---

## Difficulté 2

### Problème rencontré

Après une erreur 401 (jeton expiré) ou 403 (accès refusé), l'utilisateur restait sur la page et continuait de voir des erreurs.

### Recherches / Tests

J'ai inspecté la configuration d'Axios et les réponses renvoyées par l'API pour comprendre quels codes HTTP étaient concernés.

### Solution

J'ai ajouté des intercepteurs de réponse dans Axios : en cas de 401, la session est effacée et l'utilisateur est redirigé vers la connexion ; en cas de 403, il est redirigé vers une page d'accès refusé.

### Ce que j'ai appris

J'ai appris à utiliser les intercepteurs d'Axios pour réagir automatiquement aux erreurs de session.

---

# 10. Améliorations possibles

Dans une prochaine version, je pourrais :

- rendre l'interface entièrement responsive pour les téléphones et tablettes ;
- ajouter un mode sombre ;
- afficher des graphiques plus détaillés dans le tableau de bord ;
- internationaliser l'application (français / anglais) ;
- ajouter plus de tests automatiques pour les composants.

### Conclusion

Ces améliorations permettraient d'**offrir une meilleure expérience utilisateur**, d'élargir l'audience de l'application et de **réduire les erreurs** lors des mises à jour futures.

---

# ✅ Checklist finale

## Présentation

- [x] Le nom du projet est clair.
- [x] Le projet est présenté en 3 à 5 lignes.
- [x] Le public cible est identifié.
- [x] Le besoin est expliqué.
- [x] L'objectif est précisé.

## Fonctionnalités

- [x] 3 à 6 fonctionnalités (7 ici).
- [x] Chaque fonctionnalité commence par un verbe.
- [x] Elles correspondent à des actions réelles.

## Technologies

- [x] Les technologies sont indiquées.
- [x] Leur rôle est expliqué.

## Installation

- [x] Les prérequis sont présents.
- [x] Le dépôt est correct.
- [x] Les commandes fonctionnent.
- [x] L'adresse locale est indiquée.
- [x] Aucune donnée sensible n'est publiée.

## Captures

- [ ] Deux captures minimum (à ajouter dans `docs/captures/`).
- [ ] Chaque capture possède un titre.
- [ ] Les images fonctionnent.

## Contribution

- [x] Ma contribution est précise.
- [x] Les tâches sont clairement décrites.
- [x] Je distingue mon travail de celui du groupe.

## Difficultés

- [x] Les difficultés sont expliquées.
- [x] Les recherches sont décrites.
- [x] Les solutions sont précisées.
- [x] Les apprentissages sont présentés.

## Améliorations

- [x] 2 à 4 améliorations (5 ici).
- [x] Elles sont réalistes.