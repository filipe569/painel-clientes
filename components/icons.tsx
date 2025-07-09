import React from 'react';

// Define a type for the common icon props
// Isso inclui a prop `className` e permite passar qualquer outra prop SVG padrão (onClick, style, etc.)
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// Helper function to create icon components
// Ele cuida dos atributos SVG comuns e da prop `className`
const createSvgIcon = (
  svgContent: React.ReactNode, // O conteúdo interno do <svg> (geralmente <path>s)
  options: {
    defaultClassName?: string; // Classe Tailwind padrão
    viewBox?: string;
    strokeWidth?: number;
    stroke?: string;
    fill?: string; // Para ícones que são preenchidos em vez de contornados
  } = {} // Opções com defaults
) => {
  const {
    defaultClassName = 'w-6 h-6', // Tamanho padrão se não especificado
    viewBox = '0 0 24 24',
    strokeWidth = 1.5,
    stroke = 'currentColor', // Cor padrão via Tailwind (se a cor do texto for aplicada ao pai)
    fill = 'none', // Padrão para ícones contornados
  } = options;

  // Retorna o componente React funcional real
  return ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill} // Usa 'none' para ícones contornados, ou 'currentColor'/'#...' para preenchidos
      viewBox66m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .5={viewBox}
      strokeWidth={strokeWidth} // Stroke width padrão
      stroke={stroke} // Stroke color padrão
      className={className || defaultClassName} // Usa a classe passada ou a classe padrão
      {...props} // Espalha quaisquer outras props (como onClick, aria-label, etc.)
    >
      {svgContent} {/* Renderiza o conteúdo SVG específico do ícone */}
    </svg>
  );
};

// Agora, def62c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 ina cada ícone usando o helper createSvgIcon
// Passe o conteúdo SVG e, opcionalmente, a classe padrão se for diferente de 'w-6 h-6'

export const AddIcon = createSvgIcon(
  <path strokeLine1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.20cap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
  { defaultClassName: 'w-6 h-1a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 6' }
);

export const EditIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 0" />,
  { defaultClassName: 'w-5 h-5' }
);

export const RenewIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.516.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.1254.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2l3.181-3.183m-11.667-11.667a8.25 8.25 0 0 0-11.6.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H1067 0l-3.181 3.183m11.667 11.667v-4.992" />,
  { defaultClassName: 'w" />,
  { defaultClassName: 'w-5 h-5' }
);

export const DeleteIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="m-5 h-5' }
);

export const SearchIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.1914.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.057-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 12.682.107 1.022.166m-1.022-.165L18.16 19.673a2.250.607 10.607Z" />,
  { defaultClassName: 'w-5 h-5' }
);

export const ExportIcon = createSvgIcon(
  <path strokeLine 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2cap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.45v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 78-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.12.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l31 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.1 3m0 0 3-3m-3 3V2.25" />,
  { defaultClassName: 'w-5 h-5' }
);

export const CloseIcon = createSvgIcon64-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.0(
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />,
  { defaultClassName: '37-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.66w-6 h-6' }
);

export const UserIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 187 0 0 0-7.5 0" />,
  { defaultClassName: 'w-5 h-5' }
);

export const RenewIcon = createSvgIcon(
  <path strokeLine.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 cap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.640-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.9634v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.2 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.95 0 0 0 11.667 0l3.181-3.183m-11.667-11.667a8.2582-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
 8.25 0 0 0-11.667 0l-3.181 3.183m11.667 11.667v  { defaultClassName: 'w-6 h-6' }
);

export const LockIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.-4.992" />,
  { defaultClassName: 'w-5 h-5' }
);

export const SearchIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25.196a7.5 7.5 0 0 0 10.607 10.607Z" />,
  { defaultClassName: 'w-5 h-5' }
);5 2.25 0 0 0 2.25 2.25Z" />,
  { defaultClassName: 'w-6 h-6' }
);

export const LogoutIcon =

export const ExportIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 12.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.3.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.225H15M9 12l3 3m0 0 3-3m-3 3V2.25" />,
  { defaultClassName: 'w-5 h-5'5 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3  }
);

