'use client';

import { jsPDF } from 'jspdf';
import { ResumeFormData } from './resume-form-builder';

export const generateResumePDF = async (
  data: ResumeFormData | string,
  fileName: string = 'resume.pdf'
) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let yPosition = 20;
    const pageHeight = 297;
    const pageMargin = 18;
    const maxWidth = 174;
    const lineHeight = 4.5;
    const contentStartX = pageMargin;
    const contentEndX = pageMargin + maxWidth;
    const centerX = 105;

    // If data is string, use simple text rendering
    if (typeof data === 'string') {
      pdf.setFontSize(10);
      pdf.setFont('Helvetica', 'normal');
      const lines = data.split('\n');
      for (const line of lines) {
        if (yPosition + lineHeight > pageHeight - pageMargin) {
          pdf.addPage();
          yPosition = pageMargin;
        }
        const splitText = pdf.splitTextToSize(line || ' ', maxWidth);
        pdf.text(splitText, pageMargin, yPosition);
        yPosition += (Array.isArray(splitText) ? splitText.length : 1) * lineHeight;
      }
      pdf.save(fileName);
      return true;
    }

    const addText = (text: string, fontSize: number = 11, isBold: boolean = false, isItalic: boolean = false) => {
      if (yPosition + lineHeight > pageHeight - pageMargin) {
        pdf.addPage();
        yPosition = pageMargin;
      }
      pdf.setFontSize(fontSize);
      const fontStyle = isBold ? 'bold' : isItalic ? 'italic' : 'normal';
      pdf.setFont('Helvetica', fontStyle);
      const splitText = pdf.splitTextToSize(text, maxWidth);
      pdf.text(splitText, contentStartX, yPosition);
      yPosition += (Array.isArray(splitText) ? splitText.length : 1) * lineHeight;
    };

    const addLeftRightLine = (
      left: string,
      right: string,
      options: { leftBold?: boolean; leftItalic?: boolean; fontSize?: number } = {}
    ) => {
      if (yPosition + lineHeight > pageHeight - pageMargin) {
        pdf.addPage();
        yPosition = pageMargin;
      }

      const fontSize = options.fontSize ?? 10;
      pdf.setFontSize(fontSize);
      pdf.setFont('Helvetica', options.leftBold ? 'bold' : options.leftItalic ? 'italic' : 'normal');

      const rightText = right.trim();
      const leftMaxWidth = rightText ? maxWidth - 48 : maxWidth;
      const leftLines = pdf.splitTextToSize(left || ' ', leftMaxWidth);
      const leftLineCount = Array.isArray(leftLines) ? leftLines.length : 1;

      if (rightText) {
        pdf.text(rightText, contentEndX, yPosition, { align: 'right' });
      }

      pdf.text(leftLines, contentStartX, yPosition);
      yPosition += leftLineCount * lineHeight;
    };

    const addHeader = (title: string) => {
      if (yPosition > pageMargin + 5) yPosition += 2.5;
      pdf.setFontSize(10);
      pdf.setFont('Helvetica', 'bold');
      pdf.text(title.toUpperCase(), contentStartX, yPosition);
      yPosition += 3.4;
      pdf.setDrawColor(40);
      pdf.setLineWidth(0.2);
      pdf.line(contentStartX, yPosition, contentEndX, yPosition);
      yPosition += 3.4;
    };

    // Header with contact info
    pdf.setFontSize(18);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(data.personalInfo.fullName || 'Your Name', centerX, yPosition, { align: 'center' });
    yPosition += 7;

    // Contact info
    const contactInfo = [];
    if (data.personalInfo.phone) contactInfo.push(data.personalInfo.phone);
    if (data.personalInfo.email) contactInfo.push(data.personalInfo.email);
    if (data.personalInfo.location) contactInfo.push(data.personalInfo.location);
    if (data.personalInfo.linkedin) contactInfo.push(data.personalInfo.linkedin);

    if (contactInfo.length > 0) {
      pdf.setFontSize(9.5);
      pdf.setFont('Helvetica', 'normal');
      const contactLine = contactInfo.join(' • ');
      const contactSplit = pdf.splitTextToSize(contactLine, maxWidth);
      pdf.text(contactSplit, centerX, yPosition, { align: 'center' });
      yPosition += (Array.isArray(contactSplit) ? contactSplit.length : 1) * lineHeight;
      yPosition += 3;
    }

    // Summary
    if (data.personalInfo.summary) {
      addText(data.personalInfo.summary, 9.5);
      yPosition += 2.5;
    }

    // Education
    if (data.education.length > 0) {
      addHeader('EDUCATION');
      data.education.forEach(edu => {
        addLeftRightLine(edu.school, edu.graduationDate, { leftBold: true, fontSize: 10 });

        const degreeLine = edu.degree && edu.field
          ? `${edu.degree} in ${edu.field}`
          : (edu.degree || edu.field || '').trim();
        if (degreeLine) {
          addText(degreeLine, 9.5, false, true);
        }

        if (edu.gpa) addText(`GPA: ${edu.gpa}`, 9.5);
        if (edu.relevantCoursework) {
          addText(`Relevant Coursework: ${edu.relevantCoursework}`, 9.5);
        }
        yPosition += 1.8;
      });
    }

    // Experience
    if (data.experience.length > 0) {
      addHeader('EXPERIENCE');
      data.experience.forEach(exp => {
        const dateInfo = [];
        if (exp.startDate) dateInfo.push(exp.startDate);
        if (exp.currentlyWorking) {
          dateInfo.push('Present');
        } else if (exp.endDate) {
          dateInfo.push(exp.endDate);
        }
        addLeftRightLine(exp.company || ' ', exp.location || '', { leftItalic: true, fontSize: 9.5 });
        addLeftRightLine(exp.jobTitle || ' ', dateInfo.join(' - '), { leftBold: true, fontSize: 10 });

        exp.achievements.forEach(ach => {
          if (yPosition + lineHeight > pageHeight - pageMargin) {
            pdf.addPage();
            yPosition = pageMargin;
          }
          pdf.setFontSize(9.5);
          pdf.setFont('Helvetica', 'normal');
          const splitText = pdf.splitTextToSize(`• ${ach}`, maxWidth - 6);
          pdf.text(splitText, contentStartX + 3, yPosition);
          yPosition += (Array.isArray(splitText) ? splitText.length : 1) * lineHeight;
        });
        yPosition += 1.8;
      });
    }

    // Leadership & Community
    if (data.leadershipCommunity.length > 0) {
      addHeader('LEADERSHIP & COMMUNITY INVOLVEMENT');
      data.leadershipCommunity.forEach(lead => {
        const dateInfo = [];
        if (lead.startDate) dateInfo.push(lead.startDate);
        if (lead.currentlyHolding) {
          dateInfo.push('Present');
        } else if (lead.endDate) {
          dateInfo.push(lead.endDate);
        }
        addLeftRightLine(lead.organization || ' ', lead.location || '', { leftItalic: true, fontSize: 9.5 });
        addLeftRightLine(lead.position || ' ', dateInfo.join(' - '), { leftBold: true, fontSize: 10 });

        lead.achievements.forEach(ach => {
          if (yPosition + lineHeight > pageHeight - pageMargin) {
            pdf.addPage();
            yPosition = pageMargin;
          }
          pdf.setFontSize(9.5);
          pdf.setFont('Helvetica', 'normal');
          const splitText = pdf.splitTextToSize(`• ${ach}`, maxWidth - 6);
          pdf.text(splitText, contentStartX + 3, yPosition);
          yPosition += (Array.isArray(splitText) ? splitText.length : 1) * lineHeight;
        });
        yPosition += 1.8;
      });
    }

    // Skills
    if (data.skills.softSkills.length > 0 || data.skills.languages.length > 0 || data.skills.programming.length > 0) {
      addHeader('SKILLS');
      if (data.skills.softSkills.length > 0) {
        addText(`Soft Skills: ${data.skills.softSkills.join(', ')}`, 9.5);
        yPosition += 0.4;
      }
      if (data.skills.languages.length > 0) {
        addText(`Languages: ${data.skills.languages.join(', ')}`, 9.5);
        yPosition += 0.4;
      }
      if (data.skills.programming.length > 0) {
        addText(`Programming: ${data.skills.programming.join(', ')}`, 9.5);
        yPosition += 0.4;
      }
    }

    // Honors & Awards
    if (data.honors.length > 0) {
      addHeader('HONORS AND AWARDS');
      data.honors.forEach(honor => {
        addLeftRightLine(honor.title, honor.year, { fontSize: 9.5 });
      });
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
