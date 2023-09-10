document.addEventListener("DOMContentLoaded", () => {
    const targetImage = document.getElementById("zoom_image");
    const parentContaner = document.getElementById("magnifier-wrapper");
    const magnifyingGlass = document.createElement("DIV");
    let isDragging = false;

    const updateBackgroundSize = () => {
        const width = targetImage.getBoundingClientRect().width;
        const height = targetImage.getBoundingClientRect().height;
        magnifyingGlass.style.backgroundSize = `${width * 3.2}px ${height * 3.5}px`;
    };

    magnifyingGlass.setAttribute("class", "img-magnifier-glass");
    magnifyingGlass.style.backgroundImage = `url('${targetImage.src}')`;
    magnifyingGlass.style.backgroundRepeat = "no-repeat";
    updateBackgroundSize();
    targetImage.parentElement.insertBefore(magnifyingGlass, parentContaner);

    const dragMagnifyingGlass = (event) => {
        if (!isDragging) return;

        const coordinates = event.type === 'touchmove'
            ? event.touches[0]
            : event;

        const { x: adjustedX, y: adjustedY } = getCursorPosition(coordinates, targetImage);

        const screenHeight = window.innerHeight;

        const clampedX = Math.min(Math.max(adjustedX, 0), targetImage.width);
        const clampedY = Math.min(Math.max(adjustedY, 0), screenHeight);

        magnifyingGlass.style.left = `${clampedX - magnifyingGlass.offsetWidth / 2}px`;
        magnifyingGlass.style.top = `${clampedY - magnifyingGlass.offsetHeight / 2}px`;
        magnifyingGlass.style.backgroundPosition = `-${clampedX * 3}px -${clampedY * 3}px`;
    };

    const getCursorPosition = (event) => {
        const imageRect = targetImage.getBoundingClientRect();
        const x = event.pageX - imageRect.left - window.pageXOffset;
        const y = event.pageY - imageRect.top - window.pageYOffset;
        return { x, y };
    };

    magnifyingGlass.addEventListener("mousedown", (event) => {
        const rect = magnifyingGlass.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        magnifyingGlass.style.cursor = "grabbing";
        isDragging = true;
    });

    magnifyingGlass.addEventListener("touchstart", (event) => {
        const rect = magnifyingGlass.getBoundingClientRect();
        offsetX = event.touches[0].clientX - rect.left;
        offsetY = event.touches[0].clientY - rect.top;
        isDragging = true;
    });

    window.addEventListener("mouseup", () => {
        magnifyingGlass.style.cursor = "grab";
        isDragging = false;
    });

    window.addEventListener("touchend", () => {
        isDragging = false;
    });

    window.addEventListener("mousemove", dragMagnifyingGlass);
    window.addEventListener("touchmove", dragMagnifyingGlass);

    window.addEventListener("resize", updateBackgroundSize);
});