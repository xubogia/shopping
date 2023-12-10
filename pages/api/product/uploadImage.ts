// @ts-ignore
import qiniu from 'qiniu';

const accessKey = '8S0YD-1RNIUJZqA2yIXHNViTcWjjkMHjbQiUH-e9';
const secretKey = 'CmhSSxAZgfoeoZwtveC50S0FAF_DTdpsdAl3HUmI';
const bucket = 'abiu';
function generateUploadToken(key:string) {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: `${bucket}:${key}`,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
}

function uploadFile(uploadToken:string, newFileName:string, oldFileName:string) {
  const qiniuConfig = new qiniu.conf.Config();
  const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
  const putExtra = new qiniu.form_up.PutExtra();
  
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, newFileName, oldFileName, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        reject(respErr);
      }
      
      if (respInfo.statusCode === 200) {
        // 文件上传成功，获取访问URL
        const { key } = respBody;
        const fileURL = `image.niceweekend.com.cn/${key}`; // 请将 YOUR_BASE_URL 替换为你的七牛云存储空间的外链域名
        resolve(fileURL);
      } else {
        reject(new Error(`File upload failed: ${respInfo.statusCode} - ${respBody.error}`));
      }
    });
  });
}

export async function qiniuYun(key: string, filePath: string) {
  const uploadToken = generateUploadToken(key);
  const fileURL: any = await uploadFile(uploadToken, key, filePath);
  return `https://${fileURL.toString()}`;
}