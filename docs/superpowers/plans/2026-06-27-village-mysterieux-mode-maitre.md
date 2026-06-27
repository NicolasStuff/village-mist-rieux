# Le Village Mysterieux - Plan D'implementation

**Goal:** Creer une application Next.js deployee sur Fly.io qui heberge une partie unique de `Le Village Mysterieux`, permet aux joueurs de rejoindre et reprendre la partie, distribue roles/secrets, fournit un mode maitre narrateur, gere les accusations deterministes, propose un tutoriel de cartes, integre des assets generes avec `imagegen`, pousse le code vers GitHub et verifie le parcours complet dans un navigateur.
**Ticket:** Demande conversationnelle: jeu web familial 6-12 joueurs, secrets complementaires, roles sociaux, narrateur non joueur/mode maitre, partie unique hebergee, reprise joueur apres fermeture de l'app, tutoriel de cartes facon collection, generation des images de cartes avec `imagegen`, depot GitHub `NicolasStuff/village-mist-rieux`, deploiement Fly.io et verification navigateur post-deploiement.
**Plan status:** Final after 3 self-review iterations.

## 1. Ticket Summary

Le projet doit produire un petit jeu web familial appele `Le Village Mysterieux`.

Objectifs produit:
- Heberger une seule partie active a la fois.
- Permettre au narrateur de creer ou reprendre la partie active.
- Permettre a 6-12 joueurs de rejoindre la partie depuis leur appareil.
- Permettre a un joueur qui ferme l'app de reprendre sa vue personnelle en rouvrant le meme navigateur.
- Distribuer a chaque joueur une carte role et une carte fragment de secret.
- Former des duos secrets aleatoires, sauf nombre impair ou un joueur devient solitaire.
- Donner au narrateur/mode maitre la verite complete de la partie.
- Permettre au narrateur de gerer les phases, les accusations, les revelations, les soupcons et les pouvoirs.
- Proposer un tutoriel ou l'on peut parcourir toutes les cartes, cliquer une carte, la voir en grand, puis lire sa definition, son effet et un exemple d'usage.
- Generer les images utilisees dans les cartes avec le skill `imagegen`, puis les integrer dans `/public/assets`.
- Publier le code sur le repo GitHub `https://github.com/NicolasStuff/village-mist-rieux`.
- Deployer l'app et son stockage persistant sur Fly.io.
- Ouvrir l'app dans un navigateur apres deploiement et verifier les parcours critiques.

Non-objectifs V1:
- Pas de comptes utilisateurs.
- Pas de multijoueur temps reel avec WebSocket.
- Pas de LLM comme arbitre de verite.
- Pas d'elimination seche des joueurs reveles.
- Pas de support multi-parties simultanees.
- Pas de deploiement serverless ephemere sans stockage durable.
- Pas de validation finale sans preuve navigateur.

Decision centrale:
- L'application est `server-authoritative`: la verite de la partie vit cote serveur.
- Le navigateur du joueur ne garde qu'un jeton de reprise, jamais toute la verite.
- Le narrateur est une couche de presentation et de theatre au-dessus d'un moteur deterministe.
- Fly.io heberge le serveur Next.js et un volume persistant `/data` pour SQLite.
- Un LLM peut etre ajoute plus tard pour reformuler les annonces, mais il ne doit pas decider si une accusation est correcte.

## 2. Current State

Relevant files:
- Aucun code produit n'existe encore dans le workspace `/Users/nicolasivorra/Documents/Village mistéreux`.
- Aucun `AGENTS.md`, `CLAUDE.md`, `package.json`, `app/`, `src/`, `docs/` ou `public/` n'existait avant ce plan.
- Ce plan cree uniquement `docs/superpowers/plans/2026-06-27-village-mysterieux-mode-maitre.md`.
- Le repo GitHub `NicolasStuff/village-mist-rieux` existe, est public et vide au moment de la verification.
- La CLI Fly repond pour le compte `nicolas.ivorra.ni@gmail.com`, avec les organisations disponibles `personal`, `alexandre-rodriguez` et `astre21`.

Existing behavior:
- Le projet est un dossier vide. L'implementation partira d'une base Next.js neuve.

Constraints:
- Utiliser Next.js avec App Router et TypeScript.
- Application hebergee par un serveur Next.js unique pour la soiree.
- Une seule partie active a la fois.
- Etat de partie persiste cote serveur.
- Reprise joueur via token local garde dans le navigateur.
- Distribution reproductible par seed.
- Regles d'accusation deterministes.
- UI mobile-first, car chaque joueur peut utiliser son telephone.
- Les images des cartes doivent etre generees avec `imagegen`.
- Les images generees ne doivent contenir aucun texte: le texte des cartes est rendu en HTML/CSS pour rester lisible, localisable et controlable.
- Les assets references par l'app doivent etre copies dans le workspace, jamais laisses uniquement sous `~/.codex/generated_images`.
- Le repo local doit etre initialise, connecte au remote GitHub et pousse.
- Le deploiement Fly doit utiliser une app sans accents dans son nom, par exemple `village-mist-rieux`, sous l'organisation choisie explicitement.
- SQLite doit ecrire dans un chemin configure par variable d'environnement, par exemple `/data/village.db`, et non dans l'image Docker.
- La config Fly doit garder une seule machine active pour eviter deux etats de partie concurrents avec SQLite.
- Le plan de verification final doit inclure une ouverture reelle dans le navigateur et des checks UI.

Documentation framework verifiee:
- Context7 a confirme l'usage de `create-next-app@latest`, App Router et des validations `next typegen`, `tsc --noEmit`, lint/build.
- Context7 a confirme que les Server Actions peuvent muter les donnees puis rafraichir l'UI avec `refresh`, et que `router.refresh()` permet aux vues client de recharger les donnees serveur.
- Les docs Fly.io verifiees indiquent que `fly launch` detecte une app Next.js et genere `fly.toml`/`Dockerfile`, que les volumes Fly sont le stockage persistant adapte aux donnees d'etat, et que la section `[mounts]`/`[[mounts]]` de `fly.toml` doit monter une source de volume vers une destination comme `/data`.
- Les docs Next.js verifiees indiquent que le mode Node.js server et le deploiement Docker supportent les fonctionnalites Next.js necessaires.

## 3. Game Design Spec

### 3.1 Glossaire

- `Joueur`: personne qui participe a la partie.
- `Appareil joueur`: navigateur personnel d'un joueur, associe a un jeton de reprise.
- `Narrateur`: maitre de ceremonie humain utilisant le mode maitre.
- `Mode maitre`: ecran prive qui connait la verite de la partie.
- `Partie active`: unique partie courante hebergee par l'app.
- `Code partie`: code court permettant aux joueurs de rejoindre la partie active.
- `Jeton joueur`: token local qui permet de reprendre sa vue personnelle.
- `Role`: carte donnant un pouvoir social ou informationnel.
- `Secret`: affaire complete a cacher.
- `Fragment`: moitie d'un secret donnee a un joueur.
- `Duo`: deux joueurs qui portent ensemble un secret complet.
- `Solitaire`: joueur seul avec un secret complet dans les parties impaires.
- `Affaire`: nom public d'un secret, par exemple `La Lettre de la Cave`.
- `Element`: composant structure d'un secret: `lieu`, `objet`, `action`, `mobile`.
- `Soupcon`: penalite publique obtenue apres une accusation ratee ou certains effets.
- `Revelation`: moment ou le secret d'un duo/solitaire devient public.
- `Conseil`: phase officielle ou les accusations peuvent etre formulees.

### 3.2 Format des joueurs

Nombre de joueurs autorise:
- Minimum: 6.
- Maximum: 12.

