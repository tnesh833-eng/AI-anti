/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { StudentProfile } from '../types.ts';

export function generateStudentReportPdf(student: StudentProfile): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178 mm
  let y = margin;

  // Helper to check page overflow and add new page
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin;
      drawHeaderBanner(true);
    }
  };

  const drawHeaderBanner = (isContinued = false) => {
    // Top colored accent bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, isContinued ? 12 : 28, 'F');

    doc.setFillColor(99, 102, 241); // indigo-500 accent stripe
    doc.rect(0, isContinued ? 11 : 26.5, pageWidth, 1.5, 'F');

    if (isContinued) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(226, 232, 240);
      doc.text(
        `STUDENT PROGRESS REPORT: ${student.name.toUpperCase()} (Continued)`,
        margin,
        8
      );
      y = 18;
      return;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('ACADEMIA INTELLIGENTIA', margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(199, 210, 254);
    doc.text('Intelligent AI Tutor • Adaptive Learning System & Student Model', margin, 18);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`Report Date: ${dateStr}`, pageWidth - margin, 12, { align: 'right' });
    doc.text(`Doc ID: REP-${student.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`, pageWidth - margin, 18, { align: 'right' });

    y = 36;
  };

  // 1. Initial Banner
  drawHeaderBanner(false);

  // 2. Student Profile Card Box
  const totalQuizzes = student.quizHistory.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          student.quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes
        )
      : 75;

  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'FD');

  // Student Info Left
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(student.name, margin + 5, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Grade / Level: ${student.gradeLevel}  |  Email: ${student.email}`, margin + 5, y + 16);
  doc.text(`Primary Focus Area: ${student.preferredSubject}`, margin + 5, y + 22);

  // Status Badge
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin + 5, y + 25, 62, 6, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text('Intelligent Diagnostic Model: ACTIVE', margin + 7, y + 29.2);

  // 4 Metric Badges on Right
  const metricBoxW = 24;
  const metricBoxH = 26;
  const metricGap = 3;
  const metricsStartX = pageWidth - margin - (metricBoxW * 4 + metricGap * 3) - 5;
  const metricY = y + 4;

  const metrics = [
    { label: 'Avg Accuracy', value: `${avgScore}%`, color: [16, 185, 129] }, // emerald
    { label: 'Streak', value: `${student.streakDays}d`, color: [245, 158, 11] }, // amber
    { label: 'Total XP', value: `${student.xpPoints}`, color: [147, 51, 234] }, // purple
    { label: 'Quizzes', value: `${totalQuizzes}`, color: [99, 102, 241] }, // indigo
  ];

  metrics.forEach((m, i) => {
    const bx = metricsStartX + i * (metricBoxW + metricGap);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(bx, metricY, metricBoxW, metricBoxH, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, bx + metricBoxW / 2, metricY + 7, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.value, bx + metricBoxW / 2, metricY + 17, { align: 'center' });
  });

  y += 42;

  // 3. Section: Competency Mastery
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. COMPETENCY MASTERY EVALUATION', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Calculated via Bayesian Knowledge Tracing & IRT', margin + 92, y);

  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  const masteryItems = Object.entries(student.masteryLevels);
  if (masteryItems.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('No historical mastery benchmarks recorded.', margin, y);
    y += 8;
  } else {
    // 2-column layout for mastery bars
    const colWidth = (contentWidth - 6) / 2;
    masteryItems.forEach(([topic, score], idx) => {
      const col = idx % 2;
      const xPos = margin + col * (colWidth + 6);
      const rowY = y + Math.floor(idx / 2) * 11;

      if (col === 0 && idx > 0 && idx % 2 === 0) {
        checkPageBreak(12);
      }

      // Topic label & score
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(doc.splitTextToSize(topic, colWidth - 22)[0] || topic, xPos, rowY + 3);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      let statusText = 'Developing';
      if (score >= 75) {
        doc.setTextColor(5, 150, 105); // emerald
        statusText = 'Proficient';
      } else if (score >= 60) {
        doc.setTextColor(79, 70, 229); // indigo
        statusText = 'Competent';
      } else {
        doc.setTextColor(225, 29, 72); // rose
        statusText = 'Needs Work';
      }
      doc.text(`${score}% (${statusText})`, xPos + colWidth, rowY + 3, { align: 'right' });

      // Progress bar background
      const barY = rowY + 5;
      const barH = 3;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(xPos, barY, colWidth, barH, 1, 1, 'F');

      // Filled bar
      const fillW = Math.max(2, (score / 100) * colWidth);
      if (score >= 75) {
        doc.setFillColor(16, 185, 129);
      } else if (score >= 60) {
        doc.setFillColor(99, 102, 241);
      } else {
        doc.setFillColor(244, 63, 94);
      }
      doc.roundedRect(xPos, barY, fillW, barH, 1, 1, 'F');
    });

    y += Math.ceil(masteryItems.length / 2) * 11 + 6;
  }

  // 4. Section: Identified Weak Areas & Remedial Prescription
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. IDENTIFIED KNOWLEDGE GAPS & REMEDIAL PRESCRIPTION', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Identified: ${student.weakAreas.length} area(s)`, pageWidth - margin, y, { align: 'right' });

  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  if (student.weakAreas.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(22, 101, 52);
    doc.text('Excellent! No critical weak areas or knowledge gaps detected.', margin + 5, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(21, 128, 61);
    doc.text('The student has demonstrated solid mastery across all evaluated subjects.', margin + 5, y + 10.5);
    y += 18;
  } else {
    student.weakAreas.forEach((w) => {
      const boxH = 21;
      checkPageBreak(boxH + 4);

      const isHigh = w.severity === 'high';
      doc.setFillColor(isHigh ? 255 : 254, isHigh ? 241 : 243, isHigh ? 242 : 199); // rose-50 or amber-50
      doc.setDrawColor(isHigh ? 254 : 252, isHigh ? 205 : 211, isHigh ? 211 : 77); // rose-200 or amber-200
      doc.roundedRect(margin, y, contentWidth, boxH, 2, 2, 'FD');

      // Severity badge
      doc.setFillColor(isHigh ? 225 : 217, isHigh ? 29 : 119, isHigh ? 72 : 6);
      doc.roundedRect(margin + 4, y + 3.5, 18, 4.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text(w.severity.toUpperCase(), margin + 13, y + 6.8, { align: 'center' });

      // Subtopic title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(w.subtopic, margin + 25, y + 7);

      // Meta right
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`${w.topic}  |  ${w.errorCount} mistakes  |  Last: ${w.lastIdentified}`, pageWidth - margin - 4, y + 7, { align: 'right' });

      // Recommendation text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const remedyPrefix = 'Diagnostic Remedy: ';
      doc.setFont('helvetica', 'bold');
      doc.text(remedyPrefix, margin + 5, y + 14);
      doc.setFont('helvetica', 'normal');
      const prefixWidth = doc.getTextWidth(remedyPrefix);
      const splitRemedy = doc.splitTextToSize(w.recommendationSnippet, contentWidth - 10 - prefixWidth);
      doc.text(splitRemedy[0] || w.recommendationSnippet, margin + 5 + prefixWidth, y + 14);
      if (splitRemedy.length > 1) {
        doc.text(splitRemedy.slice(1).join(' '), margin + 5, y + 18);
      }

      y += boxH + 3.5;
    });
    y += 4;
  }

  // 5. Section: Historical Assessment Log
  checkPageBreak(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. COMPREHENSIVE ASSESSMENT LOG & QUIZ HISTORY', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Records: ${student.quizHistory.length}`, pageWidth - margin, y, { align: 'right' });

  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  if (student.quizHistory.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('No quiz assessment sessions recorded yet.', margin, y);
    y += 10;
  } else {
    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 6.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);

    const colX = {
      date: margin + 3,
      topic: margin + 26,
      score: margin + 90,
      acc: margin + 108,
      missed: margin + 125,
      time: pageWidth - margin - 3,
    };

    doc.text('DATE', colX.date, y + 4.5);
    doc.text('ASSESSMENT TOPIC / SUBJECT', colX.topic, y + 4.5);
    doc.text('SCORE', colX.score, y + 4.5);
    doc.text('ACCURACY', colX.acc, y + 4.5);
    doc.text('MISSED SUBTOPICS', colX.missed, y + 4.5);
    doc.text('TIME', colX.time, y + 4.5, { align: 'right' });

    y += 6.5;

    student.quizHistory.forEach((q, i) => {
      checkPageBreak(10);
      const isEven = i % 2 === 0;
      if (isEven) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 8, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(q.date, colX.date, y + 5.2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      const truncatedTopic = doc.splitTextToSize(q.topic, 60)[0] || q.topic;
      doc.text(truncatedTopic, colX.topic, y + 3.8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(99, 102, 241);
      doc.text(q.subject, colX.topic, y + 6.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`${q.score}/${q.totalQuestions}`, colX.score + 2, y + 5.2);

      // Accuracy pill
      const isPass = q.percentage >= 70;
      doc.setFillColor(isPass ? 209 : 254, isPass ? 250 : 226, isPass ? 229 : 226);
      doc.roundedRect(colX.acc, y + 1.8, 12, 4.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(isPass ? 5 : 225, isPass ? 150 : 29, isPass ? 105 : 72);
      doc.text(`${q.percentage}%`, colX.acc + 6, y + 5, { align: 'center' });

      // Missed subtopics
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      if (q.missedSubtopics && q.missedSubtopics.length > 0) {
        doc.setTextColor(190, 18, 60);
        const missedStr = q.missedSubtopics.join(', ');
        const truncatedMissed = doc.splitTextToSize(missedStr, 40)[0] || missedStr;
        doc.text(truncatedMissed, colX.missed, y + 5.2);
      } else {
        doc.setTextColor(16, 185, 129);
        doc.text('Flawless (100%)', colX.missed, y + 5.2);
      }

      // Time
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`${q.timeSpentSeconds}s`, colX.time, y + 5.2, { align: 'right' });

      y += 8;
    });
  }

  // 4. Section: Student Achievements & Study Badges
  const unlockedBadges = (student.achievements || []).filter((a) => a.unlocked);
  if (unlockedBadges.length > 0) {
    checkPageBreak(30);
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('4. EARNED STUDENT ACHIEVEMENTS & STUDY PATTERN BADGES', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${unlockedBadges.length} Badge(s) Unlocked`, pageWidth - margin, y, { align: 'right' });

    y += 4;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Badges pill display in 2 columns
    const bColW = (contentWidth - 6) / 2;
    unlockedBadges.forEach((b, idx) => {
      const col = idx % 2;
      const bx = margin + col * (bColW + 6);
      const by = y + Math.floor(idx / 2) * 11;
      if (col === 0 && idx > 0 && idx % 2 === 0) {
        checkPageBreak(12);
      }
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(bx, by, bColW, 9, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`[${b.tier.toUpperCase()}] ${b.title}`, bx + 3, by + 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(doc.splitTextToSize(b.description, bColW - 6)[0] || b.description, bx + 3, by + 7.5);
    });

    y += Math.ceil(unlockedBadges.length / 2) * 11 + 4;
  }

  // 5. Report Summary & Pedagogy Sign-off
  checkPageBreak(30);
  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PEDAGOGICAL ASSESSMENT RECOMMENDATION SUMMARY', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const summaryNotice =
    'This progress diagnostic is automatically evaluated using AI NLP & IRT algorithms. Regular spaced repetition and Socratic AI tutoring sessions are recommended for weak areas with severity level HIGH to achieve complete competency mastery.';
  const wrappedNotice = doc.splitTextToSize(summaryNotice, contentWidth - 8);
  doc.text(wrappedNotice, margin + 4, y + 10);

  // 7. Add Page Numbers and Footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);

    // Bottom border
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.text(
      'Academia Intelligentia • Confidential Academic Student Progress Record',
      margin,
      pageHeight - 6
    );
    doc.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: 'right' }
    );
  }

  // Trigger browser download
  const sanitizedStudentName = student.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `Progress_Report_${sanitizedStudentName}_${dateStamp}.pdf`;
  doc.save(filename);
}
