import smtplib

from api.config import EMAIL_ADD, EMAIL_PSW


def send(email_dest, subject, msg):
    try:
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls()
        server.login(EMAIL_ADD, EMAIL_PSW)
        message = 'Subject: {}\n\n{}'.format(subject, msg)
        server.sendmail(EMAIL_ADD, email_dest, message)
        server.quit()
        return True
    except Exception:
        return False

