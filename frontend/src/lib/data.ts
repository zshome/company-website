export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export const services: ServiceItem[] = [
  {
    id: 'wall',
    title: '墙面翻新',
    description: '专业墙面处理，让老墙焕发新生。采用三棵树环保涂料，无毒无味，即刷即住。',
    features: [
      '墙面基层处理',
      '裂缝修补',
      '防霉抗碱处理',
      '环保涂料施工',
      '色彩搭配咨询',
    ],
    icon: 'paintbrush',
  },
  {
    id: 'old-house',
    title: '旧房改造',
    description: '整体翻新改造，提升居住品质。一站式服务，从设计到施工全程无忧。',
    features: [
      '整体空间规划',
      '水电改造',
      '厨卫翻新',
      '地板更换',
      '软装搭配',
    ],
    icon: 'home',
  },
  {
    id: 'commercial',
    title: '商业空间',
    description: '店铺办公室焕新，提升品牌形象。专业团队快速施工，不影响正常营业。',
    features: [
      '商业空间设计',
      '品牌形象墙',
      '办公区域规划',
      '门头招牌',
      '快速施工',
    ],
    icon: 'building',
  },
  {
    id: 'custom',
    title: '定制服务',
    description: '根据需求定制专属焕新方案。专业顾问一对一服务，满足个性化需求。',
    features: [
      '免费上门测量',
      '个性化方案设计',
      '材料选配',
      '预算规划',
      '全程跟踪服务',
    ],
    icon: 'settings',
  },
];

export const companyInfo = {
  name: '福建省宜然焕新科技有限公司',
  shortName: '宜然焕新',
  brand: '三棵树马上住焕新服务',
  description: '专注于三棵树马上住焕新业务，为您提供专业的墙面翻新、旧房改造服务',
  phone: '400-xxx-xxxx',
  email: 'contact@yiran-huanxin.com',
  address: '福建省xxx市xxx区xxx路xxx号',
  workHours: '周一至周日 8:00-18:00',
  icp: '闽ICP备xxxxxxxx号',
};

export const advantages = [
  {
    title: '环保认证',
    description: '三棵树产品通过多项国际环保认证，守护家人健康',
    icon: 'shield',
  },
  {
    title: '快速施工',
    description: '专业团队高效施工，最快当天入住，不影响正常生活',
    icon: 'clock',
  },
  {
    title: '品质保障',
    description: '十年质保承诺，终身维护服务，让您无后顾之忧',
    icon: 'award',
  },
  {
    title: '专业团队',
    description: '经验丰富的施工团队，标准化作业流程，确保施工质量',
    icon: 'users',
  },
];

export const stats = [
  { value: '10+', label: '年行业经验' },
  { value: '5000+', label: '服务客户' },
  { value: '98%', label: '客户满意度' },
  { value: '10年', label: '质保承诺' },
];
