import type { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

const METHOD_LABELS: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Mobile Money',
    cash: 'Cash',
    cheque: 'Cheque',
    card: 'Card Payment',
};

/**
 * Generates an HTML receipt document and opens it in a new window for printing/saving as PDF.
 */
export function generateReceipt(txn: Transaction) {
    const dateStr = format(new Date(txn.processedAt || txn.createdAt), 'dd MMMM yyyy, h:mm a');
    const receiptNumber = `RCT-${txn.id.replace('TXN-', '')}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Receipt ${receiptNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            padding: 20px;
        }
        .receipt {
            max-width: 520px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .header {
            background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
            color: white;
            padding: 32px 32px 24px;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header .subtitle {
            font-size: 12px;
            opacity: 0.7;
            margin-top: 4px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .receipt-badge {
            display: inline-block;
            background: #22c55e;
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 14px;
            border-radius: 999px;
            margin-top: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .amount-section {
            text-align: center;
            padding: 28px 32px;
            border-bottom: 1px dashed #cbd5e1;
        }
        .amount-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748b;
            font-weight: 600;
        }
        .amount-value {
            font-size: 36px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 6px;
            font-variant-numeric: tabular-nums;
        }
        .details {
            padding: 24px 32px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }
        .detail-value {
            font-size: 13px;
            color: #0f172a;
            font-weight: 600;
            text-align: right;
        }
        .footer {
            background: #f8fafc;
            padding: 20px 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            font-size: 10px;
            color: #94a3b8;
            line-height: 1.6;
        }
        .receipt-number {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #94a3b8;
            margin-top: 8px;
        }
        @media print {
            body { background: white; padding: 0; }
            .receipt { box-shadow: none; border: none; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>IBMS Ghana</h1>
            <div class="subtitle">Insurance Brokerage Management System</div>
            <div class="receipt-badge">Payment Confirmed</div>
        </div>

        <div class="amount-section">
            <div class="amount-label">Amount Received</div>
            <div class="amount-value">${formatCurrency(txn.amount, txn.currency)}</div>
            <div class="receipt-number">${receiptNumber}</div>
        </div>

        <div class="details">
            <div class="detail-row">
                <span class="detail-label">Client</span>
                <span class="detail-value">${txn.clientName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Policy Number</span>
                <span class="detail-value" style="font-family: monospace;">${txn.policyNumber}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Method</span>
                <span class="detail-value">${METHOD_LABELS[txn.method] || txn.method}${txn.momoNetwork ? ' (' + txn.momoNetwork.toUpperCase() + ')' : ''}</span>
            </div>
            ${txn.phoneNumber ? `
            <div class="detail-row">
                <span class="detail-label">Phone Number</span>
                <span class="detail-value">${txn.phoneNumber}</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Reference</span>
                <span class="detail-value" style="font-family: monospace;">${txn.reference}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Description</span>
                <span class="detail-value">${txn.description}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">${dateStr}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value" style="color: #16a34a;">Paid</span>
            </div>
        </div>

        <div class="footer">
            <p>This is a system-generated receipt from IBMS Ghana.<br/>For queries, contact support@ibms.com.gh</p>
        </div>
    </div>

    <div style="text-align: center; margin-top: 24px;" class="no-print">
        <button onclick="window.print()" style="
            background: #1e3a5f;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            margin-right: 8px;
        ">Print Receipt</button>
        <button onclick="window.close()" style="
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
            padding: 12px 32px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        ">Close</button>
    </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
    }
}
