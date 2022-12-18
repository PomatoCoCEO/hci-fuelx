function position(x, y) {
    return `(${x},${y})`;
}

function fuel_color(progress) {
    // fc e8 99 -> 6f 3f 00
    // 252 -> 111
    // 232 -> 63
    // 153 -> 0
    let r = 0, g = 0, b = 0;
    if(progress > 0.5) {
        progress = (progress - 0.5) / 0.5;
        r = 255 - (255 - 111) * (progress);
        g = 136 - (136 - 63) * (progress);
        b = 0 - (0 - 0) * (progress);
    } else {
        progress = progress / 0.5;
        r = 252 - (252 - 255) * (progress);
        g = 232 - (232 - 136) * (progress);
        b = 153 - (153 - 0) * (progress);
    }
    return `rgb(${r},${g},${b})`;
}

String.prototype.hashCode = function() {
    let hash = 0;
    if (this.length == 0) return hash;
    for (let i = 0; i < this.length; i++) {
        let char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
