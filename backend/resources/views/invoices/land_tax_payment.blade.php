<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>Land Tax Payment Invoice</title>
  <style>
    /* Dompdf-friendly, simple CSS */
    :root {
      --text: #1f2937;
      --muted: #6b7280;
      --line: #e5e7eb;
      --soft: #f8fafc;
      --primary: #0ea5e9;
      --success: #16a34a;
      --warning: #d97706;
      --danger: #dc2626;
      --card: #ffffff;
    }

    * { box-sizing: border-box; }
    body {
      font-family: 'noto-sans-bengali', 'DejaVu Sans', Arial, sans-serif;
      color: var(--text);
      margin: 24px;
      font-size: 12px;
      line-height: 1.5;
      background: #fff;
    }

    .invoice {
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--card);
      padding: 20px;
    }

    .topbar {
      border-bottom: 1px solid var(--line);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .brand-row {
      width: 100%;
      border-collapse: collapse;
    }
    .brand-row td {
      vertical-align: top;
    }

    .brand-name {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: .3px;
    }
    .brand-meta {
      color: var(--muted);
      margin-top: 4px;
    }

    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: bold;
      color: #fff;
    }
    .badge-paid { background: var(--success); }
    .badge-pending { background: var(--warning); }
    .badge-rejected { background: var(--danger); }

    .meta {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 0 0;
    }
    .meta td {
      padding: 2px 0;
      font-size: 12px;
    }
    .meta .label { color: var(--muted); width: 110px; }

    h2.sec-title {
      font-size: 14px;
      margin: 10px 0 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--line);
    }

    table.table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
    }
    .table th, .table td {
      border: 1px solid var(--line);
      padding: 8px;
      text-align: left;
      vertical-align: top;
    }
    .table th {
      background: var(--soft);
      font-weight: 700;
      font-size: 12px;
    }

    .totals {
      margin-top: 12px;
      width: 100%;
      border-collapse: collapse;
    }
    .totals td {
      padding: 6px 8px;
      font-size: 12px;
    }
    .totals .label { text-align: right; color: var(--muted); }
    .totals .value { text-align: right; font-weight: 600; }
    .totals .grand {
      border-top: 1px solid var(--line);
      font-size: 13px;
      font-weight: 800;
    }

    .note {
      margin-top: 16px;
      font-size: 11px;
      color: var(--muted);
      border-top: 1px dashed var(--line);
      padding-top: 10px;
      text-align: center;
    }
    .thank {
      text-align: center;
      margin-top: 10px;
      font-weight: 600;
      color: var(--primary);
    }

    /* Small two-column utility using tables (Dompdf-safe) */
    .split {
      width: 100%;
      border-collapse: collapse;
    }
    .split td { vertical-align: top; }
    .w-50 { width: 50%; }
  </style>
</head>
<body>
  @php
    $brandName    = $brandName    ?? (config('app.name') ?? 'e-Land Registry');
    $brandAddress = $brandAddress ?? 'Bangladesh';
    $brandPhone   = $brandPhone   ?? '+880-1XXX-XXXXXX';
    $brandEmail   = $brandEmail   ?? 'support@example.com';

    $isPaid    = strtolower($payment->status ?? '') === 'paid';
    $statusLbl = $payment->status ? ucfirst($payment->status) : 'N/A';
  @endphp

  <div class="invoice">
    <!-- Top bar: brand + invoice meta -->
    <div class="topbar">
      <table class="brand-row">
        <tr>
          <td class="w-50">
            {{-- Optional logo (Dompdf: use public_path or base64) --}}
            {{-- <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="height:38px;"> --}}
            <div class="brand-name">{{ $brandName }}</div>
            <div class="brand-meta">
              {{ $brandAddress }} • {{ $brandPhone }} • {{ $brandEmail }}
            </div>
          </td>
          <td class="w-50" style="text-align:right;">
            <div style="font-size:18px; font-weight:800;">Land Tax Payment Invoice</div>
            <table class="meta" align="right">
              <tr>
                <td class="label">Invoice ID</td>
                <td>#{{ $payment->id }}</td>
              </tr>
              <tr>
                <td class="label">Date (তারিখ)</td>
                <td>{{ now()->format('Y-m-d') }}</td>
              </tr>
              <tr>
                <td class="label">Payment</td>
                <td>
                  @if($isPaid)
                    <span >{{ $statusLbl }}</span>
                  @else
                    <span >{{ $statusLbl ?: 'Pending' }}</span>
                  @endif
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- Payer & Land Details split -->
    <table class="split">
      <tr>
        <td class="w-50" style="padding-right:8px;">
          <h2 class="sec-title">Payer</h2>
          <table class="table">
            <tr>
              <th style="width:35%;">Name (নাম)</th>
              <td>{{ $user->name }}</td>
            </tr>
            <tr>
              <th>Email (ইমেল)</th>
              <td>{{ $user->email }}</td>
            </tr>
            <tr>
              <th>Phone (মোবাইল)</th>
              <td>{{ $user->phone ?? 'N/A' }}</td>
            </tr>
          </table>
        </td>
        <td class="w-50" style="padding-left:8px;">
          <h2 class="sec-title">Land Details</h2>
          <table class="table">
            <tr>
              <th style="width:35%;">Khatiyan Number</th>
              <td>{{ $payment->landTaxRegistration->khatiyan_number }}</td>
            </tr>
            <tr>
              <th>Dag Number</th>
              <td>{{ $payment->landTaxRegistration->dag_number }}</td>
            </tr>
            <tr>
              <th>Land Area</th>
              <td>{{ $payment->landTaxRegistration->land_area }} sq ft</td>
            </tr>
            <tr>
              <th>Land Type</th>
              <td>{{ $payment->landTaxRegistration->land_type }}</td>
            </tr>
            <tr>
              <th>Year</th>
              <td>{{ $payment->year }}</td>
            </tr>
            <tr>
              <th>Paid At</th>
              <td>
                {{ $payment->paid_at ? $payment->paid_at->format('Y-m-d H:i:s') : 'N/A' }}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Tax Details -->
    <h2 class="sec-title">Tax Details</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="width:120px; text-align:right;">Amount (BDT)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Land Tax for {{ $payment->year }} ({{ $payment->landTaxRegistration->land_type }})</td>
          <td style="text-align:right;">{{ number_format($payment->amount, 2) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    @php
      $subtotal = (float)($payment->amount ?? 0);
      $discount = 0.00;     // if any
      $tax      = 0.00;     // if any VAT/SD
      $grand    = $subtotal - $discount + $tax;
    @endphp

    <table class="totals">
      <tr>
        <td class="label">Subtotal</td>
        <td class="value">{{ number_format($subtotal, 2) }} BDT</td>
      </tr>
      @if($discount > 0)
      <tr>
        <td class="label">Discount</td>
        <td class="value">-{{ number_format($discount, 2) }} BDT</td>
      </tr>
      @endif
      @if($tax > 0)
      <tr>
        <td class="label">Tax/VAT</td>
        <td class="value">{{ number_format($tax, 2) }} BDT</td>
      </tr>
      @endif
      <tr>
        <td class="label grand">Total</td>
        <td class="value grand">{{ number_format($grand, 2) }} BDT</td>
      </tr>
    </table>

    <div class="thank">
      @if($isPaid)
        Payment received. Thank you!
      @else
        Payment pending — please complete the payment to process your application.
      @endif
    </div>

    <div class="note">
      This is a computer-generated invoice. For support, contact {{ $brandEmail }}.
    </div>
  </div>
</body>
</html>
