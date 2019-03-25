from flask import Flask
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from api.config import BaseConfig
db = SQLAlchemy()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    app.config.from_object('api.config.DevConfig')
    app.app_context().push()
    db.init_app(app)
    ma.init_app(app)
    
    from api.blueprints.main import main
    from api.blueprints.doctors import doctors_api
    from api.blueprints.patients import patients_api
    from api.blueprints.questions import questions_api
    db.create_all()
    app.register_blueprint(doctors_api, url_prefix='/doctors')
    app.register_blueprint(patients_api, url_prefix='/patients')
    app.register_blueprint(questions_api, url_prefix='/questions')
    app.register_blueprint(main)

    return app
