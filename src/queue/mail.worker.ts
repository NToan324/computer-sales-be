// import { Queue, Worker } from 'bull';
// import { sendEmail } from '@/utils/mailer';

// // Create a new queue for email tasks
// const emailQueue = new Queue('email');

// // Worker to process email tasks
// const emailWorker = new Worker('email', async (job) => {
//     const { to, subject, text } = job.data;

//     try {
//         await sendEmail(to, subject, text);
//         console.log(`Email sent to ${to}`);
//     } catch (error) {
//         console.error(`Failed to send email to ${to}:`, error);
//     }
// });

// // Export the email queue for adding tasks
// export { emailQueue };