// let sphere = document.getElementById("sphere");
// const onMouseMove = (e) => {
//   console.log(sphere.style.left);
// };
// document.addEventListener("mousemove", onMouseMove);

Math.Vector = function (x, y) {
    this.x = x;
    this.y = y;
};
Math.Vector.prototype = {
    clone: function () {
        return new Math.Vector(this.x, this.y);
    },
    negate: function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    },
    neg: function () {
        return this.clone().negate();
    },
    addeq: function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },
    subeq: function (v) {
        return this.addeq(v.neg());
    },
    add: function (v) {
        return this.clone().addeq(v);
    },
    sub: function (v) {
        return this.clone().subeq(v);
    },
    multeq: function (c) {
        this.x *= c;
        this.y *= c;
        return this;
    },
    diveq: function (c) {
        this.x /= c;
        this.y /= c;
        return this;
    },
    mult: function (c) {
        return this.clone().multeq(c);
    },
    div: function (c) {
        return this.clone().diveq(c);
    },
    dot: function (v) {
        return this.x * v.x + this.y * v.y;
    },
    length: function () {
        return Math.sqrt(this.dot(this));
    },
    normal: function () {
        return this.clone().diveq(this.length());
    }
};

function evade(evt) {
    var $this = $(this),
        corner = $this.offset(),
        center = {
            x: corner.left + $this.outerWidth() / 2,
            y: corner.top + $this.outerHeight() / 2
        },
        dist = new Math.Vector(center.x - evt.pageX, center.y - evt.pageY),
        closest = $this.outerWidth() / 2;
    // proximity test
    if (dist.length() >= closest) {
        return;
    }
    // calculate new position
    var delta = dist.normal().multeq(closest).sub(dist),
        newCorner = { left: corner.left + delta.x, top: corner.top + delta.y };
    // bounds check
    var padding = parseInt($this.css("padding-left"));
    if (newCorner.left < -padding) {
        newCorner.left = -padding;
    } else if (
        newCorner.left + $this.outerWidth() - padding >
        $(document).width()
    ) {
        newCorner.left = $(document).width() - $this.outerWidth() + padding;
    }
    if (newCorner.top < -padding) {
        newCorner.top = -padding;
    } else if (
        newCorner.top + $this.outerHeight() - padding >
        $(document).height()
    ) {
        newCorner.top = $(document).height() - $this.outerHeight() + padding;
    }
    // move bumper
    $this.offset(newCorner);
}

function beginEvade() {
    $(this).on("mousemove", evade);
}

function endEvade() {
    $(this).off("mousemove", evade);
}

$(function () {
    $(".bumper").on("mouseover", (e) => {
        $(this).on("mousemove", evade);
    });
    $(".bumper").on("mouseout", (e) => {
        $(this).off("mousemove", evade);
    });
});
