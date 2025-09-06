import { LucideProps, icons } from 'lucide-react';

type IconName = keyof typeof icons;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof Icons;
}

// Ícones do Lucide que serão usados
export const Icons = {
  // Ícones de interface
  spinner: icons.Loader2,
  gitHub: icons.Github,
  google: icons.Chrome,
  menu: icons.Menu,
  x: icons.X,
  chevronDown: icons.ChevronDown,
  chevronRight: icons.ChevronRight,
  chevronLeft: icons.ChevronLeft,
  chevronUp: icons.ChevronUp,
  plus: icons.Plus,
  minus: icons.Minus,
  check: icons.Check,
  xCircle: icons.XCircle,
  alertCircle: icons.AlertCircle,
  info: icons.Info,
  externalLink: icons.ExternalLink,
  download: icons.Download,
  upload: icons.Upload,
  
  // Ícones de navegação
  layoutDashboard: icons.LayoutDashboard,
  wallet: icons.Wallet2,
  target: icons.Target,
  barChart: icons.BarChart2,
  messageSquare: icons.MessageSquare,
  settings: icons.Settings,
  user: icons.User,
  users: icons.Users,
  creditCard: icons.CreditCard,
  bell: icons.Bell,
  search: icons.Search,
  filter: icons.Filter,
  
  // Ícones de ação
  edit: icons.Pencil,
  trash: icons.Trash2,
  copy: icons.Copy,
  share: icons.Share2,
  
  // Ícones de status
  checkCircle: icons.CheckCircle2,
  alertTriangle: icons.AlertTriangle,
  helpCircle: icons.HelpCircle,
  
  // Ícones de setas
  arrowRight: icons.ArrowRight,
  arrowLeft: icons.ArrowLeft,
  arrowUp: icons.ArrowUp,
  arrowDown: icons.ArrowDown,
  
  // Ícones de mídia
  image: icons.Image,
  file: icons.File,
  fileText: icons.FileText,
  filePlus: icons.FilePlus,
  
  // Ícones de navegação lateral
  panelLeftClose: icons.PanelLeftClose,
  panelRightOpen: icons.PanelRightOpen,
  
  // Ícones de autenticação
  logOut: icons.LogOut,
  logIn: icons.LogIn,
  userPlus: icons.UserPlus,
  lock: icons.Lock,
  mail: icons.Mail,
  
  // Ícones de transações
  dollarSign: icons.DollarSign,
  receipt: icons.Receipt,
  wallet2: icons.Wallet2,
  
  // Ícones de setas de painel
  panelLeft: icons.PanelLeft,
  panelRight: icons.PanelRight,
} as const;

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon '${name}' not found`);
    return null;
  }
  
  return <IconComponent {...props} />;
}