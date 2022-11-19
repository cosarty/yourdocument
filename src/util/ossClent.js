import OSS from 'ali-oss';

class OssClent {
  static client = null;
  constructor() {
    if (!OssClent.client) {
      // OssClent.client = this.#getClient();
    }

    return OssClent.client;
  }

  async getClient() {
    // let sts = new STS({
    //   // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    //   accessKeyId: 'LTAI5t7o3toxKbtbcXQQZEP3',
    //   accessKeySecret: '5ra9sKVmw8dM1r89R6dAm8oMfPtUjS',
    // });
    // const result = await sts.assumeRole('roleArn', 'policy', 'expiration', 'sessionName');
    const client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: 'oss-cn-hangzhou',
      endpoint: 'cosarty.com',
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId: 'LTAI5t7o3toxKbtbcXQQZEP3',
      accessKeySecret: '5ra9sKVmw8dM1r89R6dAm8oMfPtUjS',
      cname: true,
      // 从STS服务获取的安全令牌（SecurityToken）。
      // stsToken: result.credentials.SecurityToken,
      // refreshSTSToken: async () => {
      //   // 向您搭建的STS服务获取临时访问凭证。
      //   let info = await await sts.assumeRole('roleArn', 'policy', 'expiration', 'sessionName');
      //   return {
      //     accessKeyId: info.credentials.accessKeyId,
      //     accessKeySecret: info.credentials.accessKeySecret,
      //     stsToken: info.credentials.securityToken,
      //   };
      // },
      // 刷新临时访问凭证的时间间隔，单位为毫秒。每隔一段时间定时器会自动掉后台接口刷新token
      // refreshSTSTokenInterval: 600000,
      // 填写Bucket名称。
      bucket: 'shitijun',
    });

    this.client = client;
  }
  async put(pathname, file) {
    try {
      let result = await this.client.put(`questions/${pathname}`, file);
      // http://cosarty.com/questions/
      return result.url;
    } catch (e) {
      console.log(e);
    }
  }
}

export default new OssClent();
