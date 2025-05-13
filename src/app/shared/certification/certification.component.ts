import { Component, OnInit, inject } from '@angular/core';
import { CertificationService } from 'src/app/services/certification.service';
import { Certification } from 'src/app/models/certification';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { forkJoin } from 'rxjs';
import html2canvas from 'html2canvas';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs ?? pdfFonts.vfs;
@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent  implements OnInit {
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
        this.certifications = certifications.map((cert, index) => {
          const obtentionDate = new Date(cert.dateObtention);
          const expiryDate = new Date(
            obtentionDate.getFullYear() + 2,
            obtentionDate.getMonth(),
            obtentionDate.getDate()
          );
          const today = new Date();
          const expiresIn = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

          return {
            ...cert,
            qrCodeBase64: qrCodes[index] ? `data:image/png;base64,${qrCodes[index]}` : '',
            expiresIn: expiresIn,
            status: expiresIn <= 0 ? 'expired' : expiresIn <= 30 ? 'expiring' : 'valid'
          };
        });
      });
    });
  }

  share(certification: Certification): void {
    const shareText = encodeURIComponent(`Découvrez ma certification : ${certification.nom} obtenue chez ${certification.organisme}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareText}`, '_blank');
  }

  download(certification: Certification, format: 'pdf' | 'png' | 'jpeg'): void {
    const date = new Date(certification.dateObtention);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const documentDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      background: (currentPage: number, pageSize: { width: number, height: number }) => {
        const isExpired = certification.status === 'expired';
        return {
          canvas: [
            {
              type: 'rect',
              x: 5,
              y: 5,
              w: pageSize.width - 10,
              h: pageSize.height - 10,
              lineWidth: 5,
              lineColor: isExpired ? '#CC0000' : '#B8860B'
            },
            {
              type: 'rect',
              x: 20,
              y: 20,
              w: pageSize.width - 40,
              h: pageSize.height - 40,
              lineWidth: 2,
              lineColor: isExpired ? '#CC0000' : '#FFD700'
            },
            {
              type: 'line',
              x1: 50,
              y1: 80,
              x2: pageSize.width - 50,
              y2: 80,
              lineWidth: 1,
              lineColor: isExpired ? '#990000' : '#D4AF37'
            },
            {
              type: 'line',
              x1: 50,
              y1: pageSize.height - 80,
              x2: pageSize.width - 50,
              y2: pageSize.height - 80,
              lineWidth: 1,
              lineColor: isExpired ? '#990000' : '#D4AF37'
            }
          ]
        };
      },

      content: [
        {
          text: 'CERTIFICAT DE RÉUSSITE',
          style: 'title',
          margin: [0, 60, 0, 20]
        },
        {
          text: 'Ce certificat est décerné à',
          style: 'subheader',
          margin: [0, 10, 0, 5]
        },
        {
          text: certification.organisme,
          style: 'name',
          margin: [0, 5, 0, 20]
        },
        {
          text: 'En reconnaissance de l’achèvement réussi du programme suivant :',
          style: 'content',
          margin: [0, 10, 0, 10]
        },
        {
          text: certification.nom,
          style: 'certificationTitle',
          margin: [0, 5, 0, 30]
        },
        {
          text: `Délivré le : ${formattedDate}`,
          style: 'date',
          margin: [0, 20, 0, 10]
        },
        {
          columns: [
            { stack: [
                { text: 'Signature du Responsable', style: 'signature', alignment: 'left', margin: [50, 20, 0, 0] },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 120, y2: 5, lineWidth: 1 }] },
              ] },
            { stack: [
                {
                  image: certification.qrCodeBase64 || '',
                  width: 100,
                  alignment: 'center',
                  margin: [0, 30, 0, 0]
                },
                {
                  text: 'Vérification en ligne',
                  style: 'qrText',
                  alignment: 'center',
                  margin: [0, 5, 0, 0]
                }
              ] },
            { stack: [
                { text: 'Cachet Officiel', style: 'signature', alignment: 'right', margin: [0, 20, 50, 0] },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 120, y2: 5, lineWidth: 1 }] },
              ] }
          ],
          margin: [0, 30, 0, 40]
        },
        {
          text: certification.status === 'expired'
            ? 'Cette certification a expiré. Veuillez la renouveler.'
            : 'Félicitations pour cette réussite exceptionnelle !',
          style: 'footer',
          margin: [0, 50, 0, 0]
        }
      ],

      styles: {
        header: { fontSize: 16, bold: true, alignment: 'center', margin: [0, 10, 0, 15] },
        title: {
          fontSize: 28,
          bold: true,
          color: certification.status === 'expired' ? '#FF0000' : '#D4AF37',
          alignment: 'center',
          decoration: 'underline',
          margin: [0, 10, 0, 20]
        },
        subheader: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 10, 0, 5] },
        name: { fontSize: 24, bold: true, alignment: 'center', decoration: 'underline', color: '#444' },
        certificationTitle: { fontSize: 18, bold: true, italics: true, alignment: 'center', margin: [0, 5, 0, 15] },
        content: { fontSize: 14, alignment: 'center', margin: [0, 10, 0, 10] },
        date: { fontSize: 12, italics: true, alignment: 'center', margin: [0, 10, 0, 30] },
        validStatus: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          color: '#28a745',
          margin: [0, 0, 0, 30]
        },
        expiredStatus: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          color: '#dc3545',
          margin: [0, 0, 0, 30]
        },
        signature: { fontSize: 12, italics: true, bold: true, color: '#555' },
        qrText: { fontSize: 10, italics: true, color: '#888' },
        footer: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          color: certification.status === 'expired' ? '#dc3545' : '#555',
          margin: [0, 30, 0, 0]
        }
      },

      watermark: { text: 'CERTIFICAT OFFICIEL', color: 'gray', opacity: 0.1, bold: true, italics: false, angle: 30 }
    };

    if (format === 'pdf') {
      pdfMake.createPdf(documentDefinition).download(`certification-${certification.nom}.pdf`);
    } else {
      const certificateElement = document.createElement('div');
      certificateElement.style.position = 'absolute';
      certificateElement.style.visibility = 'visible';
      certificateElement.style.width = '595px';
      certificateElement.style.height = '842px';
      certificateElement.style.zIndex = '9999';
      certificateElement.style.backgroundColor = '#F5F5F5';
      certificateElement.style.border = `5px solid ${certification.status === 'expired' ? '#dc3545' : '#B8860B'}`;

      certificateElement.innerHTML = `
        <div style="font-size: 28px; text-align: center; margin-top: 60px; color: ${certification.status === 'expired' ? '#dc3545' : '#D4AF37'};">
          CERTIFICAT DE RÉUSSITE
        </div>
        <div style="font-size: 14px; text-align: center; margin-top: 20px;">
          Ce certificat est décerné à
        </div>
        <div style="font-size: 24px; text-align: center; margin-top: 5px; color: #444; text-decoration: underline;">
          ${certification.organisme}
        </div>
        <div style="font-size: 14px; text-align: center; margin-top: 10px;">
          En reconnaissance de l’achèvement réussi du programme suivant :
        </div>
        <div style="font-size: 18px; font-style: italic; text-align: center; margin-top: 5px;">
          ${certification.nom}
        </div>
        <div style="font-size: 12px; text-align: center; margin-top: 20px;">
          Délivré le : ${formattedDate}
        </div>
        <div style="font-size: 14px; font-weight: bold; text-align: center; margin-top: 10px; color: ${certification.status === 'expired' ? '#dc3545' : '#28a745'};">
          Statut : ${this.getStatusText(certification.status || 'valid')}
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <img src="${certification.qrCodeBase64}" width="100" />
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <span style="font-size: 12px; font-style: italic; color: #555;">Signature du Responsable</span>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <span style="font-size: 12px; font-style: italic; color: #555;">Cachet Officiel</span>
        </div>
        <div style="text-align: center; margin-top: 40px; font-size: 12px; font-weight: bold; color: ${certification.status === 'expired' ? '#dc3545' : '#555'};">
          ${certification.status === 'expired' ? 'Cette certification a expiré. Veuillez la renouveler.' : 'Félicitations pour cette réussite exceptionnelle !'}
        </div>
      `;

      document.body.appendChild(certificateElement);

      const ensureAssetsLoaded = () => {
        const images = certificateElement.querySelectorAll('img');
        let loadedImagesCount = 0;

        images.forEach(img => {
          if (img.complete) {
            loadedImagesCount++;
          } else {
            img.onload = () => {
              loadedImagesCount++;
              if (loadedImagesCount === images.length) {
                generateImage();
              }
            };
          }
        });

        if (images.length === 0 || loadedImagesCount === images.length) {
          generateImage();
        }
      };

      const generateImage = () => {
        html2canvas(certificateElement).then((canvas) => {
          let imageUrl: string | null = null;

          if (format === 'png') {
            imageUrl = canvas.toDataURL('image/png');
          } else if (format === 'jpeg') {
            imageUrl = canvas.toDataURL('image/jpeg');
          }

          if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `certification-${certification.nom}.${format}`;
            link.click();
          }

          document.body.removeChild(certificateElement);
        });
      };

      ensureAssetsLoaded();
    }
  }

  getStatusClass(status: string = 'valid'): string {
    switch (status) {
      case 'expired': return 'bg-danger text-white';
      case 'expiring': return 'bg-warning text-dark';
      default: return 'bg-success text-white';
    }
  }

  getStatusText(status: string = 'valid'): string {
    switch (status) {
      case 'expired': return 'Expiré';
      case 'expiring': return 'Expire bientôt';
      default: return 'Valide';
    }
  }
}
