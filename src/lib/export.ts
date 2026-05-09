import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { RegenerationOutput } from "../types";

export async function exportToPDF(output: RegenerationOutput) {
  const doc = new jsPDF();
  const teal = "#00f5ff";
  const black = "#000000";
  const zinc = "#18181b";

  // Background
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 297, "F");

  // Header
  doc.setTextColor(0, 245, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("REGEN AI", 20, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  const dateStr = new Date(output.createdAt).toLocaleString();
  doc.text(`REPORT ID: ${output.id.slice(0, 8)}`, 140, 25);
  doc.text(`GENERATED: ${dateStr}`, 140, 30);

  let yPos = 50;

  const addSection = (title: string, items: string[]) => {
    if (yPos > 240) {
      doc.addPage();
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 210, 297, "F");
      yPos = 30;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 245, 255);
    doc.text(title.toUpperCase(), 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(230, 230, 230);
    doc.setFont("helvetica", "normal");
    
    items.forEach(item => {
      const splitText = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(splitText, 20, yPos);
      yPos += splitText.length * 5 + 2;
      
      if (yPos > 270) {
        doc.addPage();
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 297, "F");
        yPos = 30;
      }
    });
    yPos += 5;
  };

  addSection("Viral Titles", output.titles);
  addSection("Captions", output.captions);
  addSection("SEO Descriptions", output.seoDescriptions);
  addSection("Trending Hashtags", [output.hashtags.join(" ")]);
  addSection("Hooks", output.hooks);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("© 2026 REGEN AI - Premium Social Content Intelligence", 20, 285);

  const cleanName = output.originalText.slice(0, 20).replace(/[^a-z0-9]/gi, '_');
  doc.save(`REGEN_${cleanName}_Report.pdf`);
}
