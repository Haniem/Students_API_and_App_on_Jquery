const $container = $(".container");
const $studentsTableBody = $(".studentsTable__tbody");
const $addStudentForm = $(".addStudent__form");
const $addStudentFormButton = $(".addStudent__form__button");
const $pageSizeInput = $("#pageSize");
const $paginationContainer = $("#pagination");

let students = [];
let currentPage = 1;
let pageSize = parseInt($pageSizeInput.val());

function renderStudents(studentsPage) {
    $studentsTableBody.empty();

    studentsPage.forEach((student) => {
        const $tr = $("<tr>").addClass("studentsTable__tr");
        $("<td>").addClass("studentsTable__td").text(student.firstName).appendTo($tr);
        $("<td>").addClass("studentsTable__td").text(student.lastName).appendTo($tr);
        $("<td>").addClass("studentsTable__td").text(student.middleName).appendTo($tr);
        $("<td>").addClass("studentsTable__td").text(new Date(student.dateOfBirth).toLocaleDateString("ru-RU")).appendTo($tr);
        $("<td>").addClass("studentsTable__td").text(student.group).appendTo($tr);

        const $delBtn = $("<button>")
            .addClass("btn btn-danger delBtn")
            .text("Удалить")
            .on("click", () => {
                $tr.remove();
                postData(`https://localhost:7147/api/Students/${student.id}`);
            });

        $("<td>").addClass("studentsTable__td").append($delBtn).appendTo($tr);
        $studentsTableBody.append($tr);
    });
}

function paginateStudents(students) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    return students.slice(startIndex, endIndex);
}

function renderPaginationControls() {
    const totalPages = Math.ceil(students.length / pageSize);
    $paginationContainer.empty();

    const $paginationList = $("<ul>").addClass("pagination justify-content-center");

    $("<li>")
        .addClass(`page-item ${currentPage === 1 ? "disabled" : ""}`)
        .append($("<a>").addClass("page-link").attr("href", "#").text("Предыдущая").on("click", () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        }))
        .appendTo($paginationList);

    for (let i = 1; i <= totalPages; i++) {
        $("<li>")
            .addClass(`page-item ${i === currentPage ? "active" : ""}`)
            .append($("<a>").addClass("page-link").attr("href", "#").text(i).on("click", () => {
                currentPage = i;
                updatePagination();
            }))
            .appendTo($paginationList);
    }

    $("<li>")
        .addClass(`page-item ${currentPage === totalPages ? "disabled" : ""}`)
        .append($("<a>").addClass("page-link").attr("href", "#").text("Следующая").on("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        }))
        .appendTo($paginationList);

    $paginationContainer.append($paginationList);
}

function updatePagination() {
    const studentsPage = paginateStudents(students);
    renderStudents(studentsPage);
    renderPaginationControls();
}

function fetchStudents() {
    $.get("https://localhost:7147/api/Students")
        .done((data) => {
            students = data;
            updatePagination();
            checkStudents();
        })
        .fail((jqXHR) => {
            console.error("Ошибка при получении данных студентов:", jqXHR.statusText);
        });
}

$pageSizeInput.on("input", (event) => {
    pageSize = parseInt($(event.target).val());
    currentPage = 1;
    updatePagination();
});

function postData(url) {
    $.ajax({
        url,
        method: "DELETE",
    }).fail((jqXHR) => {
        console.error("Ошибка при удалении студента:", jqXHR.statusText);
    });
}

function checkStudents() {
    const $noStudentsElement = $(".alert__noStudents");

    if (students.length > 0) {
        $noStudentsElement.remove();
    } else if (!$noStudentsElement.length) {
        $("<h1>")
            .addClass("alert__noStudents")
            .text("Ни одного студента не найдено")
            .insertBefore($paginationContainer);
    }
}

$addStudentFormButton.on("click", (event) => {
    event.preventDefault();

    const formData = $addStudentForm.serializeArray();
    const student = {};

    formData.forEach(({ name, value }) => {
        student[name] = name === "DateOfBirth" ? new Date(value).toISOString() : value;
    });

    if (Object.values(student).some((val) => !val)) {
        alert("Заполните все поля");
        return;
    }

    $.post({
        url: "https://localhost:7147/api/Students",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(student),
    }).fail((jqXHR) => {
        console.error("Ошибка при создании студента:", jqXHR.statusText);
    });
});

setInterval(fetchStudents, 1000);
