class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    duplicate() {
        return new Vector(this.x, this.y);
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    negativeVector() {
        return this.duplicate().negate();
    }
    vectorAddition(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    vectorSubtraction(vector) {
        return this.vectorAddition(vector.negativeVector());
    }
    vectorMultiplication(constant) {
        this.x *= constant;
        this.y *= constant;
        return this;
    }
    vectorDivision(constant) {
        this.x /= constant;
        this.y /= constant;
        return this;
    }
    addVector(vector) {
        return this.duplicate().vectorAddition(vector);
    }
    subtractVector(vector) {
        return this.duplicate().vectorSubtraction(vector);
    }
    multiplyVector(constant) {
        return this.duplicate().vectorMultiplication(constant);
    }
    divisionVector(constant) {
        return this.duplicate().vectorDivision(constant);
    }
    dotProduct(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    length() {
        return Math.sqrt(this.dotProduct(this));
    }
    normal() {
        return this.duplicate().vectorDivision(this.length());
    }
}

let bumper = document.getElementById("bumper");
let sphere = document.getElementById("sphere");
let title = document.getElementById("title");

bumper.addEventListener("mouseover", (e) => {
    addEffects();
    bumper.addEventListener("mousemove", (e) => {
        evade(e);
    });
});

function evade(evt) {
    let rect = bumper.getBoundingClientRect();
    let corner = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    },
        center = {
            x: corner.left + bumper.offsetWidth / 2,
            y: corner.top + bumper.offsetHeight / 2
        },
        distanceFromCenterXY = new Vector(center.x - evt.pageX, center.y - evt.pageY),
        closestDistanceToCenter = bumper.offsetWidth / 2;

    //calculating new position
    let delta = distanceFromCenterXY.normal().vectorMultiplication(closestDistanceToCenter).subtractVector(distanceFromCenterXY),
        newCorner = { left: corner.left + delta.x, top: corner.top + delta.y };

    //bounds checking
    let bumperPadding = parseInt(getComputedStyle(bumper).padding, 10);
    if (newCorner.left < -bumperPadding) {
        newCorner.left = -bumperPadding;
    } else if (newCorner.left + bumper.offsetWidth - bumperPadding > document.documentElement.clientWidth) {
        newCorner.left = document.documentElement.clientWidth - bumper.offsetWidth + bumperPadding;
    }
    if (newCorner.top < -bumperPadding) {
        newCorner.top = -bumperPadding;
    } else if (newCorner.top + bumper.offsetHeight - bumperPadding > document.documentElement.clientHeight) {
        newCorner.top = document.documentElement.clientHeight - bumper.offsetHeight + bumperPadding;
    }

    bumper.style.top = newCorner.top.toString() + "px";
    bumper.style.left = newCorner.left.toString() + "px";
}

function addEffects() {
    title.innerText = "The Shy Sphere";
    title.classList.add("activate-title");
    sphere.classList.add("activate-sphere");
}
function removeEffects() {
    title.innerText = "The Sphere";
}
