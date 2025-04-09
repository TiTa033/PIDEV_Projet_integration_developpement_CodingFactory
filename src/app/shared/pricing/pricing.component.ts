import { Component, OnInit, inject } from '@angular/core';
import { CertificationService } from 'src/app/services/certification.service';
import { Certification } from 'src/app/models/certification';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { forkJoin } from 'rxjs';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs ?? pdfFonts.vfs;

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  certifications: Certification[] = [];
  newCertification: Certification = { nom: '', organisme: '', dateObtention: '' };
  
  private certificationService = inject(CertificationService);

  ngOnInit(): void {
    this.loadCertifications();
  }

  private loadCertifications(): void {
    this.certificationService.getCertifications().subscribe(certifications => {
      if (!certifications.length) return;

      const qrRequests = certifications.map(cert =>
        cert.idCertification 
          ? this.certificationService.getQrCode(cert.idCertification)
          : null
      );

      forkJoin(qrRequests).subscribe(qrCodes => {
        this.certifications = certifications.map((cert, index) => ({
          ...cert,
          qrCodeBase64: qrCodes[index] ? `data:image/png;base64,${qrCodes[index]}` : undefined
        }));
      });
    });
  }

  share(certification: Certification): void {
    const shareText = encodeURIComponent(`Découvrez ma certification : ${certification.nom} obtenue chez ${certification.organisme}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareText}`, '_blank');
  }

  download(certification: Certification): void {
    const date = new Date(certification.dateObtention);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const documentDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],

        background: function (currentPage: any, pageSize: any) {
            return {
                canvas: [
                    { type: 'rect', x: 5, y: 5, w: pageSize.width - 10, h: pageSize.height - 10, lineWidth: 5, lineColor: '#B8860B' },
                    { type: 'rect', x: 20, y: 20, w: pageSize.width - 40, h: pageSize.height - 40, lineWidth: 2, lineColor: '#FFD700' },
                    { type: 'line', x1: 50, y1: 80, x2: pageSize.width - 50, y2: 80, lineWidth: 1, lineColor: '#D4AF37' },
                    { type: 'line', x1: 50, y1: pageSize.height - 80, x2: pageSize.width - 50, y2: pageSize.height - 80, lineWidth: 1, lineColor: '#D4AF37' }
                ]
            };
        },

        content: [
            { text: 'CERTIFICAT DE RÉUSSITE', style: 'title', margin: [0, 60, 0, 20] },

            { text: 'Ce certificat est décerné à', style: 'subheader', margin: [0, 10, 0, 5] },

            { text: certification.organisme, style: 'name', margin: [0, 5, 0, 20] },

            {
                text: 'En reconnaissance de l’achèvement réussi du programme suivant :',
                style: 'content',
                margin: [0, 10, 0, 10]
            },

            { text: certification.nom, style: 'certificationTitle', margin: [0, 5, 0, 30] },

            { text: `Délivré le : ${formattedDate}`, style: 'date', margin: [0, 20, 0, 50] },

            {
                columns: [
                    {
                        stack: [
                            { text: 'Signature du Responsable', style: 'signature', alignment: 'left', margin: [50, 20, 0, 0] },
                            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 120, y2: 5, lineWidth: 1 }] },
                        ]
                    },
                    {
                        stack: [
                            { image: certification.qrCodeBase64, width: 100, alignment: 'center', margin: [0, 30, 0, 0] },
                            { text: 'Vérification en ligne', style: 'qrText', alignment: 'center', margin: [0, 5, 0, 0] }
                        ]
                    },
                    {
                        stack: [
                            { text: 'Cachet Officiel', style: 'signature', alignment: 'right', margin: [0, 20, 50, 0] },
                            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 120, y2: 5, lineWidth: 1 }] },
                        ]
                    }
                ],
                margin: [0, 30, 0, 40]
            },
            {
                text: 'Félicitations pour cette réussite exceptionnelle !',
                style: 'footer',
                margin: [0, 50, 0, 0]
            }
        ],
        styles: {
            header: { fontSize: 16, bold: true, alignment: 'center', margin: [0, 10, 0, 15] },
            title: { fontSize: 28, bold: true, color: '#D4AF37', alignment: 'center', decoration: 'underline', margin: [0, 10, 0, 20] },
            subheader: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 10, 0, 5] },
            name: { fontSize: 24, bold: true, alignment: 'center', decoration: 'underline', color: '#444' },
            certificationTitle: { fontSize: 18, bold: true, italics: true, alignment: 'center', margin: [0, 5, 0, 15] },
            content: { fontSize: 14, alignment: 'center', margin: [0, 10, 0, 10] },
            date: { fontSize: 12, italics: true, alignment: 'center', margin: [0, 10, 0, 30] },
            signature: { fontSize: 12, italics: true, bold: true, color: '#555' },
            qrText: { fontSize: 10, italics: true, color: '#888' },
            footer: { fontSize: 12, bold: true, alignment: 'center', color: '#555', margin: [0, 30, 0, 0] }
        },

        watermark: { text: 'CERTIFICAT OFFICIEL', color: 'gray', opacity: 0.1, bold: true, italics: false, angle: 30 }
    };
    pdfMake.createPdf(documentDefinition).download(`certification-${certification.nom}.pdf`);
}
}