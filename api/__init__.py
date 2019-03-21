from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from api.config import BaseConfig
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('api.config.DevConfig')
    app.app_context().push()
    db.init_app(app)

    from api.blueprints.main import main
    from api.blueprints.doctors import doctors_api
    from api.blueprints.patients import patients_api
    from api.blueprints.meds import meds_api
    # db.create_all()
    app.register_blueprint(doctors_api, url_prefix='/doctors')
    app.register_blueprint(patients_api, url_prefix='/patients')
    app.register_blueprint(meds_api, url_prefix='/meds')
    app.register_blueprint(main)

    return app