Repartition:
- 6 joueurs: 3 duos.
- 7 joueurs: 3 duos + 1 solitaire.
- 8 joueurs: 4 duos.
- 9 joueurs: 4 duos + 1 solitaire.
- 10 joueurs: 5 duos.
- 11 joueurs: 5 duos + 1 solitaire.
- 12 joueurs: 6 duos.

Regle solitaire:
- Le solitaire recoit un secret complet, pas un fragment.
- Il gagne s'il reste non revele.
- Une accusation contre un solitaire doit viser 1 joueur au lieu de 2.
- Le mode maitre indique explicitement qu'un joueur est solitaire.
- L'interface publique ne revele jamais qu'un joueur est solitaire avant revelation.

### 3.3 Structure d'un secret

Chaque `SecretCase` contient:
- `id`: identifiant stable.
- `title`: nom public de l'affaire.
- `difficulty`: `facile`, `moyen`, `retors`.
- `elements.lieu`: lieu central.
- `elements.objet`: objet central.
- `elements.action`: action cachee.
- `elements.mobile`: raison.
- `fullReveal`: texte complet du secret.
- `fragments[0]`: fragment A, contient surtout lieu + objet.
- `fragments[1]`: fragment B, contient surtout action + mobile.
- `soloText`: version complete si utilise comme secret solitaire, seulement pour les secrets compatibles solo.
- `image`: chemin vers l'asset de carte.
- `tutorial`: explication de la carte et de la maniere de jouer autour.

Exemple de secret duo:
- Title: `La Lettre de la Cave`.
- Lieu: `la cave de la mairie`.
- Objet: `une cle rouillee`.
- Action: `cacher une lettre`.
- Mobile: `eviter un scandale pendant la fete du village`.
- Fragment A: `Tu sais qu'une cle rouillee a ete retrouvee pres du vieux puits, et qu'elle ouvre une porte rarement utilisee.`
- Fragment B: `Tu sais qu'une lettre compromettante a ete cachee pour eviter un scandale pendant la fete du village.`
- Reveal: `Votre duo a utilise la cle rouillee pour ouvrir la cave de la mairie et cacher une lettre compromettante.`

### 3.4 Structure d'un role

Chaque `RoleCard` contient:
- `id`: identifiant stable.
- `name`: nom affiche.
- `category`: `information`, `protection`, `pression`, `desordre`, `tempo`.
- `timing`: phase ou le role peut etre utilise.
- `effect`: effet exact.
- `limitation`: nombre d'usages et contrainte.
- `masterInstruction`: ce que le narrateur doit faire.
- `playerHint`: conseil court visible dans le tutoriel.
- `image`: chemin vers l'asset de carte.

Roles V1:
- `Notaire`: force une reponse officielle en `oui`, `non` ou `je ne sais pas` a une question ciblee.
- `Archiviste`: recoit en prive un vrai element d'une affaire non revelee qui n'est pas la sienne.
- `Garde champetre`: annule une accusation visant son equipe une fois; l'accusation n'est pas resolue.
- `Faussaire`: peut declarer une reponse officielle comme potentiellement fausse; le mode maitre l'enregistre.
- `Maire`: declenche immediatement un mini-conseil d'une seule accusation.
- `Serrurier`: demande si deux elements peuvent appartenir a la meme affaire; reponse `compatible` ou `incompatible`.
- `Commere`: consulte en prive la derniere reponse officielle donnee par un joueur.
- `Guerisseuse`: retire 1 soupcon a un joueur.
- `Cartographe`: apprend un lieu present dans une affaire non revelee qui n'est pas la sienne.
- `Horloger`: ajoute ou retire 90 secondes a une phase.
- `Messager`: fait passer une question privee via l'app a un joueur.
- `Crieur public`: force un joueur a repeter publiquement une reponse qu'il vient de donner.

Distribution:
- Une partie distribue autant de roles que de joueurs.
- Les roles sont uniques dans une partie.
- Les roles ne determinent pas les equipes.
- Les equipes sont determinees uniquement par les secrets.

### 3.5 Boucle de partie

Etapes:
1. `Setup maitre`: le narrateur cree la partie active avec noms, seed et code maitre.
2. `Connexion joueurs`: les joueurs rejoignent avec le code partie et choisissent leur nom.
3. `Distribution`: chaque joueur voit son role et son fragment sur son propre appareil.
4. `Lecture silencieuse`: 90 secondes.
5. `Rumeurs`: discussion libre.
6. `Questions officielles`: chaque joueur pose une question a un autre joueur.
7. `Pouvoirs`: certains roles peuvent etre actives.
8. `Conseil`: accusations formelles.
9. `Resolution`: le narrateur lit les verdicts et l'app applique les consequences.
10. `Fin de manche`: passage a la manche suivante.
11. `Fin de partie`: victoire du dernier duo/solitaire non revele, ou departage si limite de manches atteinte.

Durees par defaut:
- Lecture silencieuse: 90 secondes.
- Rumeurs: 4 minutes.
- Questions officielles: pas de timer global; le narrateur valide le passage.
- Pouvoirs: 2 minutes.
- Conseil: 3 minutes.

Nombre de manches:
- 6-7 joueurs: 3 manches.
- 8-9 joueurs: 4 manches.
- 10-12 joueurs: 5 manches.

Joueurs reveles:
- Ils ne peuvent plus gagner.
- Ils continuent a jouer comme enqueteurs.
- Ils gardent leur role seulement si celui-ci n'a pas deja ete utilise et si le narrateur le permet.
- Regle V1: un joueur revele peut encore utiliser son role sauf si le role protege son propre secret.

### 3.6 Connexion et reprise joueur

Le parcours joueur doit etre simple:
1. Le narrateur partage l'URL de l'app et le `code partie`.
2. Le joueur ouvre `/join`.
3. Il saisit le code partie.
4. Il choisit son nom dans la liste des joueurs non reclames.
5. Le serveur genere un `playerToken` aleatoire, l'associe au joueur et renvoie la vue personnelle.
6. Le navigateur stocke `playerToken` et `playerId` en `localStorage`.
7. Si le joueur ferme l'app puis revient, l'app lit le token local et reprend automatiquement `/player`.

Regles de reprise:
- Le token ne donne acces qu'a la vue du joueur associe.
- La vue joueur ne contient que:
  - son nom;
  - son role;
  - son fragment ou secret solo;
  - l'etat public de la partie;
  - ses pouvoirs disponibles;
  - les annonces publiques.
- La vue joueur ne contient jamais:
  - les secrets complets des autres;
  - la table des duos;
  - les roles des autres, sauf si deja publics;
  - les fragments des autres.

Cas de perte de token:
- Si le joueur change d'appareil ou vide son navigateur, le narrateur peut `liberer` ou `regenerer` son acces depuis le mode maitre.
- Une action `Reattribuer l'appareil` invalide l'ancien token et remet le joueur dans la liste reclaimable.

### 3.7 Accusations deterministes

Une accusation est saisie par le narrateur/mode maitre, pas jugee au feeling.

Champs:
- `accuserIds`: 1 ou plusieurs joueurs qui portent l'accusation.
- `targetPlayerIds`: 2 joueurs pour un duo, 1 joueur pour un solitaire.
- `claimedSecretCaseId`: affaire visee.
- `claimedElements`: au moins 2 elements parmi lieu, objet, action, mobile.
- `usedRoleEffects`: pouvoirs defensifs/offensifs actifs au moment de la resolution.

Regle d'eligibilite:
- Une accusation de duo doit contenir exactement 2 suspects.
- Une accusation de solitaire doit contenir exactement 1 suspect.
- Il faut choisir une affaire.
- Il faut choisir au moins 2 elements.
- Un joueur deja revele ne peut pas etre la cible principale d'une accusation de victoire, mais peut etre mentionne dans l'historique.

