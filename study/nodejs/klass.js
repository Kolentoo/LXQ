var student = require('./student');
var teacher = require('./teacher');

function add(teacherName, studentName) {
    teacher.addTeacher(teacherName);
    student.addStudent(studentName);
}

exports.add = add;