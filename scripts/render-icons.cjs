const sharp=require('sharp');const path=require('node:path');
(async()=>{for(const n of [192,512])await sharp(path.join(__dirname,'../assets/icons/icon.svg')).resize(n,n).png().toFile(path.join(__dirname,`../assets/icons/icon-${n}.png`));})();
