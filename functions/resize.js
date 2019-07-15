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

const resize = async (filePath, beforeOrAfter, rotate = 0) => {
  try {
    var images = [];
    const file = filePath;
    const extName = file.split('.').slice(-1)[0];

    await fs.readFile(file, (err, data) => {
      if (err) {
        console.log('Error reading file ' + fileIn + ' ' + err.toString());
      } else {
        sizes.map(size => {
          try {
            const fileDestination = `${dir}/${Date.now()}-${
              size.name
            }.${extName}`;
            images.push(fileDestination);
            sharp(data)
              .resize(size.size)
              .rotate(rotate)
              .jpeg({ quality: 60 })
              .toFile(fileDestination)
              .then(info => {
                const finalDestination = `${dir}/${Date.now()}-${size.name}-${
                  info.width
                }x${info.height}.${extName}`;

                sharp(fileDestination)
                  .toFile(finalDestination)
                  .then(info => {
                    fs.unlinkSync(fileDestination);
                  });
              });
          } catch (error) {
            console.error('sharp error', error);
          }
        });
        index = 0;
      }
      fs.unlinkSync(file);
      console.log('in resize: ', images);
    });
  } catch (err) {
    console.error('resize error', err);
  }
  return 'hey6';
};

module.exports = resize;

// const sizes = [
//   {
//     name: 'thumbnail',
//     size: 400
//   },
//   {
//     name: 'large',
//     size: 1200
//   }
// ];
// // var count = 0;
// const resize = async (filePath, beforeOrAfter, rotate = 0) => {
//   try {
//     const file = filePath;
//     const extName = file.split('.').slice(-1)[0];
//     // await sharp(file)
//     //   .metadata()
//     //   .then(data => console.log(data));
//     await fs.readFile(file, (err, data) => {
//       if (err) {
//         console.log('Error reading file ' + fileIn + ' ' + err.toString());
//       } else {
//         sizes.map(async size => {
//           try {
//             const fileDestination = `${dir}/${Date.now()}-${
//               size.name
//             }.${extName}`;
//             await sharp(data)
//               .resize(size.size)
//               .rotate(rotate)
//               .jpeg({ quality: 60 })
//               .toFile(fileDestination)
//               .then(async info => {
//                 try {
//                   console.log(info);
//                   console.log(fileDestination);
//                   const finalDestination = `${dir}/${Date.now()}-${size.name}-${
//                     info.width
//                   }x${info.height}.${extName}`;
//                   await sharp(fileDestination)
//                     .toFile(finalDestination)
//                     .then(info => fs.unlinkSync(fileDestination));
//                 } catch (error) {
//                   console.error(error);
//                 }
//               });
//           } catch (error) {
//             console.log('sharp error', error);
//           }
//         });
//       }
//       fs.unlinkSync(file);
//     });

//     // const extName = file.split('.').slice(-1)[0];
//     // await sizes.map(async size => {
//     //   try {
//     //     const fileDestination = `${dir}/${Date.now()}-${size.name}.${extName}`;
//     //     await sharp(file)
//     //       .resize(size.size)
//     //       .rotate(rotate)
//     //       .jpeg({ quality: 60 })
//     //       .toFile(fileDestination)
//     //       .then(info => {
//     //         ++count;
//     //         if (count === sizes.length) {
//     //           count = 0;
//     //         }
//     //         console.log(count);
//     //       });
//     //     await fs.unlinkSync(file);
//     //   } catch (error) {
//     //     console.log('sharp error', error);
//     //   }
//     // });
//   } catch (err) {
//     console.log('resize error', err);
//   }
// };
