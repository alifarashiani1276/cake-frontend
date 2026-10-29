// شش تصویر وکتور شیرینی؛ همه با پالت نرم سایت کشیده شده‌اند و در هر اندازه شفاف می‌مانند.
const C = {
  cream: "#f1e5d0", linen: "#e1d1ba", sage: "#d3cdb1", clay: "#7a5636", tan: "#c49a6c",
  milk: "#faf4e8", crumb: "#d9b98c", berry: "#b4635f", berryDark: "#8f4a48", leaf: "#8e9a74",
  rose: "#e6c3b5", roseDark: "#d3a898", pistachio: "#c6cca9", flame: "#e9b36b",
};

const Shadow = ({ rx = 62, cy = 168 }) => <ellipse cx="100" cy={cy} rx={rx} ry="7" fill={C.clay} opacity=".16" />;

function Svg({ children, label }) {
  return (
    <svg viewBox="30 36 140 132" role="img" aria-label={label} className="h-full w-full">
      {children}
    </svg>
  );
}

const Strawberry = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 -9 C9 -9 11 0 6 8 C3 12 -3 12 -6 8 C-11 0 -9 -9 0 -9Z" fill={C.berry} />
    <path d="M-6 -3 C-3 -7 3 -7 6 -3" stroke={C.berryDark} strokeWidth="1" fill="none" opacity=".5" />
    <path d="M-6 -9 L0 -13 L6 -9 L2 -7 L0 -9 L-2 -7Z" fill={C.leaf} />
    {[[-3, 0], [3, 1], [0, 5], [-4, 5], [4, 6]].map(([a, b], i) => (
      <ellipse key={i} cx={a} cy={b} rx=".9" ry="1.3" fill={C.cream} opacity=".7" />
    ))}
  </g>
);

export function CakeArt() {
  return (
    <Svg label="کیک خامه‌ای با توت‌فرنگی و یک شمع">
      <defs>
        <linearGradient id="cake-body" x1="0" x2="1">
          <stop offset="0" stopColor={C.cream} /><stop offset=".55" stopColor={C.milk} /><stop offset="1" stopColor={C.linen} />
        </linearGradient>
        <linearGradient id="cake-plate" x1="0" x2="1">
          <stop offset="0" stopColor={C.linen} /><stop offset=".5" stopColor={C.milk} /><stop offset="1" stopColor={C.sage} />
        </linearGradient>
      </defs>
      <Shadow rx={74} cy={170} />
      <ellipse cx="100" cy="160" rx="76" ry="13" fill="url(#cake-plate)" />
      <ellipse cx="100" cy="157" rx="66" ry="9.5" fill={C.milk} opacity=".7" />
      <path d="M46 100 V150 C46 158 154 158 154 150 V100Z" fill="url(#cake-body)" />
      <path d="M46 122 C70 127 130 127 154 122 V128 C130 133 70 133 46 128Z" fill={C.crumb} opacity=".55" />
      <path d="M46 139 C70 144 130 144 154 139 V144 C130 149 70 149 46 144Z" fill={C.crumb} opacity=".45" />
      <ellipse cx="100" cy="100" rx="54" ry="13" fill={C.milk} />
      <ellipse cx="100" cy="100" rx="54" ry="13" fill="none" stroke={C.linen} strokeWidth="1.2" />
      <Strawberry x="68" y="96" s="1" r="-14" />
      <Strawberry x="84" y="102" s=".9" r="8" />
      <Strawberry x="118" y="102" s=".95" r="-8" />
      <Strawberry x="134" y="96" s="1" r="16" />
      <Strawberry x="62" y="148" s=".95" r="-10" />
      <Strawberry x="140" y="150" s="1" r="12" />
      <rect x="96.5" y="62" width="7" height="40" rx="2" fill={C.cream} stroke={C.sage} strokeWidth="1" />
      <path d="M100 42 C106 50 107 56 100 61 C93 56 94 50 100 42Z" fill={C.flame} />
      <path d="M100 49 C103 53 103 57 100 60 C97 57 97 53 100 49Z" fill={C.milk} opacity=".9" />
    </Svg>
  );
}

