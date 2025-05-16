import { Queue } from 'bull';
import { redisClient } from '@/config/redis'; // Adjust the import based on your Redis configuration
import { sendEmail } from '@/utils/mailer';

const emailQueue = new Queue('email', {
    redis: {
        host: redisClient.host,
        port: redisClient.port,
    },
});

emailQueue.process(async (job) => {
    const { to, subject, text } = job.data;
    await sendEmail(to, subject, text);
});

export const addEmailToQueue = (to: string, subject: string, text: string) => {
    emailQueue.add({ to, subject, text });
};