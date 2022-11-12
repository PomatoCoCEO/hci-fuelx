class TerrainTileSprite extends Sprite {
    constructor(config) {
        super(config);
        this.regFrameLimit = 128;
        this.regFrameProgress = this.regFrameLimit;

    }
    draw(ctx, camera) {
        let diff_x = this.gameObject.x - camera.x;
        let diff_y = this.gameObject.y - camera.y;
        let lower_x = diff_x;
        let lower_y = diff_y;
        ctx.fillStyle = fuel_color(this.gameObject.cell.progress);
        ctx.fillRect(lower_x+3*64, lower_y+2*64, 64, 64);
    
        this.updateAnimationProgress();
    }
}