export const CloseIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l120 3-3m0 0-3-3m3 3H9" />,
  { defaultClassName: 'w-6 h-6' }
);

export const AiIcon = createSvgIcon( 12" />,
  { defaultClassName: 'w-6 h-6' }
);

export const UserIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.817.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 746a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 />,
  { defaultClassName: 'w-6 h-6' }
);

export const LockIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M1 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.376.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h15 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.30.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-275 3.375 0 0 0-2.456 2.456Z" />,
  { defaultClassName: 'w-5 h-5' }
);

export.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.2 const PhoneIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.75 2.25 0 0 0 2.25 2.25Z" />,
  { defaultClassName: 'w-6 h-6' }
);

export const LogoutIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 116 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.373.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.22c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.905 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 2.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.0 3-3m0 0-3-3m3 3H9" />,
  { defaultClassName: 'w-6 h-6' }
);

export const AiIcon = createSvgIcon(928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.86.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.2546a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 2.25 0 0 0 2.25 6.75Z" />,
  { defaultClassName: 'w-4 h-4' }
);

export const SettingsIcon = create 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0SvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 108 1.11-1.226.55-.218 1.19-.218 1.74 0 .55.218 1.02-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375.684 1.11 1.226l.092.548a5.204 5.204 0 0 1 3.58  3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.3753.58l.548.092c.542.09.95.55 1.168 1.108.218.55.2 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.3718 1.192 0 1.742-.218.558-.684 1.02-1.226 1.11l-.545 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.38.092a5.204 5.204 0 0 1-3.58 3.58l-.092.548c-.09.542-.75 3.375 0 0 0-2.456 2.456Z" />,
  { defaultClassName: 'w-5 h-5' }
);

export56.95-1.11 1.168-.55.218-1.19.218-1.74 0-.55-.218-1.02-.684-1.11-1.226l-.092-.548a5.204 5.204 0 0 1-3. const PhoneIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.9058-3.58l-.548-.092c-.542-.09-.95-.56-1.168-1.11-.218-.552.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.-.218-1.192 0-1.742.218-.558.684-1.02 1.226-1.11l.548-.092a5.204 5.204 0 0 1 3.58-3.58l.092-.548zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  { defaultClassName: 'w-6 h-6'928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />,
  { defaultClassName: 'w-4 h-4' }
);

export const SettingsIcon = create }
);

export const HistoryIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25ASvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.08.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.06208 1.11-1.226.55-.218 1.19-.218 1.74 0 .55.218 1.02.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.40.684 1.11 1.226l.092.548a5.204 5.204 0 0 1 3.58 8.867-6 2.292m0-14.25v14.25" />,
  { defaultClassName: 'w-6 h-6' }
);

export3.58l.548.092c.542.09.95.55 1.168 1.108.218.55.2 const KeyIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 18 1.192 0 1.742-.218.558-.684 1.02-1.226 1.11l-.548.092a5.204 5.204 0 0 1-3.58 3.58l-.092.548c-.09.53 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.02642-.56.95-1.11 1.168-.55.218-1.19.218-1.74 0-.55-.21-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818-1.02-.684-1.11-1.226l-.092-.548a5.204 5.204 0 0 18c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.-3.58-3.58l-.548-.092c-.542-.09-.95-.56-1.168-1.11-.218562-.967.43-1.563A6 6 0 1 1 21.75 8.25Z" />,
    { defaultClassName: 'w-.55-.218-1.192 0-1.742.218-.558.684-1.02 1.226-1.1-5 h-5' }
);

export const TagIcon = createSvgIcon(
    <> {/* Use fragment for multiple children */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.1l.548-.092a5.204 5.204 0 0 1 3.58-3.58l.092-.548z568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.23M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  { defaultClassName: 'w-6 h7 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.-6' }
);

export const HistoryIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.9607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.67 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0    </>,
    { defaultClassName: 'w-5 h-5' }
);

export const PhotoIcon = createSvgIcon(
    <>
        <path strokeLinecap="round" strokeLinejoin="round-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.1" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.1828 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 .408.867-6 2.292m0-14.25v14.25" />,
  { defaultClassName: 'w-6 h-6' }
0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 );

