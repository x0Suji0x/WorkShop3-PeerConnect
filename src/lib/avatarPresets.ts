export interface AvatarPreset {
  id: string
  label: string
  description: string
  url: string
  studioConfig: AvatarStudioConfig
}

export interface AvatarStudioConfig {
  skinTone: string
  hairStyle: 'short' | 'curly' | 'waves' | 'bob' | 'bun' | 'afro'
  hairColor: string
  outfitColor: string
  bgColor: string
  accessory: 'none' | 'glasses' | 'sunglasses' | 'headphones'
}

interface AvatarArtwork extends Omit<AvatarStudioConfig, 'bgColor' | 'accessory'> {
  backgroundStart: string
  backgroundEnd: string
  accent: string
  accessory?: 'glasses' | 'headphones' | 'earring'
}

function encodeSvg(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function hairArtwork(style: AvatarArtwork['hairStyle'], color: string) {
  switch (style) {
    case 'curly':
      return `<circle cx="38" cy="40" r="15" fill="${color}"/><circle cx="52" cy="33" r="17" fill="${color}"/><circle cx="66" cy="41" r="15" fill="${color}"/><circle cx="30" cy="52" r="11" fill="${color}"/><circle cx="74" cy="52" r="11" fill="${color}"/>`
    case 'waves':
      return `<path d="M28 58C24 26 76 22 73 58v18c-8-7-6-24-9-31-7-9-23-9-30 0-3 8-1 24-10 31z" fill="${color}"/>`
    case 'bob':
      return `<path d="M27 58C25 25 75 25 73 58l3 16c-9-2-9-17-10-25-7-12-25-12-32 0-1 8-2 23-10 25z" fill="${color}"/>`
    case 'bun':
      return `<circle cx="50" cy="24" r="13" fill="${color}"/><path d="M30 57c0-33 40-33 40 0-6-12-11-18-20-18s-14 6-20 18z" fill="${color}"/>`
    case 'afro':
      return `<circle cx="50" cy="45" r="31" fill="${color}"/>`
    default:
      return `<path d="M29 56c0-32 43-36 44 0-9-11-15-15-23-15s-14 4-21 15z" fill="${color}"/>`
  }
}

function accessoryArtwork(accessory: AvatarArtwork['accessory']) {
  if (accessory === 'glasses') {
    return '<g fill="none" stroke="#15231E" stroke-width="3"><rect x="34" y="51" width="14" height="10" rx="4"/><rect x="52" y="51" width="14" height="10" rx="4"/><path d="M48 56h4"/></g>'
  }

  if (accessory === 'headphones') {
    return '<g fill="none" stroke="#182C48" stroke-width="4" stroke-linecap="round"><path d="M27 59a23 23 0 0146 0"/><path d="M28 58v12M72 58v12"/></g><rect x="23" y="62" width="9" height="15" rx="4" fill="#182C48"/><rect x="68" y="62" width="9" height="15" rx="4" fill="#182C48"/>'
  }

  if (accessory === 'earring') {
    return '<circle cx="69" cy="65" r="4" fill="#F7CA4D"/><circle cx="69" cy="65" r="1.5" fill="#FFF4BF"/>'
  }

  return ''
}

function makeAvatarArtwork(art: AvatarArtwork) {
  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="${art.backgroundStart}"/>
          <stop offset="1" stop-color="${art.backgroundEnd}"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="32" fill="url(#bg)"/>
      <circle cx="82" cy="18" r="17" fill="${art.accent}" opacity=".42"/>
      <path d="M-7 22C8 12 18 14 24 2M76 95c8-18 19-18 31-28" fill="none" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/>
      <path d="M17 100c1-20 14-29 33-29s32 9 33 29z" fill="${art.outfitColor}"/>
      <path d="M36 100l14-21 14 21" fill="#fff" opacity=".14"/>
      <path d="M44 70h12v13H44z" fill="${art.skinTone}"/>
      <circle cx="50" cy="51" r="20" fill="${art.skinTone}"/>
      ${hairArtwork(art.hairStyle, art.hairColor)}
      <path d="M38 53c2 1 4 1 6 0M56 53c2 1 4 1 6 0" fill="none" stroke="#17231F" stroke-width="2" stroke-linecap="round"/>
      <path d="M45 63c3 3 7 3 10 0" fill="none" stroke="#17231F" stroke-width="2" stroke-linecap="round"/>
      ${accessoryArtwork(art.accessory)}
      <circle cx="19" cy="25" r="3" fill="#fff" opacity=".8"/>
      <path d="M18 17v5M15.5 19.5h5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".9"/>
    </svg>
  `.trim())
}

const presetArtwork: Array<Omit<AvatarPreset, 'url'> & { artwork: AvatarArtwork }> = [
  { id: 'mint-spark', label: 'Mint Spark', description: 'Fresh & optimistic', studioConfig: { skinTone: '#D99B77', hairStyle: 'curly', hairColor: '#301F1B', outfitColor: '#173F35', bgColor: '#E3F4EB', accessory: 'none' }, artwork: { backgroundStart: '#16C79A', backgroundEnd: '#8DE1CB', accent: '#FFFFFF', skinTone: '#D99B77', hairColor: '#301F1B', outfitColor: '#173F35', hairStyle: 'curly', accessory: 'earring' } },
  { id: 'violet-signal', label: 'Violet Signal', description: 'Creative & bold', studioConfig: { skinTone: '#8C5338', hairStyle: 'waves', hairColor: '#1D1722', outfitColor: '#30245D', bgColor: '#EDE9FE', accessory: 'glasses' }, artwork: { backgroundStart: '#7157D9', backgroundEnd: '#C4B5FD', accent: '#F7CA4D', skinTone: '#8C5338', hairColor: '#1D1722', outfitColor: '#30245D', hairStyle: 'waves', accessory: 'glasses' } },
  { id: 'coral-kick', label: 'Coral Kick', description: 'Energetic & social', studioConfig: { skinTone: '#F3C7A5', hairStyle: 'bob', hairColor: '#4B2A1E', outfitColor: '#A93638', bgColor: '#FFEDD5', accessory: 'none' }, artwork: { backgroundStart: '#FA7657', backgroundEnd: '#FBC38C', accent: '#FFE0CF', skinTone: '#F3C7A5', hairColor: '#4B2A1E', outfitColor: '#A93638', hairStyle: 'bob', accessory: 'earring' } },
  { id: 'blue-room', label: 'Blue Room', description: 'Calm & curious', studioConfig: { skinTone: '#BA7854', hairStyle: 'short', hairColor: '#1B202B', outfitColor: '#1E3A8A', bgColor: '#E0F2FE', accessory: 'headphones' }, artwork: { backgroundStart: '#4087D8', backgroundEnd: '#9CD8FA', accent: '#E6F6FF', skinTone: '#BA7854', hairColor: '#1B202B', outfitColor: '#19345E', hairStyle: 'short', accessory: 'headphones' } },
  { id: 'solar-pop', label: 'Solar Pop', description: 'Warm & playful', studioConfig: { skinTone: '#543224', hairStyle: 'afro', hairColor: '#1F1512', outfitColor: '#A94C22', bgColor: '#FEF3C7', accessory: 'none' }, artwork: { backgroundStart: '#F5B83B', backgroundEnd: '#FDE68A', accent: '#FFF7D6', skinTone: '#543224', hairColor: '#1F1512', outfitColor: '#A94C22', hairStyle: 'afro' } },
  { id: 'berry-wave', label: 'Berry Wave', description: 'Expressive & kind', studioConfig: { skinTone: '#FDDFCC', hairStyle: 'bun', hairColor: '#563442', outfitColor: '#6B2258', bgColor: '#FCE7F3', accessory: 'glasses' }, artwork: { backgroundStart: '#D3538B', backgroundEnd: '#F2A4C5', accent: '#FFE4F0', skinTone: '#FDDFCC', hairColor: '#563442', outfitColor: '#6B2258', hairStyle: 'bun', accessory: 'glasses' } },
  { id: 'forest-mode', label: 'Forest Mode', description: 'Grounded & focused', studioConfig: { skinTone: '#BA7854', hairStyle: 'short', hairColor: '#171916', outfitColor: '#14352D', bgColor: '#ECFDF5', accessory: 'headphones' }, artwork: { backgroundStart: '#235E4B', backgroundEnd: '#8DBD9E', accent: '#D9F7E7', skinTone: '#BA7854', hairColor: '#171916', outfitColor: '#14352D', hairStyle: 'short', accessory: 'headphones' } },
  { id: 'rose-glow', label: 'Rose Glow', description: 'Bright & thoughtful', studioConfig: { skinTone: '#D99B77', hairStyle: 'curly', hairColor: '#2D1B21', outfitColor: '#8B3155', bgColor: '#FCE7F3', accessory: 'none' }, artwork: { backgroundStart: '#E6789D', backgroundEnd: '#F7C4D4', accent: '#FFF4FA', skinTone: '#D99B77', hairColor: '#2D1B21', outfitColor: '#8B3155', hairStyle: 'curly', accessory: 'earring' } },
]

export const AVATAR_PRESETS: AvatarPreset[] = presetArtwork.map(({ artwork, ...preset }) => ({
  ...preset,
  url: makeAvatarArtwork(artwork),
}))

export const DEFAULT_AVATAR_URL = AVATAR_PRESETS[0].url
