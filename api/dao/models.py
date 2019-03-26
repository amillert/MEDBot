from api import db, ma
from marshmallow import fields
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

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
    
    def __repr__(self):
        return f"User('{self.email}, '{self.firstName}', '{self.lastName}', {self.role})"

    def insert_into(req, role):
        if role == 'Patient':
            user = User(email=req['email'], firstName=req['firstName'], lastName=req['lastName'], roleID=Role.get_id_by_role(role))
            db.session.add(user)
            db.session.commit()
        else:
            hashed_password = generate_password_hash(req['password'], method='sha256')
            user = User(email=req['email'], password=hashed_password, firstName=req['firstName'], lastName=req['lastName'], roleID=Role.get_id_by_role(role))
            db.session.add(user)
            db.session.commit()

    def get_users_by_role(role, user_id=None):
        if not user_id:
            user_schema = UserSchema(many=True)
            return user_schema.dump(Role.query.filter_by(name=role).first().users).data
        else:
            user_schema = UserSchema()
            user = User.query.filter_by(id=user_id, roleID=Role.get_id_by_role(role)).first()
            return user_schema.dump(user).data

    def update_user(req, user_id, role):
        if req['password']:
            req['password'] = generate_password_hash(req['password'], method='sha256')
        user = User.query.filter_by(id=user_id, roleID=Role.get_id_by_role(role)).update(dict(req))
        if user == 0:
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
        print(questions)
        return question_schema.dump(questions).data
    

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


class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    DoctorID = db.Column(db.Integer, db.ForeignKey(User.id))
    PatientID = db.Column(db.Integer, db.ForeignKey(User.id))
    creationTimestamp = db.Column(db.DateTime,  default=datetime.utcnow)
    lastActionTimestamp = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # define relationships
    sender = db.relationship(User, foreign_keys=[DoctorID], backref='sent_interviews')
    receiver = db.relationship(User, foreign_keys=[PatientID], backref='received_interviews')
    questions = db.relationship('Answer')

    def __repr__(self):
        return f"Interview('{self.DoctorID}, '{self.PatientID}', '{self.creationTimestamp}', '{self.lastActionTimestamp}', '{self.sender}',  '{self.receiver}')"

    def get_interviews_of_user(user_id, interview_id=None):
        user = User.query.filter_by(id=user_id).first()
        if interview_id:
            if user.roleID == Role.get_id_by_role('Doctor'):
                interview_schema = InterviewSchema()
                return interview_schema.dump(Interview.query.filter_by(id=interview_id, DoctorID=user_id).first()).data
            elif user.roleID == Role.get_id_by_role('Patient'):
                interview_schema = InterviewSchema()
                return interview_schema.dump(Interview.query.filter_by(id=interview_id, PatientID=user_id).first()).data
        else:
            if user.roleID == Role.get_id_by_role('Doctor'):
                interview_schema = InterviewSchema(many=True)
                interviews = interview_schema.dump(user.sent_interviews).data
                return interviews
            elif user.roleID == Role.get_id_by_role('Patient'):
                interview_schema = InterviewSchema(many=True)
                interviews = interview_schema.dump(user.received_interviews).data
                return interviews
        return False
    
    @staticmethod
    def insert_into(doctor_id, req):
        """
           request =  {"PatientID": 4, "questions":[1, 2, 3, 4]}
        """
        doctor = User.query.filter_by(id=doctor_id, roleID=Role.get_id_by_role('Doctor')).first()
        if doctor:
            interview = Interview(DoctorID=doctor_id, PatientID=req['PatientID'])
            for qid in req['questions']:
                q = (Question.query.get(qid))
                interview.questions.append(Answer(interview=interview, question=q))
            db.session.add(interview)
            db.session.commit()
            return True
        return False

    def update_interview(user_id, interview_id, req):
        user = User.query.filter_by(id=user_id).first()
        if user.role.name == 'Doctor':
            interview = Interview.query.filter_by(id=interview_id, DoctorID=user_id)
            if interview:
                updated = Interview.query.filter_by(id=interview_id).update(dict(req))
                db.session.commit()
                return True
        if user.role.name == 'Patient':
            interview_schema = InterviewSchema()
            interview = Interview.query.filter_by(id=interview_id, PatientID=user_id).first()
            interview_answers = interview.questions
            patient_answers = req['Answers']
            for answer in interview_answers:
                for pat_ans in patient_answers:
                    if answer.question.id == pat_ans['questionID']:
                        answer.answer = pat_ans['answer']
            db.session.commit()
            return True
        return False

    def delete_interview(doctor_id, interview_id):
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
    receiver = fields.Nested(UserSchema, only=['id', 'firstName', 'lastName'])
    questions = fields.Nested(AnswerSchema, many=True, only=['answer', 'question'])

