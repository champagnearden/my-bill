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
    this.billData = this.billingState.billingData(); // Retrieve the signal value
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

  go_back() {
    this.router.navigate(['/billing-form'], { state: { data: this.billData } });
  }
}
