class TerrainTileSprite extends Sprite {
    constructor(config) {
        super(config);
        this.regFrameLimit = 128;
        this.regFrameProgress = this.regFrameLimit;

    }
    draw(ctx, camera) {
        let color = this.gameObject.color();
        let diff_x = this.gameObject.x - camera.x;
        let diff_y = this.gameObject.y - camera.y;
        let lower_x = diff_x;
        let lower_y = diff_y;
        ctx.fillStyle = color;
        ctx.fillRect(lower_x+3*64, lower_y+2*64, 64, 64);
        this.updateAnimationProgress();
        // this.element.style.backgroundColor = color;
    }

    updateAnimationProgress () {
        if(this.regFrameProgress > 0) {
            this.regFrameProgress--;
            return;
        }
        this.regFrameProgress = this.regFrameLimit;
        this.gameObject.regenerate();
    }

}