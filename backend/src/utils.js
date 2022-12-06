export const utils = {
    position: (x, y) => `(${x},${y})`,
    hashCode: (str) => {
        let hash = 0;
        if (str.length == 0) return hash;
        for (let i = 0; i < this.length; i++) {
            let char = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },
}
