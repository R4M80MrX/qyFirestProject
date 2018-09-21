const SpriteFrameSet = cc.Class({
    name: 'SpriteFrameSet',
    properties: {
        language: '',
        spriteFrame: {
            default:null,
            type:cc.SpriteFrame,
            notify()
            {
                if(this.spriteFrame != null && this.language.length == 0 && this.spriteFrame._textureFilename)
                {
                    let index = this.spriteFrame._textureFilename.lastIndexOf("_") + 1;
                    if(index > 0)
                    {
                        this.language = this.spriteFrame._textureFilename.substring(index);
                        index = this.language.indexOf(".");
                        if(index > 0)
                        {
                            this.language = this.language.substring(0,index); 
                        }
                    }
                }
            }
        }
    }
});

module.exports = SpriteFrameSet;