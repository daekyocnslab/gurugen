/* html 사용법(최소)
    <div id="ID">
        <button type="button" class="btn icon btn-close" title="닫기"></button>
        ...
    </div>
    const popup = new Popup("#ID");
    popup.open();
*/

export default class Popup {
    constructor(popupElement, options = {}) {
        this.popup = document.querySelector(popupElement);
        this.closeButtonElement = options.closeButtonElement || ".btn-close";

        this.init();
    }
    init() {
        const closeButton = this.popup.querySelector(this.closeButtonElement);
        if (closeButton) {
            closeButton.addEventListener("click", () => this.close());
        }

        // 팝업 외부 클릭으로 닫기
        // if (this.closeOnOverlayClick) {
        //     this.popup.addEventListener("click", (event) => {
        //     if (event.target === this.popup) {
        //         this.close();
        //     }
        //     });
        // }
    }

    open() {
        this.popup.classList.add("open");
        document.body.style.overflow = "hidden"; 
    }

    close() {
        this.popup.classList.remove("open");
        document.body.style.overflow = ""; 
    }
}