<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .invoice-details {
            margin-bottom: 20px;
        }
        .invoice-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .invoice-details th, .invoice-details td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .invoice-details th {
            background-color: #f2f2f2;
        }
        .total {
            text-align: right;
            font-weight: bold;
            font-size: 18px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Application Invoice</h1>
        <p>Invoice ID: {{ $application->id }}</p>
        <p>Date: {{ now()->format('Y-m-d') }}</p>
    </div>

    <div class="invoice-details">
        <h2>Applicant Information</h2>
        <table>
            <tr>
                <th>Name</th>
                <td>{{ $user->name }}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{{ $user->email }}</td>
            </tr>
            <tr>
                <th>Phone</th>
                <td>{{ $user->phone ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="invoice-details">
        <h2>Application Details</h2>
        <table>
            <tr>
                <th>Application Type</th>
                <td>{{ $application->type }}</td>
            </tr>
            <tr>
                <th>Description</th>
                <td>{{ $application->description ?? 'N/A' }}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>{{ ucfirst($application->status) }}</td>
            </tr>
            <tr>
                <th>Payment Status</th>
                <td>{{ ucfirst($application->payment_status) }}</td>
            </tr>
            <tr>
                <th>Submitted At</th>
                <td>{{ $application->submitted_at ? $application->submitted_at->format('Y-m-d H:i:s') : 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="invoice-details">
        <h2>Fee Details</h2>
        <table>
            <tr>
                <th>Fee Amount</th>
                <td>BDT {{ number_format($application->fee_amount, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="total">
        <p>Total Amount: BDT {{ number_format($application->fee_amount, 2) }}</p>
    </div>

    <div class="footer">
        <p>Thank you for your application!</p>
        <p>This is a computer-generated invoice.</p>
        <p>যেটা সেটা</p>
    </div>
</body>
</html>
