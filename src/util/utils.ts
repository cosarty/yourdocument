/* eslint-disable @typescript-eslint/no-unused-expressions */
/**
 * 判断是否为移动设备
 */
export const isMobile = () => {
  const deviceWidth = document.querySelector('body')?.offsetWidth;
  return deviceWidth && deviceWidth < 480;
};

// 提取属性
export const pick = <T, K extends keyof T>(prent: T, item: K[], omit: boolean = false) => {
  return Object.keys(prent).reduce((c: any, key: any) => {
    const isExist = item.includes(key);
    // 提取
    // tslint:disable-next-line: no-unused-expression
    !omit && isExist && Object.assign(c, { [key]: prent[key] });
    // 排除
    // tslint:disable-next-line: no-unused-expression
    omit && !isExist && Object.assign(c, { [key]: prent[key] });

    return c;
  }, {});
};


