// src/i18n/texts.js
export const dual = (en, bn) => `${en} / ${bn}`;

const TXT = {
  // NAV
  personalInfo: dual("Personal Information", "ব্যক্তিগত তথ্য"),
  address: dual("Address", "ঠিকানা"),
  applyKhatian: dual("Apply Khatian", "খতিয়ান আবেদন"),
  ldt: dual("Land Development Tax (LDT)", "ভূমি উন্নয়ন কর (এলডিটি)"),
  payments: dual("Payments & Receipts", "পেমেন্ট ও রসিদ"),
  profileKyc: dual("Profile & KYC", "প্রোফাইল ও কেওয়াইসি"),
  messages: dual("Messages", "বার্তা"),
  security: dual("Security", "নিরাপত্তা"),

  // Common labels & actions
  edit: dual("Edit", "সম্পাদনা"),
  saveChanges: dual("Save Changes", "পরিবর্তন সংরক্ষণ"),
  cancel: dual("Cancel", "বাতিল"),
  back: dual("Back", "ফিরে যান"),
  loading: dual("Loading...", "লোড হচ্ছে..."),

  // Profile
  profileInformation: dual("Profile Information", "প্রোফাইল তথ্য"),
  editProfileInformation: dual(
    "Edit Profile Information",
    "প্রোফাইল তথ্য সম্পাদনা"
  ),
  fullName: dual("Full Name", "পূর্ণ নাম"),
  emailAddress: dual("Email Address", "ইমেইল ঠিকানা"),
  phoneNumber: dual("Phone Number", "ফোন নম্বর"),
  role: dual("Role", "ভূমিকা"),
  notProvided: dual("Not provided", "প্রদত্ত নয়"),

  // Address
  addressInformation: dual("Address Information", "ঠিকানা তথ্য"),
  permanentAddress: dual("Permanent Address", "স্থায়ী ঠিকানা"),
  mailingAddress: dual("Mailing Address", "মেইলিং/পত্র প্রেরণের ঠিকানা"),
  addressLine1: dual("Address Line 1", "ঠিকানা লাইন ১"),
  addressLine2: dual("Address Line 2", "ঠিকানা লাইন ২"),
  city: dual("City", "শহর/উপজেলা"),
  postalCode: dual("Postal Code", "পোস্ট কোড"),
  country: dual("Country", "দেশ"),

  // Apply Khatian
  applyForKhatian: dual("Apply for Khatian", "খতিয়ান আবেদন"),
  startNewApplication: dual("Start New Application", "নতুন আবেদন"),
  viewDrafts: dual("Applies Khatiyan", "আবেদন করা খতিয়ান"),
  loadingApplications: dual("Loading applications...", "আবেদন লোড হচ্ছে..."),
  noApplications: dual("No applications found.", "কোনো আবেদন পাওয়া যায়নি।"),
  downloadKhatian: dual("Download Khatian", "খতিয়ান ডাউনলোড"),
  payFirst: dual("Pay first", "আগে পেমেন্ট করুন"),
  typeLabel: dual("Type", "ধরন"),
  descriptionLabel: dual("Description", "বিবরণ"),
  paymentStatus: dual("Payment Status", "পেমেন্ট স্ট্যাটাস"),
  noDocument: dual("No document available", "কোনো ডকুমেন্ট নেই"),
  startNewNote: dual(
    "Start a new application or view your drafts.",
    "নতুন আবেদন করুন অথবা আপনার ড্রাফট দেখুন।"
  ),
  nbNote: dual(
    "[N.B.: If you pay, then the payment status will be PAID and the khatian download button will be enabled.]",
    "[দ্রষ্টব্য: আপনি পেমেন্ট করলে পেমেন্ট স্ট্যাটাস PAID হবে এবং খতিয়ান ডাউনলোড বাটন সক্রিয় হবে।]"
  ),

  // LDT
  ldtHeader: dual("Land Development Tax (LDT)", "ভূমি উন্নয়ন কর (এলডিটি)"),
  ldtDesc: dual(
    "View/pay LDT and download receipts.",
    "এলডিটি দেখুন/পরিশোধ করুন ও রসিদ ডাউনলোড করুন।"
  ),
  payLdt: dual("Pay LDT", "এলডিটি পরিশোধ"),
  viewHistory: dual("View Payment History", "পেমেন্ট ইতিহাস দেখুন"),

  // Payments
  paymentsHeader: dual("Payments & Receipts", "পেমেন্ট ও রসিদ"),
  noPayments: dual("No payments found.", "কোনো পেমেন্ট পাওয়া যায়নি।"),
  feeAmount: dual("Fee Amount", "ফি পরিমাণ"),
  downloadInvoice: dual("Download Invoice", "ইনভয়েস ডাউনলোড"),
  paymentPending: dual("Payment Pending", "পেমেন্ট বাকি"),

  // KYC
  profileKycHeader: dual("Profile & KYC", "প্রোফাইল ও কেওয়াইসি"),
  email: dual("Email", "ইমেইল"),
  emailVerified: dual("Email Verified", "ইমেইল যাচাইকৃত"),
  sendVerification: dual("Send Verification", "যাচাইকরণ পাঠান"),
  phone: dual("Phone", "ফোন"),
  sendOtp: dual("Send OTP", "ওটিপি পাঠান"),
  nid: dual("National ID (NID)", "জাতীয় পরিচয়পত্র (এনআইডি)"),
  kycUpdated: dual("KYC Updated", "কেওয়াইসি আপডেট হয়েছে"),
  kycPending: dual("KYC Pending", "কেওয়াইসি মুলতুবি"),
  kycUpdate: dual("KYC Update", "কেওয়াইসি আপডেট"),
  idFront: dual("ID Front", "আইডির সামনের দিক"),
  idBack: dual("ID Back", "আইডির পেছনের দিক"),
  upload: dual("Upload", "আপলোড"),
  uploading: dual("Uploading...", "আপলোড হচ্ছে..."),
  reason: dual("Reason", "কারণ"),

  // Security
  securitySettings: dual("Security Settings", "নিরাপত্তা সেটিংস"),
  changePassword: dual("Change Password", "পাসওয়ার্ড পরিবর্তন"),
  currentPassword: dual("Current Password", "বর্তমান পাসওয়ার্ড"),
  newPassword: dual("New Password", "নতুন পাসওয়ার্ড"),
  confirmNewPassword: dual(
    "Confirm New Password",
    "নতুন পাসওয়ার্ড নিশ্চিত করুন"
  ),
  savePassword: dual("Save Password", "পাসওয়ার্ড সংরক্ষণ"),
  saving: dual("Saving...", "সংরক্ষণ হচ্ছে..."),
  enable2FA: dual("Enable 2FA", "টু-ফ্যাক্টর চালু করুন"),
  show: dual("Show", "দেখান"),
  hide: dual("Hide", "লুকান"),
};

export default TXT;
