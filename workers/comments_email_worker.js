const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer')

// First argument is name of queue.
queue.process('emails', function(job, done){
    console.log('emails worker processing a job ', job.data)

    commentsMailer.newComment(job.data);
    done();
})