Regle de correction:
- `targetTeamMatches`: les suspects sont exactement les porteurs reels du secret.
- `secretMatches`: l'affaire visee est celle portee par les suspects.
- `elementMatchCount >= 2`: au moins deux elements declares correspondent au secret reel.
- L'accusation est correcte si les trois conditions sont vraies, sauf effet de role actif.

Consequences:
- Correcte sans defense: le secret est revele, les joueurs cibles deviennent `revealed`.
- Correcte avec `Garde champetre`: le verdict devient `blocked`, le secret n'est pas revele, le pouvoir est consomme.
- Fausse: chaque accusateur prend 1 soupcon.
- Fausse contre un solitaire: chaque accusateur prend 1 soupcon et le solitaire gagne 1 marque `discretion` utilisee au departage.

Historique:
- Chaque accusation est ajoutee a `game.accusations`.
- Le mode maitre conserve le detail complet.
- Les vues publiques affichent une version sans exposer la verite cachee si accusation bloquee.

### 3.8 Narrateur et mode maitre

Le mode maitre est la console privee du narrateur.

Routes prevues:
- `/master`: console narrateur pour la partie active.
- `/master/setup`: creation/reinitialisation de la partie active.
- `/join`: connexion joueur.
- `/player`: vue personnelle du joueur connecte.
- `/table`: ecran public partage optionnel.
- `/tutorial`: galerie des cartes.
- `/tutorial/[cardId]`: detail d'une carte.

Entree dans le mode maitre:
- V1: code maitre cree au setup et garde dans le navigateur du narrateur.
- Le code maitre n'est pas une securite forte, mais evite les revelations accidentelles autour de la table.
- Toute action maitre critique demande confirmation: revelation, reset partie, reattribution d'un joueur.

Le mode maitre affiche:
- Code partie et URL de connexion.
- Etat de connexion de chaque joueur: non reclame, connecte, a reprendre.
- Liste des joueurs.
- Role de chaque joueur.
- Duo/solitaire reel.
- Secret complet et fragments.
- Statut revele/non revele.
- Soupcons.
- Pouvoirs disponibles/utilises.
- Phase actuelle et timer.
- Formulaire d'accusation.
- Verdict calcule.
- Texte narrateur a lire.

Textes narrateur V1:
- Generes par templates locaux, pas par LLM.
- Variantes deterministes par seed pour garder une ambiance sans dependance API.
- Exemple verdict correct: `Le silence tombe sur la place du village. L'accusation tient debout: l'affaire "{secretTitle}" est revelee.`
- Exemple verdict faux: `Les regards se croisent, mais la piste s'effondre. Cette accusation ne revele aucun secret.`
- Exemple blocage: `Le garde champetre frappe du talon. La procedure est interrompue; le village devra revenir avec une preuve plus solide.`

Extension optionnelle post-V1:
- Ajouter un adaptateur LLM uniquement pour reformuler les annonces.
- Entree LLM: verdict deterministe, secret revele, ton souhaite.
- Sortie LLM: texte court a lire.
- Interdit: laisser le LLM decider `correct` ou `false`.

## 4. Technical Approach

### 4.1 Stack

Bootstrap:
```bash
npx create-next-app@latest . --ts --eslint --app --src-dir --import-alias "@/*"
```

Decisions:
- Next.js App Router.
- TypeScript strict.
- CSS/Tailwind selon le scaffold choisi par `create-next-app`.
- Serveur Next.js comme source de verite.
- SQLite local persistant via `better-sqlite3` pour la V1.
- Donnees de partie stockees en JSON versionne dans SQLite.
- `localStorage` uniquement pour les jetons de reprise joueur/maitre.
- Moteur de jeu pur en TypeScript, sans dependance React ni stockage.
- Mutations via Server Actions ou Route Handlers.
- Polling leger cote client pour rafraichir les vues, pas de WebSocket V1.
- Tests unitaires avec Vitest.
- Tests UI essentiels avec Playwright si le budget d'implementation le permet.
- Dockerfile compatible Fly.io.
- Volume Fly.io monte sur `/data` pour le fichier SQLite.
- Health endpoint public pour verifier le deploiement.

Deployment V1:
- Cible principale demandee: Fly.io.
- App Fly cible: `village-mist-rieux` si le nom est disponible, sinon variante proche sans accents.
- Organisation Fly a choisir explicitement au deploy: par defaut `personal` sauf demande contraire.
- Region Fly a choisir proche des joueurs, par exemple `cdg` ou `ams` pour la France.
- Stockage: volume Fly persistant monte dans `/data`.
- Variable serveur: `DATABASE_PATH=/data/village.db`.
- Une seule machine active en V1: `min_machines_running = 1`, pas de scaling horizontal tant que SQLite reste mono-fichier.
- Alternative locale conservee: un process Node local expose sur le Wi-Fi familial pour tests avant deploy.
- Non recommande sans adaptation: Vercel/serverless avec SQLite fichier local, car le stockage peut etre ephemere.
- Si deploiement cloud durable souhaite plus tard: remplacer `game-store.ts` par Postgres/Supabase sans changer le moteur de jeu.

GitHub V1:
- Remote cible: `https://github.com/NicolasStuff/village-mist-rieux`.
- Le repo a ete verifie comme existant, public et vide.
- Publier sur `main` apres validation locale.
- Ne pas creer de PR sauf demande ulterieure; le besoin actuel est de pousser le code.

Scripts attendus dans `package.json`:
- `dev`: lancer l'app locale.
- `build`: build Next.js.
- `lint`: lint.
- `type-check`: `next typegen && tsc --noEmit`.
- `test`: Vitest.
- `test:watch`: Vitest watch.
- `db:init`: creer le fichier SQLite et les tables V1.
- `start`: lancer le build Next.js en production.
- `health`: optionnel, verifier `/api/health` localement si ajoute au package.

Docker/Next production notes:
- Prefer `output: "standalone"` in `next.config` if it simplifies the production image.
- Ensure the Docker build stage can compile/install `better-sqlite3` native dependencies.
- Keep the runtime image lean, but include what `better-sqlite3` needs to load at runtime.
- Never copy local `data/village.db` into the image.

### 4.2 Architecture

Domain layer:
- `src/lib/game/types.ts`: types partages.
- `src/lib/game/rng.ts`: RNG seede deterministe.
- `src/lib/game/catalog/roles.ts`: catalogue des roles.
- `src/lib/game/catalog/secrets.ts`: catalogue des secrets duo et solitaire.
- `src/lib/game/assign.ts`: creation de partie et distribution.
- `src/lib/game/phases.ts`: progression des phases et manches.
- `src/lib/game/accusations.ts`: validation et resolution d'accusations.
- `src/lib/game/powers.ts`: resolution des pouvoirs.
- `src/lib/game/narration.ts`: templates narrateur.
- `src/lib/game/snapshots.ts`: construction des vues `public`, `player`, `master` sans fuite d'information.

Server layer:
- `src/lib/server/db.ts`: connexion SQLite.
- `src/lib/server/schema.sql`: schema initial.
- `src/lib/server/game-store.ts`: lecture/ecriture de la partie active.
- `src/lib/server/session.ts`: creation, hash et validation des tokens joueur/maitre.
- `src/lib/server/actions/master-actions.ts`: actions maitre.
- `src/lib/server/actions/player-actions.ts`: actions joueur.
- `src/lib/server/config.ts`: lecture de `DATABASE_PATH`, region/env runtime et flags serveur.

API layer:
- `src/app/api/health/route.ts`: health check public minimal, confirme process up et acces SQLite.
- `src/app/api/active-game/route.ts`: snapshot public de la partie active.
- `src/app/api/player/session/route.ts`: rejoindre/reprendre une session joueur.
- `src/app/api/player/snapshot/route.ts`: snapshot prive du joueur authentifie par token.
- `src/app/api/master/snapshot/route.ts`: snapshot maitre authentifie par token/code maitre.