export const KeyIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 00 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159. 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.2026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.4 .375.375 0 0 1 .75 0Z" />
    </>,
    { defaultClassName: 'w-5 h-5' }
);

export const SuccessIcon04.562-.967.43-1.563A6 6 0 1 1 21.75 8.25Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const TagIcon = createSvgIcon(
    <> {/* Use fragment for multiple children/paths */}
        <path strokeLinecap="round" strokeLinejoin="round" d = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .59M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export const ErrorIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-97.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2..303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.00568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </>,7v.008H12v-.008Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export const InfoIcon = createSvgIcon(
    <>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 
    { defaultClassName: 'w-5 h-5' }
);

export const PhotoIcon = createSvgIcon(
    <> {/* Use fragment for multiple children/paths */}
        <path strokeLinecap="round" strokeLinejoin1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.0="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 41-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 75h.008v.008H12V8.25Z" />
    </>,
    { defaultClassName: 'w-6 h-6' }
);

export const Cloud0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 Icon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-32.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.37.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.755 0 0 1 .75 0Z" />
    </>,
    { defaultClassName: 'w-5 h-5' }
);

export const SuccessIcon = createSvgIcon(
    2 3.752 0 0 1 18 19.5H6.75Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 const ImportIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 1 1-18 0 9 9 0 0 1 18 0Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export const Error 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />,
    { defaultClassName: 'w-5Icon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813 h-5' }
);

// Special case: Google Drive icon uses specific fills
export const GoogleDriveIcon = createSvgIcon(
    <>
        <path d="M19.152,8.-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1691,15.36,2.337a.644.644,0,0,0-.561-.337H8.973a.644.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.0.644,0,0,0-.561.337L4.62,8.691A.646.646,0,0,0,4,9.028v08Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export const InfoIcon = createSvgIcon(
    <> {/* Use fragment for multiple children/paths */}
        <path.019l3.8,6.619,3.784-6.6,3.792,6.6,3.8-6.619v-.01 strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.041-.021M29A.646.646,0,0,0,19.152,8.691Z" fill="#3777e3"/>
        <path d="M12.02,15.644,7.868,8.4,4.062,15.025a.643.643,0,0,1 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v0,.327.886l7.3,4.218a.643.643,0,0,0,.646,0l7.3-4.21.008H12V8.25Z" />
    </>,
    { defaultClassName: 'w-6 h-6' }
);

