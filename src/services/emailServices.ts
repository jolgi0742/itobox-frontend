// src/services/emailService.ts - Servicio de Email CAMCA
interface WHREmailData {
  whrNumber: string;
  trackingNumber: string;
  consignee: {
    name: string;
    email: string;
    address: string;
  };
  shipper: {
    name: string;
    company: string;
  };
  packageDetails: {
    content: string;
    pieces: number;
    weight: number;
    declaredValue: number;
  };
}

interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

class EmailServiceCAMCA {
  private static instance: EmailServiceCAMCA;
  private apiEndpoint = process.env.REACT_APP_EMAIL_API || '/api/email/send';

  public static getInstance(): EmailServiceCAMCA {
    if (!EmailServiceCAMCA.instance) {
      EmailServiceCAMCA.instance = new EmailServiceCAMCA();
    }
    return EmailServiceCAMCA.instance;
  }

  /**
   * Genera la plantilla de email para WHR según formato CAMCA
   */
  private generateWHRTemplate(data: WHREmailData): EmailTemplate {
    const subject = `WHR ${data.whrNumber} - Paquete Recibido en Miami`;
    const currentDate = new Date().toLocaleDateString('en-US');
    const currentTime = new Date().toLocaleTimeString('en-US');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            font-size: 12px; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5;
          }
          .document-container {
            background-color: white;
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #000;
          }
          .header-section {
            display: flex;
            border-bottom: 2px solid #000;
          }
          .company-info {
            flex: 1;
            padding: 15px;
            border-right: 2px solid #000;
            text-align: center;
          }
          .whr-number {
            width: 200px;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 18px;
          }
          .sender-consignee {
            display: flex;
            border-bottom: 2px solid #000;
          }
          .sender, .consignee {
            flex: 1;
            padding: 15px;
          }
          .sender {
            border-right: 2px solid #000;
          }
          .section-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
            text-decoration: underline;
          }
          .info-box {
            border: 1px solid #000;
            padding: 10px;
            margin-bottom: 10px;
          }
          .carrier-section {
            padding: 15px;
            border-bottom: 2px solid #000;
            display: flex;
            justify-content: space-between;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .details-table th, .details-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          .details-table th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          .content-section {
            padding: 15px;
            border-bottom: 2px solid #000;
          }
          .totals-section {
            padding: 15px;
            border-bottom: 2px solid #000;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .comments-section {
            padding: 15px;
          }
          .comments-header {
            display: flex;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .comment-col {
            flex: 1;
            padding-right: 20px;
          }
          .highlight {
            background-color: #ffffcc;
            padding: 10px;
            border: 1px solid #ddd;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="highlight">
          <h2>🎯 Estimado ${data.consignee.name},</h2>
          <p><strong>Su paquete ha sido recibido en nuestras instalaciones de Miami.</strong></p>
          <p>A continuación encontrará el documento WHR (Warehouse Receipt) con todos los detalles:</p>
        </div>

        <div class="document-container">
          <!-- Header -->
          <div class="header-section">
            <div class="company-info">
              <div style="font-weight: bold; font-size: 16px;">PREMIER GLOBAL</div>
              <div style="font-weight: bold; font-size: 16px;">USA CORP</div>
              <div>8548 NW 72ND ST.</div>
              <div>Tel: 786-800-9991</div>
              <div>${currentDate}</div>
              <div>${currentTime}</div>
            </div>
            <div class="whr-number">
              ${data.whrNumber}
            </div>
          </div>

          <!-- Sender and Consignee -->
          <div class="sender-consignee">
            <div class="sender">
              <div class="section-title">Sender</div>
              <div class="info-box">
                <div style="font-weight: bold;">${data.shipper.name}</div>
                <div>${data.shipper.company}</div>
              </div>
            </div>
            <div class="consignee">
              <div class="section-title">Consignee</div>
              <div class="info-box">
                <div style="font-weight: bold;">${data.consignee.name}</div>
                <div>${data.consignee.address}</div>
              </div>
            </div>
          </div>

          <!-- Carrier Info -->
          <div class="carrier-section">
            <div>
              <strong>Tracking:</strong> ${data.trackingNumber}
            </div>
            <div>
              <strong>Received by:</strong> CRI/SJO EXPRESS
            </div>
          </div>

          <!-- Package Details Table -->
          <div style="padding: 15px; border-bottom: 2px solid #000;">
            <table class="details-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Content</th>
                  <th>Pieces</th>
                  <th>Weight</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>${data.packageDetails.content}</td>
                  <td>${data.packageDetails.pieces}</td>
                  <td>${data.packageDetails.weight} LB</td>
                  <td>${data.whrNumber}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Content Description -->
          <div class="content-section">
            <div style="font-weight: bold; margin-bottom: 10px;">Content:</div>
            <div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd;">
              ${data.packageDetails.content}
            </div>
          </div>

          <!-- Totals -->
          <div class="totals-section">
            <div class="totals-row">
              <span>Total Pieces</span>
              <span style="font-weight: bold;">${data.packageDetails.pieces}</span>
            </div>
            <div class="totals-row">
              <span>Total Weight</span>
              <span style="font-weight: bold;">${data.packageDetails.weight} LB</span>
            </div>
            <div class="totals-row">
              <span>Declared value</span>
              <span style="font-weight: bold;">${data.packageDetails.declaredValue.toFixed(2)}</span>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="comments-section">
            <div class="comments-header">
              <div class="comment-col">Fecha</div>
              <div class="comment-col">Said to contain</div>
              <div class="comment-col">Comments</div>
            </div>
            <div style="height: 40px; border-top: 1px solid #ccc;"></div>
          </div>
        </div>

        <div class="highlight">
          <h3>📋 Próximos Pasos:</h3>
          <ol>
            <li>Su paquete será procesado y clasificado</li>
            <li>Recibirá notificación cuando sea enviado hacia Costa Rica</li>
            <li>Puede rastrear su paquete usando el WHR: <strong>${data.whrNumber}</strong></li>
          </ol>
          
          <h3>📞 Contacto:</h3>
          <p>Para cualquier consulta, contáctenos:</p>
          <ul>
            <li>📧 Email: info@premierglobalusa.com</li>
            <li>📱 Teléfono: 786-800-9991</li>
            <li>🌐 Web: www.premierglobalusa.com</li>
          </ul>
        </div>
      </body>
      </html>
    `;

    const textContent = `
WHR ${data.whrNumber} - Paquete Recibido en Miami

Estimado ${data.consignee.name},

Su paquete ha sido recibido en nuestras instalaciones de Miami.

DETALLES DEL PAQUETE:
- WHR Number: ${data.whrNumber}
- Tracking: ${data.trackingNumber}
- Contenido: ${data.packageDetails.content}
- Piezas: ${data.packageDetails.pieces}
- Peso: ${data.packageDetails.weight} LB
- Valor Declarado: ${data.packageDetails.declaredValue.toFixed(2)}

PRÓXIMOS PASOS:
1. Su paquete será procesado y clasificado
2. Recibirá notificación cuando sea enviado hacia Costa Rica
3. Puede rastrear su paquete usando el WHR: ${data.whrNumber}

CONTACTO:
- Email: info@premierglobalusa.com
- Teléfono: 786-800-9991
- Web: www.premierglobalusa.com

Gracias por confiar en Premier Global USA Corp.
    `;

    return {
      subject,
      htmlContent,
      textContent
    };
  }

  /**
   * Envía email WHR al consignee y personas relacionadas
   */
  public async sendWHREmail(whrData: WHREmailData, recipients?: string[]): Promise<boolean> {
    try {
      const template = this.generateWHRTemplate(whrData);
      
      // Lista de destinatarios (consignee + personas relacionadas)
      const emailRecipients = [
        whrData.consignee.email,
        ...(recipients || [])
      ].filter(email => email && email.includes('@')); // Filtrar emails válidos

      if (emailRecipients.length === 0) {
        throw new Error('No hay destinatarios válidos para el email');
      }

      const emailPayload = {
        to: emailRecipients,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent,
        from: {
          name: 'Premier Global USA Corp',
          email: 'noreply@premierglobalusa.com'
        },
        attachments: [
          {
            filename: `WHR_${whrData.whrNumber}.html`,
            content: template.htmlContent,
            contentType: 'text/html'
          }
        ]
      };

      // En desarrollo, solo logeamos el email
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 EMAIL WHR GENERADO (MODO DESARROLLO):');
        console.log('To:', emailRecipients);
        console.log('Subject:', template.subject);
        console.log('HTML Preview:', template.htmlContent.substring(0, 500) + '...');
        
        // Simular envío exitoso
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      }

      // En producción, enviar email real
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload)
      });

      if (!response.ok) {
        throw new Error(`Error sending email: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Email WHR enviado exitosamente:', result);
      
      return true;

    } catch (error) {
      console.error('❌ Error enviando email WHR:', error);
      return false;
    }
  }

  /**
   * Genera preview del email para testing
   */
  public generateEmailPreview(whrData: WHREmailData): string {
    const template = this.generateWHRTemplate(whrData);
    return template.htmlContent;
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtiene lista de personas relacionadas con el consignee
   * (Esto vendría de la base de datos en implementación real)
   */
  public getRelatedEmails(consigneeEmail: string): string[] {
    // Mock data - en implementación real esto vendría de BD
    const relatedEmails: { [key: string]: string[] } = {
      'jorge@email.com': ['admin@empresa.com', 'notificaciones@empresa.com'],
      'maria@email.com': ['supervisor@empresa.com'],
      // Agregar más relaciones según necesidad
    };

    return relatedEmails[consigneeEmail] || [];
  }
}

// Export singleton instance
export const emailService = EmailServiceCAMCA.getInstance();

// Export types
export type { WHREmailData, EmailTemplate };