UI layer:
- `src/app/page.tsx`: accueil qui route vers partie active, join, master, tutoriel.
- `src/app/master/setup/page.tsx`: creation/reinitialisation de la partie active.
- `src/app/master/page.tsx`: console narrateur.
- `src/app/join/page.tsx`: connexion joueur a la partie active.
- `src/app/player/page.tsx`: vue personnelle du joueur.
- `src/app/table/page.tsx`: etat public projetable/partageable.
- `src/app/tutorial/page.tsx`: galerie des cartes.
- `src/app/tutorial/[cardId]/page.tsx`: carte detaillee.

Components:
- `src/components/cards/CardFrame.tsx`.
- `src/components/cards/RoleCard.tsx`.
- `src/components/cards/SecretCard.tsx`.
- `src/components/tutorial/CardGallery.tsx`.
- `src/components/setup/MasterSetupForm.tsx`.
- `src/components/join/JoinGameForm.tsx`.
- `src/components/player/PlayerDashboard.tsx`.
- `src/components/player/PrivateCardPanel.tsx`.
- `src/components/table/PublicGameBoard.tsx`.
- `src/components/game/PhaseController.tsx`.
- `src/components/game/PlayerStatusBoard.tsx`.
- `src/components/master/MasterDashboard.tsx`.
- `src/components/master/ConnectionBoard.tsx`.
- `src/components/master/TruthTable.tsx`.
- `src/components/master/AccusationForm.tsx`.
- `src/components/master/VerdictPanel.tsx`.
- `src/components/master/NarratorScript.tsx`.
- `src/components/master/PowerResolutionPanel.tsx`.
- `src/components/master/ReassignPlayerAccess.tsx`.

Assets:
- `public/assets/cards/roles/*.webp`.
- `public/assets/cards/secrets/*.webp`.
- `public/assets/cards/backs/role-back.webp`.
- `public/assets/cards/backs/secret-back.webp`.
- `public/assets/narrator/narrator.webp`.
- `public/assets/backgrounds/village-evening.webp`.

Docs/assets:
- `docs/assets/imagegen-prompts.md`: prompts finaux utilises.
- `docs/assets/asset-manifest.md`: mapping asset -> carte -> prompt -> chemin.

### 4.3 Persistence model

SQLite schema V1:
```sql
create table if not exists active_game (
  id text primary key,
  join_code text not null,
  master_token_hash text not null,
  state_json text not null,
  created_at text not null,
  updated_at text not null
);

create table if not exists player_sessions (
  player_id text primary key,
  token_hash text not null,
  claimed_at text not null,
  last_seen_at text not null
);
```

Database path:
- Local dev: `DATABASE_PATH` absent => fallback controle vers `./data/village.db`.
- Fly.io: `DATABASE_PATH=/data/village.db`.
- `data/` doit etre ignore par Git.
- `db.ts` cree le dossier parent si necessaire, puis applique `schema.sql`.
- `/api/health` doit echouer explicitement si SQLite n'est pas accessible.

Single-game rule:
- `active_game` contains exactly 0 or 1 row.
- Creating a new game requires confirmation and deletes/replaces the previous row and player sessions.
- The app does not expose a multi-game list in V1.

Token rules:
- Raw tokens are generated with `crypto.randomUUID()` plus random bytes.
- Only token hashes are stored in SQLite.
- Raw tokens live only in the browser's `localStorage`.
- Player token storage key: `village-mysterieux:player-token`.
- Player id storage key: `village-mysterieux:player-id`.
- Master token storage key: `village-mysterieux:master-token`.

State versioning:
- `state_json` contains `schemaVersion`.
- V1 starts at `schemaVersion: 1`.
- `game-store.ts` validates loaded JSON and returns a recoverable error if invalid.

### 4.4 Data Model

Types principaux:
```ts
type PlayerId = string;
type RoleId = string;
type SecretCaseId = string;

type RoleCard = {
  id: RoleId;
  name: string;
  category: "information" | "protection" | "pression" | "desordre" | "tempo";
  timing: "lecture" | "rumeurs" | "questions" | "pouvoirs" | "conseil" | "defense";
  effect: string;
  limitation: string;
  masterInstruction: string;
  playerHint: string;
  image: string;
};

type SecretElements = {
  lieu: string;
  objet: string;
  action: string;
  mobile: string;
};

type SecretCase = {
  id: SecretCaseId;
  title: string;
  difficulty: "facile" | "moyen" | "retors";
  elements: SecretElements;
  fullReveal: string;
  fragments: [string, string];
  soloText?: string;
  image: string;
  tutorial: string;
};

type Player = {
  id: PlayerId;
  name: string;
  roleId: RoleId;
  secretCaseId: SecretCaseId;
  fragmentIndex: 0 | 1 | "solo";
  teamId: string;
  suspicion: number;
  revealed: boolean;
  roleUsed: boolean;
  claimed: boolean;
  lastSeenAt?: string;
};

type GamePhase =
  | "setup"
  | "joining"
  | "deal"
  | "lecture"
  | "rumeurs"
  | "questions"
  | "pouvoirs"
  | "conseil"
  | "resolution"
  | "finished";

type Accusation = {
  id: string;
  round: number;
  accuserIds: PlayerId[];
  targetPlayerIds: PlayerId[];
  claimedSecretCaseId: SecretCaseId;
  claimedElements: Partial<SecretElements>;
  verdict: "pending" | "correct" | "false" | "blocked";
  appliedRoleIds: RoleId[];
  createdAt: string;
};

type Game = {
  schemaVersion: 1;
  id: string;
  joinCode: string;
  seed: string;
  players: Player[];
  phase: GamePhase;
  round: number;
  maxRounds: number;
  accusations: Accusation[];
  revealedSecretCaseIds: SecretCaseId[];
  startedAt: string;
  updatedAt: string;
};

type PublicSnapshot = {
  phase: GamePhase;
  round: number;
  maxRounds: number;
  players: Pick<Player, "id" | "name" | "suspicion" | "revealed" | "claimed">[];
  publicAccusations: Array<Pick<Accusation, "id" | "round" | "accuserIds" | "targetPlayerIds" | "verdict">>;
};

type PlayerSnapshot = PublicSnapshot & {
  self: {
    playerId: PlayerId;
    name: string;
    role: RoleCard;
    secretTitle: string;
    fragmentText: string;
    isRevealed: boolean;
    roleUsed: boolean;
  };
};

type MasterSnapshot = PublicSnapshot & {
  truth: {
    players: Player[];
    secrets: SecretCase[];
    roles: RoleCard[];
  };
};
```

### 4.5 Distribution Algorithm

Function:
```ts
createGame(playerNames: string[], seed: string, joinCode: string): Game
```

Steps:
1. Validate `playerNames.length` between 6 and 12.
2. Normalize names: trim, reject empty, reject duplicates after lowercase normalization.
3. Create deterministic RNG from `seed`.
4. Shuffle players.
5. If player count is odd, pick the last shuffled player as `solitaire`.
6. Pair remaining players in shuffled order.
7. Shuffle roles, assign one unique role per player.
8. Shuffle duo secrets, assign one unique secret per duo.
9. Shuffle solo secrets, assign one to the solitaire if present.
10. Randomize fragment A/B inside each duo.
11. Create `Game` with `phase = "joining"`, `round = 1`, `maxRounds` from player count.
12. Persist in SQLite as the unique active game.

Determinism guarantee:
- Same player names in same order + same seed => same distribution.
- `joinCode`, timestamps and tokens do not affect role/secret distribution.
- Tests must snapshot 6, 7, 8, 11, 12 players.

### 4.6 Server mutation flow

