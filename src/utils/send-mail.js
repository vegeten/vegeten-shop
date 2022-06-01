import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'kth5954@gmail.com',
    pass: 'yrjtuizxxlmnokar',
  },
});

const sendMail = (to, subject, text) =>
  new Promise((resolve, reject) => {
    const message = {
      from: 'vegeten',
      to,
      subject,
      text,
    };

    transport.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(info);
    });
  });

export { sendMail };
