var d3 = {};
var π = Math.PI, τ = 2 * π, halfπ = π / 2, ε = 1e-6, ε2 = ε * ε, d3_radians = π / 180, d3_degrees = 180 / π;
function d3_Color() {}
d3.hsl = function(h, s, l) {
    return arguments.length === 1 ? h instanceof d3_Hsl ? d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : d3_hsl(+h, +s, +l);
};
function d3_hsl(h, s, l) {
    return new d3_Hsl(h, s, l);
}
function d3_Hsl(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
}
var d3_hslPrototype = d3_Hsl.prototype = new d3_Color();
d3_hslPrototype.rgb = function() {
    return d3_hsl_rgb(this.h, this.s, this.l);
};
function d3_hsl_rgb(h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= 0.5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
        if (h > 360) h -= 360; else if (h < 0) h += 360;
        if (h < 60) return m1 + (m2 - m1) * h / 60;
        if (h < 180) return m2;
        if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
        return m1;
    }
    function vv(h) {
        return Math.round(v(h) * 255);
    }
    return d3_rgb(vv(h + 120), vv(h), vv(h - 120));
}
function d3_xyz_lab(x) {
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
}
function d3_xyz_rgb(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
}
d3.rgb = function(r, g, b) {
    return arguments.length === 1 ? r instanceof d3_Rgb ? d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : d3_rgb(~~r, ~~g, ~~b);
};
function d3_rgbNumber(value) {
    return d3_rgb(value >> 16, value >> 8 & 255, value & 255);
}
function d3_rgbString(value) {
    return d3_rgbNumber(value) + "";
}
function d3_rgb(r, g, b) {
    return new d3_Rgb(r, g, b);
}
function d3_Rgb(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}
var d3_rgbPrototype = d3_Rgb.prototype = new d3_Color();
d3_rgbPrototype.hsl = function() {
    return d3_rgb_hsl(this.r, this.g, this.b);
};
d3_rgbPrototype.toString = function() {
    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
};
function d3_rgb_hex(v) {
    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
}
function d3_rgb_parse(format, rgb, hsl) {
    var r = 0, g = 0, b = 0, m1, m2, color;
    m1 = /([a-z]+)\((.*)\)/i.exec(format);
    if (m1) {
        m2 = m1[2].split(",");
        switch (m1[1]) {
          case "hsl":
            {
                return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
            }

          case "rgb":
            {
                return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
            }
        }
    }
    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.substring(1), 16))) {
        if (format.length === 4) {
            r = (color & 3840) >> 4;
            r = r >> 4 | r;
            g = color & 240;
            g = g >> 4 | g;
            b = color & 15;
            b = b << 4 | b;
        } else if (format.length === 7) {
            r = (color & 16711680) >> 16;
            g = (color & 65280) >> 8;
            b = color & 255;
        }
    }
    return rgb(r, g, b);
}
function d3_rgb_hsl(r, g, b) {
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
    if (d) {
        s = l < .5 ? d / (max + min) : d / (2 - max - min);
        if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
        h *= 60;
    } else {
        h = NaN;
        s = l > 0 && l < 1 ? 0 : h;
    }
    return d3_hsl(h, s, l);
}
function d3_rgb_lab(r, g, b) {
    r = d3_rgb_xyz(r);
    g = d3_rgb_xyz(g);
    b = d3_rgb_xyz(b);
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
}
function d3_rgb_xyz(r) {
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
}
function d3_rgb_parseNumber(c) {
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
}
d3.hcl = function(h, c, l) {
    return arguments.length === 1 ? h instanceof d3_Hcl ? d3_hcl(h.h, h.c, h.l) : h instanceof d3_Lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : d3_hcl(+h, +c, +l);
};
function d3_hcl(h, c, l) {
    return new d3_Hcl(h, c, l);
}
function d3_Hcl(h, c, l) {
    this.h = h;
    this.c = c;
    this.l = l;
}
var d3_hclPrototype = d3_Hcl.prototype = new d3_Color();
d3_hclPrototype.rgb = function() {
    return d3_hcl_lab(this.h, this.c, this.l).rgb();
};
function d3_hcl_lab(h, c, l) {
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    return d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
}
d3.lab = function(l, a, b) {
    return arguments.length === 1 ? l instanceof d3_Lab ? d3_lab(l.l, l.a, l.b) : l instanceof d3_Hcl ? d3_hcl_lab(l.l, l.c, l.h) : d3_rgb_lab((l = d3.rgb(l)).r, l.g, l.b) : d3_lab(+l, +a, +b);
};
function d3_lab(l, a, b) {
    return new d3_Lab(l, a, b);
}
function d3_Lab(l, a, b) {
    this.l = l;
    this.a = a;
    this.b = b;
}
var d3_lab_K = 18;
var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
var d3_labPrototype = d3_Lab.prototype = new d3_Color();
d3_labPrototype.rgb = function() {
    return d3_lab_rgb(this.l, this.a, this.b);
};
function d3_lab_rgb(l, a, b) {
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
    x = d3_lab_xyz(x) * d3_lab_X;
    y = d3_lab_xyz(y) * d3_lab_Y;
    z = d3_lab_xyz(z) * d3_lab_Z;
    return d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
}
function d3_lab_hcl(l, a, b) {
    return l > 0 ? d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : d3_hcl(NaN, NaN, l);
}
function d3_lab_xyz(x) {
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
}
function d3_interpolateLab(a, b) {
    a = d3.lab(a);
    b = d3.lab(b);
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
    return function(t) {
        return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
    };
}
module.exports = d3_interpolateLab;