Master mutations:
- `createActiveGame(playerNames, seed, masterCode)`.
- `advancePhase()`.
- `applyAccusation(accusationInput)`.
- `useRolePower(powerInput)`.
- `reassignPlayerAccess(playerId)`.
- `resetActiveGame()`.

Player mutations:
- `claimPlayer(joinCode, playerId)`.
- `resumePlayer(playerId, playerToken)`.
- `markCardSeen(playerId, playerToken)`.
- `heartbeat(playerId, playerToken)`.

Snapshot generation:
- `getPublicSnapshot(game)`: safe for everyone.
- `getPlayerSnapshot(game, playerId)`: includes only that player's private cards.
- `getMasterSnapshot(game, masterToken)`: includes truth.

Polling:
- `/player` polls private snapshot every 2-5 seconds while tab is visible.
- `/table` polls public snapshot every 2-5 seconds.
- `/master` can poll or call `router.refresh()` after mutations.

## 5. ImageGen Asset Plan

### 5.1 ImageGen policy

Use the `imagegen` skill in built-in tool mode by default.

Rules:
- One `image_gen` call per distinct asset or carefully grouped variant only when appropriate.
- Generated project assets must be copied/moved into `/public/assets/...`.
- Do not reference images from `~/.codex/generated_images`.
- Do not put text, titles, labels, card borders or UI copy inside generated images.
- Render card names, descriptions, effects and stats with React/CSS.
- Keep aspect ratio friendly to portrait cards; UI should crop with `object-cover`.
- Save prompts in `docs/assets/imagegen-prompts.md`.
- Save asset mapping in `docs/assets/asset-manifest.md`.

### 5.2 Visual direction

Art direction:
- Mysterious French village.
- Family-friendly investigation.
- Warm evening lantern light.
- Painterly collectible-card illustration.
- Expressive, readable silhouettes.
- Slightly premium board-game feel.
- Not horror, not childish, not parody of existing trading card IP.

Palette:
- Deep green.
- Burgundy.
- Old gold.
- Slate blue.
- Warm lantern amber.
- Cream only as minor paper texture, not dominant UI palette.

Image prompt template for role cards:
```text
Use case: stylized-concept
Asset type: collectible game card illustration
Primary request: portrait illustration for the role "<ROLE_NAME>" in a mysterious French village investigation game
Scene/backdrop: old French village square at dusk, subtle mystery atmosphere
Subject: one expressive character representing "<ROLE_NAME>", family-friendly, clear silhouette
Style/medium: polished painterly board-game illustration, collectible card art, not photorealistic
Composition/framing: centered character, waist-up, generous padding, no border
Lighting/mood: warm lantern light, intriguing, playful tension
Color palette: deep green, burgundy, old gold, slate blue accents, warm amber
Constraints: no text, no logo, no watermark, no card frame, no existing trading card layout
Avoid: horror, gore, modern city, guns, photorealism, childish cartoon, copyrighted style
```

Image prompt template for secret cards:
```text
Use case: stylized-concept
Asset type: collectible mystery case card illustration
Primary request: atmospheric illustration for the secret affair "<SECRET_TITLE>" in a mysterious French village investigation game
Scene/backdrop: <LOCATION_AND_SCENE_SPECIFIC_TO_SECRET>
Subject: key object or clue from the affair, shown as an intriguing mystery scene without characters revealing the culprit
Style/medium: polished painterly board-game illustration, collectible card art, family-friendly mystery
Composition/framing: central clue in foreground, village setting behind it, generous padding, no border
Lighting/mood: dusk lantern light, suspenseful but cozy
Color palette: deep green, burgundy, old gold, slate blue accents, warm amber
Constraints: no text, no logo, no watermark, no card frame, no existing trading card layout
Avoid: horror, gore, modern police scene, photorealism, childish cartoon, copyrighted style
```

Image prompt template for card backs:
```text
Use case: stylized-concept
Asset type: back illustration for a mystery board-game card
Primary request: decorative card back for "<ROLE_OR_SECRET>" cards in Le Village Mysterieux
Scene/backdrop: symbolic pattern inspired by a mysterious French village, lanterns, cobblestones, old keys, sealed letters
Subject: symmetrical ornamental mystery motif, no readable text
Style/medium: polished painterly board-game card back, premium but family-friendly
Composition/framing: centered symmetrical motif, full-bleed image, no explicit border
Lighting/mood: warm, secretive, elegant
Color palette: deep green, burgundy, old gold, slate blue accents
Constraints: no text, no logo, no watermark, no existing trading card layout
Avoid: horror, skulls, gore, photorealism, copyrighted style
```

### 5.3 Required assets

Role assets:
- `notaire.webp`
- `archiviste.webp`
- `garde-champetre.webp`
- `faussaire.webp`
- `maire.webp`
- `serrurier.webp`
- `commere.webp`
- `guerisseuse.webp`
- `cartographe.webp`
- `horloger.webp`
- `messager.webp`
- `crieur-public.webp`

Secret assets, minimum 12 for replay variety:
- `lettre-de-la-cave.webp`
- `cle-du-vieux-puits.webp`
- `ombre-du-moulin.webp`
- `tableau-de-la-chapelle.webp`
- `cloche-felee.webp`
- `registre-du-notaire.webp`
- `lanterne-du-pont.webp`
- `coffret-du-marche.webp`
- `recette-de-la-boulangerie.webp`
- `portrait-du-manoir.webp`
- `barque-disparue.webp`
- `masque-du-bal.webp`

Solo secret assets, minimum 3:
- `solitaire-dernier-temoin.webp`
- `solitaire-promesse-du-maire.webp`
- `solitaire-inconnu-de-la-gare.webp`

Shared assets:
- `public/assets/cards/backs/role-back.webp`
- `public/assets/cards/backs/secret-back.webp`
- `public/assets/narrator/narrator.webp`
- `public/assets/backgrounds/village-evening.webp`

### 5.4 Asset validation

For each generated image:
- Confirm file exists in `/public/assets/...`.
- Confirm file is a valid `png`, `jpg` or `webp`.
- Confirm dimensions are sufficient for card display.
- Visually inspect at least one role, one secret, one card back and background before final integration.
- Confirm no generated text appears in the image.
- Confirm style consistency across role and secret sets.

Suggested local checks:
```bash
find public/assets -type f | sort
file public/assets/cards/roles/notaire.webp
sips -g pixelWidth -g pixelHeight public/assets/cards/roles/notaire.webp
```

## 6. File Plan

