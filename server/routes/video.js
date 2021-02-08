const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');

const { auth } = require('../middleware/auth');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

//STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 파일을 이 폴더에 저장한다.
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single('file');

//=================================
//             Video
//=================================

// /api/video/uploadfiles
router.post('/uploadfiles', (req, res) => {
  //비디오를 서버에 저장한다.
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
  });
});

router.post('/thumbnail', (req, res) => {
  //썸네일 생성하고 비디오 러닝타임도 가져오기
  let filePath = '';
  let fileDuration = '';

  //비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  //썸네일 생성
  ffmpeg(req.body.url) //클라이언트에서 온 비디오 저장경로를 가져온다, uploads
    .on('filenames', function (filenames) {
      //비디오 파일네임 생성
      console.log('Will generate ' + filenames.join(', '));
      filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function () {
      //썸네일 생성 후 할 일
      console.log('Screenshots taken');
      return res.json({ success: true, url: filePath, fileDuration: fileDuration });
    })
    .on('error', function (err) {
      //에러가 날 때 할 일
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png',
    });
});

router.post('/upload/video', (req, res) => {
  //비디오 정보들을 저장한다.
  const video = new Video(req.body); //클라이언트에서 요청된 VideoUploadPage의 variables을 db에 저장

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.get('/getVideos', (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에 보낸다.
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

module.exports = router;
