import { format } from 'date-fns';

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

interface ReportSection {
    title: string;
    rows: { label: string; value: string }[];
}

/**
 * Generates a print-friendly HTML report and opens the browser Print dialog,
 * allowing the user to save as PDF.
 */
export function generateReportPdf(title: string, sections: ReportSection[]) {
    const dateStr = format(new Date(), 'dd MMMM yyyy, h:mm a');

    const sectionHtml = sections
        .map(
            (s) => `
        <div class="section">
            <h2>${escapeHtml(s.title)}</h2>
            <table>
                ${s.rows.map((r) => `<tr><td class="label">${escapeHtml(r.label)}</td><td class="value">${escapeHtml(r.value)}</td></tr>`).join('')}
            </table>
        </div>
    `,
        )
        .join('');

    const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
    @page { margin: 1.5cm; size: A4; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 22px; color: #1e40af; margin: 0 0 4px; }
    .header .date { font-size: 12px; color: #64748b; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 16px; color: #1e40af; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 12px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 6px 8px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    .label { color: #64748b; width: 45%; }
    .value { font-weight: 600; text-align: right; }
    .footer { text-align: center; margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
</style>
</head><body>
    <div class="header">
        <h1>${escapeHtml(title)}</h1>
        <p class="date">Generated: ${escapeHtml(dateStr)}</p>
    </div>
    ${sectionHtml}
    <div class="footer">
        Brokerium — Insurance Broker Management System &bull; Confidential
    </div>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) {
        win.document.write(html);
        win.document.close();
        win.onload = () => win.print();
    }
}
