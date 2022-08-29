import { uploadAvatar } from '@/services/upload';
import { message, Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState } from 'react';

interface PicUploaderProps {
  onChange?: (url: string) => void;
  value?: string;
}

const UploadImag: React.FC<PicUploaderProps> = ({ onChange, value }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(
    value
      ? [
          {
            uid: '-1',
            name: value.split('/').slice(-1)[0],
            status: 'done',
            url: value,
          },
        ]
      : [],
  );

  const cusReq = async (fileObj: any) => {
    const res = await uploadAvatar({ avatar: fileObj.file });
    if (res.code !== 202) {
      return;
    }

    const result = res?.data?.fileURL;
    if (result && onChange) {
      message.success('上传成功!!!');
      onChange(result);

      fileObj.onSuccess(res, fileObj.file);
    }
  };

  const fileType = ['image/jpeg', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

  const beforeUpload = async (file: File) => {
    const isFileTypeValid = fileType.includes(file.type);
    if (!isFileTypeValid) {
      message.error('只能上传 JPG/PNG/SVG/WEBP 格式的文件!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片必须小于 2MB!');
    }
    return isFileTypeValid && isLt1M;
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);

    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = (newFileList) => {
    console.log('newFileList: ', newFileList);
    setFileList(newFileList.fileList);

    if (
      newFileList.fileList.length === 0 ||
      !newFileList.file?.status ||
      newFileList.file?.status === 'removed'
    ) {
      setFileList([]);
      onChange?.('');
    }
  };

  const handleCancel = () => setPreviewVisible(false);

  return (
    <>
      <ImgCrop
        rotate
        beforeCrop={(file: File) => {
          const isAccess = fileType.includes(file.type || '');
          if (!isAccess) {
            message.error('只能上传 JPG/PNG/SVG/WEBP 格式的文件!');
          }
          return isAccess;
        }}
      >
        <Upload
          listType='picture-card'
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          customRequest={cusReq}
          beforeUpload={beforeUpload}
          multiple={false}
        >
          {fileList.length < 1 && '+ Upload'}
        </Upload>
      </ImgCrop>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadImag;
