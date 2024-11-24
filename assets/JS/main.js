"use strict";

// ^ ======================> global variables
const firstInputElement = $("#bookmarkName")[0];
const secondInputElement = $("#bookmarkURL")[0];

let editIndex = -1;  // متغير لتحديد الإشارة قيد التعديل for function editBookmark() in  Line 240

// *================================================> side-nav <=============================================


$("#btnMode").on("click", () => {
    let mode = $("body").attr("data-bs-theme");
    if (mode === "light") {
        $("body").attr("data-bs-theme", "dark");
        $("#btnMode span").html(`<i class="icon-sun"></i>`);
        localStorage.setItem("themeMode", "dark"); // حفظ الوضع في LocalStorage
    }
    else {
        $("body").attr("data-bs-theme", "light")
        $("#btnMode span").html(`<i class="icon-moon-o"></i>`);
        localStorage.setItem("themeMode", "light"); // حفظ الوضع في LocalStorage

    }
});
//? On page load, check if there's themeMode data in localStorage
$(() => {
    let savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
        $("body").attr("data-bs-theme", savedMode);
        if (savedMode === "light") {
            $("#btnMode span").html(`<i class="icon-moon-o"></i>`);
        } else {
            $("#btnMode span").html(`<i class="icon-sun"></i>`);
        }


    }
});

// *===================================================> Function Inputs <====================================================


// ?========================================> alert messages <===============================
const messagesAlert = {
    en: {
        msgErrorObj: {
            icon: "error",
            title: "Oops...",
            // text: "The Site Name or URL is not valid.",
            html:`
            <h3 class="fs-5 py-3 fw-bold text-dark"> Site Name or Url is not valid, Please follow the rules below 👇:</h3>
            `,
            footer: `<p class="text-start fw-semibold">
                <i class="icon-angle-double-right text-danger"></i> The Site Name must contain at least 3 characters and must not start with a space.
                <br>
                <i class="icon-angle-double-right text-danger"></i> The Site URL must be valid.</p>`
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
            cancelButtonText: 'No, cancel'
        },
        msgDeleteObj: {
            title: "Deleted!",
            text: "Your site has been deleted.",
            icon: "success",
            timer: 1000
        },
        msgEditObj: {
            title: 'Are you sure?',
            text: 'You are about to save changes for this bookmark.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save changes!',
            cancelButtonText: 'No, cancel'
        },
        msgSuccessEditObj: {
            icon: 'success',
            title: 'Successfully Updated!',
            text: 'The bookmark changes have been saved.',
            showConfirmButton: false,
            timer: 1000
        }
    },
    ar: {
        msgErrorObj: {
            icon: "error",
            title: "عفوًا...",
            text: "اسم الموقع أو عنوان الرابط غير صالح.",
            footer: `<p class="text-start fw-semibold">
                <i class="icon-angle-double-right text-danger"></i>يجب أن يحتوي اسم الموقع على 3 أحرف على الأقل ولا يجب أن يبدأ بمسافة.
                <br>
                <i class="icon-angle-double-right text-danger"></i>يجب أن يكون عنوان الرابط صالحًا.</p>`
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
            cancelButtonText: 'لا، إلغاء'

        },
        msgDeleteObj: {
            title: "تم الحذف!",
            text: "تم حذف موقعك.",
            icon: "success",
            timer: 1000
        },
        msgEditObj: {
            title: 'هل أنت متأكد؟',
            text: 'أنت على وشك حفظ التغييرات في هذه الإشارة المرجعية.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، احفظ التغييرات!',
            cancelButtonText: 'لا، إلغاء'
        },
        msgSuccessEditObj: {
            icon: 'success',
            title: 'تم التحديث بنجاح!',
            text: 'تم حفظ تغييرات الإشارة المرجعية.',
            showConfirmButton: false,
            timer: 1000
        }
    }
};

// تحديد اللغة حسب لغة الجهاز
const userLang = navigator.language || navigator.userLanguage;
const msgLang = userLang.startsWith("ar") ? "ar" : "en";

// استخدم الرسائل بناءً على اللغة
const selectedMessages = messagesAlert[msgLang];


// ?=====================================================> Event Inputs <=====================================
//  ^ ========================> < SubmitBtn > <==================================
$("#submitBtn").on("click", () => {

    const uName = $("#bookmarkName").val();
    const Url = $("#bookmarkURL").val();

    if (uNameValidation(uName) && UrlValidation(Url)) {
        if (editIndex !== -1) {
            Swal.fire(selectedMessages['msgEditObj'])
                .then((result) => {
                    if (result.isConfirmed) {
                        addToBookmarks();
                        Swal.fire(selectedMessages['msgSuccessEditObj']);
                    } else if (result.isDismissed) {
                        $("#bookmarkName").val('');
                        $("#bookmarkURL").val('');
                        editIndex = -1;
                    }
                });
        } else {
            // تخزين القيم في localStorage
            localStorage.setItem("name", $("#bookmarkName").val());
            localStorage.setItem("url", $("#bookmarkURL").val());
            addToBookmarks();
            clearInput();
            Swal.fire(selectedMessages['msgSuccessObj']);
        }
        firstInputElement.classList.remove("is-valid");
        secondInputElement.classList.remove("is-valid");
    }
    else {
        Swal.fire(selectedMessages['msgErrorObj']);
        firstInputElement.classList.add("is-invalid");
        secondInputElement.classList.add("is-invalid");

    }

});


