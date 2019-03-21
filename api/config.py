DOCTORS_TABLE = 'doctors'
PATIENTS_TABLE = 'patients'
MEDS_TABLE = 'meds'


class BaseConfig(object):
    CSRF_ENABLED = True
    DEBUG = False
    SECRET_KEY = 'bb42809cf4b5e2cb8d849e3c04e3da05'
    SQLALCHEMY_DATABASE_URI = 'postgres://afholrwztpxnma:ef36a6db46b2719907b57f7199ec233528e6c37c043be5a7c68ffc7eb9a8d98e@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d7e9pq49mcs352'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'productionDB'

class DevConfig(BaseConfig):
    DEBUG = True