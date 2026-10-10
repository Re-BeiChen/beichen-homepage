export interface SocialLink {
  icon: string
  label: string
  text: string
  url: string
  external?: boolean
}

export const socialLinks: SocialLink[] = [
  { icon: 'mail', label: '邮件', text: 'admin@furcraft.top', url: 'mailto:admin@furcraft.top' },
  { icon: 'message-circle', label: '微信', text: '扫描二维码或搜索 BeiChen_2009', url: '/images/wechat.png', external: true },
  { icon: 'message-square', label: 'QQ', text: '3579267163', url: 'https://qm.qq.com/q/5oMXOCmOUE', external: true },
  { icon: 'send', label: 'Telegram', text: '@BeiChen314', url: 'https://t.me/BeiChen314', external: true },
  { icon: 'music', label: '抖音', text: '北尘', url: 'https://www.douyin.com/user/MS4wLjABAAAAgwbK3SDMw7Tu3mYcf8Pbukct9sE4d_anj6rHmo9cSeWBfdIL0vYypiNofurhM99b', external: true },
  { icon: 'tv', label: 'bilibili', text: '北尘在努力', url: 'https://space.bilibili.com/1299753224', external: true }
]
