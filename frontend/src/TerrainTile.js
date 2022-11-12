class TerrainTile extends GameObject {

    constructor (config) {
        super(config);
        this.cell = config.cell;
        this.sprite = new TerrainTileSprite({
            src: config.src || undefined,
            gameObject: this
        });
    }
    
}
