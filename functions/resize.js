const fs = require('fs');
const sharp = require('sharp');

sharp.cache({ files: 0 });

const dir = 'uploads';

const sizes = [
  {
    name: 'thumbnail',
    size: 400
  },
  {
    name: 'large',
    size: 1200
  }
];

const resize = async (imageBuffer, extName) => {
  var images = [];
  var string = '';
  for (let i = 0; i < sizes.length; i++) {
    const fileDestination = `${dir}/${Date.now()}-${sizes[i].name}.${extName}`;
    string = await sharp(imageBuffer)
      .resize(sizes[i].size)
      .rotate((rotate = 0))
      .jpeg({ quality: 60 })
      .toFile(fileDestination)
      .then(info => {
        renamed = `${dir}/${Date.now()}-${sizes[i].name}-${info.width}x${
          info.height
        }.${extName}`;
        fs.renameSync(fileDestination, renamed);
        return renamed;
      });

    images.push(string);
  }
  return images;
};

module.exports = resize;
