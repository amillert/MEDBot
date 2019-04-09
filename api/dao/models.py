import psycopg2
from api import db, ma
from marshmallow import fields
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import desc
from operator import attrgetter

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=True)

    def __repr__(self):
        return f"Role('{self.name})"

    #relationship
    users = db.relationship('User', backref='role', lazy=True)

    @staticmethod
    def get_id_by_role(role):
        role = Role.query.filter_by(name=role).first()
        return role.id


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password = db.Column(db.String(100))
    firstName = db.Column(db.String(30))
    lastName = db.Column(db.String(40))
    roleID = db.Column(db.Integer, db.ForeignKey(Role.id))
    passwordChange = db.Column(db.DateTime,  default=datetime.utcnow)

    def __repr__(self):
        return f"User('{self.email}, '{self.firstName}', '{self.lastName}', {self.role})"

    def insert_into(req, role):
        hashed_password = generate_password_hash(req['password'], method='sha256')
        user = User(email=req['email'], password=hashed_password, firstName=req['firstName'], lastName=req['lastName'], roleID=Role.get_id_by_role(role))
        db.session.add(user)
        db.session.commit()

    def get_users_by_role(role, user_id=None):
        if not user_id:
            user_schema = UserSchema(many=True)
            users = User.query.filter_by(roleID=Role.get_id_by_role(role)).all()
            if users:
                return user_schema.dump(users).data
        else:
            user_schema = UserSchema()
            user = User.query.filter_by(id=user_id, roleID=Role.get_id_by_role(role)).first()
            return user_schema.dump(user).data

    @staticmethod
    def update_user(req, user_id, role):
        d = {}
        for att in req:
            if req[att]:
                d[att] = req[att]
        changepass = d.get('passwordChange')
        if changepass is True:
            mydate = datetime.now()
            year, month = divmod(mydate.month - 3, 12)
            if month == 0: 
                month = 12
                year = year -1
            next_pass = datetime(mydate.year + year, month, 1)
            d['passwordChange'] = next_pass
        print(d)
        user = User.query.filter_by(id=user_id, roleID=Role.get_id_by_role(role)).update(d)
        if user == 0:
            db.session.rollback()
            return False
        db.session.commit()
        return True

    def delete_user(req, user_id, role):
        user = User.query.filter_by(id=user_id, roleID=Role.get_id_by_role(role)).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        else:
            return False

    @staticmethod
    def changePassword(req):
        user = User.query.filter_by(email=req['email']).first()
        if user:
            print('user found')
            if check_password_hash(user.password, req['oldpassword']):
                print('old pass verified')
                user.password = generate_password_hash(req['newpassword'], method='sha256')
                mydate = datetime.now()
                year, month = divmod(mydate.month + 3, 12)
                if month == 0: 
                    month = 12
                    year = year -1
                next_pass = datetime(mydate.year + year, month, 1)
                user.passwordChange = next_pass
                db.session.commit()
                return True
        return False

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    firstName = db.Column(db.String(30))
    lastName = db.Column(db.String(40))
    doctorID = db.Column(db.Integer, db.ForeignKey(User.id))
    doctor = db.relationship(User, foreign_keys=[doctorID], backref='patients')

    @staticmethod
    def insert_into(req):
        user = User.query.get(req['doctorID'])
        if user.roleID == 1:
            print('admin')
            patient = Patient(email=req['email'], firstName=req['firstName'], lastName=req['lastName'])
            db.session.add(patient)
            db.session.commit()
        else:
            patient = Patient(email=req['email'], firstName=req['firstName'], lastName=req['lastName'], doctorID=req['doctorID'])
            db.session.add(patient)
            db.session.commit()

    def delete_patient(patient_id):
            patient = Patient.query.filter_by(id=patient_id).first()
            if patient:
                db.session.delete(patient)
                db.session.commit()
                return True
            else:
                return False

    def get_all():
        patient_schema = PatientSchema(many=True)
        return patient_schema.dump(Patient.query.all()).data
    
    def get_by_id(patient_id):
        patient_schema = PatientSchema()
        return patient_schema.dump(Patient.query.get(patient_id)).data

    @staticmethod
    def update_patient(req, patient_id):
        d = {}
        for att in req:
            if req[att]:
                d[att] = req[att]
        if d.get('doctorID') == 'unAssign':
            d['doctorID'] = None

        patient = Patient.query.filter_by(id=patient_id).update(d)
        db.session.commit()
        return True


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(100), unique=True, nullable=False)
    
    @staticmethod
    def insert_into(req):
        question = Question(question=req['question'])
        db.session.add(question)
        db.session.commit()

    @staticmethod
    def get_all_questions():
        question_schema = QuestionSchema(many=True)
        questions = Question.query.all()
        return question_schema.dump(questions).data
    
    @staticmethod
    def delete_question(question_id):
        question = Question.query.filter_by(id=question_id).first()
        if question:
            db.session.delete(question)
            db.session.commit()
            return True
        else:
            return False

    @staticmethod
    def update_question(req, question_id):
        if req['question']:
            question = Question.query.filter_by(id=question_id).update(dict(req))
            if question == 0:
                return False
            db.session.commit()
            return True


