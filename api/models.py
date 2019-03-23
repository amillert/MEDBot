from api import db


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

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(100), unique=True, nullable=False)


class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    answer = db.Column(db.String(100), nullable=True)


class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    DoctorID = db.Column(db.Integer, db.ForeignKey(User.id))
    PacientID = db.Column(db.Integer, db.ForeignKey(User.id))
    creationTimestamp = db.Column(db.DateTime,  default=db.func.current_timestamp())
    lastActionTimestamp = db.Column(db.DateTime,  default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # define relationships
    sender = db.relationship(User, foreign_keys=[DoctorID], backref='sent')
    receiver = db.relationship(User, foreign_keys=[PacientID], backref='received')


class IQALink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interviewID = db.Column(db.Integer, db.ForeignKey(Interview.id))
    questionID = db.Column(db.Integer, db.ForeignKey(Question.id))
    answerID = db.Column(db.Integer, db.ForeignKey(Answer.id))
