const express = require('express')
const BannerSchema = require('../../models/admin/Banner')
const uploadBanner = require('./utils/banner_image') 

const router = express.Router();

// BANNER ROUTER
router.get('/', async (req, res, next) => {
    try {
        const Banner = await BannerSchema.find();
        res.status(200).json({
            status: 'success',
            total : Banner.length,
            data: Banner
        });
    } catch (err) {
        next(err)
    }
  
  });
  
  
  router.post('/',uploadBanner.single('image_url'),async (req, res, next) => {
    try{
    const Banner = await BannerSchema.create({ "title": req.body.title,"description": req.body.description, "image_url": req.file.location });
  
    res.status(200).json({
        status: 'success',
        data: Banner
    });
   } catch(err) {
    next(err)
  }
  })
  
  router.delete('/:id', async (req, res, next) => {
    try {
      let Banner = await BannerSchema.findById(req.params.id);
  
      if (!Banner) {
        return next(
          new Error(`Banner not found with id of ${req.params.id}`)
        );
      }
     
      await Banner.remove();
      res.status(200).json({
          status: 'success',
          msg: 'Successfully deleted banner'
      });
  } catch (err) {
      next(err)
  }
  
  });
  
  
  
  module.exports = router