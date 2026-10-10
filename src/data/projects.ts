export interface ProjectItem {
  name: string
  url: string
  description: string
}

export const teams: ProjectItem[] = [
  { name: '光圈棱镜', url: 'https://www.aprism.top/', description: '创始者之一' },
  { name: 'MCJPG', url: 'https://mcjpg.org/', description: '审核' },
  { name: 'FurCraft', url: 'https://furcraft.top', description: '创始者' },
  { name: 'Fishpond Studio', url: 'https://fishpond.studio/', description: '核心成员' }
]

export const projects: ProjectItem[] = [
  { name: 'SPlayer-Dev/SPlayer-for-Android', url: 'https://github.com/SPlayer-Dev/SPlayer-for-Android', description: 'SPlayer 的安卓版' },
  { name: 'fishpond-studio/DMHub', url: 'https://github.com/fishpond-studio/DMHub', description: '小型团队开源域名协作管理平台' }
]
