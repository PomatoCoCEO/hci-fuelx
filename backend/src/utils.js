export const utils = {
    position: (x, y) => `(${x},${y})`,
    hashCode: (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        return Math.abs(hash);
    },
}