export function TartArt() {
  return (
    <Svg label="تارت با خامه و تمشک">
      <defs>
        <linearGradient id="tart-crust" x1="0" x2="1">
          <stop offset="0" stopColor={C.tan} /><stop offset=".5" stopColor={C.crumb} /><stop offset="1" stopColor={C.tan} />
        </linearGradient>
        <linearGradient id="tart-cream" x1="0" x2="1">
          <stop offset="0" stopColor={C.cream} /><stop offset=".5" stopColor={C.milk} /><stop offset="1" stopColor={C.linen} />
        </linearGradient>
      </defs>
      <Shadow rx={58} cy={166} />
      <path d="M44 112 L56 158 C58 164 142 164 144 158 L156 112Z" fill="url(#tart-crust)" />
      {[62, 76, 90, 104, 118, 132].map((x) => (
        <path key={x} d={`M${x} 118 L${x + 1.5} 160`} stroke={C.clay} strokeWidth="1" opacity=".18" />
      ))}
      <ellipse cx="100" cy="112" rx="56" ry="13" fill={C.crumb} />
      <ellipse cx="100" cy="109" rx="49" ry="10" fill="url(#tart-cream)" />
      <path d="M64 108 C64 92 136 92 136 108 C136 114 64 114 64 108Z" fill="url(#tart-cream)" />
      <path d="M72 94 C72 80 128 80 128 94 C128 100 72 100 72 94Z" fill={C.milk} />
      <path d="M82 82 C82 68 118 68 118 82 C118 88 82 88 82 82Z" fill="url(#tart-cream)" />
      <path d="M92 70 C94 58 106 58 108 70 C108 74 92 74 92 70Z" fill={C.milk} />
      <path d="M96 60 C98 54 102 54 104 60" stroke={C.cream} strokeWidth="2" fill="none" />
      <g transform="translate(100 56)">
        <circle r="8" fill={C.berry} />
        {[[-3, -2], [3, -2], [0, 2], [-4, 3], [4, 3], [0, -5]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="2.2" fill={C.berryDark} opacity=".35" />)}
        <path d="M-1 -7 C2 -13 8 -12 9 -9 C5 -7 2 -7 -1 -7Z" fill={C.leaf} />
      </g>
    </Svg>
  );
}

export function CookieArt() {
  return (
    <Svg label="کوکی قلبی با پودر قند">
      <defs>
        <radialGradient id="cookie-g" cx=".4" cy=".35" r=".8">
          <stop offset="0" stopColor="#e7cda0" /><stop offset=".7" stopColor={C.crumb} /><stop offset="1" stopColor={C.tan} />
        </radialGradient>
      </defs>
      <Shadow rx={52} cy={168} />
      <path d="M100 160 C36 122 36 66 74 60 C90 58 100 68 100 80 C100 68 110 58 126 60 C164 66 164 122 100 160Z" fill="url(#cookie-g)" />
      <path d="M100 150 C48 118 48 72 76 68 C90 66 100 74 100 86 C100 74 110 66 124 68 C152 72 152 118 100 150Z" fill="none" stroke={C.cream} strokeWidth="1.5" opacity=".5" />
      {[[70, 82], [84, 96], [62, 100], [78, 116], [100, 128], [122, 116], [138, 100], [118, 96], [130, 80], [100, 100], [92, 84], [110, 86], [96, 142], [108, 140]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.6 : 1.7} fill={C.milk} opacity=".85" />
      ))}
    </Svg>
  );
}

export function CroissantArt() {
  const seg = [
    { x: 40, y: 124, rx: 12, ry: 18, r: -50 },
    { x: 58, y: 100, rx: 17, ry: 25, r: -30 },
    { x: 86, y: 86, rx: 21, ry: 31, r: -8 },
    { x: 118, y: 90, rx: 20, ry: 30, r: 14 },
    { x: 144, y: 108, rx: 16, ry: 24, r: 34 },
    { x: 158, y: 130, rx: 11, ry: 17, r: 52 },
  ];
  return (
    <Svg label="کروسان کره‌ای">
      <defs>
        <linearGradient id="cr-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3bf8a" /><stop offset=".6" stopColor={C.tan} /><stop offset="1" stopColor="#a97e50" />
        </linearGradient>
      </defs>
      <Shadow rx={66} cy={160} />
      {seg.map((s, i) => (
        <g key={i} transform={`rotate(${s.r} ${s.x} ${s.y})`}>
          <ellipse cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill="url(#cr-g)" />
          <path d={`M${s.x - s.rx * 0.6} ${s.y - s.ry * 0.7} C${s.x - s.rx * 0.2} ${s.y - s.ry * 0.2} ${s.x - s.rx * 0.2} ${s.y + s.ry * 0.3} ${s.x - s.rx * 0.6} ${s.y + s.ry * 0.7}`} stroke={C.cream} strokeWidth="1.6" fill="none" opacity=".5" />
          <ellipse cx={s.x + s.rx * 0.2} cy={s.y - s.ry * 0.45} rx={s.rx * 0.35} ry={s.ry * 0.18} fill={C.cream} opacity=".35" />
        </g>
      ))}
    </Svg>
  );
}

