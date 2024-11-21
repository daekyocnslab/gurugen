/* html 사용법
<ul id="IDAccordion">
    <li class="accord-item">
        <div class="accord-head">
            ...
        </div>
        <div class="accord-body">
            ...
        </div>
    </li>
</ul> 
*/

export default class Accordion {
    constructor(containerElement) {
        this.container = document.querySelector(containerElement);

        this.init();
    }

    init() {
        const accordionHeaders = this.container.querySelectorAll(".accord-head");

        accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const accordionItem = header.parentElement;
            const accordionContent = accordionItem.querySelector(".accord-body");

            // 모든 아코디언을 닫음
            this.closeAllExcept(accordionItem);

            // 현재 아이템 토글
            if (accordionItem.classList.contains("active")) {
                this.closeAccordion(accordionItem);
            } else {
                this.openAccordion(accordionItem, accordionContent);
            }
        });
        });
    }

    closeAllExcept(currentItem) {
        const accordionItems = this.container.querySelectorAll(".accord-item");
        accordionItems.forEach(item => {
        if (item !== currentItem) {
            this.closeAccordion(item);
        }
        });
    }

    closeAccordion(item) {
        item.classList.remove("active");
        const content = item.querySelector(".accord-body");
        if (content) content.style.maxHeight = null;
    }

    openAccordion(item, content) {
        item.classList.add("active");
        if (content) content.style.maxHeight = content.scrollHeight + "px";
    }
}
