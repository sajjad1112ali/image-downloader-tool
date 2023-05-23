const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

const fs = require("fs");
const zlib = require('zlib');
const archiver = require('archiver');
const rimraf = require('rimraf');
var zipper = require("zip-local");

async function saveImageToDisk(url, filename) {
  try {
    const res = await fetch(url);
    const dest = fs.createWriteStream(filename);
    res.body.pipe(dest);
  } catch (err) {
    console.log(err);
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
async function createDirectory(min, max) {
  const dir = `./public/images/${randomIntFromInterval(1, 10)}_${makeid(5)}`;

  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        resolve(false);
      } else {
        console.log('Folder created successfully');
        resolve(dir);
  
      }
    });
  })
 
}

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
function zipFolder(dir) {
  zipper.zip(dir, function(error, zipped) {

    if(!error) {
        zipped.compress(); 
        var buff = zipped.memory(); 
        zipped.save(`${dir}/package`, function(error) {
            if(!error) {
                console.log("saved successfully !");
            }
            console.log(error)
        });
    }
});
}

const downloadImages = async (req) => {
  try {
    const { imagesCount, height, width } = req.body;
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: false,
      userDataDir: "./temp",
    });

    const arrayCount = Array(parseInt(imagesCount)).fill(0);
    const imagesPromise = await Promise.all(
      arrayCount.map(async (ar) => {
        const page = await browser.newPage();
        await page.goto(`http://picsum.photos/${width}/${height}`, {
          timeout: 0,
        });
        const imgs = await page.$$eval("img[src]", (imgs) =>
          imgs.map((img) => img.getAttribute("src"))
        );
        return imgs;
      })
    );
    const imagesSrcArr = imagesPromise.map((ar) => ar[0]);
    const direcoty = await createDirectory();
    console.log(`direcoty = ${direcoty}`)

    if (!direcoty) return false;

    await Promise.all(imagesSrcArr.map((image) => {
      let filename = `${direcoty}/${randomIntFromInterval(
        1,
        100
      )}_${makeid(10)}_${Date.now()}.jpg`;
      return saveImageToDisk(image, filename);
    }));

    await browser.close();
    // await archiveAdnDownloadFolder(direcoty);
    return direcoty;
  } catch (error) {
    console.log(
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<error>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    );
    console.log(error);
  }
};

module.exports = {
  downloadImages,
  zipFolder,
};
