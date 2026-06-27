# Le Village Mysterieux

Application Next.js pour animer une partie familiale de `Le Village Mysterieux`.

## Fonctionnalites

- Une partie active unique, stockee cote serveur dans SQLite.
- Mode maitre narrateur avec table de verite, phases, accusations et verdicts deterministes.
- Connexion joueur par code de partie et reprise automatique via token local.
- Cartes roles/secrets et tutoriel de cartes type collection.
- Reveal joueur avec dos de carte cliquable avant affichage du role.
- Assets de cartes generes avec ImageGen et copies dans `public/assets`.

## Developpement

```bash
npm install
npm run db:init
npm run dev
```

Pages principales:

- `/master/setup`: creer une partie.
- `/master`: mode maitre prive.
- `/join`: rejoindre une partie.
- `/player`: vue personnelle joueur.
- `/table`: plateau public.
- `/tutorial`: galerie des cartes.

## Verification

```bash
npm run lint
npm run test
npm run type-check
npm run build
npm audit --audit-level=moderate
```

## Docker

```bash
docker build -t village-mysterieux-local .
docker run --rm -p 3001:3000 -e DATABASE_PATH=/data/village.db village-mysterieux-local
HEALTH_URL=http://127.0.0.1:3001/api/health npm run health
```

## Fly.io

L'app Fly cible `village-mist-rieux` en region `cdg`.

```bash
fly volumes create village_data --app village-mist-rieux --region cdg --size 1
fly deploy --app village-mist-rieux
```

La base SQLite doit rester sur le volume monte dans `/data`, via `DATABASE_PATH=/data/village.db`.