Create:
- `.gitignore` - ignorer `node_modules`, `.next`, `data`, `.env*` non publics et artefacts locaux.
- `.dockerignore` - exclure dependances locales, build local, data SQLite et fichiers inutiles de l'image.
- `Dockerfile` - image production Next.js compatible Fly.io.
- `fly.toml` - configuration Fly.io, port interne, checks, env et volume `/data`.
- `package.json` - scripts and dependencies after Next.js scaffold.
- `tsconfig.json` - TypeScript config from scaffold.
- `next.config.ts` or `next.config.mjs` - Next config from scaffold.
- `eslint.config.mjs` - lint config from scaffold.
- `src/app/layout.tsx` - app shell and metadata.
- `src/app/page.tsx` - home screen.
- `src/app/master/setup/page.tsx` - master setup and reset.
- `src/app/master/page.tsx` - narrator console.
- `src/app/join/page.tsx` - player join flow.
- `src/app/player/page.tsx` - private player view and resume.
- `src/app/table/page.tsx` - public table view.
- `src/app/tutorial/page.tsx` - card gallery.
- `src/app/tutorial/[cardId]/page.tsx` - detailed card view.
- `src/app/api/health/route.ts` - health check process + SQLite.
- `src/app/api/active-game/route.ts` - public active game snapshot.
- `src/app/api/player/session/route.ts` - claim/resume player session.
- `src/app/api/player/snapshot/route.ts` - private player snapshot.
- `src/app/api/master/snapshot/route.ts` - private master snapshot.
- `src/components/cards/CardFrame.tsx` - shared visual card container.
- `src/components/cards/RoleCard.tsx` - role card rendering.
- `src/components/cards/SecretCard.tsx` - secret card rendering.
- `src/components/tutorial/CardGallery.tsx` - tutorial gallery.
- `src/components/setup/MasterSetupForm.tsx` - setup form.
- `src/components/join/JoinGameForm.tsx` - join/reclaim flow.
- `src/components/player/PlayerDashboard.tsx` - player view.
- `src/components/player/PrivateCardPanel.tsx` - private role/fragment display.
- `src/components/table/PublicGameBoard.tsx` - public shared board.
- `src/components/game/PhaseController.tsx` - phase navigation and timer.
- `src/components/game/PlayerStatusBoard.tsx` - visible player state.
- `src/components/master/MasterDashboard.tsx` - private master layout.
- `src/components/master/ConnectionBoard.tsx` - player connection/reassignment state.
- `src/components/master/TruthTable.tsx` - hidden truth table.
- `src/components/master/AccusationForm.tsx` - structured accusation input.
- `src/components/master/VerdictPanel.tsx` - deterministic verdict display.
- `src/components/master/NarratorScript.tsx` - theatrical text to read.
- `src/components/master/PowerResolutionPanel.tsx` - role power handling.
- `src/components/master/ReassignPlayerAccess.tsx` - lost-device recovery.
- `src/lib/game/types.ts` - domain types.
- `src/lib/game/rng.ts` - seeded RNG.
- `src/lib/game/catalog/roles.ts` - role data.
- `src/lib/game/catalog/secrets.ts` - secret data.
- `src/lib/game/assign.ts` - distribution.
- `src/lib/game/phases.ts` - phases and round transitions.
- `src/lib/game/accusations.ts` - accusation validation/resolution.
- `src/lib/game/powers.ts` - role effects.
- `src/lib/game/narration.ts` - narrator templates.
- `src/lib/game/snapshots.ts` - safe public/player/master projections.
- `src/lib/server/db.ts` - SQLite connection.
- `src/lib/server/schema.sql` - SQLite schema.
- `src/lib/server/config.ts` - server env and database path.
- `src/lib/server/game-store.ts` - active game persistence.
- `src/lib/server/session.ts` - token creation/hash/validation.
- `src/lib/server/actions/master-actions.ts` - master mutations.
- `src/lib/server/actions/player-actions.ts` - player mutations.
- `src/lib/game/__tests__/assign.test.ts` - distribution tests.
- `src/lib/game/__tests__/accusations.test.ts` - accusation tests.
- `src/lib/game/__tests__/powers.test.ts` - power interaction tests.
- `src/lib/game/__tests__/snapshots.test.ts` - hidden info boundary tests.
- `src/lib/server/__tests__/session.test.ts` - token/session tests.
- `docs/assets/imagegen-prompts.md` - generated image prompts.
- `docs/assets/asset-manifest.md` - generated asset mapping.
- `public/assets/...` - final generated images.

## 7. Implementation Tasks

### Task 1: Bootstrap Next.js

Purpose:
- Create a clean Next.js App Router project in the empty workspace.

Files:
- Root scaffold files.
- `src/app/*`.

Changes:
- Run `npx create-next-app@latest . --ts --eslint --app --src-dir --import-alias "@/*"`.
- Add/confirm scripts: `dev`, `build`, `lint`, `type-check`, `test`, `db:init`.
- Install Vitest, Testing Library if needed, `better-sqlite3`, and type definitions if needed.

Validation:
```bash
npm run lint
npm run type-check
npm run build
```

### Task 2: Create game catalog

Purpose:
- Encode the game content before building UI.

Files:
- `src/lib/game/catalog/roles.ts`.
- `src/lib/game/catalog/secrets.ts`.
- `src/lib/game/types.ts`.

Changes:
- Add 12 role definitions.
- Add at least 12 duo secret definitions.
- Add at least 3 solo secret definitions.
- Include stable image paths even before assets exist.
- Add tutorial descriptions for each card.

Validation:
- Type-check catalog.
- Unit test that role ids and secret ids are unique.
- Unit test that enough roles/secrets exist for 12 players.

### Task 3: Implement deterministic engine

Purpose:
- Make the game reliable before persistence/UI.

Files:
- `src/lib/game/rng.ts`.
- `src/lib/game/assign.ts`.
- `src/lib/game/phases.ts`.
- `src/lib/game/__tests__/assign.test.ts`.

Changes:
- Implement seed normalization.
- Implement deterministic shuffle.
- Implement player validation.
- Implement team/solo assignment.
- Implement role and secret assignment.
- Implement phase progression and max-round rules.

Validation:
```bash
npm run test -- assign
npm run type-check
```

### Task 4: Implement accusation, power and narration rules

Purpose:
- Make the mode maitre trustworthy.

Files:
- `src/lib/game/accusations.ts`.
- `src/lib/game/powers.ts`.
- `src/lib/game/narration.ts`.
- `src/lib/game/__tests__/accusations.test.ts`.
- `src/lib/game/__tests__/powers.test.ts`.

Changes:
- Validate accusation eligibility.
- Resolve correct/false/blocked verdicts.
- Apply soupcons.
- Reveal secrets.
- Consume powers.
- Generate narrator scripts from templates.

Validation:
- Test correct duo accusation.
- Test wrong pair with right secret.
- Test right pair with wrong secret.
- Test insufficient elements.
- Test solo accusation.
- Test `Garde champetre` blocks once.
- Test false accusation adds soupcon.

### Task 5: Implement server persistence and sessions

Purpose:
- Host one active game and allow players to resume after closing the app.

Files:
- `src/lib/server/db.ts`.
- `src/lib/server/schema.sql`.
- `src/lib/server/game-store.ts`.
- `src/lib/server/session.ts`.
- `src/lib/server/__tests__/session.test.ts`.

Changes:
- Create SQLite schema.
- Implement `getActiveGame`, `saveActiveGame`, `replaceActiveGame`, `clearActiveGame`.
- Enforce one active game.
- Generate join code.
- Generate player/master tokens.
- Store only token hashes.
- Validate player resume by `playerId + token`.
- Implement reassign player access.

Validation:
- Unit test token hash validation.
- Unit test replacing active game clears sessions.
- Manual restart Next dev server and confirm active game remains.

### Task 6: Implement safe snapshots

Purpose:
- Prevent hidden-information leaks.

Files:
- `src/lib/game/snapshots.ts`.
- `src/lib/game/__tests__/snapshots.test.ts`.

Changes:
- Build `PublicSnapshot`, `PlayerSnapshot`, `MasterSnapshot`.
- Ensure player snapshot includes only that player's role/fragment.
- Ensure public snapshot never contains secret ids, role ids, fragment text, team ids or truth.
- Ensure master snapshot contains truth.

Validation:
- Unit test public snapshot contains no hidden fields.
- Unit test player A snapshot does not reveal player B private data.
- Unit test master snapshot includes truth only after valid master token path.

### Task 7: Build master setup

Purpose:
- Let the narrator create the unique active game.

Files:
- `src/app/master/setup/page.tsx`.
- `src/components/setup/MasterSetupForm.tsx`.
- `src/lib/server/actions/master-actions.ts`.

Changes:
- Player name form with 6-12 validation.
- Seed field with generate/random option.
- Master code field or generated code.
- Confirmation when replacing an existing active game.
- Create game in SQLite and display join URL/code.

Validation:
- Manual 6-player setup.
- Manual 7-player setup includes one solitaire.
- Manual reset requires explicit confirmation.

### Task 8: Build player join and resume flow

