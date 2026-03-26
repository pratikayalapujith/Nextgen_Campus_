from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models.timetable import TimetableEntry
from app.models.faculty import Faculty
from app.models.student import Student
from app.utils.decorators import role_required

timetable_bp = Blueprint('timetable', __name__, url_prefix='/api/timetable')


@timetable_bp.route('', methods=['GET'])
@jwt_required()
def list_timetable():
    department_id = request.args.get('department_id', type=int)
    semester = request.args.get('semester', type=int)
    section = request.args.get('section')
    faculty_id = request.args.get('faculty_id', type=int)

    query = TimetableEntry.query
    if department_id:
        query = query.filter(TimetableEntry.department_id == department_id)
    if semester:
        query = query.filter(TimetableEntry.semester == semester)
    if section:
        query = query.filter(TimetableEntry.section == section)
    if faculty_id:
        query = query.filter(TimetableEntry.faculty_id == faculty_id)

    entries = query.order_by(TimetableEntry.day_of_week, TimetableEntry.start_time).all()
    return jsonify(timetable=[e.to_dict() for e in entries])


@timetable_bp.route('/my', methods=['GET'])
@jwt_required()
def my_timetable():
    identity = int(get_jwt_identity())
    claims = get_jwt()

    if claims['role'] == 'faculty':
        fac = Faculty.query.filter_by(user_id=identity).first()
        if not fac:
            return jsonify(error='Faculty profile not found'), 404
        entries = TimetableEntry.query.filter_by(faculty_id=fac.id)\
            .order_by(TimetableEntry.day_of_week, TimetableEntry.start_time).all()
    elif claims['role'] == 'student':
        student = Student.query.filter_by(user_id=identity).first()
        if not student:
            return jsonify(error='Student profile not found'), 404
        query = TimetableEntry.query.filter_by(
            department_id=student.department_id,
            semester=student.semester,
        )
        if student.section:
            query = query.filter(
                db.or_(TimetableEntry.section == student.section, TimetableEntry.section.is_(None))
            )
        entries = query.order_by(TimetableEntry.day_of_week, TimetableEntry.start_time).all()
    else:
        entries = TimetableEntry.query.order_by(TimetableEntry.day_of_week, TimetableEntry.start_time).all()

    return jsonify(timetable=[e.to_dict() for e in entries])


@timetable_bp.route('', methods=['POST'])
@role_required('admin')
def create_entry():
    data = request.get_json()
    required = ['subject_id', 'faculty_id', 'department_id', 'semester', 'day_of_week', 'start_time', 'end_time']
    for field in required:
        if data.get(field) is None:
            return jsonify(error=f'{field} is required'), 400

    entry = TimetableEntry(
        subject_id=data['subject_id'],
        faculty_id=data['faculty_id'],
        department_id=data['department_id'],
        semester=data['semester'],
        section=data.get('section'),
        day_of_week=data['day_of_week'],
        start_time=data['start_time'],
        end_time=data['end_time'],
        room=data.get('room'),
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify(entry=entry.to_dict()), 201


@timetable_bp.route('/<int:entry_id>', methods=['PUT'])
@role_required('admin')
def update_entry(entry_id):
    entry = TimetableEntry.query.get_or_404(entry_id)
    data = request.get_json()

    for field in ['subject_id', 'faculty_id', 'department_id', 'semester', 'section', 'day_of_week', 'start_time', 'end_time', 'room']:
        if field in data:
            setattr(entry, field, data[field])

    db.session.commit()
    return jsonify(entry=entry.to_dict())


@timetable_bp.route('/<int:entry_id>', methods=['DELETE'])
@role_required('admin')
def delete_entry(entry_id):
    entry = TimetableEntry.query.get_or_404(entry_id)
    db.session.delete(entry)
    db.session.commit()
    return jsonify(message='Timetable entry deleted successfully')
