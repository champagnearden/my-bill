import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BillDataModel } from '../../../assets/models/bill.model';
import { BillingStateService } from '../../services/billing-state/billing-state.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-bill-result',
  templateUrl: './billing-result.component.html',
  styleUrls: ['./billing-result.component.css'],
  standalone: false
})
export class BillingResultComponent  implements OnInit{
  @ViewChild('content', { static: false }) content!: ElementRef;
  billData: BillDataModel;

  constructor(
    private readonly router: Router,
    private readonly billingState: BillingStateService
  ) {
    //this.billData = this.billingState.billingData(); // Retrieve the signal value
    this.billData = {
      "clientName": "Test",
      "clientEmail": "jbbeck42@gmail.com",
      "clientAddress": "7 impasse de l'hotel neuf 35850 Irodouer",
      "webCreationType": "Site dynamique avec API REST",
      "numberOfPages": 2,
      "selectedOptions": [
          true,
          true
      ],
      "maintenancePlan": "Pro",
      "totalPrice": 3550,
      "monthlyPayment": 250,
      "pricingData": {
          "webCreation": [
              {
                  "type": "Site vitrine statique (responsive)",
                  "basePrice": "1500 €",
                  "pages": "200 € / page",
                  "options": [
                      {
                          "name": "Formulaire de contact avec AWS Lambda et SES",
                          "price": "250 €"
                      }
                  ]
              },
              {
                  "type": "Site dynamique avec API REST",
                  "basePrice": "2500 €",
                  "pages": "300 € / page",
                  "options": [
                      {
                          "name": "Authentification utilisateur via AWS Cognito",
                          "price": "500 €"
                      },
                      {
                          "name": "Intégration d'API tierces",
                          "price": "sur devis"
                      }
                  ]
              }
          ],
          "maintenance": [
              {
                  "name": "Basic",
                  "price": "100 € / mois",
                  "features": [
                      "Surveillance de l'hébergement (CloudFormation stack, S3).",
                      "Support technique pour correction de bugs simples.",
                      "Mise à jour de contenu (2 modifications mineures par mois)."
                  ]
              },
              {
                  "name": "Pro",
                  "price": "250 € / mois",
                  "features": [
                      "Optimisation de la stack CloudFormation.",
                      "Mises à jour régulières d’AngularJS et des dépendances.",
                      "Modifications du contenu (5 modifications par mois).",
                      "Gestion des logs et surveillance via AWS CloudWatch."
                  ]
              },
              {
                  "name": "Premium",
                  "price": "400 € / mois",
                  "features": [
                      "Toutes les prestations du forfait Pro.",
                      "Création de nouvelles pages AngularJS (jusqu'à 2/mois).",
                      "Rapport mensuel sur les performances et suggestions d’amélioration."
                  ]
              }
          ]
      },
      "creationDate": new Date("2025-01-18T14:44:25.736Z"),
      "dueDate": new Date("2025-02-18T14:44:25.736Z"),
      "invoiceNumber": "911769"
  }
  }

  ngOnInit() {
    console.log(this.billData);
  }

  getSelectedOptions(): {name:string,price:string}[] {
    return this.billData.pricingData.webCreation.filter(
        (wc: any) => wc.type === this.billData.webCreationType
      )[0].options.filter(
        (_:any, i:number) => this.billData.selectedOptions[i]
      );
  }

  generatePDF() {
    const DATA = this.content.nativeElement;
    html2canvas(DATA).then(canvas => {
      const fileWidth = 208;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('estimate-'+this.billData.invoiceNumber+'.pdf');
    });
  }

  print() {
    const originalContents = document.body.innerHTML;
    const printContents = this.content.nativeElement.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  go_back() {
    this.router.navigate(['/billing-form'], { state: { data: this.billData } });
  }
}
