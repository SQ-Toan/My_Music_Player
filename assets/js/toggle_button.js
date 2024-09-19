const toggleSwitch = document.querySelector("#theme-toggle");

const THEME_MUSIC_PLAYER = "theme";

// Kiểm tra theme hiện tại từ localStorage
const currentTheme = localStorage.getItem(THEME_MUSIC_PLAYER);
if (currentTheme) {
    document.body.classList.add(currentTheme);

    // Cập nhập trạng thái giao diện
    if (currentTheme === "darkmode") {
        toggleSwitch.checked = true;
    }
}

// Xử lý chức năng chuyển đổi giao diện
toggleSwitch.addEventListener("click", () => {
    if (toggleSwitch.checked) {
        document.body.classList.add("darkmode");
        document.body.classList.remove("lightmode");
        localStorage.setItem(THEME_MUSIC_PLAYER, "darkmode");
    } else {
        document.body.classList.add("lightmode");
        document.body.classList.remove("darkmode");
        localStorage.setItem(THEME_MUSIC_PLAYER, "lightmode");
    }
});