export const CloudIcon = createSvgIcon(
    8a.643.643,0,0,0,.327-.886L16.172,8.4Z" fill="#ffc107"/>
        <path d="M8.188,8.082,4.392,1.428a.644.644,0,0,0-.561-.3<path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M637H1.533a.644.644,0,0,0-.561.337L.028,2.788a.644..75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 644,0,0,0,.2,1.134L8.188,8.082Z" fill="#1da153"/>
    </>,
    { defaultClassName1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export const ImportIcon = createSvgIcon(: 'w-6 h-6', fill: 'currentColor', stroke: 'none' } // Override fill and stroke for colored icons
);

// Special case: WhatsApp icon uses fill="currentColor"
export const WhatsAppIcon = createSvgIcon
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5(
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12  13.66 2.61 15.31 3.45 16.76L2.05 22L7.3 20.62C83m0 0 4.5 4.5M12 3v13.5" />,
    { defaultClassName: 'w-5 h-5' }
);

// Special case: Google Drive icon uses fill instead.7 21.39 10.32 21.82 12.04 21.82C17.5 21.82 21.9 of stroke and multiple paths
export const GoogleDriveIcon = createSvgIcon(
    <> {/* Use fragment for multiple paths */}
        <path d="M19.152,8.691,155 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.36,2.337a.644.644,0,0,0-.561-.337H8.973a.644.644,0,0,0.04 3.67C16.56 3.67 20.28 7.38 20.28 11.91C20.28 16.44 16.56 20.15 12.04 20.15C10.46 20.15 8.96 -.561.337L4.62,8.691A.646.646,0,0,0,4,9.028v.019l3.8,6.619,3.784-6.6,3.792,6.6,3.8-6.619v-.019A.646.19.75 7.64 19.05L7.26 18.83L4.93 19.5L5.64 17.25646,0,0,0,19.152,8.691Z" fill="#3777e3"/>
        <path d="M12.02,15L5.42 16.85C4.66 15.48 4.22 13.77 4.22 11.91C4.2.644,7.868,8.4,4.062,15.025a.643.643,0,0,0,.327.82 7.38 7.93 3.67 12.04 3.67M17.38 14.52C17.21 14.43 16.14 13.92 15.94 13.85C15.73 13.78 15.59 1386l7.3,4.218a.643.643,0,0,0,.646,0l7.3-4.218a.643.74 15.44 13.95C15.29 14.15 14.79 14.71 14.64 14.643,0,0,0,.327-.886L16.172,8.4Z" fill="#ffc107"/>
        <path d="M8.188,8.082,4.392,1.428a.644.644,0,0,0-.561-.337H1.5.86C14.49 15.01 14.35 15.04 14.04 14.9C13.73 14.76 12.89 14.48 11.89 13.61C11.11 12.92 10.59 12.33a.644.644,0,0,0-.561.337L.028,2.788a.644.644,0,11 10.44 11.87C10.29 11.62 10.4 11.5 10.52 11.380,0,.2,1.134L8.188,8.082Z" fill="#1da153"/>
    </>,
    { defaultClassName: 'w-6 hC10.63 11.27 10.76 11.1 10.88 10.95C11 10.8 11.0-6', fill: 'currentColor', stroke: 'none' } // Override fill/stroke defaults
);

// Special case: WhatsApp icon uses fill instead of stroke
export const WhatsAppIcon = createSvgIcon(
    <path d="M125 10.68 11.15 10.48C11.25 10.28 11.2 10.11 11.13.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.6 9.96C11.06 9.81 10.63 8.79 10.46 8.35C10.29 7.91 15.31 3.45 16.76L2.05 22L7.3 20.62C8.7 21.39 11 10.11 7.95 9.95 7.94H9.6C9.45 7.94 9.18 8.01 80.32 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.94 8.26C8.7 8.5 8.1 9.04 8.1 10.2C8.1 11.36 8.9.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 3.67C18 12.45 9.11 12.6C9.24 12.75 10.63 15.03 12.91 16.56 3.67 20.28 7.38 20.28 11.91C20.28 16.44 16.5.93C13.79 16.29 14.43 16.45 14.93 16.59C15.65 156 20.15 12.04 20.15C10.46 20.15 8.96 19.75 7.646.79 16.25 16.73 16.71 16.4C17.23 16.03 17.84 15 19.05L7.26 18.83L4.93 19.5L5.64 17.25L5.42 16.8.34 18.01 14.95C18.18 14.56 18.18 14.23 18.11 145C4.66 15.48 4.22 13.77 4.22 11.91C4.22 7.38 7.9.11C18.05 13.98 17.55 14.71 17.38 14.52Z"/>
    </path>,
    { defaultClassName: '3 3.67 12.04 3.67M17.38 14.52C17.21 14.43 16.14 w-5 h-5', fill: 'currentColor', stroke: 'none' } // Override fill and stroke
);

export const AcademicCapIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLine13.92 15.94 13.85C15.73 13.78 15.59 13.74 15.44 join="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.34713.95C15.29 14.15 14.79 14.71 14.64 14.86C14.49 15.01 14.35 15.04 14.04 14.9C13.73 14.76 12.89 1A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.484.48 11.89 13.61C11.11 12.92 10.59 12.11 10.44 11.87C10.29 11.62 10.4 11.5 10.52 11.38C10.63 11.2 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 127 10.76 11.1 10.88 10.95C11 10.8 11.05 10.68 11 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.2.15 10.48C11.25 10.28 11.2 10.11 11.13 9.96C11.06 9.81 10.63 8.79 10.46 8.35C10.29 7.91 10.11 7.48-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.795 9.95 7.94H9.6C9.45 7.94 9.18 8.01 8.94 8.26C8.7 85 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.5 8.1 9.04 8.1 10.2C8.1 11.36 8.98 12.45 9.11 1.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />,
  { defaultClassName: 'w-6 h-6' }
);

