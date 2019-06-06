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


def send_interview(email_dest, patientID, interviewID):
    send(email_dest, 'MEDBot medical interview',
         'Hello dear Test patient,\n'
         'here is yours medical interview to fill during next 7 days.\n'
         'http://127.0.0.1:4200/' + str(patientID) + '/answer/interview/' +
         str(interviewID) + '\n'
         'Please remember to do it before your meeting with a doctor, it will save time for us all.\n'
         'Thanks,\n'
         'MEDBot team')
