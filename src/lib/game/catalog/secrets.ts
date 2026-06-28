import type { SecretCase } from "@/lib/game/types";

const image = (slug: string) => `/assets/cards/secrets/${slug}.webp`;

export const duoSecrets: SecretCase[] = [
  {
    id: "lettre-de-la-cave",
    title: "La Lettre de la Cave",
    difficulty: "facile",
    elements: {
      lieu: "la cave de la mairie",
      objet: "une cle rouillee",
      action: "cacher une lettre",
      mobile: "eviter un scandale pendant la fete du village",
    },
    fragments: [
      "Tu sais qu'une cle rouillee a ete retrouvee pres du vieux puits, et qu'elle ouvre une porte rarement utilisee.",
      "Tu sais qu'une lettre compromettante a ete cachee pour eviter un scandale pendant la fete du village.",
    ],
    fullReveal:
      "Le duo a utilise la cle rouillee pour ouvrir la cave de la mairie et cacher une lettre compromettante.",
    soloText:
      "Tu as cache seul une lettre compromettante dans la cave de la mairie avec une cle rouillee.",
    image: image("lettre-de-la-cave"),
    tutorial: "Une affaire claire: lieu, objet et action sont faciles a croiser.",
  },
  {
    id: "cle-du-vieux-puits",
    title: "La Cle du Vieux Puits",
    difficulty: "facile",
    elements: {
      lieu: "le vieux puits",
      objet: "un anneau de cles",
      action: "echanger une cle",
      mobile: "ouvrir une reserve interdite",
    },
    fragments: [
      "Tu sais qu'un anneau de cles a change de main pres du vieux puits.",
      "Tu sais qu'une reserve interdite a ete ouverte sans l'accord du village.",
    ],
    fullReveal:
      "Le duo a echange un anneau de cles pres du vieux puits pour ouvrir une reserve interdite.",
    soloText:
      "Tu as echange un anneau de cles pres du vieux puits pour ouvrir une reserve interdite.",
    image: image("cle-du-vieux-puits"),
    tutorial: "Une affaire d'objet. Les questions sur les cles sont dangereuses.",
  },
  {
    id: "ombre-du-moulin",
    title: "L'Ombre du Moulin",
    difficulty: "moyen",
    elements: {
      lieu: "le moulin abandonne",
      objet: "une lanterne eteinte",
      action: "guetter un rendez-vous",
      mobile: "proteger une promesse ancienne",
    },
    fragments: [
      "Tu sais qu'une lanterne eteinte a ete trouvee au moulin abandonne apres minuit.",
      "Tu sais qu'un rendez-vous a ete surveille pour proteger une vieille promesse.",
    ],
    fullReveal:
      "Le duo a guette un rendez-vous au moulin abandonne avec une lanterne eteinte pour proteger une promesse ancienne.",
    image: image("ombre-du-moulin"),
    tutorial: "Cette affaire sonne innocente, mais le mobile peut trahir le duo.",
  },
  {
    id: "tableau-de-la-chapelle",
    title: "Le Tableau de la Chapelle",
    difficulty: "moyen",
    elements: {
      lieu: "la petite chapelle",
      objet: "un portrait retourne",
      action: "deplacer un tableau",
      mobile: "cacher une inscription au dos",
    },
    fragments: [
      "Tu sais qu'un portrait retourne a disparu quelques minutes de la petite chapelle.",
      "Tu sais qu'une inscription au dos d'un tableau devait rester invisible.",
    ],
    fullReveal:
      "Le duo a deplace le portrait de la chapelle pour cacher une inscription au dos.",
    image: image("tableau-de-la-chapelle"),
    tutorial: "Un bon secret pour tester les questions sur objets et lieux sacres.",
  },
  {
    id: "cloche-felee",
    title: "La Cloche Felee",
    difficulty: "moyen",
    elements: {
      lieu: "le clocher",
      objet: "un marteau de cuivre",
      action: "faire sonner la cloche",
      mobile: "couvrir un bruit dans la ruelle",
    },
    fragments: [
      "Tu sais qu'un marteau de cuivre a ete vu dans le clocher.",
      "Tu sais que la cloche a sonne pour couvrir un bruit dans la ruelle.",
    ],
    fullReveal:
      "Le duo a fait sonner la cloche avec un marteau de cuivre pour couvrir un bruit dans la ruelle.",
    image: image("cloche-felee"),
    tutorial: "Le bruit est la cle: les joueurs parlent rarement des sons.",
  },
  {
    id: "registre-du-notaire",
    title: "Le Registre du Notaire",
    difficulty: "retors",
    elements: {
      lieu: "l'etude du notaire",
      objet: "un registre aux pages collees",
      action: "arracher une page",
      mobile: "effacer une dette familiale",
    },
    fragments: [
      "Tu sais qu'un registre aux pages collees a ete ouvert dans l'etude du notaire.",
      "Tu sais qu'une page a ete arrachee pour effacer une dette familiale.",
    ],
    fullReveal:
      "Le duo a arrache une page du registre du notaire pour effacer une dette familiale.",
    image: image("registre-du-notaire"),
    tutorial: "Une affaire sociale: le mobile compte autant que l'objet.",
  },
  {
    id: "lanterne-du-pont",
    title: "La Lanterne du Pont",
    difficulty: "facile",
    elements: {
      lieu: "le pont de pierre",
      objet: "une lanterne rouge",
      action: "envoyer un signal",
      mobile: "prevenir un visiteur secret",
    },
    fragments: [
      "Tu sais qu'une lanterne rouge a ete accrochee au pont de pierre.",
      "Tu sais qu'un signal devait prevenir un visiteur arrive trop tot.",
    ],
    fullReveal:
      "Le duo a accroche une lanterne rouge au pont de pierre pour prevenir un visiteur secret.",
    soloText:
      "Tu as accroche une lanterne rouge au pont de pierre pour prevenir un visiteur secret.",
    image: image("lanterne-du-pont"),
    tutorial: "Simple a comprendre, difficile a cacher si le pont revient souvent.",
  },
  {
    id: "coffret-du-marche",
    title: "Le Coffret du Marche",
    difficulty: "moyen",
    elements: {
      lieu: "la halle du marche",
      objet: "un coffret scelle",
      action: "echanger un paquet",
      mobile: "eviter que le maire le trouve",
    },
    fragments: [
      "Tu sais qu'un coffret scelle a circule sous la halle du marche.",
      "Tu sais qu'un paquet a ete echange pour eviter que le maire le trouve.",
    ],
    fullReveal:
      "Le duo a echange un coffret scelle sous la halle du marche pour le cacher au maire.",
    image: image("coffret-du-marche"),
    tutorial: "Les echanges sont des pieges: demande qui a vu qui porter quoi.",
  },
  {
    id: "recette-de-la-boulangerie",
    title: "La Recette de la Boulangerie",
    difficulty: "retors",
    elements: {
      lieu: "la boulangerie",
      objet: "un carnet tache de farine",
      action: "copier une recette",
      mobile: "sauver le concours du lendemain",
    },
    fragments: [
      "Tu sais qu'un carnet tache de farine est sorti de la boulangerie.",
      "Tu sais qu'une recette a ete copiee pour sauver le concours du lendemain.",
    ],
    fullReveal:
      "Le duo a copie une recette dans le carnet farineux de la boulangerie pour sauver le concours.",
    image: image("recette-de-la-boulangerie"),
    tutorial: "Un secret presque gentil, excellent pour pousser au mensonge nuance.",
  },
  {
    id: "portrait-du-manoir",
    title: "Le Portrait du Manoir",
    difficulty: "retors",
    elements: {
      lieu: "le vieux manoir",
      objet: "un cadre poussiereux",
      action: "retirer une photo",
      mobile: "cacher un lien de famille",
    },
    fragments: [
      "Tu sais qu'un cadre poussiereux a ete ouvert dans le vieux manoir.",
      "Tu sais qu'une photo a ete retiree pour cacher un lien de famille.",
    ],
    fullReveal:
      "Le duo a retire une photo d'un cadre du vieux manoir pour cacher un lien de famille.",
    image: image("portrait-du-manoir"),
    tutorial: "Ici, les questions sur les familles peuvent tout declencher.",
  },
  {
    id: "barque-disparue",
    title: "La Barque Disparue",
    difficulty: "moyen",
    elements: {
      lieu: "l'etang communal",
      objet: "une corde mouillee",
      action: "deplacer une barque",
      mobile: "atteindre l'ile sans etre vu",
    },
    fragments: [
      "Tu sais qu'une corde mouillee a ete retrouvee pres de l'etang communal.",
      "Tu sais qu'une barque a ete deplacee pour rejoindre l'ile sans etre vu.",
    ],
    fullReveal:
      "Le duo a deplace une barque avec une corde mouillee pour atteindre l'ile sans etre vu.",
    image: image("barque-disparue"),
    tutorial: "Une affaire de deplacement: elle pousse les joueurs a reconstruire un trajet.",
  },
  {
    id: "masque-du-bal",
    title: "Le Masque du Bal",
    difficulty: "facile",
    elements: {
      lieu: "la salle des fetes",
      objet: "un masque dore",
      action: "prendre l'identite d'un invite",
      mobile: "entendre une conversation privee",
    },
    fragments: [
      "Tu sais qu'un masque dore a disparu pendant le bal de la salle des fetes.",
      "Tu sais que quelqu'un a pris l'identite d'un invite pour ecouter une conversation.",
    ],
    fullReveal:
      "Le duo a utilise un masque dore pendant le bal pour prendre l'identite d'un invite et entendre une conversation privee.",
    image: image("masque-du-bal"),
    tutorial: "Tres lisible: parfait pour une premiere partie.",
  },
];