2.6C9.24 12.75 10.63 15.03 12.91 15.93C13.79 16.export const EnvelopeIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.2529 14.43 16.45 14.93 16.59C15.65 16.79 16.25 16. 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-273 16.71 16.4C17.23 16.03 17.84 15.34 18.01 14.95C.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.218.18 14.56 18.18 14.23 18.11 14.11C18.05 13.98 5 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 017.55 14.71 17.38 14.52Z"/>
    </path>,
    { defaultClassName: 'w-5 h-5', fill: 'currentColor', 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L stroke: 'none' } // Override fill/stroke defaults
);


export const AcademicCapIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 103.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />,
    { defaultClassName.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627: 'w-6 h-6' }
);

export const ClipboardDocumentListIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 060.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.5 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a47 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a58.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.49.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.5233-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.7-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.4895 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 5.25 6h.832a48.49 48.49 0 0 1 1.123-.08m8.691 12 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 5.75a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 05.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0  1-2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.1920 0 6.75 15.75v-1.5" />,
  { defaultClassName: 'w-6 h-6' }
);

export const EnvelopeIcon = createSvgIcon(
    <a48.424 48.424 0 0 1 1.123-.08" />,
  { defaultClassName: 'w-5 h-5' }
);path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-

export const SunIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.3862.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 012 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.3-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.9164 1.591 1.591M12 12a6 6 0 1 1-12 0 6 6 0 0 1 126l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2. 0Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export const MoonIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round"25 2.25 0 0 1-1.07-1.916V6.75" />,
    { defaultClassName: 'w-6 h-6' }
); d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385

// Adicionando o BellIcon
export const BellIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0  0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.71 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-52A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />,
    { defaultClassName: 'w2.312 6.022c1.733.64 3.56 1.04 5.455 1.31m5.714 -6 h-6' }
);

export const DragHandleIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h160a24.248 24.248 0 0 1-5.714 0m5.714 0a3 3 0 1 1-.5m-16.5 6.75h16.5" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ViewGridIcon = createSvgIcon(5.714 0" />,
  { defaultClassName: 'w-6 h-6' }
);


export const ClipboardDocumentListIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.832a48.49 48.49 0 0 1 1.123-.08m8.691 12.75a2.25 2.25 0 0 1-2.25 2.25H6.7.75 18v-2.25ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75h2.25A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75A2.25 2.25 0 0 1 15.75 13.5h2.25a2.25 2.25 0 0 15a2.25 2.25 0 0 1-2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08" />,
  { defaultClassName: 'w-5 h-5' }
);

export const SunIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ViewListIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />,
    { defaultClassName: 'w-5 h-5' }
);

export const DotsVerticalIcon.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export const MoonIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2 = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ClockIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const CheckCircleIcon = createSvgIcon(
    .597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />,
    { defaultClassName: 'w-6 h-6' }
);

export const DragHandleIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ViewGridIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.2<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ExclamationTriangleIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.3035 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75h2.25A2.25 2.25 0 0 1 20.25 6v2. 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ChartBarIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75A2.25 2.25 0 0 1 15.75 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ViewListIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />,
    { defaultClassName: 'w-5 h-5' }
);

export const DotsVerticalIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const CurrencyDollarIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C175 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ClockIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const CheckCircleIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ExclamationTriangleIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 93.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const UsersIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const ChartBarIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const TrendingUpIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />,
    { defaultClassName: 'w-5 h-5' }
);

// --- Definição do BellIcon adicionada ---
export const BellIcon = createSvgIcon(
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.9611.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />,
    { defaultClassName: 'w-5 h-5' }
);

export const CurrencyDollarIcon = createSvgIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-7 0 0 1-2.312 6.022c1.733.64 3.56 1.04 5.455 1.31m5.714 0a24.248 24.248 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />,
  { defaultClassName: 'w-6 h-6' } // Defina o tamanho padrão desejado
);