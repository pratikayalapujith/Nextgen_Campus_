from app.extensions import db
from datetime import datetime


class Department(db.Model):
    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(10), unique=True, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    students = db.relationship('Student', backref='department', lazy='dynamic')
    faculty_members = db.relationship('Faculty', backref='department', lazy='dynamic')
    subjects = db.relationship('Subject', backref='department', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'student_count': self.students.count() if self.students else 0,
            'faculty_count': self.faculty_members.count() if self.faculty_members else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