export function CupcakeArt() {
  return (
    <Svg label="کاپ‌کیک وانیلی">
      <defs>
        <linearGradient id="cc-wrap" x1="0" x2="1">
          <stop offset="0" stopColor={C.sage} /><stop offset=".5" stopColor="#e6e0c6" /><stop offset="1" stopColor={C.sage} />
        </linearGradient>
        <linearGradient id="cc-frost" x1="0" x2="1">
          <stop offset="0" stopColor={C.cream} /><stop offset=".5" stopColor={C.milk} /><stop offset="1" stopColor={C.linen} />
        </linearGradient>
      </defs>
      <Shadow rx={46} cy={166} />
      <path d="M58 108 L70 162 H130 L142 108Z" fill="url(#cc-wrap)" />
      {[78, 90, 102, 114, 126].map((x, i) => <path key={x} d={`M${58 + i * 3} 110 L${x} 162`} stroke={C.clay} strokeWidth="1" opacity=".15" />)}
      <path d="M52 112 C52 96 148 96 148 112 C148 118 52 118 52 112Z" fill={C.crumb} />
      <path d="M56 106 C56 86 144 86 144 106 C144 114 56 114 56 106Z" fill="url(#cc-frost)" />
      <path d="M66 90 C66 72 134 72 134 90 C134 98 66 98 66 90Z" fill={C.milk} />
      <path d="M78 76 C78 60 122 60 122 76 C122 83 78 83 78 76Z" fill="url(#cc-frost)" />
      <path d="M90 62 C92 48 108 48 110 62 C110 67 90 67 90 62Z" fill={C.milk} />
      <path d="M97 51 C99 44 101 44 103 51" stroke={C.cream} strokeWidth="2.5" fill="none" />
      <circle cx="100" cy="46" r="6.5" fill={C.berry} />
      <path d="M100 40 C103 34 108 35 109 38 C105 40 102 40 100 40Z" fill={C.leaf} />
    </Svg>
  );
}

export function MacaronArt() {
  const Mac = ({ x, y, shell, shellDark, r = 0 }) => (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M-36 -2 C-36 -22 36 -22 36 -2 C36 2 -36 2 -36 -2Z" fill={shell} />
      <rect x="-33" y="-2" width="66" height="9" rx="4.5" fill={C.milk} />
      <path d="M-36 8 C-36 -2 36 -2 36 8 C36 26 -36 26 -36 8Z" fill={shell} />
      <path d="M-30 -10 C-12 -17 12 -17 30 -10" stroke={C.cream} strokeWidth="2" fill="none" opacity=".6" strokeLinecap="round" />
      <path d="M-34 -3 C-34 -5 34 -5 34 -3" stroke={shellDark} strokeWidth="1.5" fill="none" opacity=".5" />
      <path d="M-32 12 C-20 22 20 22 32 12" stroke={shellDark} strokeWidth="1.5" fill="none" opacity=".35" />
    </g>
  );
  return (
    <Svg label="ماکارون‌ها">
      <Shadow rx={64} cy={168} />
      <Mac x="76" y="140" shell={C.pistachio} shellDark="#a8ae88" r="-6" />
      <Mac x="112" y="104" shell={C.rose} shellDark={C.roseDark} r="8" />
    </Svg>
  );
}

export const PASTRY_ART = {
  cake: CakeArt, tart: TartArt, cookie: CookieArt, croissant: CroissantArt, cupcake: CupcakeArt, macaron: MacaronArt,
};
