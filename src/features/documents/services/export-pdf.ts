import jsPDF from 'jspdf';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Generates a PDF from markdown content, uploads to Supabase Storage,
 * and returns a signed download URL.
 */
export async function exportDocumentToPdf(
  documentId: string,
  orgId: string,
  title: string,
  markdown: string,
): Promise<string> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // --- Header ---
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('CompliPilot — Document de conformite', margin, 12);
  pdf.text(new Date().toLocaleDateString('fr-FR'), pageWidth - margin, 12, { align: 'right' });
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, 15, pageWidth - margin, 15);

  y = 25;

  // --- Title ---
  pdf.setFontSize(16);
  pdf.setTextColor(15, 23, 42);
  const titleLines = pdf.splitTextToSize(title, contentWidth);
  pdf.text(titleLines, margin, y);
  y += titleLines.length * 8 + 5;

  // --- Body (simplified markdown → text rendering) ---
  pdf.setFontSize(10);
  pdf.setTextColor(30, 30, 30);

  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();

    // Check for page break
    if (y > pageHeight - 25) {
      addFooter(pdf, pageWidth, pageHeight, margin);
      pdf.addPage();
      y = margin;
    }

    if (trimmed.startsWith('# ')) {
      y += 4;
      pdf.setFontSize(14);
      pdf.setTextColor(15, 23, 42);
      const heading = trimmed.replace(/^#+ /, '');
      const wrapped = pdf.splitTextToSize(heading, contentWidth);
      pdf.text(wrapped, margin, y);
      y += wrapped.length * 7 + 3;
      pdf.setFontSize(10);
      pdf.setTextColor(30, 30, 30);
    } else if (trimmed.startsWith('## ')) {
      y += 3;
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      const heading = trimmed.replace(/^#+ /, '');
      const wrapped = pdf.splitTextToSize(heading, contentWidth);
      pdf.text(wrapped, margin, y);
      y += wrapped.length * 6 + 2;
      pdf.setFontSize(10);
      pdf.setTextColor(30, 30, 30);
    } else if (trimmed.startsWith('### ')) {
      y += 2;
      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);
      const heading = trimmed.replace(/^#+ /, '');
      const wrapped = pdf.splitTextToSize(heading, contentWidth);
      pdf.text(wrapped, margin, y);
      y += wrapped.length * 5.5 + 2;
      pdf.setFontSize(10);
      pdf.setTextColor(30, 30, 30);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bullet = trimmed.replace(/^[-*] /, '');
      const cleanBullet = bullet.replace(/\*\*/g, '');
      const wrapped = pdf.splitTextToSize(`  \u2022 ${cleanBullet}`, contentWidth - 5);
      for (const wl of wrapped) {
        if (y > pageHeight - 25) {
          addFooter(pdf, pageWidth, pageHeight, margin);
          pdf.addPage();
          y = margin;
        }
        pdf.text(wl, margin + 3, y);
        y += 5;
      }
    } else if (trimmed.startsWith('>')) {
      pdf.setTextColor(100, 100, 100);
      const quote = trimmed.replace(/^>\s*\*?\*?/, '').replace(/\*?\*?$/, '');
      const wrapped = pdf.splitTextToSize(quote, contentWidth - 10);
      pdf.setDrawColor(180, 180, 180);
      pdf.line(margin + 2, y - 3, margin + 2, y + wrapped.length * 5);
      for (const wl of wrapped) {
        pdf.text(wl, margin + 6, y);
        y += 5;
      }
      pdf.setTextColor(30, 30, 30);
      y += 2;
    } else if (trimmed === '') {
      y += 3;
    } else {
      const cleanText = trimmed.replace(/\*\*/g, '');
      const wrapped = pdf.splitTextToSize(cleanText, contentWidth);
      for (const wl of wrapped) {
        if (y > pageHeight - 25) {
          addFooter(pdf, pageWidth, pageHeight, margin);
          pdf.addPage();
          y = margin;
        }
        pdf.text(wl, margin, y);
        y += 5;
      }
    }
  }

  addFooter(pdf, pageWidth, pageHeight, margin);

  // --- Upload to Supabase Storage ---
  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
  const fileName = `documents/${orgId}/${documentId}.pdf`;

  const supabase = await createServerClient();

  await supabase.storage.from('compliance-docs').upload(fileName, pdfBuffer, {
    contentType: 'application/pdf',
    upsert: true,
  });

  // Get signed URL (valid 1 hour)
  const { data: signedUrl } = await supabase.storage
    .from('compliance-docs')
    .createSignedUrl(fileName, 3600);

  if (!signedUrl?.signedUrl) {
    throw new Error('Erreur lors de la creation du lien de telechargement');
  }

  // Update document record with PDF URL
  await supabase.from('compliance_documents').update({ pdf_url: fileName }).eq('id', documentId);

  return signedUrl.signedUrl;
}

/** Adds a footer with page number and CompliPilot branding. */
function addFooter(pdf: jsPDF, pageWidth: number, pageHeight: number, margin: number): void {
  const pageCount = pdf.getNumberOfPages();
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Genere par CompliPilot', margin, pageHeight - 8);
  pdf.text(`Page ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
}