export const soloSecrets: SecretCase[] = [
    {
      id: "solitaire-dernier-temoin",
      title: "Le Dernier Temoin",
      difficulty: "retors",
      elements: {
        lieu: "la gare fermee",
        objet: "un billet dechire",
        action: "retenir un temoignage",
        mobile: "proteger un inconnu",
      },
      fragments: [
        "Tu sais tout: un billet dechire a ete trouve a la gare fermee.",
        "Tu as retenu un temoignage pour proteger un inconnu.",
      ],
      soloText:
        "Tu es le dernier temoin: tu as garde un billet dechire de la gare fermee pour proteger un inconnu.",
      fullReveal:
        "Le solitaire a retenu un temoignage lie a un billet dechire trouve a la gare fermee.",
      image: image("solitaire-dernier-temoin"),
      tutorial: "Un secret solo: une seule cible, mais une histoire complete.",
    },
    {
      id: "solitaire-promesse-du-maire",
      title: "La Promesse du Maire",
      difficulty: "moyen",
      elements: {
        lieu: "le bureau du maire",
        objet: "un ruban bleu",
        action: "signer une promesse",
        mobile: "sauver une reputation",
      },
      fragments: [
        "Tu sais tout: un ruban bleu a ete cache dans le bureau du maire.",
        "Tu as signe une promesse pour sauver une reputation.",
      ],
      soloText:
        "Tu as signe une promesse dans le bureau du maire avec un ruban bleu pour sauver une reputation.",
      fullReveal:
        "Le solitaire a signe une promesse cachee dans le bureau du maire pour sauver une reputation.",
      image: image("solitaire-promesse-du-maire"),
      tutorial: "Un solo plus politique: attention aux questions sur le maire.",
    },
    {
      id: "solitaire-inconnu-de-la-gare",
      title: "L'Inconnu de la Gare",
      difficulty: "facile",
      elements: {
        lieu: "l'ancienne gare",
        objet: "une valise verte",
        action: "faire entrer un inconnu",
        mobile: "rendre un service secret",
      },
      fragments: [
        "Tu sais tout: une valise verte a attendu a l'ancienne gare.",
        "Tu as fait entrer un inconnu pour rendre un service secret.",
      ],
      soloText:
        "Tu as fait entrer un inconnu par l'ancienne gare avec une valise verte pour rendre un service secret.",
      fullReveal:
        "Le solitaire a fait entrer un inconnu par l'ancienne gare avec une valise verte.",
      image: image("solitaire-inconnu-de-la-gare"),
      tutorial: "Un solo direct, facile a jouer avec des debutants.",
    },
];

export const allSecrets = [...duoSecrets, ...soloSecrets];

export function getSecret(secretId: string): SecretCase {
  const secret = allSecrets.find((item) => item.id === secretId);

  if (!secret) {
    throw new Error(`Unknown secret: ${secretId}`);
  }

  return secret;
}
