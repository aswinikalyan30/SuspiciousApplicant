# 🛡️ FraudGuard AI - Higher Education Fraud Detection Platform

An advanced, AI-powered fraud detection dashboard designed specifically for higher education institutions. This platform leverages multi-agent AI systems to detect, analyze, and review potential fraud across admissions, financial aid, and student participation.

## ✨ Features

### 🎯 Core Functionality

- **Multi-Agent AI Detection System**
  - **ApplicationAgent**: Detects VPN usage, essay similarity, email age violations
  - **MemoryAgent**: Cross-references previous incidents and repeat offender patterns
  - **EscalationAgent**: Intelligent case prioritization and escalation recommendations
  - **ExplainerAgent**: Provides AI-generated case summaries and insights

- **Real-time Fraud Monitoring**
  - Live KPI dashboard with animated count-up metrics
  - 7-day fraud risk trend visualization
  - Real-time case alerts and notifications

- **Interactive Case Review**
  - Tinder-style swipeable case cards
  - Gesture-based approval/escalation (swipe right/left)
  - Keyboard navigation support
  - Progress tracking and session statistics

### 🎨 UI/UX Features

- **Futuristic AI-Inspired Design**
  - Glassmorphism effects with translucent panels
  - Neural network background patterns
  - Gradient color schemes (Primary: #7100EB, Secondary: #95F4A0)
  - Smooth animations and micro-interactions

- **Dark/Light Mode Support**
  - System preference detection
  - Persistent theme storage
  - Seamless switching animations

- **Mobile-Responsive Design**
  - Optimized layouts for all screen sizes
  - Touch-friendly swipe gestures
  - Collapsible mobile navigation

### 📊 Dashboard Components

1. **KPI Cards**
   - Total Flags, Financial Aid Flags, Ghost Students, Escalated Cases
   - Animated count-up on load
   - Clickable filtering functionality
   - Agent insights indicators

2. **Fraud Risk Chart**
   - 7-day trend visualization using Recharts
   - Interactive tooltips with case details
   - Gradient fills and custom animations

3. **Recent Alerts Table**
   - Live-updating case list
   - Inline search functionality
   - Mini timeline previews
   - Memory Echo indicators for repeat offenders

4. **Agent Status Panel**
   - Real-time agent activity monitoring
   - Enable/disable toggles
   - Performance indicators

### 🔔 Notification System

- **Live Toast Notifications**
  - Slide-in animations for critical alerts
  - Auto-dismissal with manual override
  - Color-coded severity levels

- **Bell Icon with Badge**
  - Unread count indicator
  - Dropdown notification center
  - Case deep-linking

### 📱 Case Review Interface

- **Swipeable Cards**
  - Drag gestures with visual feedback
  - Real-time glow effects during swipe
  - Stack preview (up to 3 cards)

- **AI-Generated Summaries**
  - On-demand analysis generation
  - Neural wave loading animations
  - Typing indicator effects

- **Memory Echo Integration**
  - Previous incident highlighting
  - Risk pattern recognition
  - Confidence scoring

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fraud-detection-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 Usage Guide

### Navigation

- **Dashboard Tab**: Overview of fraud metrics and recent alerts
- **Review Cases Tab**: Swipeable interface for case processing
- **Settings Tab**: Agent configuration and user preferences

### Case Review Controls

#### Swipe Gestures
- **Swipe Right** (or → key): Approve case as legitimate
- **Swipe Left** (or ← key): Escalate for further investigation
- **Swipe Up** (or ↑ key): View detailed case information

#### Mouse/Touch Controls
- **Drag cards** to reveal swipe indicators
- **Click "Generate"** to create AI summaries
- **Use action buttons** below cards for precise control

### Notifications

- **Bell icon** shows unread count
- **Click notifications** to jump to relevant cases
- **Toast messages** appear for critical alerts
- **Auto-dismiss** after 5 seconds or manual close

## 🛠️ Technical Architecture

### Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Key Components

```
src/
├── components/
│   ├── Dashboard.tsx              # Main dashboard view
│   ├── Header.tsx                 # Navigation and branding
│   ├── KPICard.tsx               # Animated metric cards
│   ├── FraudRiskChart.tsx        # Trend visualization
│   ├── RecentAlertsTable.tsx     # Live case table
│   ├── CaseReviewPanel.tsx       # Swipe container
│   ├── SwipeableFraudCard.tsx    # Individual case cards
│   └── NotificationSystem.tsx    # Alert management
├── context/
│   └── FraudDetectionContext.tsx # Global state management
├── data/
│   └── mockData.ts               # Sample fraud cases
├── types/
│   └── index.ts                  # TypeScript definitions
└── App.tsx                       # Main application
```

### State Management

- **React Context** for global state
- **useReducer** for complex state updates
- **Real-time simulation** with intervals
- **Persistent theme** storage

## 🎨 Design System

### Color Palette

- **Primary**: #7100EB (Deep violet for buttons, highlights)
- **Secondary**: #95F4A0 (Mint for safe states, accents)
- **Warning**: #EFC728 (Medium risk alerts)
- **Danger**: #D42828 (High risk alerts)

### Typography

- **Font Family**: Inter with system fallbacks
- **Headings**: Gradient text effects
- **Body**: Optimized for readability

### Animations

- **Count-up**: KPI cards animate on load
- **Pulse Glow**: Critical alerts and Memory Echo indicators
- **Neural Wave**: AI processing animations
- **Slide-in**: New case notifications
- **Typing Dots**: AI summary generation

## 📋 Data Structure

### Fraud Case Model

```typescript
interface FraudCase {
  id: string;
  studentId: string;
  student: Student;
  riskScore: number;
  status: 'pending' | 'reviewed' | 'escalated' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  flaggedAt: string;
  stage: 'admissions' | 'financial_aid' | 'enrollment' | 'lms_activity';
  flags: FraudFlag[];
  timeline: TimelineEvent[];
  aiSummary?: string;
  memoryEcho?: MemoryEcho;
}
```

### Detection Rules

- **VPN IP Detection**: Multiple geographic locations
- **Essay Similarity**: Plagiarism scoring (85%+ threshold)
- **Email Age Verification**: Recently created accounts (< 7 days)
- **LMS Activity Monitoring**: Ghost student detection (14+ days inactive)
- **Document Verification**: Duplicate submissions across applications

## 🔮 Future Enhancements

- **Case Detail Modal** with full timeline view
- **Settings Panel** with rule configuration
- **Document Request System** with email integration
- **Advanced Analytics** with machine learning insights
- **Multi-tenant Support** for multiple institutions
- **API Integration** with real fraud detection services
- **Audit Trail** for compliance reporting

## 📄 License

This project is available for educational and demonstration purposes. For production use in educational institutions, please contact the development team for licensing information.

---

**Built with ❤️ for Higher Education Security**
