class TerrainTileSprite extends Sprite {
    draw(ctx, camera) {
        let color = this.gameObject.color();
        let diff_x = this.gameObject.x - camera.x;
        let diff_y = this.gameObject.y - camera.y;
        let lower_x = diff_x;
        let lower_y = diff_y;
        ctx.fillStyle = color;
        ctx.fillRect(lower_x+3*64, lower_y+2*64, 64, 64);
        // this.element.style.backgroundColor = color;
    }

}