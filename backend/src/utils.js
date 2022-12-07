export const utils = {
    position: (x, y) => `(${x},${y})`,
    hashCode: (str) => {
        let hash = 0;
        if (str.length == 0) return hash;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },
    ordinal(n) {
        const s=["th","st","nd","rd"],
            v=n%100;
        return n+(s[(v-20)%10]||s[v]||s[0]);
    }
}
