var apiUrl = "http://localhost:3000";

var studentSelect = document.getElementById("studentSelect");
var courseSelect = document.getElementById("courseSelect");
var studentCoursesList = document.getElementById("studentCoursesList");
var courseStudentsList = document.getElementById("courseStudentsList");

var users = [], courses = [], enrollments = [];

function loadData() {
  Promise.all([
    fetch(apiUrl + "/Users").then(function (res) { return res.json(); }),
    fetch(apiUrl + "/Courses").then(function (res) { return res.json(); }),
    fetch(apiUrl + "/Enrollments").then(function (res) { return res.json(); })
  ]).then(function (data) {
    users = data[0].filter(function (u) { return u.usertype === "student"; });
    courses = data[1];
    enrollments = data[2];

    populateSelect(studentSelect, users, "id", "name", "-- Select Student --");
    populateSelect(courseSelect, courses, "id", "coursename", "-- Select Course --");
  }).catch(function (err) {
    alert("Error loading data.");
    console.error(err);
  });
}

function populateSelect(selectElement, items, valueKey, textKey, defaultText) {
  selectElement.innerHTML = '<option value="">' + defaultText + '</option>';
  items.forEach(function (item) {
    selectElement.innerHTML += '<option value="' + item[valueKey] + '">' + item[textKey] + '</option>';
  });
}

function showCoursesForStudent() {
  var userId = studentSelect.value;
  studentCoursesList.innerHTML = "";

  if (!userId) {
    alert("Please select a student!");
    return;
  }

  var userEnrollments = enrollments.filter(function (e) { return e.userid == userId; });
  var courseNames = userEnrollments.map(function (e) {
    var course = courses.find(function (c) { return c.id == e.courseid; });
    return course ? course.coursename : null;
  }).filter(Boolean);

  renderList(studentCoursesList, courseNames, "No courses found for this student.");
}

function showStudentsForCourse() {
  var courseId = courseSelect.value;
  courseStudentsList.innerHTML = "";

  if (!courseId) {
    alert("Please select a course!");
    return;
  }

  var courseEnrollments = enrollments.filter(function (e) { return e.courseid == courseId; });
  var studentNames = courseEnrollments.map(function (e) {
    var user = users.find(function (u) { return u.id == e.userid; });
    return user ? user.name : null;
  }).filter(Boolean);

  renderList(courseStudentsList, studentNames, "No students enrolled for this course.");
}

function renderList(listElement, items, emptyMessage) {
  if (items.length === 0) {
    listElement.innerHTML = '<li class="list-group-item text-danger">' + emptyMessage + '</li>';
  } else {
    listElement.innerHTML = items.map(function (name) {
      return '<li class="list-group-item">' + name + '</li>';
    }).join('');
  }
}

loadData();
  
