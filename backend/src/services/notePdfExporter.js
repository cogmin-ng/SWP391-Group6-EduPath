const PDFDocument = require('pdfkit');

const REGULAR_FONT = require.resolve(
  '@expo-google-fonts/noto-sans/400Regular/NotoSans_400Regular.ttf'
);
const BOLD_FONT = require.resolve(
  '@expo-google-fonts/noto-sans/700Bold/NotoSans_700Bold.ttf'
);

const COLORS = {
  primary: '#4f46e5',
  heading: '#0f172a',
  body: '#334155',
  muted: '#64748b',
  border: '#e2e8f0',
};

function formatDate(value) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(value);
}

function addPageFooter(doc) {
  const range = doc.bufferedPageRange();
  for (
    let pageIndex = range.start;
    pageIndex < range.start + range.count;
    pageIndex += 1
  ) {
    doc.switchToPage(pageIndex);
    doc
      .font('NotoSans')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(
        `EduPath • Trang ${pageIndex + 1}/${range.count}`,
        50,
        doc.page.height - 36,
        { width: doc.page.width - 100, align: 'center', lineBreak: false }
      );
  }
}

exports.stream = (output, { roadmap, user, notes, exportedAt }) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 54, right: 54, bottom: 58, left: 54 },
    bufferPages: true,
    info: {
      Title: `Ghi chú cá nhân - ${roadmap.title}`,
      Author: user.name || user.email,
      Subject: 'Personal Learning Notes',
    },
  });

  doc.registerFont('NotoSans', REGULAR_FONT);
  doc.registerFont('NotoSansBold', BOLD_FONT);
  doc.on('error', (error) => output.destroy(error));
  doc.pipe(output);

  doc
    .font('NotoSansBold')
    .fontSize(10)
    .fillColor(COLORS.primary)
    .text('EDUPATH • PERSONAL LEARNING NOTES');
  doc.moveDown(0.8);
  doc
    .fontSize(23)
    .fillColor(COLORS.heading)
    .text(roadmap.title, { lineGap: 3 });
  doc.moveDown(0.6);
  doc
    .font('NotoSans')
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text(`Người học: ${user.name || user.email}`)
    .text(`Xuất lúc: ${formatDate(exportedAt)}`)
    .text(`Tổng số ghi chú: ${notes.length}`);
  doc.moveDown(1.2);
  doc
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(1.2);

  notes.forEach((note, index) => {
    const requiredHeight = 72;
    if (doc.y + requiredHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }

    doc
      .font('NotoSansBold')
      .fontSize(9)
      .fillColor(COLORS.primary)
      .text(`NODE ${note.node.orderIndex + 1}`);
    doc
      .fontSize(15)
      .fillColor(COLORS.heading)
      .text(note.node.title, { lineGap: 2 });
    doc.moveDown(0.25);
    doc
      .font('NotoSans')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(`Cập nhật: ${formatDate(note.updatedAt)}`);
    doc.moveDown(0.55);
    doc.fontSize(10.5).fillColor(COLORS.body).text(note.content, {
      lineGap: 4,
      paragraphGap: 7,
      align: 'left',
    });

    if (index < notes.length - 1) {
      doc.moveDown(1);
      doc
        .strokeColor(COLORS.border)
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();
      doc.moveDown(1);
    }
  });

  addPageFooter(doc);
  doc.end();
};
