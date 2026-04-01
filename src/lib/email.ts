export async function sendEmail(to: string, subject: string, body: string) {
  // In a real application, you would use a service like Resend, SendGrid, or Nodemailer here.
  // For this project, we will simulate sending an email by logging it to the console.
  console.log('--------------------------------------------------')
  console.log(`📧 SIMULATED EMAIL SENT TO: ${to}`)
  console.log(`SUBJECT: ${subject}`)
  console.log(`BODY:\n${body}`)
  console.log('--------------------------------------------------')
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return true
}
