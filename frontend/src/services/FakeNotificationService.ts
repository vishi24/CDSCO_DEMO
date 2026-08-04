// Since this is a demo, we mock out some notification utilities
export const FakeNotificationService = {
  sendSms: (mobile: string, message: string) => {
    console.log(`[FAKE SMS] To: ${mobile} | Message: ${message}`);
  },
  sendEmail: (email: string, subject: string, body: string) => {
    console.log(`[FAKE EMAIL] To: ${email} | Subject: ${subject} | Body: ${body}`);
  }
};