Purpose:
- Let players connect from their own device and resume after closing the app.

Files:
- `src/app/join/page.tsx`.
- `src/app/player/page.tsx`.
- `src/components/join/JoinGameForm.tsx`.
- `src/components/player/PlayerDashboard.tsx`.
- `src/components/player/PrivateCardPanel.tsx`.
- `src/app/api/player/session/route.ts`.
- `src/app/api/player/snapshot/route.ts`.
- `src/lib/server/actions/player-actions.ts`.

Changes:
- Join by code partie.
- Show list of unclaimed player names.
- Claim selected player and store token locally.
- Auto-resume `/player` when token exists.
- Show role and fragment privately.
- Heartbeat or last-seen update.
- If token invalid, route back to `/join` with clear recovery message.

Validation:
- Claim one player and refresh.
- Close/reopen browser tab and resume.
- Try another player without token and confirm hidden info remains inaccessible.
- Reassign a player from master and reclaim from another browser.

### Task 9: Build public table screen

Purpose:
- Give the group a clean shared state without exposing secrets.

Files:
- `src/app/table/page.tsx`.
- `src/app/api/active-game/route.ts`.
- `src/components/table/PublicGameBoard.tsx`.
- `src/components/game/PlayerStatusBoard.tsx`.

Changes:
- Show current phase, round, timer.
- Show player list with claimed/revealed status.
- Show soupcons.
- Show public accusation history.
- Poll public snapshot.
- Never show private card data.

Validation:
- Manual phase progression from master updates table.
- Public screen never shows hidden roles/secrets/team ids.

### Task 10: Build mode maitre narrateur

Purpose:
- Make the narrator the operational center of the game.

Files:
- `src/app/master/page.tsx`.
- `src/app/api/master/snapshot/route.ts`.
- `src/components/master/MasterDashboard.tsx`.
- `src/components/master/ConnectionBoard.tsx`.
- `src/components/master/TruthTable.tsx`.
- `src/components/master/AccusationForm.tsx`.
- `src/components/master/VerdictPanel.tsx`.
- `src/components/master/NarratorScript.tsx`.
- `src/components/master/PowerResolutionPanel.tsx`.
- `src/components/master/ReassignPlayerAccess.tsx`.

Changes:
- Authenticate by master token/code.
- Show join code and connected players.
- Add private truth table with collapsible sections.
- Add phase/timer controls.
- Add structured accusation form.
- Show computed verdict before applying.
- Require confirmation before applying verdict.
- Generate narrator text.
- Apply result to server state.
- Track used powers.
- Reassign lost player access.

Validation:
- Manual correct accusation reveals target duo.
- Manual false accusation adds soupcon.
- Manual blocked accusation consumes defense and does not reveal.
- Refresh after verdict keeps state.
- Reopen master browser and resume with master token.

### Task 11: Build tutorial cards

Purpose:
- Let everyone learn cards before/after a game.

Files:
- `src/app/tutorial/page.tsx`.
- `src/app/tutorial/[cardId]/page.tsx`.
- `src/components/tutorial/CardGallery.tsx`.
- `src/components/cards/CardFrame.tsx`.
- `src/components/cards/RoleCard.tsx`.
- `src/components/cards/SecretCard.tsx`.

Changes:
- Gallery with filters: `Tous`, `Roles`, `Secrets`, `Solitaire`.
- Card detail route with large card image, rendered title, definition, timing, effect, example.
- Mobile-friendly previous/next links.
- Keep explanations on card detail pages.

Validation:
- Open every tutorial card without 404.
- Card text fits mobile and desktop.

### Task 12: Generate ImageGen assets

Purpose:
- Replace placeholder visuals with final project-bound card assets.

Files:
- `docs/assets/imagegen-prompts.md`.
- `docs/assets/asset-manifest.md`.
- `public/assets/cards/roles/*`.
- `public/assets/cards/secrets/*`.
- `public/assets/cards/backs/*`.
- `public/assets/narrator/narrator.webp`.
- `public/assets/backgrounds/village-evening.webp`.

Changes:
- Create final prompt list from templates in section 5.
- Generate all role images with `imagegen`.
- Generate all secret images with `imagegen`.
- Generate card backs, narrator portrait and village background.
- Copy selected outputs into `public/assets`.
- Convert/rename consistently if needed.
- Update manifest with prompt and file path for each asset.

Validation:
```bash
find public/assets -type f | sort
file public/assets/cards/roles/notaire.webp
sips -g pixelWidth -g pixelHeight public/assets/cards/roles/notaire.webp
npm run build
```

Manual:
- Inspect the tutorial gallery.
- Confirm no card image contains accidental text.
- Confirm visual style is coherent.

### Task 13: Visual polish and responsive QA

Purpose:
- Make the app feel like a polished game, not an admin form.

Files:
- `src/app/globals.css`.
- Card components.
- Join/player/table/master/tutorial pages.

Changes:
- Establish visual system:
  - village mystery background;
  - compact game controls;
  - portrait cards;
  - readable mobile typography;
  - no oversized marketing hero;
  - no nested cards.
- Use icons for clear actions if an icon library is available or added.
- Ensure buttons and text never overflow.
- Ensure master mode is dense and scannable.

Validation:
- Manual mobile viewport.
- Manual desktop viewport.
- No overlapping text.
- No blank images.
- `npm run build`.

### Task 14: End-to-end manual scenarios

Purpose:
- Prove the game can actually be played.

Scenarios:
- 6 players:
  - create active game;
  - join from two different browsers;
  - resume after closing player tab;
  - enter master;
  - correct accusation;
  - false accusation;
  - finish game.
- 7 players:
  - confirm one solitaire;
  - accuse solitaire correctly;
  - confirm duo accusations still work.
- 12 players:
  - confirm enough roles/secrets;
  - confirm UI remains usable.
- Lost device:
  - claim player;
  - invalidate/reassign from master;
  - reclaim as same player from another browser.

Validation:
- Record issues and fix before considering implementation done.

### Task 15: Push code to GitHub

Purpose:
- Publish the implemented app to the empty GitHub repository requested by the user.

Files:
- Entire project.
- `.gitignore`.

Changes:
- Initialize Git if the scaffold did not already do it.
- Confirm local status before commit.
- Set branch to `main`.
- Add remote `origin` pointing to `https://github.com/NicolasStuff/village-mist-rieux.git`.
- Commit the complete implementation with a concise message.
- Push `main` to GitHub.

Commands:
```bash
git status --short
git init
git branch -M main
git remote add origin https://github.com/NicolasStuff/village-mist-rieux.git
git add .
git commit -m "Initial Village Mysterieux app"
git push -u origin main
```

Validation:
```bash
gh repo view NicolasStuff/village-mist-rieux --json nameWithOwner,url,defaultBranchRef,isEmpty
git status --short
git log --oneline -1
```

Expected:
- GitHub repo is no longer empty.
- `origin/main` points at the implementation commit.
- No generated secrets, local SQLite DB, `.env` files or `~/.codex/generated_images` paths are committed.

### Task 16: Deploy to Fly.io

Purpose:
- Deploy the single active game server and persistent SQLite storage to Fly.io.

Files:
- `Dockerfile`.
- `.dockerignore`.
- `fly.toml`.
- `src/app/api/health/route.ts`.
- `src/lib/server/config.ts`.
- `src/lib/server/db.ts`.

Changes:
- Confirm Fly authentication and organization.
- Create or launch the Fly app.
- Create a volume for SQLite.
- Configure `DATABASE_PATH=/data/village.db` in `fly.toml`.
- Configure health check against `/api/health`.
- Deploy the image.
- Confirm the app has exactly one active machine for V1.

