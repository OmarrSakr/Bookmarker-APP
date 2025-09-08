"use strict";

// ^ ======================> global variables
const firstInputElement = $("#bookmarkName")[0];
const secondInputElement = $("#bookmarkURL")[0];
let editIndex = -1; // متغير لتحديد الإشارة قيد التعديل
let bookmarks = JSON.parse(localStorage.getItem("bookmarksList")) || [];

// *================================================> side-nav <=============================================
$("#btnMode").on("click", () => {
    let mode = $("body").attr("data-bs-theme");
    if (mode === "light") {
        $("body").attr("data-bs-theme", "dark");
        $("#btnMode span").html(`<i class="icon-sun"></i>`);
        localStorage.setItem("themeMode", "dark");
    } else {
        $("body").attr("data-bs-theme", "light");
        $("#btnMode span").html(`<i class="icon-moon-o"></i>`);
        localStorage.setItem("themeMode", "light");
    }
});

// تحميل الوضع المحفوظ عند تحميل الصفحة
$(() => {
    let savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
        $("body").attr("data-bs-theme", savedMode);
        $("#btnMode span").html(savedMode === "light" ? `<i class="icon-moon-o"></i>` : `<i class="icon-sun"></i>`);
    }
});

// *===================================================> Function Inputs <====================================================
// ?========================================> alert messages <===============================
const messagesAlert = {
    en: {
        msgErrorObj: {
            icon: "error",
            title: "Oops...",
            html: `
            <h3 class="fs-5 py-3 fw-bold text-dark">Site Name or URL is not valid, Please follow the rules below 👇:</h3>
            <ul class="text-start fw-semibold">
                <li><i class="icon-angle-double-right text-danger"></i> The Site Name must contain at least 3 characters.</li>
                <li><i class="icon-angle-double-right text-danger"></i> The Site URL must be valid (e.g., icomoon.io or https://example.com).</li>
            </ul>`
        },
        msgSuccessObj: {
            title: "Great work!",
            text: "You've successfully added a bookmark.",
            icon: "success",
            timer: 1000
        },
        msgConfirmObj: {
            title: "Are you sure?",
            text: "You are about to delete this website. This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel"
        },
        msgDeleteObj: {
            title: "Deleted!",
            text: "Your site has been deleted.",
            icon: "success",
            timer: 1000
        },
        msgEditObj: {
            title: "Are you sure?",
            text: "You are about to save changes for this bookmark.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save changes!",
            cancelButtonText: "No, cancel"
        },
        msgSuccessEditObj: {
            icon: "success",
            title: "Successfully Updated!",
            text: "The bookmark changes have been saved.",
            showConfirmButton: false,
            timer: 1000
        }
    },
    ar: {
        msgErrorObj: {
            icon: "error",
            title: "عفوًا...",
            html: `
            <h3 class="fs-5 py-3 fw-bold text-dark">اسم الموقع أو الرابط غير صالح:</h3>
            <ul class="text-start fw-semibold">
                <li><i class="icon-angle-double-right text-danger"></i> يجب أن يحتوي اسم الموقع على 3 أحرف على الأقل.</li>
                <li><i class="icon-angle-double-right text-danger"></i> يجب أن يكون الرابط صالحًا (مثال: icomoon.io أو https://example.com).</li>
            </ul>`
        },
        msgSuccessObj: {
            title: "عمل رائع!",
            text: "تمت إضافة الإشارة المرجعية بنجاح.",
            icon: "success",
            timer: 1000
        },
        msgConfirmObj: {
            title: "هل أنت متأكد؟",
            text: "أنت على وشك حذف هذا الموقع. هذا الإجراء لا يمكن التراجع عنه.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم، احذفه!",
            cancelButtonText: "لا، إلغاء"
        },
        msgDeleteObj: {
            title: "تم الحذف!",
            text: "تم حذف موقعك.",
            icon: "success",
            timer: 1000
        },
        msgEditObj: {
            title: "هل أنت متأكد؟",
            text: "أنت على وشك حفظ التغييرات في هذه الإشارة المرجعية.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم، احفظ التغييرات!",
            cancelButtonText: "لا، إلغاء"
        },
        msgSuccessEditObj: {
            icon: "success",
            title: "تم التحديث بنجاح!",
            text: "تم حفظ تغييرات الإشارة المرجعية.",
            showConfirmButton: false,
            timer: 1000
        }
    }
};

// تحديد اللغة حسب لغة الجهاز
const userLang = navigator.language || navigator.userLanguage;
const msgLang = userLang.startsWith("ar") ? "ar" : "en";
const selectedMessages = messagesAlert[msgLang];

