from app.extensions import db
from app.models.user import User
from app.models.department import Department
from app.models.facility import Facility
from app.models.subject import Subject
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.timetable import TimetableEntry
from app.models.notice import Notice


def seed():
    """Seed the database with test data."""

    # ── 1. Admin ──────────────────────────────────────────────
    admin = User.query.filter_by(email='admin@campus.com').first()
    if not admin:
        admin = User(email='admin@campus.com', full_name='System Admin', role='admin', phone='9000000001')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.flush()

    # ── 2. Departments ────────────────────────────────────────
    depts_data = [
        ('Computer Science & Engineering', 'CSE', 'Core branch covering software, AI, and systems'),
        ('Electronics & Communication', 'ECE', 'Circuits, signals, and communication systems'),
        ('Mechanical Engineering', 'ME', 'Thermodynamics, manufacturing, and design'),
        ('Civil Engineering', 'CE', 'Structures, construction, and environmental engineering'),
        ('Electrical & Electronics', 'EEE', 'Power systems and electrical machines'),
    ]
    dept_map = {}
    for name, code, desc in depts_data:
        d = Department.query.filter_by(code=code).first()
        if not d:
            d = Department(name=name, code=code, description=desc)
            db.session.add(d)
            db.session.flush()
        dept_map[code] = d

    # ── 3. Faculty ────────────────────────────────────────────
    faculty_data = [
        ('rajesh.kumar@campus.com', 'Dr. Rajesh Kumar', 'FAC001', 'CSE', 'Professor', 'Ph.D Computer Science', 'Machine Learning'),
        ('priya.sharma@campus.com', 'Dr. Priya Sharma', 'FAC002', 'CSE', 'Associate Professor', 'Ph.D Software Engineering', 'Cloud Computing'),
        ('anil.reddy@campus.com', 'Dr. Anil Reddy', 'FAC003', 'ECE', 'Professor', 'Ph.D Electronics', 'VLSI Design'),
        ('meena.iyer@campus.com', 'Prof. Meena Iyer', 'FAC004', 'ME', 'Assistant Professor', 'M.Tech Thermal', 'Heat Transfer'),
        ('vijay.nair@campus.com', 'Dr. Vijay Nair', 'FAC005', 'CE', 'Professor', 'Ph.D Structural', 'Earthquake Engineering'),
        ('deepa.menon@campus.com', 'Prof. Deepa Menon', 'FAC006', 'EEE', 'Associate Professor', 'M.Tech Power Systems', 'Smart Grids'),
    ]
    fac_map = {}
    for email, name, emp_id, dept_code, desig, qual, spec in faculty_data:
        u = User.query.filter_by(email=email).first()
        if not u:
            u = User(email=email, full_name=name, role='faculty', phone='9876500000')
            u.set_password('faculty123')
            db.session.add(u)
            db.session.flush()
            f = Faculty(user_id=u.id, employee_id=emp_id, department_id=dept_map[dept_code].id,
                        designation=desig, qualification=qual, specialization=spec)
            db.session.add(f)
            db.session.flush()
            fac_map[emp_id] = f
        else:
            f = Faculty.query.filter_by(employee_id=emp_id).first()
            if f:
                fac_map[emp_id] = f

    # ── 4. Subjects ───────────────────────────────────────────
    subjects_data = [
        ('CS201', 'Data Structures & Algorithms', 'CSE', 3, 4, 'FAC001'),
        ('CS202', 'Operating Systems', 'CSE', 4, 3, 'FAC002'),
        ('CS203', 'Database Management Systems', 'CSE', 3, 4, 'FAC001'),
        ('CS301', 'Computer Networks', 'CSE', 5, 3, 'FAC002'),
        ('EC201', 'Digital Electronics', 'ECE', 3, 3, 'FAC003'),
        ('EC202', 'Signals & Systems', 'ECE', 4, 4, 'FAC003'),
        ('ME201', 'Thermodynamics', 'ME', 3, 4, 'FAC004'),
        ('CE201', 'Structural Analysis', 'CE', 5, 3, 'FAC005'),
        ('EE201', 'Electrical Machines', 'EEE', 3, 4, 'FAC006'),
    ]
    subj_map = {}
    for code, name, dept_code, sem, credits, fac_key in subjects_data:
        s = Subject.query.filter_by(code=code).first()
        if not s:
            fac = fac_map.get(fac_key)
            s = Subject(code=code, name=name, department_id=dept_map[dept_code].id,
                        semester=sem, credits=credits, faculty_id=fac.id if fac else None)
            db.session.add(s)
            db.session.flush()
        subj_map[code] = s

    # ── 5. Students ───────────────────────────────────────────
    students_data = [
        ('rahul.verma@campus.com', 'Rahul Verma', '22CSE001', 'CSE', 3, 'A', 2022),
        ('sneha.patil@campus.com', 'Sneha Patil', '22CSE002', 'CSE', 3, 'A', 2022),
        ('arjun.das@campus.com', 'Arjun Das', '22CSE003', 'CSE', 3, 'B', 2022),
        ('divya.raj@campus.com', 'Divya Raj', '22CSE004', 'CSE', 4, 'A', 2022),
        ('kiran.mohan@campus.com', 'Kiran Mohan', '22CSE005', 'CSE', 5, 'A', 2022),
        ('ananya.sen@campus.com', 'Ananya Sen', '22ECE001', 'ECE', 3, 'A', 2022),
        ('rohan.pillai@campus.com', 'Rohan Pillai', '22ECE002', 'ECE', 4, 'A', 2022),
        ('lakshmi.nair@campus.com', 'Lakshmi Nair', '22ME001', 'ME', 3, 'A', 2022),
        ('aditya.singh@campus.com', 'Aditya Singh', '22CE001', 'CE', 5, 'A', 2022),
        ('pooja.menon@campus.com', 'Pooja Menon', '22EEE001', 'EEE', 3, 'A', 2022),
        ('vikram.shah@campus.com', 'Vikram Shah', '23CSE001', 'CSE', 3, 'A', 2023),
        ('nisha.thomas@campus.com', 'Nisha Thomas', '23CSE002', 'CSE', 3, 'A', 2023),
    ]
    for email, name, roll, dept_code, sem, sec, year in students_data:
        if not User.query.filter_by(email=email).first():
            u = User(email=email, full_name=name, role='student', phone='9800000000')
            u.set_password('student123')
            db.session.add(u)
            db.session.flush()
            st = Student(user_id=u.id, roll_number=roll, department_id=dept_map[dept_code].id,
                         semester=sem, section=sec, admission_year=year)
            db.session.add(st)

    # ── 6. Facilities ─────────────────────────────────────────
    facilities_data = [
        ('Computer Lab 1', 'lab', 60, 'Block A, Floor 2', 'High-performance workstations with GPU support'),
        ('Computer Lab 2', 'lab', 40, 'Block A, Floor 3', 'Networking and security lab'),
        ('Seminar Hall', 'seminar_room', 200, 'Block B, Floor 1', 'Projector, PA system, and AC'),
        ('Main Auditorium', 'hall', 500, 'Main Building', 'Events, conferences, and guest lectures'),
        ('Sports Complex', 'sports', 300, 'Campus Ground', 'Indoor and outdoor sports facilities'),
        ('Library Reading Hall', 'hall', 150, 'Library Block', 'Quiet zone with digital resources'),
        ('Electronics Lab', 'lab', 30, 'Block C, Floor 1', 'Circuit design and testing equipment'),
    ]
    for name, ftype, cap, loc, desc in facilities_data:
        if not Facility.query.filter_by(name=name).first():
            db.session.add(Facility(name=name, type=ftype, capacity=cap, location=loc, description=desc))

    # ── 7. Timetable ──────────────────────────────────────────
    if not TimetableEntry.query.first():
        cs201 = subj_map.get('CS201')
        cs202 = subj_map.get('CS202')
        cs203 = subj_map.get('CS203')
        cs301 = subj_map.get('CS301')
        ec201 = subj_map.get('EC201')
        me201 = subj_map.get('ME201')
        ee201 = subj_map.get('EE201')
        fac001 = fac_map.get('FAC001')
        fac002 = fac_map.get('FAC002')
        fac003 = fac_map.get('FAC003')
        fac004 = fac_map.get('FAC004')
        fac006 = fac_map.get('FAC006')

        tt_entries = []
        # CSE Sem 3 Sec A - Monday, Wednesday, Friday
        if cs201 and fac001:
            tt_entries += [
                TimetableEntry(subject_id=cs201.id, faculty_id=fac001.id, department_id=dept_map['CSE'].id,
                               semester=3, section='A', day_of_week=0, start_time='09:00', end_time='10:00', room='CR-101'),
                TimetableEntry(subject_id=cs201.id, faculty_id=fac001.id, department_id=dept_map['CSE'].id,
                               semester=3, section='A', day_of_week=2, start_time='09:00', end_time='10:00', room='CR-101'),
            ]
        if cs203 and fac001:
            tt_entries += [
                TimetableEntry(subject_id=cs203.id, faculty_id=fac001.id, department_id=dept_map['CSE'].id,
                               semester=3, section='A', day_of_week=1, start_time='10:00', end_time='11:00', room='CR-102'),
                TimetableEntry(subject_id=cs203.id, faculty_id=fac001.id, department_id=dept_map['CSE'].id,
                               semester=3, section='A', day_of_week=4, start_time='10:00', end_time='11:00', room='CR-102'),
            ]
        # CSE Sem 4 Sec A
        if cs202 and fac002:
            tt_entries += [
                TimetableEntry(subject_id=cs202.id, faculty_id=fac002.id, department_id=dept_map['CSE'].id,
                               semester=4, section='A', day_of_week=1, start_time='11:00', end_time='12:00', room='CR-201'),
                TimetableEntry(subject_id=cs202.id, faculty_id=fac002.id, department_id=dept_map['CSE'].id,
                               semester=4, section='A', day_of_week=3, start_time='11:00', end_time='12:00', room='CR-201'),
            ]
        # CSE Sem 5 Sec A
        if cs301 and fac002:
            tt_entries.append(
                TimetableEntry(subject_id=cs301.id, faculty_id=fac002.id, department_id=dept_map['CSE'].id,
                               semester=5, section='A', day_of_week=0, start_time='14:00', end_time='15:00', room='CR-301'),
            )
        # ECE Sem 3 Sec A
        if ec201 and fac003:
            tt_entries += [
                TimetableEntry(subject_id=ec201.id, faculty_id=fac003.id, department_id=dept_map['ECE'].id,
                               semester=3, section='A', day_of_week=0, start_time='10:00', end_time='11:00', room='EC-101'),
                TimetableEntry(subject_id=ec201.id, faculty_id=fac003.id, department_id=dept_map['ECE'].id,
                               semester=3, section='A', day_of_week=3, start_time='09:00', end_time='10:00', room='EC-101'),
            ]
        # ME Sem 3
        if me201 and fac004:
            tt_entries.append(
                TimetableEntry(subject_id=me201.id, faculty_id=fac004.id, department_id=dept_map['ME'].id,
                               semester=3, section='A', day_of_week=2, start_time='11:00', end_time='12:00', room='ME-101'),
            )
        # EEE Sem 3
        if ee201 and fac006:
            tt_entries.append(
                TimetableEntry(subject_id=ee201.id, faculty_id=fac006.id, department_id=dept_map['EEE'].id,
                               semester=3, section='A', day_of_week=4, start_time='09:00', end_time='10:00', room='EE-101'),
            )
        for e in tt_entries:
            db.session.add(e)

    # ── 8. Notices ────────────────────────────────────────────
    if not Notice.query.first():
        notices = [
            Notice(title='Welcome to NextGen Campus!',
                   content='The NextGen Campus Management System is now live. All students and faculty are requested to update their profiles and check their schedules.',
                   category='general', target_role='all', author_id=admin.id, is_pinned=True),
            Notice(title='Mid-Semester Exam Schedule Released',
                   content='Mid-semester examinations will begin from April 15th. Detailed timetable has been uploaded to the portal.',
                   category='exam', target_role='all', author_id=admin.id, is_pinned=True),
            Notice(title='Annual Sports Day Registration',
                   content='Register for the annual sports day events before March 30th. Contact the sports department for details.',
                   category='event', target_role='student', author_id=admin.id, is_pinned=False),
            Notice(title='Faculty Development Programme',
                   content='A 3-day FDP on "AI in Education" will be held from April 5-7 in the Seminar Hall. All faculty members are encouraged to attend.',
                   category='academic', target_role='faculty', author_id=admin.id, is_pinned=False),
            Notice(title='Library New Arrivals',
                   content='Over 200 new books and journals have been added to the library. Visit the library portal for the complete catalogue.',
                   category='general', target_role='all', author_id=admin.id, is_pinned=False),
        ]
        for n in notices:
            db.session.add(n)

    db.session.commit()
    print('✅ Test data seeded successfully!')
