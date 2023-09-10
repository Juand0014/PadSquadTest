document.addEventListener("DOMContentLoaded", () => {
    const targetImage = document.getElementById("zoom_image");
    const magnifyingGlass = createMagnifyingGlass(targetImage);
    let isDragging = false;

    targetImage.parentElement.insertBefore(magnifyingGlass, document.getElementById("magnifier-wrapper"));

    function createMagnifyingGlass(img) {
        const element = document.createElement("DIV");
        element.className = "img-magnifier-glass";
        element.style.background = `no-repeat url('${img.src}')`;
        updateBackgroundSize(element, img);
        return element;
    }

    function updateBackgroundSize(element, img) {
        const { width, height } = img.getBoundingClientRect();
        element.style.backgroundSize = `${width * 3.2}px ${height * 3.5}px`;
    }

    function getCursorPosition(e, img) {
        const rect = img.getBoundingClientRect();
        return { x: e.pageX - rect.left - window.pageXOffset, y: e.pageY - rect.top - window.pageYOffset };
    }

    function drag(event) {
        if (!isDragging) return;
        const { x, y } = getCursorPosition(event.type === 'touchmove' ? event.touches[0] : event, targetImage);
        const [clampX, clampY] = [Math.min(Math.max(x, 0), targetImage.width), Math.min(Math.max(y, 0), window.innerHeight)];
        Object.assign(magnifyingGlass.style, {
            left: `${clampX - magnifyingGlass.offsetWidth / 2}px`,
            top: `${clampY - magnifyingGlass.offsetHeight / 2}px`,
            backgroundPosition: `-${clampX * 3}px -${clampY * 3}px`
        });
    }

    function start(event, type) {
        const rect = magnifyingGlass.getBoundingClientRect();
        [offsetX, offsetY] = type === "mouse" ? [event.clientX - rect.left, event.clientY - rect.top] : [event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top];
        magnifyingGlass.style.cursor = "grabbing";
        isDragging = true;
    }

    function stop() {
        magnifyingGlass.style.cursor = "grab";
        isDragging = false;
    }

    magnifyingGlass.addEventListener("mousedown", e => start(e, "mouse"));
    magnifyingGlass.addEventListener("touchstart", e => start(e, "touch"));
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    window.addEventListener("mousemove", drag);
    window.addEventListener("touchmove", drag);
    window.addEventListener("resize", () => updateBackgroundSize(magnifyingGlass, targetImage));
});