class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interviewID = db.Column(db.Integer, db.ForeignKey('interview.id'))
    questionID = db.Column(db.Integer, db.ForeignKey('question.id'))
    question = db.relationship(Question, uselist=False)
    interview = db.relationship('Interview', uselist=False)
    answer = db.Column(db.String(150), nullable=True)

    @staticmethod
    def insert_into(req):
        answer = Answer(interviewID=req['interviewID'],
                          questionID=req['questionID'], question=req['question'],
                          interview=req['interview'], answer=req['answer'])
        db.session.add(answer)
        db.session.commit()

def myFunc(e):
    return e.id

class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    DoctorID = db.Column(db.Integer, db.ForeignKey(User.id))
    PatientID = db.Column(db.Integer, db.ForeignKey(Patient.id))
    creationTimestamp = db.Column(db.DateTime,  default=datetime.utcnow)
    lastActionTimestamp = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.String(30))
    
    # define relationships
    sender = db.relationship(User, foreign_keys=[DoctorID], backref='sent_interviews')
    receiver = db.relationship(Patient, foreign_keys=[PatientID], backref='received_interviews')
    questions = db.relationship('Answer')

    def __repr__(self):
        return f"Interview('{self.DoctorID}, '{self.PatientID}', '{self.creationTimestamp}', '{self.lastActionTimestamp}', '{self.sender}',  '{self.receiver}')"

    def get_interviews_of_user(user_id, interview_id=None):
        user = User.query.filter_by(id=user_id).first()
        if interview_id:
            interview_schema = InterviewSchema()
            return interview_schema.dump(Interview.query.filter_by(id=interview_id, DoctorID=user_id).first()).data
        else:
            interview_schema = InterviewSchema(many=True)
            interviews = interview_schema.dump(user.sent_interviews).data
            return interviews
        return False
    
    def get_interviews_of_patient(patient_id, interview_id=None):
        if interview_id:
            interview_schema = InterviewSchema()
            return interview_schema.dump(Interview.query.filter_by(id=interview_id, PatientID=patient_id).first()).data
        else:
            interview_schema = InterviewSchema(many=True)
            interviews = interview_schema.dump(patient.received_interviews).data
            return interviews

    @staticmethod
    def insert_into(doctor_id, req):
        """
           request =  {"PatientID": 4, "questions":[1, 2, 3, 4]}
        """
        doctor = User.query.filter_by(id=doctor_id).first()
        if doctor:
            interview = Interview(DoctorID=doctor_id, PatientID=req['PatientID'], status='Sent')
            for qid in req['questions']:
                q = (Question.query.get(qid))
                interview.questions.append(Answer(interview=interview, question=q))
            db.session.add(interview)
            db.session.commit()
            return True, interview.id
        return False

    def answer_interview(patient_id, interview_id, req):
        interview_schema = InterviewSchema()
        interview = Interview.query.filter_by(id=interview_id, PatientID=patient_id).first()
        interview.status = 'Answered'
        interview_answers = interview.questions
        patient_answers = req['Answers']
        for answer in interview_answers:
            for pat_ans in patient_answers:
                if answer.question.id == pat_ans['questionID']:
                    answer.answer = pat_ans['answer']
        db.session.commit()
        return True

    def update_interview(user_id, interview_id, req):
        user = User.query.filter_by(id=user_id).first()
        interview = Interview.query.filter_by(id=interview_id, DoctorID=user_id)
        if interview:
            updated = Interview.query.filter_by(id=interview_id).update(dict(req))
            db.session.commit()
            return True
        return False

    def delete_interview(doctor_id, interview_id):
        user = User.query.filter_by(id=doctor_id).first()
        if user.roleID == Role.get_id_by_role('Admin'):
             interview = Interview.query.filter_by(id=interview_id).first()
        else:
            interview = Interview.query.filter_by(id=interview_id, DoctorID=doctor_id).first()   
        if interview:
            db.session.delete(interview)
            db.session.commit()
            return True
        return False


#Marshmallow Schemas
class RoleSchema(ma.ModelSchema):
    class Meta:
        model = Role

class UserSchema(ma.ModelSchema):
    class Meta:
        model = User
    role = fields.Nested(RoleSchema, only=['name'])

class PatientSchema(ma.ModelSchema):
    class Meta:
        model = Patient
    doctor = fields.Nested(UserSchema, only=['id', 'firstName', 'lastName'])

class QuestionSchema(ma.ModelSchema):
    class Meta:
        model = Question


class AnswerSchema(ma.ModelSchema):
    class Meta:
        model = Answer
    question = fields.Nested(QuestionSchema)


class InterviewSchema(ma.ModelSchema):
    class Meta:
        model = Interview
    sender = fields.Nested(UserSchema, only=['id', 'firstName', 'lastName'])
    receiver = fields.Nested(PatientSchema, only=['id', 'firstName', 'lastName'])
    questions = fields.Nested(AnswerSchema, many=True, only=['answer', 'question'])