Commands:
```bash
fly auth whoami
fly orgs list
fly launch --name village-mist-rieux --org personal --region cdg --no-deploy
fly volumes create village_data --region cdg --size 1 --app village-mist-rieux
fly deploy --app village-mist-rieux
fly status --app village-mist-rieux
fly checks list --app village-mist-rieux
fly logs --app village-mist-rieux
```

Expected `fly.toml` properties:
```toml
app = "village-mist-rieux"
primary_region = "cdg"

[env]
  NODE_ENV = "production"
  DATABASE_PATH = "/data/village.db"

[[mounts]]
  source = "village_data"
  destination = "/data"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
```

Validation:
```bash
curl -fsS https://village-mist-rieux.fly.dev/api/health
fly ssh console --app village-mist-rieux -C "ls -la /data"
fly ssh console --app village-mist-rieux -C "test -f /data/village.db && echo db-ok"
```

Notes:
- If `village-mist-rieux` is unavailable globally on Fly, choose the closest available slug and update `fly.toml`, final docs and browser verification URL.
- If Fly reports an organization/billing issue, stop and report the exact blocker instead of silently pivoting hosting providers.
- Do not scale horizontally while SQLite is the authoritative store.

### Task 17: Browser verification after deployment

Purpose:
- Prove the deployed app works from the user's perspective, not only by build logs.

Tools:
- Use the in-app browser or Playwright/browser automation.
- Capture screenshots when useful.

Flow to verify:
- Open `https://<fly-app>.fly.dev`.
- Confirm home page renders without console/runtime errors.
- Open `/tutorial`.
- Open one role card detail and one secret card detail.
- Open `/master/setup`.
- Create a 6-player game with deterministic names.
- Confirm join code is displayed.
- Open `/join` in a fresh browser context.
- Join as one player and confirm only that player's role/fragment appears.
- Close/reopen or reload the player page and confirm resume works.
- Open `/table` and confirm only public state is visible.
- Open `/master`, confirm truth table is visible only in master mode.
- Submit a known false accusation and verify soupcon increment.
- Submit or simulate a known correct accusation and verify revelation.
- Reload `/master`, `/player` and `/table` after mutations and confirm server state persists.
- Restart or redeploy only if needed, then confirm `/data/village.db` still exists.

Validation commands:
```bash
npm run build
curl -fsS https://<fly-app>.fly.dev/api/health
```

Completion evidence:
- Final Fly URL.
- GitHub commit hash pushed to `main`.
- Health check response.
- Browser verification summary with the exact flows tested.
- Any screenshots or paths if captured.

## 8. Risks And Edge Cases

Gameplay risks:
- Too many powers may slow the first game.
- Some roles may reveal too much information.
- Accusation form may feel too mechanical if not wrapped in narration.
- Solitaire may be too hard or too easy depending on group dynamics.
- Players might accidentally see the mode maitre.

Mitigations:
- Keep roles one-use by default.
- Start with 12 roles but allow simple future presets: `debutant`, `normal`, `chaos`.
- Require confirmation before revealing private cards.
- Add code/friction before mode maitre.
- Make revealed players continue as enqueteurs to avoid family-game frustration.

Technical risks:
- SQLite fichier local ne convient pas a un deploiement serverless ephemere.
- SQLite sur Fly perd ses donnees si le fichier n'est pas dans le volume `/data`.
- Deux machines Fly actives peuvent diverger avec SQLite mono-fichier.
- Le nom d'app Fly `village-mist-rieux` peut etre deja pris globalement.
- Un deploy Fly peut echouer si l'organisation choisie ou la facturation n'est pas prete.
- Le repo GitHub vide peut avoir une branche par defaut non initialisee avant le premier push.
- LocalStorage token perdu si le joueur change d'appareil.
- Token joueur vole sur le meme appareil donnerait acces a sa vue.
- Hidden-information leak par snapshot trop large.
- Hydration issues si localStorage est lu pendant server render.
- Generated assets may be inconsistent or contain text.
- Long lists of generated assets can make the first implementation slow.
- App may become too stateful inside React components.

Mitigations:
- Document deployment V1: Node process avec disque persistant.
- Monter et verifier explicitement `/data`.
- Garder `min_machines_running = 1` et ne pas activer de scaling horizontal en V1.
- Verifier `fly auth whoami`, `fly orgs list`, `fly status`, `fly checks list` et `/api/health`.
- Verifier le repo GitHub avec `gh repo view` avant push et `git log` apres push.
- Reassign player access from master.
- Store only token hashes server-side.
- Test snapshots explicitly for hidden fields.
- Keep storage/token read in client components or route handlers only.
- Pure engine functions outside React.
- Asset validation step before integration is considered complete.
- Keep ImageGen outputs as illustrations only; all copy in code.

Edge cases:
- Duplicate player names.
- Player count outside 6-12.
- Odd player count with solo secret.
- All but one team revealed.
- Accusation against already revealed players.
- Garde champetre blocking a correct accusation.
- Refresh during private player view.
- Player token invalidated during session.
- Master token lost.
- Replacing active game while players are connected.
- Missing image file.
- Invalid or absent active game.
- Server restart during game.
- Fly deploy with unavailable app name.
- Volume created in a different region than the app.
- Browser verification finds a runtime-only bug not caught by build.

## 9. Validation Strategy

Automated:
```bash
npm run lint
npm run type-check
npm run test
npm run build
curl -fsS https://<fly-app>.fly.dev/api/health
```

Optional UI automation:
```bash
npm run test:e2e
```

Manual:
- Create games with 6, 7, 10 and 12 players.
- Verify deterministic seed replay.
- Verify player join by code.
- Verify player resume after closing/reopening tab.
- Verify player token cannot access another player's private data.
- Verify master mode truth table.
- Verify correct/false/blocked accusations.
- Verify reassign player access.
- Verify tutorial gallery and detail pages.
- Verify ImageGen assets render in the app.
- Verify GitHub `main` contains the implementation commit.
- Verify Fly.io app status, checks and logs.
- Open the deployed Fly URL in a browser and exercise home, tutorial, join, player resume, table and master flows.

Regression scope:
- Distribution correctness.
- Hidden-information boundaries.
- Server persistence.
- Player session resume.
- Accusation verdicts.
- Role power side effects.
- Mobile card readability.
- Fly deployment persistence.
- GitHub publication.
- Browser runtime behavior.

Acceptance criteria:
- The app hosts exactly one active game at a time.
- A narrator can create/reset the active game.
- Players can join the active game with a code.
- A player can close the app and resume their personal view from the same browser.
- Every player receives a role and secret fragment privately.
- The narrateur/mode maitre can see truth and manage accusations.
- The app resolves accusation outcomes deterministically.
- Revealed players remain visible and playable as enqueteurs.
- The tutorial shows every card with image and definition.
- The final app uses generated card assets stored in `/public/assets`.
- The code is committed and pushed to `NicolasStuff/village-mist-rieux` on GitHub.
- The app is deployed on Fly.io with persistent SQLite storage mounted at `/data`.
- `/api/health` succeeds on the deployed Fly URL.
- Browser verification confirms the deployed app works for tutorial, master setup, player join/resume, table view and accusation resolution.

## 10. Review Loop

- Iteration 1: Draft initial grounded on empty repo, user gameplay constraints, Next.js App Router, deterministic narrator model and ImageGen requirement.
- Iteration 2: Revised architecture after user clarified that the app must host a unique active game and let players reconnect/resume. Replaced local-only game storage with server-authoritative SQLite, player/master tokens, join flow, snapshots and hidden-information tests.
- Iteration 3: Added verified GitHub target, Fly.io deployment architecture, persistent volume requirements, deployment commands and mandatory browser verification after deployment.
- Final pass: no remaining actionable findings after checking gameplay loop, unique-game hosting, resume flow, hidden-information boundaries, ImageGen requirements, GitHub push, Fly persistence, deployment sequence and browser validation coverage.
