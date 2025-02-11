export const prices = {
  webCreation: [
    {
      type: "Site vitrine statique (responsive)",
      basePrice: "1500 €",
      pages: "200 € / page",
      options: [
        { name: "Formulaire de contact avec AWS Lambda et SES", "price": "250 €" }
      ]
    },
    {
      type: "Site dynamique avec API REST",
      basePrice: "2500 €",
      pages: "300 € / page",
      options: [
        { name: "Authentification utilisateur via AWS Cognito", "price": "500 €" },
        { name: "Intégration d'API tierces", "price": "sur devis" }
      ]
    }
  ],
  maintenance: [
    {
      name: "Basic",
      price: "100 € / mois",
      features: [
        "Surveillance de l'hébergement (CloudFormation stack, S3).",
        "Support technique pour correction de bugs simples.",
        "Mise à jour de contenu (2 modifications mineures par mois)."
      ]
    },
    {
      name: "Pro",
      price: "250 € / mois",
      features: [
        "Optimisation de la stack CloudFormation.",
        "Mises à jour régulières d'AngularJS et des dépendances.",
        "Modifications du contenu (5 modifications par mois).",
        "Gestion des logs et surveillance via AWS CloudWatch."
      ]
    },
    {
      name: "Premium",
      price: "400 € / mois",
      features: [
        "Toutes les prestations du forfait Pro.",
        "Création de nouvelles pages AngularJS (jusqu'à 2/mois).",
        "Rapport mensuel sur les performances et suggestions d'amélioration."
      ]
    }
  ]
}
  