// ?=====================================================> Event Inputs <=====================================
function uNameValidation(uName) {
    const uNamePattern = /^[\w\s\p{L}'@#_,.\-/|!$&^%+=><()*?\\؟]{3,}$/u;
    const valid = uNamePattern.test(uName);
    if (valid) {
        firstInputElement.classList.add("is-valid");
        firstInputElement.classList.remove("is-invalid");
        return true;
    } else {
        firstInputElement.classList.add("is-invalid");
        firstInputElement.classList.remove("is-valid");
        return false;
    }
}

function UrlValidation(Url) {
    Url = Url.trim();
    // Regex مرن يقبل أي نص يشبه رابط (بدون اشتراط بروتوكول)
const URLpattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-z]{2,10}(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/;
    const valid = URLpattern.test(Url);

    if (valid) {
        secondInputElement.classList.add("is-valid");
        secondInputElement.classList.remove("is-invalid");
        return true;
    } else {
        secondInputElement.classList.add("is-invalid");
        secondInputElement.classList.remove("is-valid");
        return false;
    }
}

function clearInput() {
    $("#bookmarkName").val("");
    $("#bookmarkURL").val("");
    firstInputElement.classList.remove("is-invalid", "is-valid");
    secondInputElement.classList.remove("is-invalid", "is-valid");
}

// التحقق الفوري
$("#bookmarkURL").on("input", () => {
    const url = $("#bookmarkURL").val().trim();
    if (url === "") {
        secondInputElement.classList.remove("is-valid", "is-invalid");
        return;
    }
    UrlValidation(url);
});

$("#bookmarkName").on("input", () => {
    const uName = $("#bookmarkName").val().trim();
    if (uName === "") {
        firstInputElement.classList.remove("is-valid", "is-invalid");
        return;
    }
    uNameValidation(uName);
});

// Submit Button
$("#submitBtn").on("click", () => {
    const uName = $("#bookmarkName").val().trim();
    let url = $("#bookmarkURL").val().trim();


    // إضافة https:// إذا لم يكن موجودًا (للتخزين فقط)
    if (!url.match(/^https?:\/\//)) {
        url = 'https://' + url;
    }

    // التحقق من المدخلات
    const isNameValid = uNameValidation(uName);
    const isUrlValid = UrlValidation($("#bookmarkURL").val().trim()); // التحقق من الرابط الأصلي بدون https://

    if (!isNameValid || !isUrlValid) {
        console.log("Validation failed, Name valid:", isNameValid, "URL valid:", isUrlValid); // للتصحيح
        Swal.fire(selectedMessages['msgErrorObj']);
        if (!isNameValid) firstInputElement.classList.add("is-invalid");
        if (!isUrlValid) secondInputElement.classList.add("is-invalid");
        return; // إيقاف التنفيذ لو التحقق فشل
    }

    // تحديث حقل الـ input بالرابط المنظف
    $("#bookmarkURL").val(url);

    // إذا كان في وضع التعديل
    if (editIndex !== -1) {
        Swal.fire(selectedMessages['msgEditObj']).then((result) => {
            if (result.isConfirmed) {
                bookmarks[editIndex].firstInputElement = uName;
                bookmarks[editIndex].secondInputElement = url;
                setLocalstorage();
                renderBookmarks();
                clearInput();
                editIndex = -1;
                $("#submitBtn").text(msgLang === "ar" ? "إرسال" : "Submit");
                $("#cancelBtn").hide();
                Swal.fire(selectedMessages['msgSuccessEditObj']);
            } else if (result.isDismissed) {
                clearInput();
                editIndex = -1;
                $("#submitBtn").text(msgLang === "ar" ? "إرسال" : "Submit");
                $("#cancelBtn").hide();
            }
        });
    } else {
        // إضافة رابط جديد
        const bookmarkObj = { firstInputElement: uName, secondInputElement: url };
        bookmarks.push(bookmarkObj);
        setLocalstorage();
        renderBookmarks();
        clearInput();
        $("#submitBtn").text(msgLang === "ar" ? "إرسال" : "Submit");
        $("#cancelBtn").hide();
        Swal.fire(selectedMessages['msgSuccessObj']);
    }
});

// *===================================================> Section Table <====================================================
// ?========================================> Search Input <===============================
function setLocalstorage() {
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
}

function renderBookmarks(bookmarksArray = bookmarks) {
    $('#tableSection').show();
    const tableContent = $('#tableContent');
    tableContent.empty();

    let contentTable = '';
    for (let i = 0; i < bookmarksArray.length; i++) {
        contentTable += `
            <tr>
                <td data-label="Index" class="fw-semibold">${i + 1}</td>
                <td data-label="Website Name" class="fw-semibold text-capitalize">${bookmarksArray[i].firstInputElement}</td>
                <td data-label="Visit">
                    <button class="btn btn-success btn-sm" onclick="visitBookmark('${bookmarksArray[i].secondInputElement}')">
                        <span class="icon-text"><i class="icon-eye1 pe-1 icon-btn"></i> <span class="responsive-text">Visit</span></span>
                    </button>
                </td>
                <td data-label="Edit">
                    <button class="btn btn-warning btn-sm text-white" onclick="editBookmark(${i})">
                        <span class="icon-text"><img src="./assets/Imgs/edit-pencil.svg" class="pe-1" style="width: 30px;">
                        <span class="responsive-text">Edit</span></span>
                    </button>
                </td>
                <td data-label="Delete">
                    <button class="btn btn-danger btn-sm" onclick="deleteBookmark(${i})">
                        <span class="icon-text"><i class="icon-bin pe-1 icon-btn"></i> <span class="responsive-text">Delete</span></span>
                    </button>
                </td>
            </tr>`;
    }
    tableContent.html(contentTable);
}

function deleteBookmark(index) {
    Swal.fire(selectedMessages['msgConfirmObj']).then((result) => {
        if (result.isConfirmed) {
            bookmarks.splice(index, 1);
            setLocalstorage();
            renderBookmarks();
            if (bookmarks.length < 1) {
                $('#tableSection').hide(300);
            }
            Swal.fire(selectedMessages['msgDeleteObj']);
        }
    });
}

function visitBookmark(url) {
    window.open(url, '_blank');
}

function editBookmark(index) {
    editIndex = index;
    $("#bookmarkName").val(bookmarks[index].firstInputElement);
    $("#bookmarkURL").val(bookmarks[index].secondInputElement);
    $("#bookmarkName")[0].scrollIntoView({ behavior: "smooth", block: "center" });
    $("#bookmarkName").focus();
    $("#submitBtn").text(msgLang === "ar" ? "حفظ التغييرات" : "Save Changes");
    $("#cancelBtn").show();
}

$("#cancelBtn").on("click", () => {
    clearInput();
    editIndex = -1;
    $("#submitBtn").text(msgLang === "ar" ? "إرسال" : "Submit");
    $("#cancelBtn").hide();
});

function searchByName(keyword) {
    const result = bookmarks.filter(bookmark => bookmark.firstInputElement.toLowerCase().includes(keyword.toLowerCase()));
    renderBookmarks(result);
}

$("#searchInput").on("input", () => {
    searchByName($("#searchInput").val());
});

$(() => {
    if (bookmarks && bookmarks.length > 0) {
        $("#tableContent").show();
        renderBookmarks();
    } else {
        $('#tableSection').hide();
    }
});

// * ==============================> convert text's sortButton
const lang = navigator.language || navigator.userLanguage;
const sortButton = document.getElementById('sortButton');

function setButtonText() {
    sortButton.textContent = lang.startsWith('ar') ? "تبديل الفرز بين الاسم" : "Toggle Sort by Name";
}

setButtonText();

// * ==============================> Sort Items in Form By Name
function toggleSort() {
    sortBookmarks('name');
}

function sortBookmarks(criteria) {
    if (criteria === "name") {
        bookmarks.sort((a, b) => {
            const lang = document.documentElement.lang || 'en';
            return lang.startsWith('ar') ?
                a.firstInputElement.localeCompare(b.firstInputElement, 'ar') :
                a.firstInputElement.localeCompare(b.firstInputElement, 'en');
        });
    }
    renderBookmarks();
}

// استدعاء أولي لعرض الإشارات المرجعية عند التحميل
renderBookmarks();

$(document).on("keydown", (event) => {
    if (event.key === "Enter") {
        setTimeout(() => {
            $("#submitBtn").click();
        }, 100);
    }

    if (event.key === "ArrowDown") {
        const focusedElement = $(':focus');
        if (focusedElement.is('#bookmarkName')) {
            $('#bookmarkURL').focus();
        } else if (focusedElement.is('#bookmarkURL')) {
            $('#submitBtn').focus();
        }
    }

    if (event.key === "ArrowUp") {
        const focusedElement = $(':focus');
        if (focusedElement.is('#bookmarkURL')) {
            $('#bookmarkName').focus();
        } else if (focusedElement.is('#submitBtn')) {
            $('#bookmarkURL').focus();
        }
    }
});

// Back to Top Button
$(window).on("scroll", () => {
    if ($(window).scrollTop() > 200) {
        $("#back-to-top").addClass("visible");
    } else {
        $("#back-to-top").removeClass("visible");
    }
});

$("#back-to-top").on("click", () => {
    $("html, body").animate({ scrollTop: 0 }, "smooth");
});