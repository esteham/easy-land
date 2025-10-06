# KYC Workflow Implementation TODO

- [x] Create new migration to change 'approved' to 'success' in kycs status enum
- [x] Update KycController.php: add listPendingKyc, approveKyc, rejectKyc methods
- [x] Update api.php: add admin routes for KYC approval
- [x] Update frontend Dashboard.jsx: fetch KYC on mount, disable upload if status 'success', show status always
- [x] Run the new migration
- [x] Test the workflow
