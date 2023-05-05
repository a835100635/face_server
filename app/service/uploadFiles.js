/**
 * 用户服务
 */
const { Service } = require('egg');
const fs = require("fs");
const path = require("path");
const qiniu = require("qiniu");
const md5 = require("md5");
const BadRequestException = require('../exception/badRequest');

// 需要填写你的 Access Key 和 Secret Key
const accessKey = process.env.QINIU_ACCESS_KEY;
const secretKey = process.env.QINIU_SECRET_KEY;
const bucket = process.env.QINIU_BUCKET;
// 临时存放文件夹
const temporaryStorage = process.env.QINIU_TEMPORARY_STORAGE;
// 构建鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone[process.env.QINIU_ZONE];
// 是否使用https域名
// config.useHttpsDomain = false;
// 上传是否使用cdn加速
// config.useCdnDomain = false;
const options = {
  scope: bucket,
  expires: 7200 * 4,
  force: true,
  callbackBodyType: 'application/json'
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);


class UploadFilesService extends Service {
  // 上传文件 默认上传到七牛云临时文件夹
  async upload(data) {
    // 避免重复上传文件 时间戳+随机数
    const timestamp = (new Date()).getTime();
    const randomNum = Math.ceil(Math.random() * 1000);
    try {
      // 获取 Stream文件流
      const stream = await data.getFileStream(); // 文件不存在将响应400错误
      // 文件扩展名称
      const extname = path.extname(stream.filename).toLocaleLowerCase();
      // md5加密文件 文件名+时间戳+随机数
      const filename = md5(path.basename(stream.filename, extname) + timestamp + randomNum) + extname;
      // 文件位置
      const formUploader = new qiniu.form_up.FormUploader(config);
      // 上传参数
      const putExtra = new qiniu.form_up.PutExtra();
      // 文件上传
      const result = await new Promise((resolve, reject) => {
        formUploader.putStream(uploadToken, `${temporaryStorage}${filename}`, stream, putExtra, (respErr, respBody, respInfo) => {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(respBody);
          }
        });
      });

      return {
        url: result.key
      };
    } catch (error) {
      throw new BadRequestException('上传失败: ' + error.error);
    }

  }


  /**
   * 移动文件
   * @param {string} filename 文件路径 
   * @param {*} target 目标路径
   */
  async moveFile(filename, target) {
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    try {
      await new Promise((resolve, reject) => {
        bucketManager.move(bucket, filename, bucket, target, options, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
          } else {
            resolve(respBody);
          }
        });
      });
    } catch (error) {
      throw new BadRequestException('移动文件失败: ' + error.error);
    }
  }
}

module.exports = UploadFilesService;