function uNameValidation(uName) {
    const uNamePattern = /^(?!\s)[\w\s\p{L}@#_,.\-/|!$&^%+=><()*?\\؟]{3,}$/u;
    const valid = uNamePattern.test(uName);
    const inputElement = $("#bookmarkName")[0];
    if (valid) {
        inputElement.classList.add("is-valid");
        inputElement.classList.remove("is-invalid");
        return true;
    } else {
        inputElement.classList.add("is-invalid");
        inputElement.classList.remove("is-valid");
        return false;
    }
}

function UrlValidation(Url) {
    const URLpattern = /^(http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    const valid = URLpattern.test(Url);
    const inputElement = $("#bookmarkURL")[0];
    if (valid) {
        inputElement.classList.add("is-valid");
        inputElement.classList.remove("is-invalid");
        return true;
    } else {
        inputElement.classList.add("is-invalid");
        inputElement.classList.remove("is-valid");
        return false;
    }
}

function clearInput() {
    $("#bookmarkName").val("");             // كدا انا بفرغ الحقل بعمل Clear Input
    $("#bookmarkURL").val("");
    // const firstInputElement = $("#bookmarkName")[0];
    firstInputElement.classList.remove("is-invalid");
    // const secondInputElement = $("#bookmarkURL")[0];
    secondInputElement.classList.remove("is-invalid");

}

// *===================================================> Section Table <====================================================
// ?========================================> Search Input <===============================


let bookmarks = [];
let bookmarksListFounded = JSON.parse(localStorage.getItem("bookmarksList"));

function setLocalstorage() {
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
}

function Display(bookmarksArray) {
    $('#tableSection').show();
    const tableContent = $('#tableContent');
    tableContent.empty();

    let contentTable = '';
    for (let i = 0; i < bookmarksArray.length; i++) {
        contentTable += `<tr>
            <td scope="row" class="fw-semibold ">${i + 1}</td>
            <td class="fw-semibold text-capitalize">${bookmarksArray[i].firstInputElement}</td>
            <td><button class="btn btn-success btn-sm" onclick="visitBookmark('${bookmarksArray[i].secondInputElement}')">
            <span class="icon-text"><i class="icon-eye1 pe-1 icon-btn"></i> <span class="responsive-text">Visit</span></span>
            </button></td>
            <td><button class="btn btn-warning btn-sm text-white" onclick="editBookmark(${i})">
            <span class="icon-text"><img src="./assets/Imgs/edit-pencil.svg" class="pe-1" style="width: 30px;">
            <span class="responsive-text">Edit</span></span>
            </button></td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteBookmark(${i})">
            <span class="icon-text"><i class="icon-bin pe-1 icon-btn"></i> <span class="responsive-text">Delete</span></span>
            </button></td>
        </tr>`;
    }
    tableContent.html(contentTable);
}

Display(bookmarks);              //^==================================>

function addToBookmarks() {
    const inputName = $('#bookmarkName').val().trim();
    const inputURL = $('#bookmarkURL').val().trim();

    if (inputName && inputURL) {
        if (editIndex === -1) {
            const bookmarkObj = { firstInputElement: inputName, secondInputElement: inputURL };  //^firstInputElement storage in nameInput
            bookmarks.push(bookmarkObj);
        } else {  // إذا كان هناك تعديل، قم بتحديث السطر الموجود for function editBookmark() in  Line 240
            bookmarks[editIndex].firstInputElement = inputName;
            bookmarks[editIndex].secondInputElement = inputURL;
            editIndex = -1;  // إعادة ضبط الفهرس بعد التعديل
        }
        setLocalstorage();
        Display(bookmarks);
        $('#bookmarkName').val('');
        $('#bookmarkURL').val('');
    } else {
        alert("Please fill all the Inputs!");
    }
}


function deleteBookmark(index) {
    Swal.fire(selectedMessages['msgConfirmObj'])
        .then((result) => {
            if (result.isConfirmed) {
                bookmarks.splice(index, 1);
                setLocalstorage('bookmarksList', bookmarks);
                Display(bookmarks);
                if (bookmarks.length < 1) {
                    $('#tableSection').hide(300)
                }
                Swal.fire(selectedMessages['msgDeleteObj']);
            }
        });
}


function visitBookmark(url) {
    window.open(url, '_blank');
}


function editBookmark(index) {
    editIndex = index;        // حفظ الفهرس للإشارة قيد التعديل
    $("#bookmarkName").val(bookmarks[index].firstInputElement);
    $("#bookmarkURL").val(bookmarks[index].secondInputElement);

}

function saveEdits(editIndex) {
    if (editIndex > -1) {
        bookmarks[editIndex].firstInputElement = $("#bookmarkName").val();
        bookmarks[editIndex].secondInputElement = $("#bookmarkURL").val();
        setLocalstorage();  // تحديث `localStorage`
        Display(bookmarks);  // تحديث الجدول
        editIndex = -1;  // إعادة ضبط الفهرس
        $("#bookmarkName").val('');  // إعادة تعيين الحقول
        $("#bookmarkURL").val('');
        // Swal.fire(selectedMessages['msgSuccessEditObj']);
    }
}
$("#submitBtn").on('click', saveEdits);

function searchByName(keyword) {
    const result = bookmarks.filter(bookmark => bookmark.firstInputElement.toLowerCase().includes(keyword.toLowerCase()));
    if (result) {
        Display(result);
    }
    else {
        $("#tableContent").hide();
    }
}
$("#searchInput").on("input", () => {
    $("#searchInput").html
})

$(() => {

    if (bookmarksListFounded && bookmarksListFounded.length > 0) {
        bookmarks = bookmarksListFounded;
        $("#tableContent").show();
        Display(bookmarks);

    } else {
        $('#tableSection').hide();
    }
});



//* ==============================> convert text's sortButton
// Detect device language
const lang = navigator.language || navigator.userLanguage;

// Get the button element
const sortButton = document.getElementById('sortButton');

// تغيير النص بناءً على اللغة
function setButtonText() {
    if (lang.startsWith('ar')) { 
        sortButton.textContent = "تبديل الفرز بين الاسم";
    } else { 
        sortButton.textContent = "Toggle Sort by Name"; 
    }
}

setButtonText();


//* ==============================> Response about Sort Items in Form By Name

// دالة التبديل بين فرز الاسم
function toggleSort() {
    // إذا كان الفرز على أساس الاسم، نقوم بترتيب البيانات حسب الأسماء
    sortBookmarks('name');
}

// دالة الفرز بناءً على الاسم (تأخذ في الاعتبار اللغة)
function sortBookmarks(criteria) {
    if (criteria === "name") {
        bookmarks.sort((a, b) => {
            const lang = document.documentElement.lang || 'en'; // نفترض أن اللغة الإنجليزية هي الافتراضية

            if (lang.startsWith('ar')) {
                return a.firstInputElement.localeCompare(b.firstInputElement, 'ar'); // ترتيب بالترتيب الأبجدي العربي
            } else {
                return a.firstInputElement.localeCompare(b.firstInputElement, 'en'); // ترتيب بالترتيب الأبجدي الإنجليزي
            }
        });
    }
    renderBookmarks(); // إعادة عرض الجدول بعد الفرز
}

// دالة العرض لتحديث الجدول تلقائيًا
function renderBookmarks() {
    const tableContent = document.getElementById('tableContent');
    tableContent.innerHTML = ''; 

    bookmarks.forEach((bookmark, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td class="fw-semibold text-capitalize">${bookmark.firstInputElement}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="visitBookmark('${bookmark.secondInputElement}')">
                    <i class="icon-eye1 pe-1 icon-btn"></i>Visit
                </button>
            </td>
            <td>
                <button class="btn btn-warning btn-sm text-white" onclick="editBookmark(${index})">
                    <img src="./assets/Imgs/edit-pencil.svg" class="pe-1" style="width: 30px;">Edit
                </button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteBookmark(${index})">
                    <i class="icon-bin pe-1 icon-btn"></i>Delete
                </button>
            </td>
        `;
        tableContent.appendChild(row);
    });
}

// استدعاء أولي لعرض الإشارات المرجعية عند التحميل
renderBookmarks();







$(document).on("keydown", (event) => {
    // إذا تم الضغط على مفتاح Enter
    if (event.key === "Enter") {
        // تأخير تنفيذ الضغط على الزر لبضع ميلي ثانية (100ms على سبيل المثال)
        setTimeout(() => {
            $("#submitBtn").click(); // محاكاة الضغط على زر الإرسال
        }, 100); // 100ms تأخير
    }

    // إذا تم الضغط على السهم للأسفل، تحرك إلى الحقل التالي
    if (event.key === "ArrowDown") {
        const focusedElement = $(':focus');
        if (focusedElement.is('#bookmarkName')) {
            $('#bookmarkURL').focus(); // الانتقال إلى الحقل الثاني
        } else if (focusedElement.is('#bookmarkURL')) {
            $('#submitBtn').focus(); // الانتقال إلى الزر
        }
    }

    // إذا تم الضغط على السهم للأعلى، تحرك إلى الحقل السابق
    if (event.key === "ArrowUp") {
        const focusedElement = $(':focus');
        if (focusedElement.is('#bookmarkURL')) {
            $('#bookmarkName').focus(); // العودة إلى الحقل الأول
        } else if (focusedElement.is('#submitBtn')) {
            $('#bookmarkURL').focus(); // العودة إلى حقل الـ URL
        }
    }
});


